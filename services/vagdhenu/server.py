"""Dheevara's HTTP wrapper around Vāgdhenu (https://github.com/prathoshap/vagdhenu, Apache-2.0).

Loads the Vāgdhenu renderer once on a CUDA 12.1 GPU and serves one śloka per request:

    GET  /health  -> {"ok": true, "meters": [...], "vagdhenu": "<commit>"}
    POST /chant   {"padas": ["…", "…"], "meter": "anuṣṭubh" | null, "seed": 60}
                  -> audio/wav, header X-Meter: the meter used, percent-encoded

Rule 7: this is the only machine path for ślokas. Output is internal until Vāgdhenu's author
agrees to wider use (docs/research/vagdhenu.md). It binds to 127.0.0.1 by default: reach it over
an SSH tunnel and set VAGDHENU_URL to the tunnel's local address.

Environment:
    VAGDHENU_ROOT   path of the Vāgdhenu checkout (with models/ from scripts/setup.sh)
    VAGDHENU_VOICE  voice checkpoint (default models/voice_steer_ema_2026-06-17.pt)
    VAGDHENU_VOC    vocoder checkpoint (default models/voc_bigvgan_EMA_2026-06-11.pth)
    VAGDHENU_NFE    flow steps (default 32)
    HOST, PORT      bind address (default 127.0.0.1:7861)
"""
import io
import json
import os
import subprocess
import sys
import threading
import wave
from urllib.parse import quote
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.environ.get("VAGDHENU_ROOT") or sys.exit("set VAGDHENU_ROOT to the Vāgdhenu checkout")
SRC = os.path.join(ROOT, "src")
sys.path.insert(0, SRC)
sys.path.insert(0, os.path.join(ROOT, "BigVGAN"))

import numpy as np  # noqa: E402
import limits  # noqa: E402  (Vāgdhenu's one-verse guard)
from render_core import Renderer, detect_meter_key  # noqa: E402

BANK = os.path.join(SRC, "reference_bank", "bank.json")
VOCAB = os.path.join(SRC, "reference_bank", "vocab.txt")
VOICE = os.environ.get("VAGDHENU_VOICE", os.path.join(ROOT, "models", "voice_steer_ema_2026-06-17.pt"))
VOC = os.environ.get("VAGDHENU_VOC", os.path.join(ROOT, "models", "voc_bigvgan_EMA_2026-06-11.pth"))
NFE = int(os.environ.get("VAGDHENU_NFE", "32"))

try:
    COMMIT = subprocess.run(["git", "-C", ROOT, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
except OSError:
    COMMIT = "unknown"

_bank = json.load(open(BANK, encoding="utf-8"))
METERS = [k for k, v in _bank.items() if not k.startswith("_") and isinstance(v, dict) and "wav" in v]
ALIAS = {}
for k, v in _bank.items():
    if k.startswith("_") or not isinstance(v, dict) or "wav" not in v:
        continue
    ALIAS[k.lower()] = k
    ALIAS[v["wav"].replace(".wav", "").lower()] = k

print(f"[vagdhenu] loading renderer once: voice={VOICE} nfe={NFE}", flush=True)
RENDERER = Renderer(VOICE, VOC, BANK, device="cuda", vocab_file=VOCAB, nfe=NFE)
LOCK = threading.Lock()  # one GPU, one render at a time
print("[vagdhenu] ready", flush=True)


def to_wav(sr, audio):
    pcm = (np.clip(audio, -1.0, 1.0) * 32767).astype("<i2")
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())
    return buf.getvalue()


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            return self._json(200, {"ok": True, "meters": METERS, "vagdhenu": COMMIT})
        return self._json(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/chant":
            return self._json(404, {"error": "not found"})
        try:
            n = int(self.headers.get("Content-Length", "0"))
            req = json.loads(self.rfile.read(n) or b"{}")
            padas = req.get("padas")
            if not isinstance(padas, list) or not padas or not all(isinstance(p, str) and p.strip() for p in padas):
                return self._json(422, {"error": "padas must be a non-empty list of Devanagari strings"})
            text = "\n".join(p.strip() for p in padas)
            msg = limits.validate_one_shloka(text)
            if msg:
                return self._json(422, {"error": "one śloka per request", "detail": msg})
            meter = req.get("meter")
            if meter:
                used = ALIAS.get(str(meter).lower())
                if not used:
                    return self._json(422, {"error": f"unknown meter {meter!r}", "meters": METERS})
            else:
                used = ALIAS.get((detect_meter_key(text) or "").lower())
                if not used:
                    return self._json(422, {"error": "could not detect the meter; name it", "meters": METERS})
            seed = int(req.get("seed", 60))
            with LOCK:
                sr, audio = RENDERER.render_one([p.strip() for p in padas], used, seed=seed)
            body = to_wav(sr, audio)
        except Exception as e:  # report, never substitute audio
            return self._json(500, {"error": f"render failed: {e}"})
        self.send_response(200)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Meter", quote(used))  # percent-encoded UTF-8
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    host, port = os.environ.get("HOST", "127.0.0.1"), int(os.environ.get("PORT", "7861"))
    print(f"[vagdhenu] listening on http://{host}:{port}", flush=True)
    ThreadingHTTPServer((host, port), Handler).serve_forever()
