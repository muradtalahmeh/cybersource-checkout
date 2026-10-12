#!/usr/bin/env bash
# Repeatable regression run for the audio-whiteboard-animation skill.
#   skill-dev/regression/run.sh <skill-dir> <out-dir> [--inventory inv.json | --make-inventory inv.json]
# For each fixture in fixtures.json it builds a FRESH project from the skill
# (scripts/new_project.sh + the fixture's own scenes/storyboard/transcript),
# then runs: storyboard coverage, scene checks + golden frames (9:16 and 16:9),
# the determinism test (both formats) and export checks on the listed clips.
# Results land in <out-dir>/*.json; compare two runs with compare.py.
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"; repo="$(cd "$here/../.." && pwd)"
skill="$(cd "$1" && pwd)"; out="$(mkdir -p "$2" && cd "$2" && pwd)"; shift 2
{
  echo "date: $(date -u +%FT%TZ)"
  echo "git: $(git -C "$repo" rev-parse HEAD)"
  echo "node: $(node --version) · python: $(python3 --version 2>&1) · ffmpeg: $(ffmpeg -version | head -1 | cut -d' ' -f3)"
  echo "playwright: $(node -e "const p=require(require('path').join(require('child_process').execSync('npm root -g').toString().trim(),'playwright/package.json'));console.log(p.version)")"
  echo "chromium: $(ls /opt/pw-browsers 2>/dev/null | tr '\n' ' ')"
} > "$out/env.txt"
python3 "$here/check_skill.py" "$skill" "$out/skill.json" "$@"
n=$(python3 -c "import json;print(len(json.load(open('$here/fixtures.json'))))")
for i in $(seq 0 $((n-1))); do
  eval "$(python3 - "$here/fixtures.json" $i <<'PY'
import json,sys,shlex
f=json.load(open(sys.argv[1]))[int(sys.argv[2])]
print(f"name={shlex.quote(f['name'])} proj={shlex.quote(f['project'])} audio={shlex.quote(f['audio'])} title={shlex.quote(f['title'])}")
print("clips=(" + " ".join(shlex.quote(f'{a} {s} {e}') for a,s,e in f['clips']) + ")")
PY
)"
  b="$out/build/$name"; rm -rf "$b"
  bash "$skill/scripts/new_project.sh" "$repo/$audio" "$b" "$title" > "$out/$name.new_project.txt" 2>&1 || { echo "new_project failed for $name"; cat "$out/$name.new_project.txt"; continue; }
  for f in js/scenes.js js/storyboard.js js/transcript.js; do cp "$repo/$proj/$f" "$b/$f"; done
  (cd "$b" && node tools/storyboard.mjs) > "$out/$name.storyboard.txt" 2>&1; cat "$out/$name.storyboard.txt"
  for a in v h; do
    node "$here/check_scenes.mjs" "$b" $a "$out/$name.scenes.$a.json"
    (cd "$b" && node tools/seektest.mjs $a) > "$out/$name.seek.$a.txt" 2>&1; echo "$name $a seektest: $(grep -o '[0-9]*/[0-9]* identical' "$out/$name.seek.$a.txt")"
  done
  k=0; for c in "${clips[@]}"; do set -- $c; python3 "$here/check_export.py" "$b" $1 $2 $3 "$out/$name.export.$k.json"; k=$((k+1)); done
done
echo "results in $out"
