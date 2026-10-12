#!/usr/bin/env python3
"""Transcribe speech spans with Whisper (ONNX, CPU) and keep measured timing.

  python3 tools/transcribe.py --audio a.wav --spans spans.json --model-dir DIR \
      --lang ar [--key sentences] [--timestamps] --out transcript_raw.json

Each span from spans.json is decoded on its own, so every output line carries
start/end times measured from the audio (span boundaries from silence
detection). With --timestamps the decoder also emits Whisper timestamp tokens,
which split a span into finer segments (20 ms grid, accuracy typically within
~0.2 s); those are marked "source": "whisper-ts" while span boundaries are
"source": "silence".

Output: {"lang", "model", "segments": [{"start","end","text","conf","source","span"}]}
"conf" is the mean token probability of the text tokens (0..1); it is a
decoder self-estimate, not a guarantee. Nothing here edits the audio.
"""
import argparse, json, subprocess, sys
import numpy as np
import onnxruntime as ort
from transformers import WhisperFeatureExtractor, WhisperTokenizer

ap = argparse.ArgumentParser()
ap.add_argument('--audio', required=True)
ap.add_argument('--spans', required=True, help='spans.json from detect_speech.py or a JSON list of [s,e]')
ap.add_argument('--key', default='sentences')
ap.add_argument('--model-dir', required=True)
ap.add_argument('--lang', default='ar')
ap.add_argument('--timestamps', action='store_true')
ap.add_argument('--pad', type=float, default=0.15)
ap.add_argument('--max-tokens', type=int, default=224)
ap.add_argument('--out', required=True)
a = ap.parse_args()

D = a.model_dir.rstrip('/') + '/'
gen = json.load(open(D + 'generation_config.json'))
SOT, EOT = gen['decoder_start_token_id'], gen['eos_token_id']
NO_TS = gen['no_timestamps_token_id']
TS0 = NO_TS + 1                       # first timestamp token  <|0.00|>
LANG = gen['lang_to_id'][f'<|{a.lang}|>']
TASK = gen['task_to_id']['transcribe']
prompt = [SOT, LANG, TASK] + ([] if a.timestamps else [NO_TS])
suppress = set(gen.get('suppress_tokens', []))

fe = WhisperFeatureExtractor.from_pretrained(D)
tok = WhisperTokenizer.from_pretrained(D)
so = ort.SessionOptions(); so.intra_op_num_threads = 4
enc = ort.InferenceSession(D + 'onnx/encoder_model_quantized.onnx', so, providers=['CPUExecutionProvider'])
dec = ort.InferenceSession(D + 'onnx/decoder_model_merged_quantized.onnx', so, providers=['CPUExecutionProvider'])
din = [i.name for i in dec.get_inputs()]
dout = [o.name for o in dec.get_outputs()]
past_names = [n for n in din if n.startswith('past_key_values')]
shape0 = dec.get_inputs()[din.index(past_names[0])].shape
heads, dim = shape0[1], shape0[3]

pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
SR = 16000
dur = len(audio) / SR

sp = json.load(open(a.spans))
spans = sp[a.key] if isinstance(sp, dict) else sp


def softmax(x):
    x = x - x.max(); e = np.exp(x); return e / e.sum()


def decode(seg):
    """Greedy decode one <=30 s segment. Returns list of (token, prob)."""
    feats = fe(seg, sampling_rate=SR, return_tensors='np').input_features.astype(np.float32)
    hidden = enc.run(['last_hidden_state'], {'input_features': feats})[0]
    feeds = {'encoder_hidden_states': hidden, 'use_cache_branch': np.array([False])}
    for n in past_names:
        feeds[n] = np.zeros((1, heads, 0, dim), np.float32)
    ids = list(prompt)
    inp = np.array([ids], np.int64)
    out = []
    for step in range(a.max_tokens):
        feeds['input_ids'] = inp
        res = dict(zip(dout, dec.run(None, feeds)))
        lg = res['logits'][0, -1].astype(np.float64)
        for t in suppress:
            lg[t] = -1e9
        if a.timestamps:
            if step == 0:
                lg[:TS0] = -1e9                     # segment must open with a timestamp
            lg[NO_TS] = -1e9
        else:
            lg[TS0:] = -1e9
        p = softmax(lg)
        nxt = int(lg.argmax())
        if nxt == EOT:
            break
        out.append((nxt, float(p[nxt])))
        gen_ids = [t for t, _ in out]
        if len(gen_ids) > 30 and gen_ids[-8:] == gen_ids[-16:-8]:
            out.append((-1, 0.0))                   # repetition loop marker
            break
        # feed cache
        for n in past_names:
            pres = n.replace('past_key_values', 'present')
            if '.decoder.' in n or step == 0:
                feeds[n] = res[pres]
        feeds['use_cache_branch'] = np.array([True])
        inp = np.array([[nxt]], np.int64)
    return out


segments = []
for si, (s, e) in enumerate(spans):
    s0 = max(0.0, s - a.pad); e0 = min(dur, e + a.pad)
    if e0 - s0 > 30:
        print(f'span {si} longer than 30 s ({e0 - s0:.1f}); truncating', file=sys.stderr)
        e0 = s0 + 30
    seg = audio[int(s0 * SR):int(e0 * SR)]
    toks = decode(seg)
    looped = any(t == -1 for t, _ in toks)
    toks = [(t, p) for t, p in toks if t != -1]
    if not a.timestamps:
        text = tok.decode([t for t, _ in toks], skip_special_tokens=True).strip()
        probs = [p for _, p in toks]
        segments.append({'start': round(s, 3), 'end': round(e, 3), 'text': text,
                         'conf': round(float(np.mean(probs)), 3) if probs else 0.0,
                         'source': 'silence', 'span': si, 'loop': looped})
        print(f'[{s:7.2f}–{e:7.2f}] {text}{"  (LOOP)" if looped else ""}')
        continue
    # split by timestamp tokens
    cur_t0, buf, bufp = None, [], []
    for t, p in toks:
        if t >= TS0:
            ts = s0 + (t - TS0) * 0.02
            if buf:
                text = tok.decode(buf, skip_special_tokens=True).strip()
                segments.append({'start': round(cur_t0 if cur_t0 is not None else s, 3), 'end': round(min(ts, e0), 3),
                                 'text': text, 'conf': round(float(np.mean(bufp)), 3), 'source': 'whisper-ts',
                                 'span': si, 'loop': looped})
                print(f'[{segments[-1]["start"]:7.2f}–{segments[-1]["end"]:7.2f}] {text}')
                buf, bufp = [], []
            cur_t0 = ts
        else:
            buf.append(t); bufp.append(p)
    if buf:  # text with no closing timestamp: close at span end
        text = tok.decode(buf, skip_special_tokens=True).strip()
        segments.append({'start': round(cur_t0 if cur_t0 is not None else s, 3), 'end': round(e, 3), 'text': text,
                         'conf': round(float(np.mean(bufp)), 3), 'source': 'whisper-ts-open', 'span': si, 'loop': looped})
        print(f'[{segments[-1]["start"]:7.2f}–{segments[-1]["end"]:7.2f}] {text}  (open end)')

json.dump({'lang': a.lang, 'model': D, 'timestamps': a.timestamps, 'pad': a.pad, 'segments': segments},
          open(a.out, 'w'), ensure_ascii=False, indent=1)
print(f'wrote {a.out}: {len(segments)} segments')
