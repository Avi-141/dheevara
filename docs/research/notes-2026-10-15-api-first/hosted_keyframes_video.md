# Hosted / API-based keyframes, consistency and video for Dheevara (as of 2026-10-15)

This note extends `docs/research/notes-2026-10-15-open-source/paid_offerings_and_gulab.md` (the "prior note") and does not repeat its per-second video prices for fal, Runway, Veo 3.1, Kling, Sora 2, Seedance, MiniMax H3 or Wan 3.0. Provenance: **[F]** means the page was fetched today. **[S]** means a search snippet or third-party/aggregator source, which should be verified before budgeting. FX is assumed, not sourced.

## 1. GPU / inference platforms: what each offers for media generation

### Takeaway
None of the platforms the founder named ("Google? Together? Fireworks?") is a "GPU" choice. Each is a hosted model catalogue, and they differ a lot:
- **Google (Gemini API paid tier, or Vertex AI / "Gemini Enterprise Agent Platform").** This is the strongest data-terms option and the best consistency feature set: Veo 3.1 with 3 reference images, first/last frame and 9:16; Nano Banana Pro/2 with multi-reference. It hosts no LoRAs and no open models in its media API.
- **Together AI.** A cheap per-image catalogue (FLUX.2, Qwen Image, Imagen 4, Seedream, Nano Banana) plus some video models priced per clip. Its FLUX LoRA path is deprecated and it offers no image fine-tuning.
- **Fireworks.** Lists **no** image or video generation models.
- **Replicate.** 1-hour default deletion of API inputs and outputs, and its "trainings" give a real hosted LoRA path.
- **fal.** The broadest aggregator: $2 FLUX LoRA training, Wan LoRA training at $0.005/step, LoRA URLs on inference.
- **Runware.** A large, cheap catalogue with an explicit "uploaded content not used for training" statement.

For a self-made style LoRA called over an API, the realistic hosts are **fal, Replicate and Runware**, plus Comfy Cloud as a workflow host.

