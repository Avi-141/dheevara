# Paid / Hosted Offerings for Dheevara's Media Pipeline (incl. verdict on gulab.ai) — as of 2026-10-15

Provenance key: **[F]** = page fetched directly today (2026-10-15); **[S]** = secondary/aggregator source surfaced via search (verify before budgeting); **[B]** = derived from inspecting gulab.ai's public JavaScript bundle today (`/assets/index-B90G2OUT.js`, ~2.9 MB). FX assumption for INR conversions: **₹88 / US$** and **~7.1 CNY / US$**. These rates are assumptions, not sourced quotes.

---

## 1. gulab.ai: what it is, how it fits, what to ask

### Takeaway
Gulab is a **Bengaluru-incubated (Upsurge Labs) node-based "AI creative canvas" that resells and wraps other vendors' models**. It routes to fal.ai, ByteDance/BytePlus, Alibaba, MiniMax, xAI, Google and OpenAI, and adds Sarvam Bulbul for Indic TTS. It has no model of its own, no Indic or mythology specialisation, and no published terms that its pages render without JavaScript. It does have a credit-metered **MCP server** (`mcp.gulab.ai/mcp`) that an agent could drive. Verdict: it is **not a replacement for fal**. It adds a markup layer and another data processor on top of fal and ByteDance. At most it is useful as a **human storyboarding and exploration canvas** for the founder or artists, and only if it answers the data-use questions below in writing.

