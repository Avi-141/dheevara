# Vāgdhenu: the chant voice

Retrieved 2026-10-04 from https://github.com/prathoshap/vagdhenu (shallow clone at `c18927a`, 2026-07-19) and https://huggingface.co/prathoshap/vagdhenu (model card). Avi pointed at the repo on 4 Oct.

## What it is

A single-speaker Sanskrit chant (pārāyaṇa) TTS by Prof. Prathosh A. P. (IISc Bengaluru). The README reports "MOS ~4.6 (expert listener)". It was used to produce the Mahābhārata Tātparya Nirṇaya chant series and the Śrīmad Bhāgavatam audio.

- **Model:** an IndicF5 / F5-TTS flow-matching DiT (~337M params) with a fine-tuned NVIDIA BigVGAN-v2 vocoder. Sanskrit is routed through Kannada script internally (README).
- **Meter:** chosen per verse from a reference bank (`src/reference_bank/bank.json`); `detect_meter_key(text)` auto-detects it from a complete verse (`src/render_core.py`). Our śloka, 7.34.19, is a *pathyā* anuṣṭubh (scholar review), which the bank carries as `anuṣṭubh`.
- **Runtime:** Python 3.10 and a **CUDA 12.1 GPU**. Torch 2.4.1+cu121; IndicF5 pinned at commit `13f7c4d6`. Weights come from Hugging Face (README, `requirements.txt`, `scripts/setup.sh`).
- **API in code:** `Renderer(voice_path, voc_path, bank_path, device="cuda", vocab_file=…, nfe=…)` loads once. `render_one(text, meter, seed=60)` returns `(sample_rate, float32 audio)` for one verse given as Devanagari pādas (`src/render_core.py`).
- **Server in the repo:** `demo/server.py` is a Gradio server for a dedicated GPU. It loads the model once and allows one śloka per request (`MAX_AKSHARAS = 100`) and 10 renders per IP per day (`src/limits.py`). It is Gradio, not a plain HTTP API, so `services/vagdhenu/` wraps `Renderer` directly.

## Licences and use

| Item | Licence | Source |
|---|---|---|
| Code | Apache-2.0 | `LICENSE`, README |
| Weights (`voice_steer_ema_2026-06-17.pt`, `voc_bigvgan_EMA_2026-06-11.pth`) | Apache-2.0, "our contribution"; the vocoder is a BigVGAN-v2 derivative, and "please observe NVIDIA's BigVGAN license terms" | HF model card |
| BigVGAN | MIT (NVIDIA, 2024) | https://github.com/NVIDIA/BigVGAN/blob/main/LICENSE |
| IndicF5 base | MIT; the HF repo is gated (`auto`), and the tokenizer vocab ships in the Vāgdhenu repo | https://huggingface.co/api/models/ai4bharat/IndicF5 |

**Conditions beyond the licence**, which we follow:
- "The voice is the author's own. Please use responsibly; do not impersonate" (README, model card).
- The project page asks: "Please use it only for **non-Vedic chants**, and remove all diacritical marks before pasting the text" (`docs/index.html`). The model card adds "No Vedic svaras". Epic anuṣṭubh is non-Vedic, and the CE text we use carries no svara marks.
- The plan and handoff go further than the licence: Vāgdhenu output stays internal until its author agrees (product plan, Risks; handoff section 9). Apache-2.0 would allow more, but the voice is a person's, and we asked first.

## How we use it

- `services/vagdhenu/` is a small HTTP wrapper for a CUDA 12.1 box: `GET /health`, and `POST /chant` taking `{ devanagari, meter?, seed? }` and returning WAV. It loads `Renderer` once and enforces one verse per request.
- `src/voice/chant.mjs` calls `VAGDHENU_URL`. **Until `VAGDHENU_URL` is set, the chant step throws**, naming the variable and this file. There is no TTS fallback (rule 7, and the decision of 3 Oct: no local fallbacks).

**Not used:** the public Hugging Face Space (https://huggingface.co/spaces/prathoshap/vagdhenu-demo) runs on the author's ZeroGPU quota with a 10-per-day limit, and calling it from a pipeline would spend someone else's quota without permission. If Avi gets the author's agreement, the author may prefer to host an endpoint for us; that would become `VAGDHENU_URL`.

## Open for Avi

1. A GPU box (E2E or IndiaAI) with CUDA 12.1. The repo does not state a VRAM minimum; its own warm server runs on an A6000 (`demo/server.py`).
2. The author's permission for any use beyond internal review, or a human reciter instead.
