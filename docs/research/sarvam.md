# Sarvam: Bulbul v3, dictionaries, STT, Vision, terms

Retrieved 2026-10-04. Every row cites the page it came from. Sarvam publishes a Markdown copy of each docs page at `<page>.md`; those are what was read. The handoff pointed at `https://docs.sarvam.ai/llms-full.txt`, which now returns a 301 to `https://docs.sarvam.ai/llms.txt` (an index, not the full text).

The key was checked on 2026-10-04 with a free call (`GET /text-to-speech/pronunciation-dictionary` → 200, zero dictionaries). No characters were billed.

## Bulbul v3 (narration)

| Fact | Value | Source |
|---|---|---|
| Endpoint | `POST https://api.sarvam.ai/text-to-speech`, JSON body | https://docs.sarvam.ai/api-reference/text-to-speech/convert.md |
| Auth | header `api-subscription-key: <key>` | same |
| Model id | `bulbul:v3` (legacy `bulbul:v2`) | https://docs.sarvam.ai/api/getting-started/models/bulbul.md |
| Max text | 2,500 characters per REST request (v3) | both pages above |
| Languages | `bn-IN en-IN gu-IN hi-IN kn-IN ml-IN mr-IN od-IN pa-IN ta-IN te-IN` (11). **No Sanskrit**; that fits rule 7, since ślokas are chanted, never read by TTS | convert.md |
| `speaker` | lowercase enum; v3 voices: shubh (default), aditya, ritu, priya, neha, rahul, pooja, rohan, simran, kavya, amit, dev, ishita, shreya, ratan, varun, manan, sumit, roopa, kabir, aayan, ashutosh, advait, anand, tanya, tarun, sunny, mani, gokul, vijay, shruti, suhani, mohit, kavitha, rehan, soham, rupali. "Speaker names are case-sensitive and must be lowercase" | convert.md |
| `pace` | 0.5–2.0 on v3, default 1.0 | convert.md, bulbul.md |
| `temperature` | 0.01–2.0, default 0.6; v3 only. Lower is steadier | convert.md |
| `pitch`, `loudness`, `enable_preprocessing` | not supported on v3 (preprocessing is always on) | convert.md |
| `speech_sample_rate` | 8000, 16000, 22050, 24000; plus 32000, 44100 and 48000 on the **REST API only**. The reference contradicts itself on the default (enum says 22050, prose says 24000), so the pipeline always sends it explicitly | convert.md, bulbul.md |
| `output_audio_codec` | mp3, linear16, mulaw, alaw, opus, flac, aac, wav (default wav) | convert.md |
| `dict_id` | a pronunciation dictionary id; v3 only | convert.md |
| `enable_cached_responses` | beta, v1/v2 only: not available for v3. Our own cache is the only cache | convert.md |
| Response | `{ request_id, audios: [base64 WAV, …] }`; decode `audios[0]` | convert.md |
| Errors | 400, 403, 422, 429 (quota), 500; body `{ error: { request_id, message, code } }` | convert.md |
| No SSML | Control is `pace` and splitting text at pauses | bulbul.md (Known limitations) |
| Native script | "Romanised Indic input degrades quality": Hindi narration must be in Devanagari | bulbul.md |
| Numbers | Write numbers over 4 digits with commas ("10,000") | convert.md |

