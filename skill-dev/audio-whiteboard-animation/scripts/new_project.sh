#!/usr/bin/env bash
# Create a whiteboard-video project from the bundled template.
#   new_project.sh <narration-audio> <target-dir> "<Title>"
# The narration is copied byte-for-byte. If it is not a WAV, a lossless PCM
# WAV decode is written next to it for the player/exporter (original kept).
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
audio="$1"; dir="$2"; title="${3:-Whiteboard lesson}"
[ -f "$audio" ] || { echo "audio not found: $audio" >&2; exit 1; }
[ -e "$dir" ] && [ -n "$(ls -A "$dir" 2>/dev/null)" ] && { echo "target not empty: $dir" >&2; exit 1; }
mkdir -p "$dir"
cp -r "$here/template/." "$dir/"
mkdir -p "$dir/assets/audio" "$dir/docs" "$dir/output"
ext="${audio##*.}"; ext="${ext,,}"
if [ "$ext" = "wav" ]; then
  cp "$audio" "$dir/assets/audio/narration.wav"
else
  cp "$audio" "$dir/assets/audio/original.$ext"
  ffmpeg -v error -y -i "$audio" -c:a pcm_s16le "$dir/assets/audio/narration.wav"
fi
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$dir/assets/audio/narration.wav")
sed -i "s/__AUDIO_DURATION__/$dur/" "$dir/js/transcript.js"
esc=$(printf '%s' "$title" | sed 's/[&/\]/\\&/g')
sed -i "s/__TITLE__/$esc/g" "$dir/index.html"
echo "project: $dir"
echo "audio:   $(ffprobe -v error -show_entries stream=codec_name,sample_rate,channels -of csv=p=0 "$dir/assets/audio/narration.wav") · ${dur}s"
sha256sum "$audio" "$dir/assets/audio/"* | sed 's/^/sha256 /'
