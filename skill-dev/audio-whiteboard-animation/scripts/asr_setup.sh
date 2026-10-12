#!/usr/bin/env bash
# Prepare local speech recognition (Whisper ONNX + onnxruntime).
#   asr_setup.sh [small|base]      → prints the model directory on the last line
# Order of sources:
#   1. $WHISPER_ONNX_DIR if it already holds encoder/decoder ONNX files
#   2. a cached copy in ~/.cache/awb-asr/<size>
#   3. the npm registry tarball (plain data: ONNX + JSON + txt), which works in
#      sandboxes where huggingface.co / github.com are blocked. Only the
#      tarball is downloaded — no package install, no scripts run.
set -euo pipefail
size="${1:-small}"
pip install -q onnxruntime transformers soundfile numpy 2>&1 | grep -v -i "warning\|pytorch" || true
if [ -n "${WHISPER_ONNX_DIR:-}" ] && ls "$WHISPER_ONNX_DIR"/onnx/encoder_model*.onnx >/dev/null 2>&1; then echo "$WHISPER_ONNX_DIR"; exit 0; fi
cache="$HOME/.cache/awb-asr/$size"
model="$cache/package/models/Xenova/whisper-$size"
if [ ! -f "$model/onnx/encoder_model_quantized.onnx" ]; then
  mkdir -p "$cache"
  url=$(curl -fsS "https://registry.npmjs.org/sts-whisper-$size" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['versions'][d['dist-tags']['latest']]['dist']['tarball'])")
  curl -fsS -o "$cache/w.tgz" "$url"
  # refuse anything that is not model data
  if tar -tzf "$cache/w.tgz" | grep -vqE '(/$|\.(onnx|json|txt)$)'; then echo "unexpected file types in tarball" >&2; tar -tzf "$cache/w.tgz" >&2; exit 1; fi
  tar -xzf "$cache/w.tgz" -C "$cache"
fi
echo "$model"
