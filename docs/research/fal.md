# fal.ai provider research: video models, queue, LoRA training, terms

## What this means for Dheevara (added by the pipeline session, 2026-10-04)

- **MiniMax H3's territory limit covers hosted use too.**
  - The H3 Community License (dated 2 Aug 2026; https://huggingface.co/MiniMaxAI/MiniMax-H3/resolve/main/LICENSE, re-read in session) binds anyone using the works "including through any Hosted Services".
  - §V.4 says: "You may not use, reproduce, modify, distribute, or display the MiniMax H3 Works or any of their Outputs or results outside the Applicable Territory", which excludes the US, UK, EU and South Korea.
  - No fal page says fal holds a different licence. So the plan's line "Hosted H3 through fal is unaffected" (product plan, Market) is **not supported**.
  - Until Avi gets a written answer from fal or MiniMax, `src/render/models.mjs` treats **every** H3 endpoint (hosted, LoRA, Max) as `india_only`, and rule 4 throws for a `worldwide` contract routed to any of them. That leaves no reference-locked character model for diaspora cuts. This is the biggest open question for M2.
- **480p drafts:**
  - Wan 3.0 ($0.05/s), H3 LoRA ($0.0625/s) and Gemini Omni Flash (360p) offer a draft tier.
  - Kling 3.0's cheapest is turbo standard at 720P ($0.112/s). LTX-2.5 and Veo 3.1 start at 720p.
  - So the draft lane for worldwide shots is Wan 3.0 at 480p, and Kling drafts cost about twice that.
- **Seeds:** Kling v3 has no `seed` field, so the ledger records `seed: null` for Kling, and a retry cannot reproduce a take.
- **Webhooks:** fal signs them with ED25519. The cloud container can't receive inbound calls, so runs poll the queue status. `webhook.mjs` is built for deployment only (handoff section 5).
- **Results:** queue results stay about an hour after completion, so the pipeline downloads each video as soon as it lands.
- **Training on our content:** fal's terms commit not to train on customer content, except for models marked "Pending Enterprise Ready", and none of ours is. Partner-API models (Kling, Wan, LTX, Veo, base H3) pass content on to the partner, whose own terms are **unverified**. Only public text and our scripts go into prompts; no unreleased passage is ever sent.
- **The LoRA trainer the plan priced is deprecated:** LTX-2 at $0.0048/step. The current LTX-2.3 trainers cost $0.0024–0.006 per step, and the H3 trainers $0.005–0.015 per step. Training needs Avi's yes in any case (handoff section 9).

All sources below were retrieved on **2026-10-04**, without an API key and with no authenticated calls. When a value is not on a page I fetched, it says **unverified**.

## How to read the citations

Every table row and claim cites one or more source IDs.

**Per-endpoint sources** (substitute the endpoint id; Appendix A lists every exact URL used):
- `L` = `https://fal.ai/models/<id>/llms.txt`. This is fal's live schema and pricing file. fal's own words: "generated from the same metadata the platform serves, so it cannot drift from the real endpoint" [F1].
- `O` = `https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=<id>`. This is the queue OpenAPI: field limits, nested schemas and queue paths.
- `P` = `https://fal.ai/models/<id>`. This is the model page HTML. It carries the badges ("Commercial use", "Partner") and an embedded `endpointBilling` object with `provider_type`, `is_partner_api` and `enterprise_status`.

**Platform sources:**

| ID | URL |
|---|---|
| F1 | https://fal.ai/llms.txt |
| F2 | https://fal.ai/docs/llms.txt |
| F3 | https://api.fal.ai/v1/models?q=… (catalog search, unauthenticated). Queries used: `wan 3`, `minimax h3`, `ltx 2.5`, `veo 3.1`, `gemini omni`, `kling`, `ltx`, `multi shot`, `multi-shot`, `wan-3`, `h3 lora`, plus `category=training` paged |
| F4 | https://api.fal.ai/v1/models?endpoint_id=…&expand=enterprise_status (returns `license_type`, `status`, `enterprise_status` per id) |
| F5 | https://fal.ai/docs/platform-apis/v1/models.md (model search; "Authentication: Optional") |
| Q1 | https://fal.ai/docs/documentation/model-apis/inference/queue.md |
| Q2 | https://fal.ai/docs/documentation/model-apis/inference/webhooks.md |
| Q3 | https://fal.ai/docs/documentation/model-apis/media-expiration.md |
| Q4 | https://fal.ai/docs/documentation/model-apis/common-parameters.md |
| Q5 | https://fal.ai/docs/documentation/model-apis/faq.md |
| Q6 | https://fal.ai/docs/documentation/model-apis/concurrency-limits.md |
| Q7 | https://fal.ai/docs/documentation/model-apis/pricing.md |
| Q8 | https://fal.ai/docs/documentation/setting-up/authentication.md |
| Q9 | https://fal.ai/docs/platform-apis/v1/models/pricing.md, and https://api.fal.ai/v1/models/pricing?endpoint_id=minimax/h3/reference-to-video/lora, which returned HTTP 401 `"API key authentication required"` |
| T1 | https://fal.ai/legal/terms-of-service ("Last Updated: September 8, 2026") |
| T2 | https://fal.ai/legal/api-services (no date shown) |
| T3 | https://fal.ai/legal/privacy-policy ("Last Updated: July 22, 2026") |
| T4 | https://fal.ai/legal/acceptable-use-policy |
| T5 | https://fal.ai/legal/data-processing-addendum ("Last Updated: July 31, 2026") |
| H1 | https://huggingface.co/MiniMaxAI/MiniMax-H3/resolve/main/LICENSE (MiniMax H3 Community License, dated August 2, 2026) |
| H2 | https://huggingface.co/api/models/MiniMaxAI/MiniMax-H3 |
| H3 | https://huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/README.md |

**Hosting key.** "Partner" means the page shows the Partner badge and `provider_type:"partner"`, `is_partner_api:true` [P]. fal's API Services terms say: "If Client uses any third-party AI model via the Company Platform through a third party's API, Client acknowledges that Client Content will be transferred to such a third party" [T2]. "fal-run" means `provider_type:"fal"`, `is_partner_api:false` and no Partner badge [P].

Every endpoint below has `license_type: "commercial"` and `enterprise_status: "ready"` [F4], and shows the "Commercial use" badge [P].

---

## 1. Summary tables

### Kling 3.0 (Kuaishou). Partner API, commercial use

None of the Kling v3 endpoints has a `seed` field or a resolution field.

| Endpoint id | Durations | Resolution / aspect | Price as fal states | Src |
|---|---|---|---|---|
| `fal-ai/kling-video/v3/standard/text-to-video` | "3" to "15" s (string enum), default "5" | No resolution field; output resolution **unverified**. Aspect 16:9, 9:16, 1:1 | $0.084/s audio off, $0.126/s audio on, $0.154/s audio on with voice control | L, O, P |
| `fal-ai/kling-video/v3/standard/image-to-video` | 3 to 15 s | No resolution or aspect field | Same as standard t2v | L, O, P |
| `fal-ai/kling-video/v3/pro/text-to-video` | 3 to 15 s | No resolution field (**unverified**). Aspect 16:9, 9:16, 1:1 | $0.112/s audio off, $0.168/s audio on, $0.196/s with voice control | L, O, P |
| `fal-ai/kling-video/v3/pro/image-to-video` | 3 to 15 s | No resolution or aspect field | Same as pro t2v | L, O, P |
| `fal-ai/kling-video/v3/turbo/standard/text-to-video` | 3 to 15 s | "720P" (from the description). Aspect 16:9, 9:16, 1:1 | $0.112/s | L, O, P |
| `fal-ai/kling-video/v3/turbo/standard/image-to-video` | 3 to 15 s | "720P" | $0.112/s | L, O, P |
| `fal-ai/kling-video/v3/turbo/pro/text-to-video` | 3 to 15 s | "1080p". Aspect 16:9, 9:16, 1:1 | $0.14/s | L, O, P |
| `fal-ai/kling-video/v3/turbo/pro/image-to-video` | 3 to 15 s | "1080p" | $0.14/s | L, O, P |
| `fal-ai/kling-video/v3/4k/text-to-video` | 3 to 15 s | Native 4K | $0.42/s, audio on or off | L, O, P |
| `fal-ai/kling-video/v3/4k/image-to-video` | 3 to 15 s | Native 4K | $0.42/s | L, O, P |

- **Multi-shot.** There is no separate Kling multi-shot endpoint. Multi-shot is the `multi_prompt` field (list of `{prompt, duration "1" to "15"}`) on all v3 endpoints. Standard, pro and 4K also take `shot_type` (`customize` default, or `intelligent`). On turbo, `multi_prompt` is "Multi-shot storyboard (1-6 shots) … total duration must not exceed 15s". The maximum shot count for standard and pro is **unverified**. `fal-ai/multishot-master` exists but is `deprecated` and is not Kling [F3].
- **Draft tiers.** Turbo standard is 720P at $0.112/s [L]. No 480p option exists.

### Wan 3.0 (Alibaba). Partner API, commercial use

| Endpoint id | Durations | Resolutions | Price as fal states | Src |
|---|---|---|---|---|
| `alibaba/wan-3.0/text-to-video` | Integer 2 to 30 s, default 5. `null` means "smart duration" | **480p**, 720p, 1080p (default 1080p) | $0.05/s 480p, $0.10/s 720p, $0.20/s 1080p ("Pricing is subjected to change") | L, O, P |
| `alibaba/wan-3.0/image-to-video` | 2 to 30 s | 480p, 720p, 1080p | Same as t2v | L, O, P |
| `alibaba/wan-3.0/reference-to-video` | 2 to 30 s | 480p, 720p, 1080p | Same, plus "Input video duration is billed in addition to output duration" | L, O, P |
| `alibaba/wan-3.0-prime/text-to-video` | 2 to 30 s | 480p, 720p, 1080p | $0.068/s 480p, $0.14/s 720p, $0.28/s 1080p ("subject to change") | L, O, P |
| `alibaba/wan-3.0-prime/image-to-video` | 2 to 30 s | 480p, 720p, 1080p | Same as Prime t2v | L, O, P |
| `alibaba/wan-3.0-prime/reference-to-video` | 2 to 30 s | 480p, 720p, 1080p | Same as Prime t2v | L, O, P |

### MiniMax H3

| Endpoint id | Hosting | Durations | Resolutions | Price as fal states | Src |
|---|---|---|---|---|---|
| **`minimax/h3/reference-to-video/lora`** (confirmed: the plan's id exists, status `active`) | **fal-run** | Integer 5 to 15 s, default 5 | **480P**, 768P, 2K, 4K (default 2K). "480P and 768P are native generation modes; 2K and 4K upscale a 768P base result" | $0.0625/s 480p, $0.075/s 768p, $0.1625/s 2K, $0.20/s 4K | L, O, P, F3 |
| `minimax/h3/text-to-video/lora` | fal-run | 5 to 15 s | 480P, 768P, 2K, 4K | Same as ref2v LoRA | L, O, P |
| `minimax/h3/image-to-video/lora` | fal-run | 5 to 15 s | 480P, 768P, 2K, 4K | Same as ref2v LoRA | L, O, P |
| `minimax/h3/reference-to-video` (no LoRA) | **Partner** | 5 to 15 s | 480P, 768P, 2K, 4K | $0.05/s 480p, $0.06/s 768p, $0.13/s 2K, $0.16/s 4K; "the first 5 reference images are free and each additional image costs $0.08" | L, O, P |
| `minimax/h3/text-to-video` | Partner | 5 to 15 s | 480P, 768P, 2K, 4K | $0.05 / $0.06 / $0.13 / $0.16 per s | L, O, P |
| `minimax/h3/image-to-video` | Partner | 5 to 15 s | 480P, 768P, 2K, 4K | $0.05 / $0.06 / $0.13 / $0.16 per s | L, O, P |
| `minimax/h3-max/text-to-video` | fal-run ("fal's H3 Max is a post-trained variant of MiniMax H3") | Float 0.92 to 15 s | 480P, 768P, 1080P (default 768P) | Promo $0.03 / $0.048 / $0.096 per s, "40% off … The discount ends October 15" (no year given). Afterwards $0.05 / $0.08 / $0.16 | L, O, P |
| `minimax/h3-max/image-to-video` | fal-run | 0.92 to 15 s | 480P, 768P, 1080P | Same as H3 Max t2v | L, O, P |
| `minimax/h3-max/reference-to-video` | fal-run | 0.92 to 15 s | 480P, 768P, 1080P | $0.05 / $0.08 / $0.16 per s. Includes 4,096 reference tokens; extra tokens $0.02 per 1,000 | L, O, P |
| `minimax/h3-max-turbo/text-to-video` | fal-run | 0.92 to 15 s | 480P, 768P, 1080P | Promo $0.015 / $0.024 / $0.048 per s until "October 15". Afterwards $0.025 / $0.04 / $0.08 | L, O, P |
| `minimax/h3-max-turbo/image-to-video` | fal-run | 0.92 to 15 s | 480P, 768P, 1080P | Same as Max Turbo t2v | L, O, P |

The H3 Max and Max Turbo endpoints have **no `loras` field** [O]. In this family, LoRA is only on the three `minimax/h3/*/lora` endpoints.

### LTX-2.5 (Lightricks). Partner API, commercial use

| Endpoint id | Durations | Resolutions | Price as fal states | Src |
|---|---|---|---|---|
| `lightricks/ltx-2.5/text-to-video/fast` | 6, 8, … 20 s or "auto" (default). Up to 20 s at 24/25 fps for 720p and 1080p; 10 s at 48/50 fps or at 1440p/2160p | 720p, 1080p, 1440p, 2160p (default 1080p). **No 480p** | $0.09/s 720p, $0.13/s 1080p, $0.19/s 1440p, $0.30/s 4K. "Native audio is included at every resolution" | L, O, P |
| `lightricks/ltx-2.5/image-to-video/fast` | Same as t2v fast | Same | Same | L, O, P |
| `lightricks/ltx-2.5/text-to-video/pro` | 6, 8, 10 s or "auto" | 720p, 1080p | $0.12/s 720p, $0.17/s 1080p | L, O, P |
| `lightricks/ltx-2.5/image-to-video/pro` | 6, 8, 10 s or "auto" | 720p, 1080p | Same as pro t2v | L, O, P |

fal labels LTX-2.5 "open-source" [L], yet these endpoints are Partner API and have **no LoRA field** [O, P]. There is no LTX-2.5 trainer on fal. The nearest are the LTX-2.3 trainers in §4 [F3].

### Veo 3.1 (Google). Partner API, commercial use

| Endpoint id | Durations | Resolutions | Price as fal states | Src |
|---|---|---|---|---|
| `fal-ai/veo3.1` (t2v) | "4s", "6s", "8s" (default 8s) | 720p, 1080p, 4k (default 720p). **No 480p** | $0.20/s without audio, $0.40/s with audio at 720p/1080p. 4k: $0.40/s without, $0.60/s with | L, O, P |
| `fal-ai/veo3.1/image-to-video` | 4s, 6s, 8s | 720p, 1080p, 4k | Same as t2v | L, O, P |
| `fal-ai/veo3.1/reference-to-video` | `duration` string, default "8s" | 720p, 1080p, 4k | Same as t2v | L, O, P |
| `fal-ai/veo3.1/fast` and `/fast/image-to-video` | 4s, 6s, 8s | 720p, 1080p, 4k | $0.10/s without audio, $0.15/s with (720p/1080p). 4k: $0.30 / $0.35 | L, O, P |
| `fal-ai/veo3.1/lite` and `/lite/image-to-video` | 4s, 6s, 8s | 720p, 1080p | $0.03/s 720p no audio, $0.05/s 720p audio, $0.05/s 1080p no audio, $0.08/s 1080p audio | L, O, P |

Extra endpoints in the catalog: `fal-ai/veo3.1/first-last-frame-to-video`, `/extend-video`, and `/fast/*` and `/lite/*` variants [F3]. The model page says: "All videos generated with Veo 3.1 are invisibly watermarked with SynthID … The watermark cannot be disabled." It also says: "Can I use Veo 3.1 for commercial projects? Yes. Videos generated through the fal.ai API can be used in commercial projects." [P: fal-ai/veo3.1]

### Gemini Omni Flash (Google). Partner API, commercial use

| Endpoint id | Durations | Resolutions | Price as fal states | Src |
|---|---|---|---|---|
| `google/gemini-omni-flash/v1.1/image-to-video` | Integer 3 to 10 s, default 8 | **360p**, 720p, 1080p, 4k (default 720p). **No 480p** | $0.03/s 360p, $0.10/s 720p, $0.15/s 1080p, $0.30/s 4K | L, O, P |
| `google/gemini-omni-flash/v1.1/text-to-video` | 3 to 10 s | 360p, 720p, 1080p, 4k | Same as v1.1 i2v | L, O, P |
| `google/gemini-omni-flash/v1.1/reference-to-video` | 3 to 10 s | 360p, 720p, 1080p, 4k | Same as v1.1 i2v | L, O, P |
| `google/gemini-omni-flash/image-to-video` (v1) | 3 to 10 s | No resolution field | Token-billed: input $1.875 per 1M tokens, output $21.875 per 1M tokens, "approximately $0.13 per second" at 720p | L, O, P |
| `google/gemini-omni-flash` (v1 t2v) | 3 to 10 s | No resolution field | $21.875 per 1M tokens, "approximately $0.125 per second" at 720p | L, O, P |

Also listed: `google/gemini-omni-flash/v1.1/edit`, `google/gemini-omni-flash/edit` and `google/gemini-omni-flash/reference-to-video` [F3]. The product plan says "extends to 40 s"; I did not check that.

### Which endpoints offer 480p

| Model | 480p? |
|---|---|
| Wan 3.0 and Wan 3.0 Prime | Yes [L] |
| MiniMax H3, base and LoRA (480P) | Yes [L] |
| H3 Max and Max Turbo (480P) | Yes [L] |
| Kling v3 | No resolution field [O] |
| LTX-2.5 | No; lowest is 720p [L] |
| Veo 3.1 | No; lowest is 720p [L] |
| Gemini Omni Flash 1.1 | No; lowest is 360p [L] |

---

## 2. Endpoint details: inputs and outputs

### Kling v3 standard, pro and 4K [L, O]

**Inputs:**
- `prompt` and `multi_prompt` are mutually exclusive.
- `duration` takes "3" to "15" as strings.
- `generate_audio`: default `true`. "Supports Chinese and English voice output. Other languages are automatically translated to English."
- `shot_type`
- `aspect_ratio`: t2v only.
- `negative_prompt`: default "blur, distort, and low quality".
- `cfg_scale`: 0 to 1, default 0.5.
- i2v also takes `start_image_url` (required), `end_image_url` and `elements`. Each element is `{frontal_image_url, reference_image_urls (1–3), video_url (3–10.05 s, 720–2160 px, one per request), voice_id}`, and the prompt refers to them as `@Element1`.
- **No `seed`.**

**Output:** `{"video": {"url", "content_type", "file_name", "file_size"}}`.

### Kling v3 turbo [L, O]

**Inputs:**
- `prompt` ("keep under 2500 characters") or `multi_prompt` (1 to 6 shots, total 15 s or less).
- `duration`: 3 to 15 s.
- `aspect_ratio`: t2v only.
- `image_url`: required on i2v. Formats jpg/jpeg/png, max 50 MB, at least 300 px per side, aspect between 1:2.5 and 2.5:1.
- No negative_prompt, cfg_scale, seed or generate_audio fields.

**Output:** same `video` object as standard/pro.

### Wan 3.0 and Wan 3.0 Prime [L, O]

**Inputs:**
- `prompt`: required on t2v.
- `resolution`
- `aspect_ratio`: adaptive (default), 16:9, 4:3, 1:1, 3:4, 9:16.
- `duration`
- `audio`: default true.
- `enable_prompt_expansion`: default true. "Disabling it can save roughly 20-60 seconds of latency but is likely to degrade generation quality".
- `enable_thinking`: default false.
- `seed`: 0 to 2147483647.
- `enable_safety_checker`: default true. "Disabling it requires account authorization".
- i2v: `start_image_url` (required) and `end_image_url`.
- r2v:
  - `reference_image_urls`: up to 10.
  - `reference_video_urls`: up to 5, total 15 s or less, each at least 16 fps.
  - `reference_audio_urls`: up to 5, total 15 s or less.
  - `file_url` and `web_url`: both require `enable_thinking=true`.
- **No `negative_prompt`. No LoRA.**

**Output:** `{"video": VideoFile{url, width, height, fps, duration, num_frames, file_name, file_size, content_type}, "seed", "duration", "actual_prompt"}`.

### `minimax/h3/reference-to-video/lora` [L, O]

**Required inputs:** `prompt` and `loras`.
- `prompt`: up to 50,000 characters. "Refer to reference assets by … Image 1, Image 2, Video 1, Audio 1".
- `loras`: 1 to 3 items, each `LoRAInput {path (required): "URL or HuggingFace repo id (owner/repo) of the LoRA weights", weight_name (optional), scale: 0–4, default 1}`.

**Optional inputs:**
- `reference_image_urls`: up to 9.
- `reference_video_urls`: up to 3, each 2 to 15 s, combined 15 s or less.
- `reference_audio_urls`: up to 3, each 2 to 15 s, combined 15 s or less.
- Images, videos and audio together: "must add up to at most 12 files".
- `duration`: 5 to 15.
- `resolution`
- `aspect_ratio`: adaptive (default), 21:9, 16:9, 4:3, 1:1, 3:4, 9:16.
- `seed`: "A random seed is selected when omitted".
- `enable_safety_checker`: default true.
- `sync_mode`: returns base64 instead of a CDN URL.
- `prompt_expansion_mode`: disabled, fast, balanced (default), quality.
- **No `negative_prompt`.**

**Output:** `{"video": File{url, content_type, file_name, file_size}, "expanded_prompt"}`. fal describes `expanded_prompt` as "Null when prompt expansion was disabled, left the prompt unchanged, or was performed internally by MiniMax's hosted API."

The catalog lists the endpoint's category as `video-to-video` [F3].

### Other H3 endpoints [L, O]

- **t2v and t2v LoRA:** add `target_audio_url` (at least 2 s, max 15 MB) and `aspect_ratio` (default 16:9).
- **i2v and i2v LoRA:** `image_url` and/or `end_image_url`. The canvas follows the image, so there is no aspect field.
- **H3 Max reference-to-video:** adds `image_url`, `middle_image_url`, `middle_frame_time` and `end_image_url`.

### LTX-2.5 [L, O]

**Inputs:**
- `prompt`: required.
- `image_url`: required on i2v.
- `end_image_url`
- `duration`
- `resolution`
- `aspect_ratio`: 16:9 or 9:16; i2v also accepts "auto".
- `fps`: 24, 25, 48, 50 on fast; 24, 25, 50 on pro.
- `generate_audio`: default true.
- `camera_motion`: dolly_in, dolly_out, dolly_left, dolly_right, jib_up, jib_down, static, focus_shift.
- **No seed, negative_prompt or loras.**

**Output:** `video` as a VideoFile with the same fields as Wan.

The fal display name for `…/text-to-video/pro` reads "Ltx 2.5 Text to Video Fast", which is a labelling slip on fal [L, F3].

### Veo 3.1 [L, O]

**Inputs:**
- `prompt`: required; up to 20,000 characters on r2v.
- `negative_prompt`
- `seed`
- `aspect_ratio`: 16:9 or 9:16; i2v also accepts "auto".
- `duration`
- `resolution`
- `generate_audio`: default true.
- `auto_fix`
- `safety_tolerance`: "1" to "6", default "4".
- i2v: `image_url`, "720p or higher resolution in 16:9 or 9:16".
- r2v: `image_urls` (required). r2v has no seed or negative_prompt.

**Output:** `{"video": File}`.

### Gemini Omni Flash 1.1 [L, O]

**Inputs:**
- `prompt`: required, up to 20,000 characters.
- `image_url`: i2v.
- `end_image_url`: i2v, interpolates between the two images.
- `image_urls`: r2v, up to 10.
- `reference_video_urls`: r2v, up to 3, each 3 s or less.
- `aspect_ratio`: 16:9 or 9:16.
- `resolution`
- `duration`
- **No seed or negative_prompt.**

**Output:** `{"video": File}`.

### Embedded `endpointBilling.price` is not the displayed price [P]

Each model page embeds an `endpointBilling.price`, a single base unit value. It does not always match the displayed price. For example, `kling-video/v3/standard/*` embeds `0.14`, while the displayed text says $0.084/$0.126. The prices in this file are the displayed text from `L`, which matches the rendered `P` text. fal's pricing API needs a key (HTTP 401) [Q9], so it was not used.

---

## 3. Queue API [Q1, Q2, O, F1, Q8]

**Authentication**
- Header: `Authorization: Key $FAL_KEY` [F1, Q1].
- The OpenAPI security scheme is `apiKey` in header `Authorization` [O].
- Key scopes are API and ADMIN [Q8].

**Submit:** `POST https://queue.fal.run/<endpoint-id>` with the JSON input body [Q1, O]. Response [Q1]:
```json
{"request_id":"764cabcf-…","response_url":"https://queue.fal.run/<id>/requests/<rid>/response",
 "status_url":"https://queue.fal.run/<id>/requests/<rid>/status",
 "cancel_url":"https://queue.fal.run/<id>/requests/<rid>/cancel","queue_position":0}
```
The webhook docs show a `gateway_request_id` as well. It differs from `request_id` only after a retry [Q2].

**Status:** `GET https://queue.fal.run/<id>/requests/{request_id}/status?logs=1` [Q1, O].
- `status` is one of `IN_QUEUE`, `IN_PROGRESS`, `COMPLETED`.
- Other fields: `queue_position` (in queue only), `logs[] {message, timestamp}`, `metrics.inference_time` (on completion), `error` and `error_type` (on failure).
- An SSE stream is available at `…/status/stream` [Q1].

**Result:** `GET https://queue.fal.run/<id>/requests/{request_id}` [Q1 cURL, O]. The submit response's `response_url` ends in `/response` [Q1]. Video models return a `video` object [Q1].

**Cancel:** `PUT https://queue.fal.run/<id>/requests/{request_id}/cancel` [Q1, O].

| HTTP status | Body |
|---|---|
| 202 | `{"status":"CANCELLATION_REQUESTED"}` (an in-progress job "may still complete") |
| 400 | `{"status":"ALREADY_COMPLETED"}` |
| 404 | `{"status":"NOT_FOUND"}` |

**Path shape.** The OpenAPI for every multi-segment id checked (for example `/fal-ai/kling-video/v3/pro/text-to-video/requests/{request_id}/status`) uses the **full endpoint id** in the status, result and cancel paths [O]. To be safe, use the `status_url`, `response_url` and `cancel_url` returned by submit.

**Synchronous call:** `POST https://fal.run/<id>` [L].

**Webhooks** [Q2, Q1]
- Request: add `?fal_webhook=<url>` to the submit URL.
- Payload: `{"request_id","gateway_request_id","status":"OK"|"ERROR","payload":{…model output…}}`. On error it adds `"error":"Invalid status code: 422"` and the payload holds `detail`. If the output cannot be serialised, `"payload":null` with `"payload_error"`.
- Delivery and retries:
  - The endpoint must answer 2xx.
  - The first attempt times out after 15 s; retries time out after 120 s.
  - Retries use increasing backoff "until the stored result expires — about 1 hour after the request completes, or about 6 minutes for results of 10 KB or more — up to a maximum of 31 retries".
  - 3xx redirects are not followed and count as a permanent failure.
  - Private, internal or loopback targets are dropped.
- Signature verification:
  - Headers: `X-Fal-Webhook-Request-Id`, `X-Fal-Webhook-User-Id`, `X-Fal-Webhook-Timestamp` (Unix seconds) and `X-Fal-Webhook-Signature` (hex).
  - Message: `request_id \n user_id \n timestamp \n hex(sha256(raw body))`, as UTF-8.
  - Verify with ED25519 against every key in `https://rest.fal.ai/.well-known/jwks.json`. Each key's `x` field is base64url. Cache the keys for no more than 24 h.
  - Reject requests whose timestamp is off by more than 300 s.
- Source IP ranges: `GET https://api.fal.ai/v1/meta` → `webhook_ip_ranges`.

**How long results stay available**
- Queue result: "If all delivery attempts fail, you can usually still retrieve the result from the queue while it is retained — results larger than 1 MB, and results for requests with payload storage disabled, are only available until the stored result expires" [Q2].
- Request payloads (JSON) are stored **30 days** by default. Send `X-Fal-Store-IO: 0` to opt out [Q3, Q4].
- CDN media: "available for at least 7 days by default" [Q5]. Q4 gives the header default as "Your account setting (forever and publicly readable if not configured)" [Q4]. Set retention per request with `X-Fal-Object-Lifecycle-Preference: {"expiration_duration_seconds": N}` [Q3].
- Media URLs are public by default [Q5].
- A Platform API call deletes a request's payloads and output CDN files [Q3].

**Concurrency and rate limits** [Q5, Q6]
- New accounts get **2** concurrent requests. The limit rises automatically "up to **40**" with credits bought, based on "paid invoices from the last four weeks".
- Only `IN_PROGRESS` requests count. Queued requests wait and are never rejected for concurrency.
- fal "may apply additional concurrency limits on certain high-demand models".
- Direct (`fal.run`) calls over the limit get a 429 of type `concurrent_requests_limit` with `X-Fal-needs-retry: 1`.

**Retries:** the queue re-queues on 503, 504 or connection errors "up to 10 times". `X-Fal-No-Retry: 1` disables this [Q1].

**Billing**
- Not charged for server errors (500 and above) or for time spent in the queue [Q7, Q5].
- A 422 "may still be charged if a runner spent GPU time" [Q5].
- Credits are prepaid and expire 365 days after purchase [Q5].

---

## 4. LoRA training on fal [L, O, P, F3]

| Trainer endpoint | For | Price as fal states | Steps (default) | Hosting | Status |
|---|---|---|---|---|---|
| `minimax/h3/ref2va/trainer` | H3 reference-to-video LoRA ("the reference-conditioned variant behind minimax/h3/reference-to-video") | $0.015 × steps ($15 per 1,000) | 1 to 15,000 (2,000) | fal-run | active |
| `minimax/h3/i2v/trainer` | H3 image-to-video (with audio) | $0.01 × steps | 1 to 15,000 (2,000) | fal-run | active |
| `minimax/h3/t2v/trainer` | H3 text-to-video | $0.005 × steps | 1 to 15,000 (2,000) | fal-run | active |
| `minimax/h3/flf2v/trainer` | H3 first/last frame | $0.01 × steps | 1 to 15,000 (2,000) | fal-run | active |
| `fal-ai/ltx23-video-trainer` | LTX-2.3 22B | $0.0048 per step ("default 2000-step training will cost $9.60") | 100 to 6,000 (2,000) | fal-run | active |
| `fal-ai/ltx23-trainer-v2/t2v` | LTX 2.3 t2v | $0.006 × steps | 100 to 10,000 (2,000) | fal-run | active |
| `fal-ai/ltx23-trainer-v2/i2v` | LTX 2.3 i2v | $0.0024 × steps | 100 to 10,000 (2,000) | fal-run | active |
| `fal-ai/ltx2-video-trainer` | LTX-2 | $0.0048 per step | 1 to 20,000 (2,000) | fal-run | **deprecated** |
| `fal-ai/wan-22-trainer/t2v-a14b` | Wan 2.2 ("T2V/I2V 480P") | $0.004 per step (minimum 100 steps charged) | 100 to 20,000 (400) | fal-run | active |
| `fal-ai/wan-22-trainer/i2v-a14b` | Wan 2.2 | $0.005 per step (minimum 100 steps charged) | 100 to 20,000 (400) | fal-run | active |

**What the trainers take and return**
- H3 trainer inputs [L]:
  - `training_data_url`: a zip of clips, "at least 10".
  - `rank`: 8, 16, 32, 64 or 128; default 32.
  - `learning_rate`: default 0.0002.
  - `number_of_frames`: default 73, must satisfy frames % 17 == 5.
  - `frame_rate`: default 24.
  - `resolution`: low, medium or high.
  - `aspect_ratio`
  - `trigger_phrase`
- ref2va trainer extras [L]:
  - `reference_conditioning_p`: default 0.9.
  - `resume_from_lora_url`
  - Sidecar files in the zip: `clipNN.txt` captions and ordered `clipNN.ref_1..ref_4.<ext>` image, video or audio references.
- H3 trainer output: `{lora_file, config_file, debug_dataset?}` [L]. This LoRA goes into the `loras[].path` of `minimax/h3/*/lora` [P: ref2va trainer, L].

**No trainer exists** for Wan 3.0, LTX-2.5, Kling, Veo or Gemini [F3: `category=training` paged, plus searches `wan 3.0 trainer` and `ltx 2.5 trainer`, which returned nothing].

**Where non-H3 LoRAs can run.** Wan 2.2 and LTX-2.3 LoRAs run on their own LoRA inference endpoints, not on Wan 3.0 or LTX-2.5:
- `fal-ai/wan/v2.2-a14b/text-to-video/lora` and `/image-to-video/lora`: resolution 480p, 580p or 720p; "Price: $0.1 per seconds" (verbatim; whether that means per video second or per GPU second is **unverified**).
- `fal-ai/ltx-2.3-22b/text-to-video/lora` and `/image-to-video/lora`: "$0.001805 per megapixel of generated video data (width × height × frames)".
- `fal-ai/ltx-2.3-22b/distilled/image-to-video/lora`: $0.001405 per megapixel.

---

## 5. Terms, data use and licences

### fal Terms of Service [T1]

- **Licence to Customer Input.** "Customer hereby grants Company a non-exclusive … license to reproduce, use, access, store, display, adapt … and otherwise process any Customer Input **to provide the Services**." The customer keeps ownership of Customer Input.
- **Usage Data.** "Usage Data" is "anonymized or aggregated data … which may include data based on or derived from Customer Input". fal may use it "to design, develop, and offer Company products, services, and AI models; and for any other lawful purposes."
- **Confidentiality.** "Customer's Confidential Information includes Customer Input and Output Content generated for Customer."
- **Third-Party Materials.** Customers may not use third-party model outputs "to develop, fine-tune, or train any artificial intelligence or machine learning algorithms or models" that compete with those Third-Party Materials.
- **Export.** Customers must not be in a US-embargoed or "terrorist supporting" country, or on US restricted-party lists.

### fal API Services supplemental terms [T2]. This is the clause that bears on rule 5

> "Use of Client Content. Company will not use Client Content to create, train, develop (directly or indirectly) Company's products or services. This restriction applies to all third-party APIs, except for APIs marked as 'Pending Enterprise Ready' … ('Excluded Models'). In addition, Company's information security and other obligations (such as the DPA) will not apply to Excluded Models."

> "Third Party Models. If Client uses any third-party AI model via the Company Platform through a third party's API, Client acknowledges that Client Content will be transferred to such a third party."

What this means for each endpoint here:
- All of them are `enterprise_status: "ready"` [F4], so none is an "Excluded Model" and fal's no-training commitment covers them.
- Partner endpoints send content to the partner: Kling (Kuaishou), Wan 3.0 (Alibaba), LTX-2.5 (Lightricks), Veo 3.1 and Gemini Omni Flash (Google), and **base** H3 (MiniMax). Those partners' own training and retention terms are **not stated on fal** and are **unverified**.
- The H3 LoRA endpoints, H3 Max, H3 Max Turbo and all trainers are fal-run [P].

### DPA and privacy policy [T5, T3]

- "Company may Process Deidentified Data to improve the Services" [T5].
- Client personal data is kept "until the termination of the Agreement" [T5].
- "fal is based in the United States and we and our service providers process and store personal information on servers located in the United States and other countries" [T3].

### Output licence and commercial use

- FAQ: "Each model has its own license. Most models on fal are available for commercial use and are marked with a `Commercial use` badge … Models marked `Research only` are restricted to non-commercial use" [Q5].
- Every endpoint in this file shows "Commercial use" and none shows "Research only" [P]. The catalog API returns `license_type: "commercial"` for all of them [F4].
- No per-model licence text (for example Kuaishou, Alibaba or Google output terms) appears on any fal page fetched [P].

### MiniMax H3 territory [H1, H2, H3, P]

What the licence says [H1]:
- The licence is the "MiniMax H3 Community License Agreement", dated August 2, 2026 [H1, H2].
- "Excluded Territories" means "the European Union, the United Kingdom, the Republic of Korea and the United States of America". "Applicable Territory" means "worldwide, excluding the Excluded Territories".
- It binds anyone "using … any portion or element of the MiniMax H3 Works (**including through any Hosted Services**)". "Output" includes results obtained "through Hosted Services".
- §V.4: "You may not use, reproduce, modify, distribute, or display the MiniMax H3 Works **or any of their Outputs** or results outside the Applicable Territory." The Acceptable Use Policy item 1 repeats this: "Use outside the Applicable Territory".
- §V.2: a Hosted Service provider "must bind each recipient or user to enforceable terms at least as protective as" §V and the Acceptable Use Policy.
- §IV: separate written authorisation is needed above US$20M yearly revenue, and "MiniMax H3" must be shown prominently in the UI of a commercial product.
- The open release does not include H3-Context-IR and H3-Regenerate-2K; those are hosted-API-only [H3].

What fal says:
- No fal page fetched mentions H3 territory, the community licence or "Powered by MiniMax H3". I searched all `P`, `L` and `O` files for `minimax/*` for "territor", "community licen", "excluded" and "powered by minimax", and found nothing.
- fal shows H3 LoRA and H3 Max as "Commercial use" with `provider_type: "fal"`, meaning fal runs them itself [P]. fal is a US company [T3].
- Whether fal holds a separate licence from MiniMax that lifts the territory limit is **unverified**. Nothing on any page I fetched says so.

So: `docs/product-plan.md` line 45 says "Hosted H3 through fal is unaffected". **Nothing I found supports that**, and the licence text says Hosted Services and Outputs are covered. Base `minimax/h3/*` (Partner) would fall under MiniMax's own API terms. I could not read those: https://platform.minimax.io/protocol/terms-of-service renders client-side, and the fetch returned 3 words.

### India and territory restrictions on fal itself [T1, T4, F2]

- The Acceptable Use Policy bars use if "you are located in any country, territory, or region that is the target of comprehensive sanctions" administered by the US, EU, UK or other authorities ("Restricted Territories") [T4]. The ToS export clause says the same [T1].
- **No fal page names India**, and none restricts India-based use. I searched T1–T5 and the full docs text (https://fal.ai/docs/llms-full.txt) for "india", "territor", "geo", "embargo" and "sanction".
- fal Serverless apps can pin `regions` such as `["us-east"]`. No region control for Model APIs was found [llms-full.txt].

---

## 6. Could not verify

1. **Kling v3 output resolution.** Standard, pro and the plan's "1080p" are not stated on fal; there is no resolution field. Only turbo ("720P" standard, "1080p" pro) and 4K state a resolution [L, P]. The maximum number of `multi_prompt` shots on standard and pro is also not stated; "1-6 shots" appears only on turbo.
2. **Partner data use.** Whether Kuaishou, Alibaba, Lightricks, Google or MiniMax (base H3) train on, or retain, content passed through fal's Partner API. fal states only that content is transferred [T2].
3. **H3 on fal and the community licence.** Whether fal's fal-run H3 LoRA and H3 Max endpoints carry the H3 Community License territory limits, or run under a separate MiniMax agreement. No fal statement exists either way [P, L, O, H1]. MiniMax platform terms could not be read (client-rendered page).
4. **CDN media default retention.** "at least 7 days" [Q5] and "forever … if not configured" [Q4] are both fal statements. The actual account default is visible only with a key, via https://fal.ai/docs/platform-apis/v1/storage/settings/get.md, which I did not call.
5. **Live submit response for multi-segment ids.** I could not confirm whether the `status_url` returned for nested ids like `fal-ai/kling-video/v3/pro/text-to-video` uses the full id. The OpenAPI says it does [O]; checking needs a key.
6. **Account-specific pricing and discounts.** The pricing API needs a key [Q9]. Prices here are fal's published per-model text.
7. **H3 Max promo end date.** "October 15" has no year on the page [L].
8. **Wan 2.2 LoRA price unit.** "$0.1 per seconds" is ambiguous [L].
9. **Gemini Omni Flash "extends to 40 s".** The plan's claim was not checked. The `…/v1.1/edit` endpoint exists [F3] but I did not fetch its schema.
10. **API Services terms date.** No "Last Updated" date appears on https://fal.ai/legal/api-services [T2].
11. **DPA subprocessor list.** Attachment 4 rendered empty in the HTML I fetched [T5].

---

## Appendix A: exact per-endpoint URLs read (all 2026-10-04)

For each id below I read the three URLs:
- `https://fal.ai/models/<id>/llms.txt`
- `https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=<id>`
- `https://fal.ai/models/<id>`

The ids:

- Kling:
  - `fal-ai/kling-video/v3/pro/text-to-video`, `fal-ai/kling-video/v3/pro/image-to-video`
  - `fal-ai/kling-video/v3/standard/text-to-video`, `fal-ai/kling-video/v3/standard/image-to-video`
  - `fal-ai/kling-video/v3/turbo/pro/text-to-video`, `fal-ai/kling-video/v3/turbo/pro/image-to-video`
  - `fal-ai/kling-video/v3/turbo/standard/text-to-video`, `fal-ai/kling-video/v3/turbo/standard/image-to-video`
  - `fal-ai/kling-video/v3/4k/text-to-video`, `fal-ai/kling-video/v3/4k/image-to-video`
  - `fal-ai/kling-video/o3/pro/reference-to-video`
- Wan:
  - `alibaba/wan-3.0/text-to-video`, `alibaba/wan-3.0/image-to-video`, `alibaba/wan-3.0/reference-to-video`
  - `alibaba/wan-3.0-prime/text-to-video`, `alibaba/wan-3.0-prime/image-to-video`, `alibaba/wan-3.0-prime/reference-to-video`
- MiniMax:
  - `minimax/h3/reference-to-video/lora`, `minimax/h3/reference-to-video`
  - `minimax/h3/text-to-video`, `minimax/h3/image-to-video`
  - `minimax/h3/text-to-video/lora`, `minimax/h3/image-to-video/lora`
  - `minimax/h3-max/reference-to-video`, `minimax/h3-max/text-to-video`, `minimax/h3-max/image-to-video`
  - `minimax/h3-max-turbo/text-to-video`, `minimax/h3-max-turbo/image-to-video`
  - `minimax/h3/ref2va/trainer`, `minimax/h3/i2v/trainer`, `minimax/h3/t2v/trainer`, `minimax/h3/flf2v/trainer`
- LTX:
  - `lightricks/ltx-2.5/text-to-video/fast`, `lightricks/ltx-2.5/text-to-video/pro`
  - `lightricks/ltx-2.5/image-to-video/fast`, `lightricks/ltx-2.5/image-to-video/pro`
- Veo:
  - `fal-ai/veo3.1`, `fal-ai/veo3.1/image-to-video`
  - `fal-ai/veo3.1/fast`, `fal-ai/veo3.1/fast/image-to-video`
  - `fal-ai/veo3.1/lite`, `fal-ai/veo3.1/lite/image-to-video`
  - `fal-ai/veo3.1/reference-to-video`
- Gemini:
  - `google/gemini-omni-flash`, `google/gemini-omni-flash/image-to-video`
  - `google/gemini-omni-flash/v1.1/image-to-video`, `google/gemini-omni-flash/v1.1/text-to-video`, `google/gemini-omni-flash/v1.1/reference-to-video`
- Trainers:
  - `fal-ai/ltx23-video-trainer`, `fal-ai/ltx23-trainer-v2/t2v`, `fal-ai/ltx23-trainer-v2/i2v`, `fal-ai/ltx2-video-trainer`
  - `fal-ai/wan-22-trainer/t2v-a14b`, `fal-ai/wan-22-trainer/i2v-a14b`

For the following I read only `llms.txt`:
- `fal-ai/ltx-2.3-22b/text-to-video/lora`, `fal-ai/ltx-2.3-22b/image-to-video/lora`, `fal-ai/ltx-2.3-22b/distilled/image-to-video/lora`
- `fal-ai/wan/v2.2-a14b/text-to-video/lora`, `fal-ai/wan/v2.2-a14b/image-to-video/lora`

All three URLs (`L`, `O`, `P`) were fetched for every id in the main list, 54 endpoints in total.
