"""Compare two regression runs: python3 compare.py <baseline-dir> <candidate-dir> [> report.md]"""
import glob, json, os, sys
A, B = sys.argv[1], sys.argv[2]
L = lambda d, f: json.load(open(os.path.join(d, f)))
print(f'# Regression comparison\n\nbaseline: `{A}`  \ncandidate: `{B}`\n')
ok = True
sa, sb = L(A, 'skill.json'), L(B, 'skill.json')
ca, cb = sa['code_hashes'], sb['code_hashes']
changed = sorted(k for k in set(ca) | set(cb) if ca.get(k) != cb.get(k))
print(f'## Skill\n- code files (template/ + scripts/): {len(cb)}; changed vs baseline: {changed or "none"}')
print(f'- missing referenced paths: {sb["missing_paths"] or "none"}')
if 'inventory' in sb:
    inv = sb['inventory']; print(f'- instruction units from the old SKILL.md present verbatim: {inv["present_verbatim"]}/{inv["units"]}')
    for u in inv['not_verbatim']: print(f'  - NOT verbatim: “{u[:160]}”')
for f in sorted(glob.glob(os.path.join(B, '*.scenes.*.json'))):
    n = os.path.basename(f); a, b = L(A, n), L(B, n)
    same = [t for t in b['golden'] if a['golden'].get(t) == b['golden'][t]]
    diff = [t for t in b['golden'] if a['golden'].get(t) != b['golden'][t]]
    stats = ['strokes', 'penStrokes', 'fades', 'anims', 'camKeys', 'penOverlaps']
    sd = {k: (a[k], b[k]) for k in stats if a[k] != b[k]}
    print(f'\n## {n}\n- golden frames identical: {len(same)}/{len(b["golden"])}' + (f' — differing at {diff}' if diff else ''))
    print(f'- scene structure: {"identical" if not sd and a["sceneIds"] == b["sceneIds"] else sd}; problems: {b["problems"] or "none"}; page errors: {len(b["errors"])}; failed requests: {b["failedRequests"] or "none"}')
    ok &= not diff and not sd and not b['problems']
for f in sorted(glob.glob(os.path.join(B, '*.seek.*.txt'))):
    n = os.path.basename(f); print(f'- {n}: {open(f).read().strip().splitlines()[-1]}')
for f in sorted(glob.glob(os.path.join(B, '*.export.*.json'))):
    n = os.path.basename(f); a, b = L(A, n), L(B, n)
    print(f'\n## {n} ({b["aspect"]} {b["from"]}–{b["to"]} s)')
    print(f'- frames {b["video"]["nb_frames"]} (baseline {a["video"]["nb_frames"]}), {b["video"]["width"]}x{b["video"]["height"]} {b["video"]["codec_name"]} {b["video"]["r_frame_rate"]}; audio {b["audio"]["codec_name"]} {b["audio"]["duration"]} s')
    print(f'- audio offsets vs original: {b["audio_offsets_ms"]} ms (baseline {a["audio_offsets_ms"]})')
    print(f'- picture timing PSNR at t: {[r["psnr_+0"] for r in b["picture_timing"]]} (baseline {[r["psnr_+0"] for r in a["picture_timing"]]})')
    print(f'- problems: {b["problems"] or "none"}')
    ok &= not b['problems']
print(f'\n**Overall: {"PASS" if ok else "FAIL"}**')
