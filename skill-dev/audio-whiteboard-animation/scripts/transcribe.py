"""Decode speech spans with Whisper ONNX (greedy, no timestamps).

  python3 -I transcribe.py --audio narration.wav --spans spans.json --model-dir DIR \
      --lang ar --key sentences --out ar.json

--spans: JSON from detect_speech.py (use --key sentences|phrases) or a plain
list of [start, end] pairs. Each span is decoded on its own, so every line
of output carries measured start/end times.

Run a second pass with --lang en over spans that contain English examples:
when forced to the narration language, Whisper TRANSLATES embedded English
sentences instead of transcribing them.
"""
import argparse, json, subprocess, sys
import numpy as np
import onnxruntime as ort
from transformers import WhisperFeatureExtractor, WhisperTokenizer

ap = argparse.ArgumentParser()
ap.add_argument('--audio', required=True); ap.add_argument('--spans', required=True)
ap.add_argument('--model-dir', required=True); ap.add_argument('--lang', default='ar')
ap.add_argument('--key', default='sentences'); ap.add_argument('--out', required=True)
ap.add_argument('--pad', type=float, default=0.15)
a = ap.parse_args()
D = a.model_dir.rstrip('/') + '/'
gen = json.load(open(D + 'generation_config.json'))
lang_id = gen['lang_to_id'][f'<|{a.lang}|>']
SOT = [gen['decoder_start_token_id'], lang_id, gen['task_to_id']['transcribe'], gen['no_timestamps_token_id']]
EOT = gen['eos_token_id']
fe = WhisperFeatureExtractor.from_pretrained(D); tok = WhisperTokenizer.from_pretrained(D)
so = ort.SessionOptions(); so.intra_op_num_threads = 4
enc_f = 'onnx/encoder_model_quantized.onnx'; dec_f = 'onnx/decoder_model_merged_quantized.onnx'
enc = ort.InferenceSession(D + enc_f, so, providers=['CPUExecutionProvider'])
dec = ort.InferenceSession(D + dec_f, so, providers=['CPUExecutionProvider'])
din = [i.name for i in dec.get_inputs()]; dout = [o.name for o in dec.get_outputs()]
heads = dec.get_inputs()[din.index([n for n in din if n.startswith('past_key_values')][0])].shape[1]
dim = dec.get_inputs()[din.index([n for n in din if n.startswith('past_key_values')][0])].shape[3]
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
sr = 16000; dur = len(audio) / sr
sp = json.load(open(a.spans)); spans = sp[a.key] if isinstance(sp, dict) else sp
ts_first = 50364  # first timestamp token: suppress timestamps
out = []
for s, e in spans:
    seg = audio[int(max(0, s - a.pad) * sr):int(min(dur, e + a.pad) * sr)]
    f = fe(seg, sampling_rate=sr, return_tensors='np').input_features.astype(np.float32)
    h = enc.run(['last_hidden_state'], {'input_features': f})[0]
    feeds = {'encoder_hidden_states': h, 'use_cache_branch': np.array([False])}
    for n in din:
        if n.startswith('past_key_values'): feeds[n] = np.zeros((1, heads, 0, dim), np.float32)
    inp = np.array([SOT], np.int64); gen_ids = []
    for step in range(220):
        feeds['input_ids'] = inp
        res = dict(zip(dout, dec.run(None, feeds)))
        lg = res['logits'][0, -1]; lg[ts_first:] = -1e9
        nx = int(lg.argmax())
        if nx == EOT: break
        gen_ids.append(nx)
        if len(gen_ids) > 40 and gen_ids[-10:] == gen_ids[-20:-10]: break  # repetition loop
        for n in din:
            if n.startswith('past_key_values'):
                p = n.replace('past_key_values', 'present')
                if '.encoder.' in n:
                    if step == 0: feeds[n] = res[p]
                else: feeds[n] = res[p]
        feeds['use_cache_branch'] = np.array([True]); inp = np.array([[nx]], np.int64)
    txt = tok.decode(gen_ids, skip_special_tokens=True).strip()
    looped = len(gen_ids) > 40 and gen_ids[-10:] == gen_ids[-20:-10]
    out.append({'start': round(s, 2), 'end': round(e, 2), 'text': txt, **({'loop': True} if looped else {})})
    print(f"[{s:7.2f}-{e:7.2f}]{' LOOP' if looped else ''} {txt}", flush=True)
json.dump({'duration': dur, 'lang': a.lang, 'segments': out}, open(a.out, 'w'), ensure_ascii=False, indent=1)