### Cited Findings
**Google**
- **Veo through the Gemini API** [F] — [ai.google.dev Veo docs](https://ai.google.dev/gemini-api/docs/veo)
  - 9:16 and 16:9 on Veo 3.1, 3.1 Fast and 3.1 Lite.
  - Durations are 4, 6 or 8 s. Reference images, extension and 1080p/4K require 8 s.
  - 4K is on 3.1 and 3.1 Fast only, not Lite.
  - Lite supports neither reference images nor extension.
  - Extension adds 7 s per step, up to 20 times. The input must be 720p and 9:16 or 16:9, and output can reach 148 s.
  - Generated videos are kept server-side for 2 days.
- **`personGeneration` setting** [F] — [Veo docs](https://ai.google.dev/gemini-api/docs/veo)
  - Image-to-video, interpolation and reference-image modes allow only `allow_adult`.
  - In the EU, UK, CH and MENA, `allow_adult` is the only value allowed.
  - This matters because Dheevara's figures (e.g., Abhimanyu, aged 16) are adults or teens in stone. Keep prompts describing carved adult figures.
- **Vertex AI (now "Gemini Enterprise Agent Platform") data governance** [F] — [docs.cloud.google.com data-governance](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/data-governance)
  - Google "won't use your data to train or fine-tune any AI/ML models without your prior permission or instruction". This covers GA and pre-GA managed models.
  - Google "may log prompts to detect potential abuse". Zero-data-retention customers can request an exception.
  - In-memory and durable caching for Gemini models is on by default and deleted within 24 h. It can be disabled per project (`disableCache`).
  - Request/response logging is off by default.
  - The page does not mention Veo or Imagen by name, so whether the caching and ZDR controls apply to them is unconfirmed.
- **Gemini API paid tier** [prior note, F]: "not used to improve products" for Veo, Nano Banana and TTS.
- **Vertex region** [S] — [Vertex locations](https://docs.cloud.google.com/vertex-ai/docs/general/locations): Vertex lists Mumbai (asia-south1) as a region, but whether Veo or Imagen is served there was **not** confirmed.

**Together AI** [F] — [together.ai/pricing](https://www.together.ai/pricing)
- **Images, per image**

  | Model | Price |
  |---|---|
  | FLUX.2 [pro] / [flex] | $0.03 |
  | FLUX.2 [dev] | $0.0154 |
  | Nano Banana Pro | $0.134 |
  | Nano Banana 2 (Gemini 3.1 Flash Image) | $0.05 |
  | Qwen Image 2.0 | $0.04 |
  | Qwen Image 2.0 Pro | $0.08 |
  | Ideogram 4.0 | $0.06 |

- **Images, per megapixel**

  | Model | Price |
  |---|---|
  | FLUX.1 Kontext [pro] | $0.04 |
  | FLUX.1 Kontext [max] | $0.08 |
  | FLUX.2 [max] | $0.07 |
  | Imagen 4 Fast / Preview / Ultra | $0.02 / $0.04 / $0.06 |
  | Seedream 4.0 | $0.03 |

- **Video, per clip at the lowest setting**

  | Model | Price |
  |---|---|
  | Seedance 2.5 | $0.115 |
  | Seedance 2.0 | $0.16 |
  | HappyHorse 1.1 (text-, image- and reference-to-video) | $0.14 |
  | FLUX 3 | $0.17 |
  | Sora 2 | $0.80 |
  | Kling 2.1 Master | $0.92 |
  | Veo 2.0 | $2.50 |

  Together says displayed prices "refer to the lowest resolution/duration settings."
- The page has no image-model LoRA, image fine-tuning or data statements.
- **LoRAs** [S] — [Together FLUX LoRA quickstart](https://docs.together.ai/docs/quickstart-flux-lora): `image_loras` (path and scale, up to 2 LoRAs) existed on `FLUX.1-dev-lora`, which is now marked **deprecated**. "Fine-tuning for FLUX LoRA is not yet available."

**Fireworks AI** [F] — [fireworks.ai/pricing](https://fireworks.ai/pricing): no image or video generation models are listed, only text, embeddings, fine-tuning (including VLM image SFT) and GPUs.

**Replicate**
- **Pricing** [F] — [replicate.com/pricing](https://replicate.com/pricing)
  - Prices shown include flux-1.1-pro at $0.04/image and wan-2.1 i2v at $0.09/s (480p) or $0.25/s (720p). The page appears stale or abbreviated and has no Veo, Kling or Seedream rows.
  - Hardware for trainings and private models: H100 $0.001525/s, A100-80GB $0.0014/s, L40S $0.000975/s.
- **Data retention** [F] — [Replicate data retention](https://replicate.com/docs/topics/predictions/data-retention)
  - API prediction inputs, outputs, files and logs are deleted after 1 hour by default. Web-UI predictions are kept indefinitely.
  - The page states nothing about training on customer data.

**fal**
- **LoRA training** [F] — [fal flux-lora-fast-training](https://fal.ai/models/fal-ai/flux-lora-fast-training)
  - $2 per training run, scaling linearly with steps (default 1,000).
  - `is_style: true` turns off auto-caption and masks for style training.
  - The resulting LoRA URL is passed in a `loras` array (path, scale) to `fal-ai/flux-lora`.
- **Wan LoRA trainer** [S] — [fal wan-trainer llms.txt](https://fal.ai/models/fal-ai/wan-trainer/llms.txt): $0.005 per step (Wan 2.1 i2v-480p and t2v variants), about $2 at 400 steps.
- **Data terms**: no fal enterprise ZDR or DPA was found. See the prior note's flag on §6(c) "Usage Data … AI models".

**Runware** [F] — [runware.ai/pricing](https://runware.ai/pricing)
- **Images, per image**

  | Model | Price |
  |---|---|
  | Qwen-Image-2.1-Turbo | $0.014 |
  | Qwen-Image-2.1-Pro | $0.075 |
  | FLUX 3 Image | $0.041 |
  | Seedream 5.0 Flash | $0.019 |

- **Video, per second**

  | Model | Price |
  |---|---|
  | MiniMax H3 Max Turbo, 480p | $0.025 |
  | Wan 3.0, 480p | $0.05 |
  | FLUX 3 Video Draft, 720p | $0.04 |
  | Seedance 2.5, 480p | $0.1025 |
  | LTX-2.5 Fast / Pro, 720p | $0.09 / $0.12 |

- Runware also has a "LoRA Training" tool and "Model Upload". It states: "Custom models and content you upload remain private and are not shared or used for training." Data residency is EU and US.

**WaveSpeed** [S] — [CostBench](https://www.costbench.com/software/ai-media-apis/wavespeed/); [apiframe guide](https://apiframe.ai/guides/wavespeed-ai-api-guide)
- Pay-as-you-go. Images cost about $0.005 (Z Image Turbo) to $0.14 (Nano Banana Pro).
- Video costs about $0.01/s (Wan 2.2 Ultra Fast) to $0.15/s (Veo 3.1 Fast).

**Modal** [S] — [Modal geographic latency](https://modal.com/docs/guide/geographic-latency)
- "All inputs to Modal containers go through our control plane in Virginia, USA". Most workers are in the US, with some in Europe and Asia.
- No India region was found.
- Modal is bring-your-own-model compute (H100 ≈ $3.95/h per the prior note), not a model catalogue.

**Comfy Cloud** [F] — [comfy.org/pricing](https://comfy.org/pricing.md)
- **GPUs, billed per second:** H100 $6.23/h, RTX PRO 6000 $4.54/h, B200 $11.23/h.
- **Plans**

  | Plan | Price | Notes |
  |---|---|---|
  | Standard | $20/mo | |
  | Creator | $35/mo | Adds custom model and LoRA import |
  | Pro | $100/mo | |
  | Team | $700/mo | Up to 50 members |

- "Cloud API" runs workflows programmatically. Concurrent API workflows are 1/3/5/25 by plan.
- Partner Nodes (e.g., Nano Banana Pro) draw from the credit pool, with BYOK for Runway and Gemini.
- No data or training statement appears on the page.

### Inferences
- **Google is the cleanest answer for "no training on our scripts".** The training restriction is contractual on Vertex and stated on the Gemini API paid tier, and caching and logging can be switched off. Veo 3.1 Fast at $0.10–0.12/s (prior note) with reference images, first/last frame and 9:16 covers most of the video need on one vendor. The cost is being locked to Google's model family and having no custom LoRA.
- **Together and Runware are good keyframe-volume shops** (FLUX.2 pro at $0.03, Qwen Image) but not consistency tools on their own.
- **Fireworks is irrelevant for media.**
- **For a style LoRA** (e.g., trained on photographs of real Hoysala/Chola reliefs the team has rights to), use fal ($2/run, LoRA URL at inference) or Replicate (hardware-second billing, 1-h deletion). Runware is a candidate if its LoRA upload is confirmed.
- **Wan LoRAs also give video-side style lock**, which closed models (Veo, Kling) cannot.
- **Region:** every platform except possibly Vertex asia-south1 serves from the US or EU. Generation is asynchronous, so India latency hardly matters for the pipeline. It matters only for interactive canvases.

### Gaps
- No pricing pages were retrieved for DeepInfra or Baseten (searches returned nothing specific).
- Not verified: whether Veo or Imagen is available in asia-south1, and Vertex per-second Veo prices (the pricing page fetch was truncated).
- No official training terms were found for Together, Runware video, WaveSpeed or fal.
- Replicate's pricing page looked partial. Current Replicate prices for Kontext, Veo, Kling and Seedream are unverified.
- Not confirmed: whether Together or Runware accept user-uploaded LoRAs on FLUX.2 or Qwen-Image today.

## 2. Keyframe and consistency tooling via API, and a recommended workflow

### Takeaway
The models that take **style and character references together in one call** are:

| Model | References per call | Basis |
|---|---|---|
| Nano Banana Pro | up to 6 object + 5 character + 3 style | [F] |
| FLUX.2 [pro] | up to ~8–10 references | [S] |
| Seedream 4.5 | 6–14 references; sources conflict | [S] |
| Runway gen4_image | up to 3 @-tagged references, e.g. "@abhimanyu in the style of @relief" | [S] |
| Qwen-Image-Edit-Plus | 1–3 images | [S] |

For video:

| Model | Reference support | Basis |
|---|---|---|
| Veo 3.1 / Fast | 3 reference images ("style and content"), first/last frame, 9:16 | [F] |
| Kling 3.0 Omni (O3) | Elements, up to 4 images each, plus up to 7 raw reference images | [S] |

Midjourney has no official API. Recommended workflow: a hosted **style LoRA** (fal) **plus** multi-reference keyframing (Nano Banana Pro or FLUX.2 pro), then **first/last-frame image-to-video** (Veo 3.1 Fast or Kling).

### Cited Findings
- **Gemini image models** [F] — [Gemini image-generation docs](https://ai.google.dev/gemini-api/docs/image-generation)
  - Nano Banana Pro: "Up to 6 images of objects with high-fidelity", up to 5 character images and up to 3 style references.
  - Nano Banana 2: about 10 object and 4 character images (column mapping inferred from a flattened table).
  - 1K, 2K and 4K output. All outputs carry SynthID.
  - 9:16 support on Pro and 2 was not explicitly confirmed on the fetched portion.
- **Veo 3.1 / 3.1 Fast** [F] — [Veo docs](https://ai.google.dev/gemini-api/docs/veo)
  - "accepts up to 3 reference images" ("style and content references"). The examples only use `reference_type="asset"`.
  - `lastFrame` is "the final image for an interpolation video … must be used in combination with the `image` parameter".
  - Reference-image mode requires 8 s clips. Lite has no reference images.
- **Imagen subject customization** [S] — [Vertex subject customization](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/subject-customization); [Firebase guide](https://firebase.google.com/docs/ai-logic/edit-images-imagen-subject-customization): reference image(s) are cited by ID in the prompt (`[1]`), using model `imagen-3.0-capability-001`, on Vertex only. It is an older generation than Nano Banana Pro.
- **Kling 3.0 Omni / O3** [S] — [Runware Kling O3 docs](https://runware.ai/docs/models/klingai-video-o3-pro); [Kling Omni guide](https://kling.ai/quickstart/klingai-video-3-omni-model-user-guide); [magichour](https://magichour.ai/api/kling-3-0-omni)
  - Elements store a subject with up to 4 images or one video.
  - Up to 7 raw reference images, referenced as @image_1…7.
  - 3–15 s single shots or multi-shot stacks of 2–6 scenes.
  - Parameter names differ by reseller. One aggregator gives $0.084/s official and $0.075/s on EvoLink.
- **Runway gen4_image** [S] — [segmind](https://www.segmind.com/models/runway-gen4-image/api); [mcpservers rw-generate-image](https://mcpservers.org/hi/agent-skills/runwayml/rw-generate-image)
  - Up to 3 reference images, each with a lowercase tag of 3–16 characters, cited as @tag in the prompt.
  - 5 credits at 720p, 8 at 1080p (≈$0.05–0.08).
- **FLUX.2 [pro]** [S] — [innfactory](https://innfactory.ai/en/ai-models/flux/); [opper](https://opper.ai/black-forest-labs/flux-2-pro)
  - Up to 8–10 reference images. BFL has US and EU endpoints (api.us.bfl.ai / api.eu.bfl.ai).
  - Kontext [pro]/[max] cost $0.04/$0.08 per MP on Together [F].
  - BFL's own training and retention terms were not found. Resellers state "no training on customer data".
- **Seedream 4.5** [S] — [cliprise guide](https://www.cliprise.app/learn/guides/model-guides/seedream-4-5-complete-guide); [Freepik](https://www.freepik.com/blog/introducing-seedream-4-5): sources give 14, 9 or 6 reference images (conflict). 2K–4K output.
- **Qwen-Image-Edit-Plus** [S] — [Alibaba Model Studio](https://help.aliyun.com/en/model-studio/qwen-image-edit-plus); [pricepertoken](https://pricepertoken.com/image/model/qwen-qwen-image-edit-plus)
  - 0.22 CNY per image (Singapore) on Model Studio, about $0.031 on fal.
  - Multi-image editing with 1–3 inputs on RunComfy at $0.035.
  - LoRA variants exist (muapi "qwen-image-edit-plus-lora").
- **Ideogram Character** [S] — [apiframe](https://apiframe.ai/jp/models/ideogram-character); [Ideogram reference features](https://docs.ideogram.ai/using-ideogram/features-and-tools/reference-features): consistency from a **single** character reference image, about 25 s per image. It is face-centric.
- **Recraft custom styles** [S] — [recraft llms.txt](https://www.recraft.ai/llms.txt): a style is created from up to 5 reference images. Whether style creation is exposed in the API was not confirmed.
- **Midjourney** [S] — [myarchitectai](https://www.myarchitectai.com/blog/midjourney-apis); [cometapi](https://www.cometapi.com/does-midjourney-provide-an-api/): no official API. Its ToS forbids automated access, and third-party wrappers risk account bans.
- **Hosted LoRA training**
  - fal FLUX LoRA: $2/run, "minutes" [F]. fal Wan LoRA: $0.005/step [S].
  - Replicate: billed by H100 second ($0.001525/s ≈ $5.5/h) [F].
  - Runware: a LoRA Training tool exists, price not found [F].
  - Together: FLUX LoRA fine-tuning "not yet available" [S].
  - Third-party estimate: about $2 per LoRA run [S] — [tech-insider](https://tech-insider.org/train-custom-ai-image-lora-2026/).

### Inferences
**Recommended consistency workflow.** Dheevara identifies characters by costume, weapon and posture, not faces, which suits reference-based models well.

1. **Asset bible (one-off, human-curated).**
   - About 20–40 rights-cleared photos of stone reliefs under a raking warm light. These can be the team's own photography of Belur, Halebidu or Ellora, or commissioned work.
   - Train a **style LoRA** on fal (`is_style: true`, ~$2). The LoRA file is ours, and any LoRA-capable host can call it.
   - Write a short style prompt block ("carved basalt high relief, single oil-lamp raking light from frame-left, near-monochrome, chisel marks, medium-wide").
2. **Character sheets (per recurring figure, human-approved).**
   - For each figure (Abhimanyu: boy-warrior, chakra-ring armour, short sword and shield, broken wheel later; Droṇa: elder, bow, matted hair, brahmin thread; Hanumān: mace, tail, back or ¾ only), generate a 3-view turnaround plus a weapon/prop sheet.
   - Generate with Nano Banana Pro (style refs + object refs) or FLUX.2 pro + style LoRA.
   - Deity sheets are back, silhouette or symbol only, per Rule 1.
   - Store the sheets as canon assets with `claim:` ids for costume details.
3. **Per-shot keyframes (draft).**
   - Nano Banana Pro at $0.134, or FLUX.2 pro at $0.03 on Together, or FLUX-dev + LoRA on fal.
   - Inputs: the style refs (≤3), the relevant character sheets (≤5), and a set/location plate.
   - Generate a first frame and, for camera pushes, a last frame (same composition, tighter crop).
   - Edit fixes go through Qwen-Image-Edit-Plus or FLUX Kontext ($0.03–0.04).
4. **Image-to-video.**
   - Drafts use cheap image-to-video (MiniMax H3 Turbo $0.025/s or Veo 3.1 Lite $0.05/s, from the prior note) at 480–720p.
   - Finals use **Veo 3.1 Fast** with `image` + `lastFrame` (the interpolation suits slow pushes) or with 3 asset references, at 8 s, 9:16. Kling O3 with Elements is the fallback.
   - Interpolation and first/last frame are the strongest lever against style drift, because the model only has to move between two approved stone frames.
5. **Ledger.** Every keyframe and clip row is written before the call (Rule 3). The reference-asset ids are recorded per shot so consistency is auditable.

**Why not a single vendor.** Google alone (Nano Banana Pro → Veo 3.1) gives the cleanest data terms and native multi-reference, but no custom style LoRA. A fal LoRA gives style lock but adds fal's weaker terms. A pragmatic split:
- The style-LoRA training set (public-domain relief photos) is not sensitive, so it can live on fal.
- Script-derived prompts go only to Google paid-tier or Vertex endpoints.

### Gaps
- Official limits were not retrieved for BFL FLUX.2 references, Seedream 4.5 reference count, the Kling official API schema, the Runway API reference, or Recraft's style-creation endpoint.
- No hands-on test of how well any model holds "carved stone" texture through image-to-video. This needs a bake-off on 2–3 shots.
- Pricing for Veo reference-image mode versus plain image-to-video was not separately confirmed.

## 3. Content policies: Hindu deities, religious figures, battle violence

### Takeaway
No major API was found to have a rule banning depictions of Hindu deities. Google's Generative AI Prohibited Use Policy has no religion-specific clause and explicitly allows "educational, documentary, … artistic" exceptions. The practical risks are:
- **realistic violence and blood**, where Kling is reported to reject photoreal weapons fire or blood,
- **minor and person-generation settings** on Veo, and
- regional sensitivity, e.g., Nepal's directive against AI deity imagery.

Dheevara's style already mitigates both: stylised stone, restrained violence, faceless deities.

### Cited Findings
- **Google Generative AI Prohibited Use Policy** [F] — [policies.google.com](https://policies.google.com/terms/generative-ai/use-policy)
  - Prohibits "Hatred or hate speech" and "Violence or the incitement of violence".
  - Has no religious-figure clause.
  - "We may make exceptions … based on educational, documentary, scientific, or artistic considerations."
- **Veo person generation** [F] — [Veo docs](https://ai.google.dev/gemini-api/docs/veo): image-to-video and reference modes allow only `allow_adult`. The EU, UK, CH and MENA allow only `allow_adult`.
- **Kling (third-party account)** [S] — [Atlas Cloud Kling policy guide](https://www.atlascloud.ai/blog/guides/kling-ai-nsfw-policy)
  - "Action scenes involving realistic weapons fire, blood, or physical impact are commonly rejected. Stylized or clearly animated violence is treated differently."
  - The API returns a generic error.
  - Public and political figures are high-risk. Religion is not mentioned.
- **Nepal** [S] — [Onlinekhabar](https://english.onlinekhabar.com/doa-issues-notice-against-ai-generated-images-videos-of-deities.html): Nepal's Department of Archaeology issued a notice against AI-generated images and videos of deities that could offend religious sentiment. This is a government notice on publishers, not a model policy.
- **Hindu American Foundation** [S] — [HAF](https://www.hinduamerican.org/blog/can-i-use-ai-generated-images-for-my-daily-prayers): cautions that AI introduces distortions a traditional artist would not, relative to the dhyāna mantra. This is a community norm.
- **Adobe Firefly** [S] — [Adobe forum](https://community.adobe.com/t5/adobe-firefly-ideas/indian-god-pictures-are-not-drawn-well/idi-p/14025022): user complaints are about poor quality ("Indian god pictures are not drawn well"), not refusals.

### Inferences
- **Expect few hard refusals on deity prompts.** Expect occasional refusals on "arrows piercing", "blood" or "severed" language. Keep the planner's prompt vocabulary non-graphic (implied impact, dust, fallen chariot wheels) and log refusals as ledger rows. A moderation failure on BytePlus is not charged (prior note).
- **Avoid naming living public figures** and anything that reads as political, which is high-risk on Kling.
- **The bigger reputational risk is audience offence, not vendor refusal.** Rules 1 and 9 (scholar sign-off) carry it.

### Gaps
- Not retrieved: OpenAI (Sora 2 / GPT-Image) usage policy, Runway, ByteDance/BytePlus or MiniMax content policies on religion.
- No empirical refusal test was run. A 10-prompt red-team per vendor is recommended before committing.

## 4. Node-based creative canvases with APIs, as team tooling

### Takeaway
**Comfy Cloud** is the only canvas confirmed to turn a team-built node graph into a callable production API ("Cloud API", per-GPU-second, custom LoRA import on Creator $35/mo and up). It is the best bridge between artists' canvas work and the pipeline. Krea has a separate pay-as-you-go API but it is model access, not workflow execution. The others are mainly human canvases, with a public workflow API unconfirmed or "coming soon":
- Flora: API early-access or conflicting reports.
- Figma Weave: no public API, Enterprise "coming soon".
- Freepik Spaces: plain Freepik API exists; Spaces API unconfirmed.
- LTX Studio: Elements; an "API Console" exists.
- Higgsfield: nothing found.
- Runway Workflows: API not found.

None publishes a no-training clause except Runway Enterprise.

### Cited Findings
- **Comfy Cloud** [F] — [comfy.org/pricing](https://comfy.org/pricing.md): "Comfy API deploys workflows as production APIs". Plans, GPU rates and concurrency are as in Q1. Partner Nodes bring in Nano Banana Pro and others, with BYOK for Runway and Gemini. No data terms on the page.
- **Other hosted ComfyUI services** [S] — [Comfy Deploy](https://comfydeploy.com/pricing); [RunComfy billing](https://docs.runcomfy.com/serverless/about-billing); [InstaSD](https://instasd.com/pricing): Comfy Deploy H100 ≈ $0.002338/s, RunComfy serverless, InstaSD ≈ $0.0025/s top tier.
- **Krea API** [S] — [krea.ai/app/api/pricing](https://www.krea.ai/app/api/pricing): billed separately from plans. K2 Medium Turbo $0.015, K2 Medium $0.03, K2 Large $0.06 per image. Also routes to Seedance, Veo and Nano Banana.
- **Flora** [S] — [API Evangelist](https://apis.apievangelist.com/store/flora-api/); [stork](https://www.stork.ai/startups/flora-ai): reports conflict between a public REST API (v1.6.0: canvas runs, generations, uploads) and no public API. A competitor calls it early-access.
- **Figma Weave (ex-Weavy)** [S] — [Weave FAQ](https://help.weavy.ai/en/articles/12692387-figma-weave-faq); [Figma blog](https://www.figma.com/blog/connecting-figma-and-weave/); [Wireflow, a competitor](https://www.wireflow.ai/features/figma-weave-api): no public API. Enterprise API workflow execution is "coming soon".
- **Freepik** [S] — [Freepik API docs](https://cn.freepik.com/ai/docs/freepik-api); [hackceleration review](https://www.hackceleration.com/freepik-spaces-review)
  - Freepik API is pay-per-use with €5 free.
  - Spaces is credit plans from €5/mo (Essential) to €143.75/mo (Pro), billed annually.
  - No Spaces workflow API was confirmed, and no training terms were found.
- **LTX Studio** [S] — [LTX help: Elements](https://help.ltx.io/hc/en-us/categories/35331831779602-Elements-Brand-Kit); [LTX blog](https://ltx.studio/blog/how-to-create-a-consistent-character)
  - Elements store characters, objects and locations, invoked as @name. Names are fixed after creation.
  - The help centre lists an "API Console". Whether Elements are API-exposed is unconfirmed.
- **Runway terms** [S] — [Runway Enterprise Terms](https://runwayml.com/enterprise-terms); [Vorp Labs](https://vorplabs.com/models/media-rights); [conductatlas](https://conductatlas.com/platform/runway/runway-terms-of-service/ai-training-license-over-inputs-and-outputs/)
  - Standard terms reportedly license inputs and outputs for model training, with no self-serve opt-out.
  - Enterprise terms incorporate a DPA and prohibit training on Customer Content, reportedly including third-party models routed through Runway.
  - The API marketing claims "no training", which conflicts with the standard ToS.
- **Gulab** (Indian canvas, MCP server): see the prior note.

### Inferences
- **Team tooling pick.**
  - **Comfy Cloud (Creator or Pro)** for look-dev and to host the style-LoRA graph as an API that `src/render` can call. Ask Comfy for a written no-training statement first.
  - **Krea or Flora** only for unpaid exploration with non-sensitive prompts.
- **Runway API on standard terms fails the no-training rule.** Use it only under an Enterprise order, or keep script-derived text out of it.
- **Prefer pipelines in our repo.** Rules "Planning … committed as files" and "no local stand-ins" favour code over canvases. Canvases should produce assets (character sheets, LoRA, reference plates) that are committed into `content/` or the asset bible, not be part of the runtime path.

### Gaps
- Not retrieved: Higgsfield API, the Runway Workflows API, Invoke (hosted / API), Krea node workflows via API, and the official Flora API docs.
- No privacy or training terms were fetched for Comfy, Krea, Flora, Freepik or LTX.