### Cited Findings
- **Product.** "Node-based AI creative studio. Connect image, video, and text AI models on an infinite canvas. Imagen 4, Veo 3.1, FLUX, Sora 2, and more." The site lists these features: "Elements" (save a character image and reuse it across scenes, i.e. character consistency), collaboration with notes and versions, the "Bloom" creator program, and MCP. Its one India-flavoured example is "A walk through Hampi, one moment at a time." The page names no company, founders, pricing or customers. — [gulab.ai home, F](https://gulab.ai/)
- **Parent and incubator.** Upsurge Labs' site lists its incubated projects as "Lauki, Zelta, Gulab, Naksha, Helium, Openbio, Banana, Bhindi, Moltx, and Anannas". The site does not name founders, location or funding. — [upsurge.io, F](https://upsurge.io/)
- **Contact email.** The "banned account" screen in the app bundle says to contact **hi@lauki.ai**, which points to a shared team or entity with sibling project Lauki. — [gulab.ai JS bundle, B](https://gulab.ai/)
- **Founder.** Secondary sources describe Upsurge Labs (Bengaluru) as founded by **Sowmay Jain**, co-founder of the DeFi protocol Instadapp, to incubate AI, robotics and biotech projects. Its sibling project Bhindi AI reportedly raised a **$4M pre-seed led by Cyber Fund**. A Tracxn profile titled "Upsurge Labs" describes a different, defunct Gurugram company, so the two are not the same entity. — [startupintros, S](https://startupintros.com/orgs/bhindi-ai); [aiodyssey, S](https://aiodyssey.io/p/this-founder-s-no-code-solution-secured-4m-funding-4-months-in); [Tracxn (different entity), S](https://tracxn.com/d/companies/upsurge-labs/__Ma7P99lTAbFSMg5YKLQ2eBQsE4MFdLH3gF2Rpu25Ink)
- **Social and market reception.** The X handle is @trygulab. An Indian influencer account posted that it was "Great to see Indian founders building AI products… This AI filmmaking tool…". Search summaries mention "Gulab v3" (one prompt producing images, video, voice and music on one canvas) and an Oct-9 post ranking models by blind human votes. — [x.com/trygulab, S](https://x.com/trygulab); [MeghUpdates on X, S](https://x.com/MeghUpdates/status/2072323543908679862)
- **Models are wrapped, not owned.** The model IDs in the bundle are other vendors' endpoints:
  - fal: `fal-ai/kling-video/o3/...`, `fal-ai/kling-video/v3/pro/...`, `fal-ai/veo3.1`, `fal-ai/veo3.1/fast`, `fal-ai/pixverse/v6`, `fal-ai/flux/schnell`
  - Others: `bytedance/seedance-2.5|2.0|2.0/fast|2.0/mini`, `minimax/h3`, `h3-max`, `h3-max-turbo`, `alibaba/wan-3.0`, `wan-3.0-prime`, `alibaba/happy-horse/v1.1`, `xai/grok-imagine-video`, `google/gemini-omni-flash`, `openai/gpt-image-2`, Sora 2 / Sora 2 Pro
  - TTS: `sarvam/bulbul-v3` ("Sarvam • Indian languages") and Gemini 3.8 Flash TTS
  - The language list includes hi/bn/ta/te/kn/ml/mr/gu/pa/od/en-IN.
  - Media-URL allowlists reference `fal.media`, `fal.run`, `imgen.x.ai`, `vidgen.x.ai`, `.volces.com` and `bytepluses.com` (ByteDance's BytePlus/Volcano storage).
  - So user prompts and reference images flow to Gulab, then to fal and/or ByteDance and others. — [gulab.ai JS bundle, B](https://gulab.ai/)
- **Billing.** Billing is credit-metered. Each job carries `_credit_cost` and `_credit_model`. The app reconciles and auto-refunds orphaned charges. One message reads "Out of bloom… Add credits to continue." There is an extra safety check when an uploaded image contains a real person. — [gulab.ai JS bundle, B](https://gulab.ai/)
- **API / MCP.**
  - Hosted MCP server at `https://mcp.gulab.ai/mcp`, stateless HTTP, Bearer keys prefixed `gsk_`, up to 5 active keys per account.
  - Generate tools: `list_models`, `generate_image` (sync), `generate_video` (async), `get_job_status`, `fetch_result`.
  - Project and asset tools: `create_project`, `upload_asset`, `list_elements`, `get_element`, etc.
  - Other tools: `analyze_image`, `transcribe_audio`, `check_balance`, `get_usage`.
  - Tool calls "spend your credits". Prices are not listed. — [gulab.ai/mcp, F](https://gulab.ai/mcp)
- **Pricing page.** The page is a client-rendered SPA ("Loading…"). Neither WebFetch nor curl got any plan prices. — [gulab.ai/pricing, F](https://gulab.ai/pricing)
- **Sister product, Gulab Music.** music.gulab.ai sells fixed-price music videos:
  - 1:00 for **$29**, 2:00 for **$49** (or **₹3,999** via UPI), 3:00 for **$69**.
  - Checkout uses Stripe (card) or Razorpay (UPI). Failed videos are refunded in full. Generation takes about 20–40 minutes.
  - This confirms an Indian entity with Razorpay merchant setup. — [music.gulab.ai, F](https://music.gulab.ai/)
- **Terms and privacy pages.** /terms and /privacy also render client-side, and no terms text could be retrieved. The bundle has no "we do not train", output-ownership, data-residency or governing-law strings. — [gulab.ai/terms, F](https://gulab.ai/terms); [gulab.ai/privacy, F](https://gulab.ai/privacy)

### Inferences
- **Cost.** Gulab sits *on top of* fal (plus direct BytePlus, xAI, Alibaba and MiniMax access), so per-second cost through Gulab is at best equal to fal or BytePlus and almost certainly higher because of the credit markup. For a pipeline whose hard rules include a cost ledger and per-run budget cap, a direct fal or BytePlus key gives cleaner per-call cost attribution. Gulab's `get_usage` and `check_balance` exist but are coarser.
- **Data rules.** Gulab adds a processor to the data path: Gulab, then fal, then the model owner (Kuaishou, ByteDance, MiniMax, etc.). With no fetchable terms, it currently **fails Dheevara's "no training on unreleased texts / need zero-retention terms" rule by default**, until written terms say otherwise. India hosting is unknown. The front end is a plain SPA, and the backend region is unknown.
- **Where it could fit.** Gulab could complement fal as an interactive storyboard and look-dev canvas. Its "Elements" reusable-character feature and side-by-side model comparison would help explore the "stone relief, single oil lamp" look before codifying prompts. The MCP server could also let an agent prototype across many models with one key. It is not a production backbone. It is a pre-revenue-style incubator project with no named customers, no SLA and no published DPA.
- **Lock-in.** Lock-in is low because the underlying models are the same ones reachable on fal or BytePlus. Workflow lock-in, meaning canvases and Elements stored in Gulab, is the main risk. Open-weight equivalents: ComfyUI and similar node canvases.
- **Questions to ask Gulab.**
  1. Legal entity, registered address, governing law.
  2. Do you, or any downstream provider you route to (fal, BytePlus, MiniMax, Kuaishou, xAI, Alibaba), train on or retain prompts, reference images and outputs? Will you sign a DPA with a no-training and zero- or short-retention clause and name all sub-processors?
  3. Where are assets stored (country/cloud)? Can storage be India-only?
  4. Output ownership and commercial-use licence, including pass-through of each model's licence.
  5. Credit-to-USD rate and per-model markup versus fal list price, and is there a volume or BYO-key mode (bring our own fal key)?
  6. A REST API besides MCP, with per-job cost in the response for our ledger, plus a hard spend cap.
  7. Content policy for religious figures.
  8. SLA and uptime.
  9. Any Indic or mythology fine-tunes, LoRAs or style packs, or is it pure routing?

### Gaps
- No pricing, credit value, terms, privacy policy, founders' names for Gulab specifically, funding, customer list or Product Hunt listing could be retrieved. The pages are JS-rendered, and LinkedIn and Product Hunt were not reached. Gulab-to-Sowmay Jain is inferred only via the Upsurge Labs incubator listing.
- Fetching the X influencer post returned 402. Its date and content beyond the search snippet are unverified.

---

## 2. Hosted video-generation APIs: prices and terms

### Takeaway
The cheapest credible hosted per-second rates as of Oct 2026, from cheapest up:

| Route | $/s | Basis |
|---|---|---|
| MiniMax H3 Max Turbo on fal | $0.025 | [F] |
| Veo 3.1 Lite on Gemini API (720p) | $0.05 | [F] |
| MiniMax H3 Max on fal | $0.05 | [F] |
| Runway Gen-4 Turbo | $0.05 | [F] |
| Kling 2.5 Turbo Pro on fal | $0.07 | [F] |
| Veo 3.1 Fast / Sora 2 (720p) | $0.10 | [F] / [S] |
| Wan 3.0 720p, Model Studio Singapore | ≈$0.105 | [F] |
| Gen-4.5 | $0.12 | [F] |
| Kling v3 Pro on fal | $0.14 | [F] |
| Veo 3.1 standard | $0.40 | [F] |

Only Google's Gemini API (paid tier) states in its pricing page that data is **not** used to improve products. fal's terms allow use of anonymized or aggregated "Usage Data" for its own AI models.

### Cited Findings
- **Google Veo (Gemini API, paid tier)** — [ai.google.dev pricing, F](https://ai.google.dev/gemini-api/docs/pricing)
  - Per-second prices, with audio:

    | Model | 720p | 1080p | 4K |
    |---|---|---|---|
    | Veo 3.1 Standard | $0.40 | $0.40 | $0.60 |
    | Veo 3.1 Fast | $0.10 | $0.12 | $0.30 |
    | Veo 3.1 Lite | $0.05 | $0.08 | n/a |

  - Gemini Omni Flash (a video gen and edit model) costs about $0.10/s at 720p (token-priced).
  - "Used to improve our products": **No on paid tier** for Veo, Nano Banana and Gemini TTS. Yes on the free tier.
  - Images per image: Nano Banana 2.1 is $0.0336 (1K) and $0.0504 (2K). Nano Banana Pro is $0.134.
- **fal.ai** — [fal.ai/pricing, F](https://fal.ai/pricing)
  - Per-second video prices on the visible list:

    | Model | $/s |
    |---|---|
    | MiniMax H3 Max (image-to-video, text-to-video, reference-to-video) | $0.05 |
    | H3 Max Turbo | $0.025 |
    | Kling 2.5 Turbo Pro image-to-video | $0.07 |
    | Kling v3 Pro (image-to-video, text-to-video) | $0.14 |
    | Seedance 2 (image-to-video, reference-to-video) | $0.014 per 1K tokens |

  - "Settings such as resolution, duration, and quality may affect the final cost."
  - GPUs: H100 from $2.49/h (list $4.50), H200 from $2.99/h, B200 from $5.49/h, RTX PRO 6000 from $1.99/h.
- **fal terms** — [fal.ai/terms, F](https://fal.ai/terms)
  - §6(a) grants fal a licence to "reproduce, use, … create derivative works from, and otherwise process any Customer Input **to provide the Services**."
  - §6(c) says anonymized or aggregated "Usage Data" may be used "to design, develop, and offer Company products, services, and **AI models**". **Flag: aggregated or anonymized data may feed fal's models.**
  - No fixed retention period is stated. §7(e) allows retention under "standard backup, archival, or record-retention practices".
  - §14 says models may be "hosted by third parties" under additional terms.
  - Governing law is California, venue San Francisco.
  - Output ownership is not explicitly assigned. fal disclaims IP in outputs.
- **Runway API** (credits are $0.01 each) — [Runway API pricing docs, F](https://docs.dev.runwayml.com/guides/pricing/)

  | Model | Credits/s | ≈ $/s |
  |---|---|---|
  | Gen-4 Turbo | 5 | $0.05 |
  | Gen-4.5 | 12 | $0.12 |
  | Aleph 2.0 (56-credit minimum per generation) | 28 | $0.28 |
  | Veo 3.1 via Runway, audio / no audio | 40 / 20 | $0.40 / $0.20 |
  | Veo 3.1 Fast via Runway, audio / no audio | 15 / 10 | $0.15 / $0.10 |

  Gen-5 is not on the page.
- **OpenAI Sora 2 API.** The official page returned 403. Secondary sources give Sora 2 at **$0.10/s at 720p** (4/8/12-s clips) and Sora 2 Pro at $0.30/s (720p), $0.50/s (1024p) and $0.70/s (1080p). Batch is reportedly about half price. One source notes the model "has an expiration date". — [benchlm, S](https://benchlm.ai/media-pricing/sora); [magichour, S](https://magichour.ai/blog/sora-2-pricing)
- **ByteDance Seedance (BytePlus ModelArk).**
  - The price is a token unit price × tokens, where tokens = duration × width × height × fps / 1024. Only successful generations are charged, and moderation failures are not.
  - Minimum token floors apply when the input includes video. — [BytePlus docs via search, S](https://docs.byteplus.com/docs/ModelArk/1544106)
  - Third-party rates: Seedance 2.0 Pro is $3.00/M tokens and Fast is $1.50/M. — [Segmind, S](https://blog.segmind.com/seedance-2-vs-seedance-2-fast-how-video-token-pricing-actually-works)
  - Estimates for 5 s with no input: about $0.35 (480p), $0.76 (720p) and $1.87 (1080p), i.e. about **$0.15/s at 720p**. — [YingTu, S](https://yingtu.ai/en/blog/seedance-2-pricing-free-vs-paid-guide)
  - Seedance 2.5 (30 s + audio) exists per Gulab's model list. — [B](https://gulab.ai/)
- **Alibaba Wan 3.0 (Model Studio).** Per-second prices: Singapore (International) is 0.37471 / 0.74942 / 1.49884 CNY at 480p / 720p / 1080p, roughly $0.05 / $0.105 / $0.21. Beijing, Tokyo, Frankfurt and Virginia are listed at 0.3 / 0.6 / 1.2 CNY. Access is reportedly gated by application. — [Alibaba Cloud Model Studio docs, S via search snippet](https://help.aliyun.com/en/model-studio/wan3-0-video); [aiunderstanding.org, S](https://aiunderstanding.org/news/alibaba-makes-wan3-0-video-generator-generally-available-with-30-second-outputs)
- **Kling direct API.** No official page was retrieved. An aggregator says units cost $0.14 each, sold in packs of 5,000 units for $700 that expire in 180 days. That works out to about $0.084/s for Kling 3.0 at 720p with no audio, with audio adding about 50%. CostBench gives a $0.08–0.42/s range. — [flexprice, S](https://flexprice.io/pricing-index/kling-ai); [CostBench, S](https://costbench.com/software/ai-media-apis/kling-api/)
- **Moonvalley Marey** (a model trained on licensed data). Only consumer credit plans were found: 10 credits per generation, at $14.99 for 100, $34.99 for 250 and $149.99 for 1,000 credits, i.e. about $1.50 per generation on Standard. No per-second API price was found. — [Moonvalley help center, S](https://help.moonvalley.com/en/articles/11787654-what-are-the-costs-and-subscription-options-for-using-marey-to-generate-videos)
- **Open-weight equivalents.** Wan (Alibaba) is open-weight and self-hostable. Kling, Veo, Sora, Runway, MiniMax H3 and Seedance are closed. LTX-Video is open (not priced here). This comes from general knowledge; see the companion note video_generation_models.md.

### Inferences
- **9:16, image-to-video and first/last frame.** Gulab's bundle exposes image-to-video endpoints for Kling, Veo 3.1, Seedance, Hailuo and Wan via fal or the vendors, which confirms image-to-video availability across them. Support for 9:16 and first/last frame was not verified per vendor this session.
- **Most data-safe hosted option.** Gemini API paid tier, with an explicit "not used to improve products". Next would be Runway or OpenAI enterprise terms, not verified here. ByteDance, Kuaishou and MiniMax via fal add Chinese model-owner sub-processors whose training terms are unverified, so they are the riskiest for unreleased texts.
- **Prompt-only exposure.** Prompts for shots are derived text, not the full unreleased chapter. One mitigation is sending only the visual prompt plus keyframe and never narration text. This reduces exposure but does not satisfy "zero-retention" formally.

### Gaps
- Not fetched: Luma Ray 3, Pika, Higgsfield, LTX Studio API, Replicate per-model pricing, or Runway Gen-5.
- Not verified: per-vendor 9:16 and first/last-frame support, India availability, and religious-figure content policies. No vendor content policy on deities was retrieved.
- OpenAI and Kling official pricing pages were not retrieved (403 or not found).
- fal's DPA and enterprise zero-retention option were not found.

---

## 3. Indian AI media/content startups and platforms

### Takeaway
The most relevant Indian precedent is **Galleri5 + Collective Artists Network**. They produced JioHotstar/Star Plus's AI "Mahabharat: Ek Dharmayudh" with a crew of about 130–140 people, and are making "Chiranjeevi Hanuman" with Star Studio18. Galleri5 now pitches an "AI cinema OS". It is a **production-services and partnership** play, not a self-serve API. Sarvam is the only Indian vendor with a verified self-serve media API (TTS/STT/translation). Gulab is the only Indian self-serve video canvas found.

### Cited Findings
- **Galleri5 platform.** Collective Artists Network and Galleri5 unveiled a "cinema native OS" at the India AI Impact Summit: an end-to-end orchestration layer covering generative systems, character architecture, shot pipelines, VFX, lip-sync and delivery. — [adgully, S](https://www.adgully.com/post/12486/collective-artists-network-and-galleri5-unveil-cinema-native-os-at-india-ai-impact-summit); [indiantelevision, S](https://indiantelevision.com/mam/galleri5-launches-indias-first-ai-cinema-os-at-india-ai-summit/)
- **Galleri5 productions.** Galleri5 powers *Mahabharat: Ek Dharmayudh*, produced under Collective's "Historyverse" banner and airing on Star Plus and JioHotstar. It also powers *Chiranjeevi Hanuman*, a theatrical feature with Star Studio18, and a slate of Hanuman, Krishna, Shiva and Shivaji. — [mediabrief, S](https://mediabrief.com/galleri5-showcases-ai-filmmaking-capabilities/); [indiantelevision, S](https://indiantelevision.com/movies/galleri5-takes-ai-filmmaking-from-television-to-the-big-screen/)
- **Crew size.** Vijay Subramaniam (Collective) put the Mahabharat team at about 130–140 people and said "It's Engineering, Not Mindless Prompting". — [Hollywood Reporter India, S](https://www.hollywoodreporterindia.com/features/interviews/vijay-subramaniam-on-ai-mahabharata-anurag-kashyaps-critique-and-future-of-mid-tier-films-they-will-go-into-oblivion)
- **JioStar plans.** JioStar reportedly plans to hire 80 AI engineers and an AI series slate after Mahabharat's debut. View figures conflict across reports (6.5M versus 26.5M+). — [niftytrader, S](https://www.niftytrader.in/markets/jiostar-ai-series-slate-mahabharat-ai-hires/)
- **Sarvam.** Sarvam's public price list covers Bulbul TTS, STT, translate, transliterate and LLMs, with a Bengaluru address and ISO / SOC 2 Type II badges. The pricing page makes no statement on retention, training or hosting location. — [sarvam.ai/api-pricing, F](https://www.sarvam.ai/api-pricing)

### Inferences
- Galleri5/Collective is a potential **co-production or benchmark** rather than a vendor. They are building a competing mythology IP slate (Krishna, Shiva, Hanuman), so sharing unreleased critical-edition scripts with them carries competitive as well as data risk.
- A buyable "API" for Indic mythological video does not appear to exist. Dheevara's differentiator (critical-edition citations, aniconic deities, stone-relief style) is not something these players sell.

### Gaps
- Not researched this session: Krutrim, Gan.ai, Invideo AI, Pocket FM / Pocket Toons, Kuku FM, Intelliflicks (Abundantia), Smallest.ai, Gnani, Murf, Dubverse. API availability and prices are unverified.
- From prior knowledge, unverified today: Rephrase.ai was acquired by Adobe (2023), and Invideo AI is a consumer and prosumer SaaS rather than a generation API.

---

## 4. Paid TTS / voice with Indic support and data terms

### Takeaway
Two cheap, high-quality options cover the 8+ Indian languages: **Sarvam Bulbul v3 at ₹30/10K chars** (₹27 on Growth) and **Bulbul V4 Flash at ₹20/10K**, which is India-based, and **Gemini 3.8 Flash TTS at about $0.00225 per 10 s of audio**, with paid tier not used for training. ElevenLabs is **$0.08/1K chars** for v3 and Multilingual v2, roughly 2.4× Sarvam. Its zero-retention mode is advertised only for a medical STT product on the pricing page.

### Cited Findings
- **Sarvam (INR per 10K characters, Pay-as-you-go / Pro / Growth / Business).** Data and hosting terms are not stated on the pricing page. — [Sarvam pricing, F](https://www.sarvam.ai/api-pricing)

  | Product | PAYG | Pro | Growth | Business |
  |---|---|---|---|---|
  | Bulbul V3 | ₹30 | ₹28.5 | ₹27 | ₹27 |
  | Bulbul V4 Flash | ₹20 | ₹18.5 | ₹17 | ₹17 |
  | Voice cloning | ₹20 | ₹20 | ₹20 | ₹20 |
  | Translate | ₹20 | ₹17 | ₹15 | ₹15 |

  - STT is ₹0.49/min on PAYG.
  - LLM: Sarvam 105B is ₹15 input and ₹60 output per 1M tokens.
- **ElevenLabs API.** — [ElevenLabs API pricing, F](https://elevenlabs.io/pricing/api)
  - TTS: v3 and Multilingual v2 are $0.08/1K chars. Flash and Turbo are $0.04/1K.
  - Dubbing v1 is $0.33/min with watermark or $0.50/min without. Dubbing v2 is $2.20/min.
  - Plans: Starter $6, Creator $22, Pro $99, Scale $299 and Business $990 per month.
  - Zero Retention Mode is shown only for Scribe v2 Medical (HIPAA).
  - No India data residency is mentioned.
- **Google Gemini TTS (paid).** Per 1M tokens:

  | Model | Text input | Audio output |
  |---|---|---|
  | 3.8 Flash TTS | $0.50 (to Dec 31 2026, then $1.00) | $9.00 (≈$0.00225 per 10 s), then $18 |
  | 3.8 Flash-Lite TTS | $0.50 | $6.00 |

  Paid tier is "not used to improve our products". — [Gemini API pricing, F](https://ai.google.dev/gemini-api/docs/pricing)
- **Gulab re-sells TTS.** It offers `sarvam/bulbul-v3` and Gemini 3.8 Flash TTS with Indic voices (shubh, aditya, ritu, priya…), which are Sarvam's voice names. — [gulab.ai bundle, B](https://gulab.ai/)

### Inferences
- **Keep Sarvam direct.** It is already integrated and Indian. Ask Sarvam for a written no-training / retention statement and confirmation of India hosting (Trust Center not fetched).
- **Use Gemini Flash TTS as a fallback or second voice** where its Indic quality is acceptable.
- **Open-weight equivalents** (see indic_audio_language.md): AI4Bharat IndicF5 / Indic Parler-TTS. Lock-in for TTS is low because voices can be swapped per chapter.

### Gaps
- Not fetched: Azure neural Indic voices, AWS Polly Indic, Google Cloud Chirp 3 HD pricing, Murf, Smallest.ai. Consent rules for cloning per vendor were not verified.

---

## 5. Paid GPU / serverless inference for open models

### Takeaway
H100 hourly rates are roughly:

| Provider | H100 rate | Basis |
|---|---|---|
| fal compute | $2.49–4.50/h | [F] |
| RunPod pods | from $1.99/h | [S]; serverless about $2.7–4.6/h-equivalent |
| Modal | ≈$3.95/h ($0.001097/s) | [S] |
| E2E Networks (India) | ~₹350–400/h on-demand | [S], conflicting |
| IndiaAI subsidised | ~₹92/h, eligible users | [S] |

India-resident compute via E2E or IndiaAI satisfies the residency preference.

### Cited Findings
- **fal GPU list prices.** H100 is $4.50/h list, "as low as" $2.49. H200 is $6.00 / $2.99. B200 is $7.99 / $5.49. — [fal pricing, F](https://fal.ai/pricing)
- **RunPod.** H100 80GB from $1.99/h on-demand with per-second billing (updated July 2026). The serverless H100 Flex equivalent is about $4.55/h, or about $2.15–2.69/h in other reports. — [runpod.io, S](https://www.runpod.io/gpu-cloud/pricing); [costbench, S](https://costbench.com/compare/modal-vs-runpod/)
- **Modal.** H100 is $0.001097/s, about $3.95/h. Spheron argues that is a floor. — [Spheron, S](https://www.spheron.network/blog/modal-gpu-pricing-2026-per-second-billing/)
- **E2E Networks.** Its pricing page lists "H200/H100 from ₹49/hr" (an entry figure, excluding 18% GST). Third parties cite H100 at ₹350–400/h or ₹362/h. — [e2enetworks.com/pricing, S](https://www.e2enetworks.com/pricing.md); [dev.to, S](https://dev.to/mr_manushukla/gpu-cloud-pricing-in-india-2026-h100-h200-and-b200-rates-compared-bo7)
- **Other India rates.** JarvisLabs H100 is about ₹217/h. Cyfuture is about ₹329/h. The IndiaAI subsidised rate is about ₹92/h for eligible users. — [HF blog, S](https://huggingface.co/blog/daya-shankar/nvidia-h100-price-india); [Spheron India, S](https://www.spheron.network/blog/gpu-cloud-india-2026/)

### Inferences
- **For self-hosting Wan / LTX finals in India:** first E2E TIR or IndiaAI-portal compute (residency plus subsidy), then RunPod or Modal for burst.

### Gaps
- Not fetched: Baseten, Together, Fireworks or Yotta prices, or IndiaAI portal eligibility details.

---

## 6. Cost for one 2-minute chapter (13 shots, ~114 s video, narration in 2 languages)

### Takeaway
The cheapest "acceptable quality" routes are **fal MiniMax H3 Max Turbo, H3 Max, or Veo 3.1 Lite**. On finals only, video costs **~$2.85–9.10 (₹250–800)**. With a realistic draft-first workflow (≈3 generations per shot) that rises to **~₹800–1,550**. Premium routes (Kling v3 Pro, Veo 3.1 Fast 1080p, Gen-4.5) cost **₹1,200–1,400 finals-only, or ₹3,600–4,200 with drafts**. Self-hosted open (₹300–600/chapter, per sibling research) is competitive with the cheapest hosted routes and wins once drafts are counted, unless drafts use a cheap tier such as H3 Turbo or Veo Lite and only finals use premium.

### Cited Findings
Unit prices come from Sections 2 and 4:
- **Video:** fal [F](https://fal.ai/pricing), Gemini [F](https://ai.google.dev/gemini-api/docs/pricing), Runway [F](https://docs.dev.runwayml.com/guides/pricing/), Sora [S](https://benchlm.ai/media-pricing/sora).
- **TTS:** Sarvam [F](https://www.sarvam.ai/api-pricing), ElevenLabs [F](https://elevenlabs.io/pricing/api).

### Inferences
Arithmetic assumptions:
- 114 s of final video and 13 keyframe images.
- About 2,000 characters of narration per language, so 4,000 characters total. This is an assumption: roughly 300 words × 2 minutes per language.
- Drafts mean 3 generations per shot.
- ₹88/$.

| Route (finals) | Video ($/s × 114) | Keyframes (13) | Narration (2 langs) | Total finals-only | With 3× draft attempts on video |
|---|---|---|---|---|---|
| A. fal MiniMax H3 Max Turbo ($0.025/s) | $2.85 (₹251) | Nano Banana 2.1 1K, 13×$0.034 ≈ $0.44 (₹39) | Sarvam Bulbul v3 ₹12 | **≈ ₹300** | ≈ ₹800 |
| B. fal MiniMax H3 Max ($0.05/s), same price as Runway Gen-4 Turbo and Veo 3.1 Lite 720p | $5.70 (₹502) | ₹39 | ₹12 | **≈ ₹550** | ≈ ₹1,550 |
| C. Veo 3.1 Fast 1080p via Gemini API ($0.12/s), no-training paid tier | $13.68 (₹1,204) | ₹39 | Gemini Flash TTS ≈ ₹5, or Sarvam ₹12 | **≈ ₹1,250** | ≈ ₹3,700 (or ≈ ₹2,250 if the 2 extra draft passes run on Veo Lite 720p at $0.05/s = ₹1,003) |
| D. fal Kling v3 Pro ($0.14/s) | $15.96 (₹1,404) | ₹39 | ElevenLabs v3 4K chars × $0.08 = $0.32 (₹28) | **≈ ₹1,470** | ≈ ₹4,280 |
| (Ref) Veo 3.1 Standard ($0.40/s) | $45.60 (₹4,013) | ₹39 | ₹12 | ≈ ₹4,060 | ≈ ₹12,100 |
| (Ref) Self-hosted open (Wan/LTX on rented GPU), per sibling note | — | — | — | ₹300–600 | (drafts included in that estimate per sibling research) |

- **Gulab route.** It equals the underlying fal or BytePlus price plus an unknown credit markup. Gulab Music's consumer price of $49 / ₹3,999 for a 2-minute music video gives an upper-bound sense of consumer-packaged pricing, roughly 3–8× the raw API cost in route B or C.
- **Narration is negligible.** It is ₹5–30 per chapter on any vendor. Video drives about 95% of cost.
- **Recommended hybrid.** Draft on H3 Max Turbo (≈₹251 per 114-s pass) and do finals on a premium model (₹1,204–1,404) only for approved shots. That gives ≈ ₹1,500–1,700 per chapter with 1 draft pass, or ≈ ₹2,000–2,200 with 3 draft passes. Drafting and finalising both on H3 Max (route B) stays ≈ ₹550–1,550. Alternatively, draft self-hosted and finalise hosted.

### Gaps
- Real draft-to-final ratios are unknown. 3× is an assumption.
- Not verified: Seedance per-chapter cost (~$0.15/s at 720p [S] would give ≈ ₹1,500 finals-only), Indic character counts per language, and live FX rates.
