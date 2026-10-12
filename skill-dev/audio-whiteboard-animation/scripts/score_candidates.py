"""Pick between candidate transcriptions of one span by forced decoding.

  python3 -I score_candidates.py --audio narration.wav --model-dir DIR --cands cands.json [--lang en]

cands.json: [[start, end, ["candidate A", "candidate B", ...]], ...]
Prints the total log-likelihood of each candidate (higher = better fit).
Whisper's language model pulls toward grammatical text, so for a deliberately
WRONG example ("I didn't watched TV") compare the gap against the same
sentence's correct repeat elsewhere, and weigh the narration's context
("this is wrong"). Report anything inferred this way to the user as a flag.
"""
import argparse, json, subprocess
import numpy as np
import onnxruntime as ort
from transformers import WhisperFeatureExtractor, WhisperTokenizer

ap = argparse.ArgumentParser()
ap.add_argument('--audio', required=True); ap.add_argument('--model-dir', required=True)
ap.add_argument('--cands', required=True); ap.add_argument('--lang', default='en')
a = ap.parse_args()
D = a.model_dir.rstrip('/') + '/'
gen = json.load(open(D + 'generation_config.json'))
SOT = [gen['decoder_start_token_id'], gen['lang_to_id'][f'<|{a.lang}|>'], gen['task_to_id']['transcribe'], gen['no_timestamps_token_id']]
fe = WhisperFeatureExtractor.from_pretrained(D); tok = WhisperTokenizer.from_pretrained(D)
enc = ort.InferenceSession(D + 'onnx/encoder_model_quantized.onnx', providers=['CPUExecutionProvider'])
dec = ort.InferenceSession(D + 'onnx/decoder_model_merged_quantized.onnx', providers=['CPUExecutionProvider'])
din = [i.name for i in dec.get_inputs()]
pk = dec.get_inputs()[[i for i, n in enumerate(din) if n.startswith('past_key_values')][0]]
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768


def score(s, e, text):
    seg = audio[int(max(0, s - 0.1) * 16000):int((e + 0.1) * 16000)]
    f = fe(seg, sampling_rate=16000, return_tensors='np').input_features.astype(np.float32)
    h = enc.run(['last_hidden_state'], {'input_features': f})[0]
    ids = SOT + tok.encode(' ' + text, add_special_tokens=False) + [gen['eos_token_id']]
    feeds = {'encoder_hidden_states': h, 'input_ids': np.array([ids[:-1]], np.int64), 'use_cache_branch': np.array([False])}
    for n in din:
        if n.startswith('past_key_values'): feeds[n] = np.zeros((1, pk.shape[1], 0, pk.shape[3]), np.float32)
    lg = dec.run(['logits'], feeds)[0][0]
    m = lg.max(-1, keepdims=True)
    lp = lg - m - np.log(np.exp(lg - m).sum(-1, keepdims=True))
    return float(sum(lp[i - 1, ids[i]] for i in range(len(SOT), len(ids))))


for s, e, cands in json.load(open(a.cands)):
    for c in cands: print(f'{s:7.2f}-{e:7.2f}  {score(s, e, c):8.2f}  {c}')
    print()
