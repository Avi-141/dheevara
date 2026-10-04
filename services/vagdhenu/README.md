# Vāgdhenu chant service

The only machine path for ślokas (rule 7): an HTTP wrapper around [Vāgdhenu](https://github.com/prathoshap/vagdhenu) by Prof. Prathosh A. P. (IISc). It needs a **CUDA 12.1 GPU** and Python 3.10. Licences and conditions: `docs/research/vagdhenu.md`. Output stays internal until Vāgdhenu's author agrees to wider use.

## Run it on the GPU box

```bash
git clone https://github.com/prathoshap/vagdhenu && cd vagdhenu
git checkout c18927a            # the commit docs/research/vagdhenu.md describes
bash scripts/setup.sh           # torch 2.4.1+cu121, deps, BigVGAN, weights into models/
cd .. && git clone https://github.com/Avi-141/dheevara
VAGDHENU_ROOT=$PWD/vagdhenu python dheevara/services/vagdhenu/server.py
# [vagdhenu] listening on http://127.0.0.1:7861
```

It binds to `127.0.0.1`. From the pipeline machine, open a tunnel and point the pipeline at it:

```bash
ssh -N -L 7861:127.0.0.1:7861 <gpu-box>
export VAGDHENU_URL=http://127.0.0.1:7861   # in the cloud environment's settings, not in git
```

## API

- `GET /health` returns `{ "ok": true, "meters": [...], "vagdhenu": "<commit>" }`.
- `POST /chant` takes `{ "padas": ["उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने", "नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि"], "meter": "anuṣṭubh", "seed": 60 }`.
  - It returns `audio/wav` (16-bit mono), and the header `X-Meter` names the meter used (percent-encoded).
  - Leave `meter` null to auto-detect it from a complete verse.
  - One śloka per request; more returns 422.

The pipeline client is `src/voice/chant.mjs`. Without `VAGDHENU_URL` it throws; it never substitutes a TTS voice.
