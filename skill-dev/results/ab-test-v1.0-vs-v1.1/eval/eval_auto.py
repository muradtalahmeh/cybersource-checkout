"""Automated, version-blind checks of one run's storyboard against the reference.
   python3 eval_auto.py <run_dir> <reference_transcript.json> > run_auto.json"""
import json, os, re, subprocess, sys
run, ref = sys.argv[1], json.load(open(sys.argv[2]))
P = os.path.join(run, 'project')
def load(f):
    js = open(os.path.join(P, 'js', f), encoding='utf-8').read()
    out = subprocess.run(['node', '-e', "const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(0,'utf8'),c);"
                          "vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),c);console.log(JSON.stringify({T:c.window.TRANSCRIPT,D:c.window.AUDIO_DURATION,S:c.window.STORYBOARD}))",
                          os.path.join(P, 'js', 'storyboard.js')], input=js, capture_output=True, text=True)
    return json.loads(out.stdout) if out.returncode == 0 else {'error': out.stderr[-400:]}
res = {'run': os.path.basename(run), 'files': {f: os.path.exists(os.path.join(P, f)) for f in ['js/transcript.js', 'js/storyboard.js', 'docs/STORYBOARD.md', 'js/scenes.js']}}
d = load('transcript.js')
if 'error' in d: res['load_error'] = d['error']; print(json.dumps(res, ensure_ascii=False, indent=1)); sys.exit()
T, DUR, S = d['T'] or [], d['D'], d['S'] or []
norm = lambda s: re.sub(r"[^a-z' ]", '', (s or '').lower().replace('’', "'")).split()
# --- coverage / structure
probs = []
if S and abs(S[0]['start']) > 1e-6: probs.append('first scene not at 0')
for a, b in zip(S, S[1:]):
    if abs(a['end'] - b['start']) > 1e-6: probs.append(f"gap/overlap {a['id']}->{b['id']}")
if S and abs(S[-1]['end'] - DUR) > 0.02: probs.append(f"last scene ends {S[-1]['end']} != {DUR}")
orph = [t for t in T if not any(t['s'] >= s['start'] - 0.05 and t['s'] < s['end'] for s in S)]
if orph: probs.append(f'{len(orph)} transcript segments outside scenes')
dur = [round(s['end'] - s['start'], 2) for s in S]
res['structure'] = {'audio_duration': DUR, 'scenes': len(S), 'scene_durations': dur, 'transcript_segments': len(T), 'problems': probs,
                    'fields_missing': sorted({k for s in S for k in ['concept', 'visual', 'drawing', 'sync'] if not s.get(k)})}
# --- transcript: English examples recovered + timing
ex = [r for r in ref if r.get('en')]
rows = []
for r in ex:
    target = norm(r['en'])
    best = None
    for t in T:
        cand = norm(t.get('en')) or []
        if not cand: continue
        if cand == target or ' '.join(target) in ' '.join(cand):
            dt = abs(t['s'] - r['s'])
            if best is None or dt < best[0]: best = (dt, t)
    rows.append({'reference': r['en'], 'found_exact': best is not None, 'start_diff_s': round(best[0], 2) if best else None,
                 'flagged': bool(best and best[1].get('flag')) if best else None})
res['english_examples'] = rows
alltext = ' '.join((t.get('en') or '') + ' ' + (t.get('ar') or '') for t in T)
res['wrong_forms_in_transcript'] = {'watched_after_didnt': bool(re.search(r"didn'?t watched", alltext, re.I)), 'went_after_didnt': bool(re.search(r"didn'?t went", alltext, re.I))}
res['transcript_flags'] = [t.get('flag') for t in T if t.get('flag')]
# --- on-screen English vs narration
spoken = set(w for r in ref for w in norm(r.get('en'))) | set(w for r in ref for w in norm(r.get('ar')))
onscreen = [(s['id'], e) for s in S for e in (s.get('english') or [])]
res['onscreen_english'] = []
for sid, e in onscreen:
    words = norm(re.sub(r'[✓✗→]', ' ', e))
    extra = [w for w in words if w not in spoken]
    wrong = bool(re.search(r"didn'?t (watched|went)", e, re.I))
    scene = next(s for s in S if s['id'] == sid)
    marked = bool(re.search(r'✗|cross|strike|struck|red|wrong|خطأ|incorrect', json.dumps(scene, ensure_ascii=False), re.I))
    res['onscreen_english'].append({'scene': sid, 'text': e, 'words_not_spoken': extra, 'wrong_form': wrong, 'scene_marks_wrong': marked if wrong else None})
res['onscreen_arabic_count'] = sum(len(s.get('arabic') or []) for s in S)
print(json.dumps(res, ensure_ascii=False, indent=1))