**Price:** Bulbul v3 costs ₹30 per 10,000 characters, rounded to the nearest character (https://docs.sarvam.ai/api/getting-started/pricing.md). One s1e3 narration track of about 1,500 characters is about ₹4.5 per language.

**Rate limits:** TTS REST is 60 req/min on Starter, 200 on Pro and 1,000 on Business. **bulbul:v3 on Starter is 30 req/min.** Limits are per account, token bucket, and 429 means back off (https://docs.sarvam.ai/api/getting-started/ratelimits.md). New accounts get ₹100 in free credits, and credits never expire (same page).

## Choosing narrators

Source for this section: https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/best-practices.md.

- **Recommended speakers, ranked by measured pronunciation accuracy:**
  - en-IN: **ratan** (male), **ishita** (female)
  - hi-IN: **shubh** or ashutosh (male), **priya** or suhani (female)
- **Storytelling preset:** shubh or roopa at pace 0.9, temperature 0.8, WAV at 24 kHz.
- **Advice that shapes our scripts:**
  - avoid "complex Sanskrit words (may mispronounce); use simpler Hindi"
  - keep sentences short
  - end Hindi sentences with `।` and English ones with `.`
- **varun** is "deep, dramatic… suited to suspense or villain characters", so not a neutral narrator.

Our starting casts are in `content/voice/casts.json`: en-IN ratan and hi-IN shubh, each at pace 0.9 and temperature 0.7, with alternates for Avi's casting pass (handoff open question 7).

## Pronunciation dictionary

Source: https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/pronunciation-dictionary.md and https://docs.sarvam.ai/api-reference/pronunciation-dictionary/create.md.

- **File format:** `{ "pronunciations": { "<lang>": { "<word>": "<how to say it>" } } }`. Plain-text replacement, no phonemes. Matching is per language: only the block for the request's `language_code` applies, on exact word matches.
- **Endpoints**, all on `https://api.sarvam.ai/text-to-speech/pronunciation-dictionary`:
  - create: `POST` multipart, field `file`, part type `application/json`. Returns `dictionary_id`, e.g. `p_5cb7faa6`.
  - list: `GET`
  - get: `GET /<id>`
  - update: `PUT /<id>`, merging, id kept
  - delete: `DELETE ?dict_id=<id>`
- **Limits:** 10 dictionaries per user, 100 words per dictionary, 1 MB per file, one dictionary per request, bulbul:v3 only.
- **Gotcha:** the Node SDK sends the file part as `application/octet-stream`, which the API rejects. Use `fetch` with `FormData` and a `Blob` of type `application/json`.

Consequence for M1: one dictionary per pipeline, at most 100 names across all languages. It's generated from canon person and place names and updated in place (the id stays stable). Each language gets only the names Bulbul actually mispronounces, which the docs also advise.

## Speech-to-text (ingestion, later)

Saaras v4 is the default STT model (`saaras:v3` also works). It covers 23 languages including Sanskrit (`sa-IN`), with transcribe, translate, verbatim, translit and codemix modes, and v4 accepts up to 50 keyterms (https://docs.sarvam.ai/api/getting-started/models/saaras.md). Price: ₹30 per hour, ₹45 with diarization (pricing.md).

## Sarvam Vision (OCR, later)

Model `sarvam-vision`, 23 languages including Sanskrit (`sa-IN`), 10 pages per PDF job, 200 MB per file, output as HTML or Markdown in a ZIP with page-level JSON (https://docs.sarvam.ai/api/getting-started/models/sarvam-vision.md). Price: ₹0.5 per page for digitisation, ₹1 for field extraction (pricing.md).

## Rights and data use

**Commercial use of output** (https://docs.sarvam.ai/api/getting-started/commercial-licensing.md):
- Audio generated on our account while credits are consumed, signup credits included, carries a perpetual Production License under the EULA.
- Sarvam assigns rights in Output to us.
- The license doesn't cover Sarvam's models or voices themselves, and reselling the voices is forbidden.
- "Prototype audio generated before you had credits" is not licensed.

**Training on inputs: the terms contradict each other.**
- EULA (https://www.sarvam.ai/eula): "Sarvam will not use Your Content to train our AI models unless you provide explicit opt-in consent."
- Privacy Policy (https://www.sarvam.ai/privacy-policy), section "AI Model Training & Your Data", headed "Default Policy: Opt-In", then says: "We use Your content (including inputs, uploads, prompts, or generated outputs) to train, fine-tune, and/ or improve our AI models unless you explicitly opt-out through your account settings or by writing to [the privacy address]."
- Terms of Service v2.0, effective 29 July 2026 (https://www.sarvam.ai/terms-of-service), §17.5: "Where and to the extent we use Inputs, Outputs or usage data for training our machine-learning models, we will do so in accordance with the Privacy Policy and applicable law, and (where required) subject to your consent". The commercial-licensing page says the Terms govern where they conflict with the EULA.

**Reading for rule 5:** treat Sarvam as *may train on inputs unless the account has opted out*.
- Unreleased source passages (our books, lineage material) are blocked from Sarvam at the router.
- Narration scripts written from the public critical edition aren't source text, and they go to Sarvam.
- **Avi:** please opt the account out of training in the Sarvam dashboard's account settings, and confirm by email to Sarvam. Then record the opt-out in `docs/decisions.md`.

Also from the Terms: Sarvam "may moderate Inputs and Outputs", and audio may carry provenance or traceability signals. Free or trial output may be limited to non-commercial use under product-specific terms. That's consistent with the commercial-licensing page, which counts signup credits as paid.

## What the pipeline does with this

- `src/voice/sarvam.mjs` sends `model: "bulbul:v3"`, a lowercase `speaker`, `pace` validated to 0.5–2.0, an explicit `speech_sample_rate`, `output_audio_codec: "wav"` and an optional `dict_id`. It refuses text over 2,500 characters and decodes `audios[0]`.
- Rates:
  - drafts at 24 kHz
  - finals at 48 kHz (REST only, which we use)
- Every call is cached on a hash of all inputs, so a second run bills nothing. Our own cache is the only cache, since Sarvam's response cache doesn't cover v3.
- The pace and sample-rate limits above are checked before any request, so a bad value fails locally, not as a 422 after spending a request.
