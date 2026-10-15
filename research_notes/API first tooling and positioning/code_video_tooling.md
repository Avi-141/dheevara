# Code-generated video and pipeline-assembly tooling, API-first (state as of 15 Oct 2026)

Scope: this extends `docs/research/notes-2026-10-15-open-source/code_generated_video.md`. That file already covers the open-source licences (Remotion's source-available licence, Motion Canvas and Revideo under MIT, Blender GPL), headless behaviour, the literature on LLM-to-code video (Code2Video, SceneCraft, LL3M), open-weight LLMs and the Blender-DSL architecture. Those points are not repeated here. This file covers hosted and API offerings, pricing, and which tool to pick at each pipeline stage (the build-brief milestones are M2 draft render, M3 QC gate and M4 assemble).

Method note: there were about 20 search and fetch calls. Pricing pages were fetched directly where possible (Shotstack, Creatomate, remotion.pro, Modal). Several figures come from search-result summaries of vendor pages and are marked as such. All prices are USD, list price, as seen on 2026-10-15.

---

## 1. Remotion (licence, cloud rendering, LLM tooling); Revideo and Motion Canvas hosted options

### Takeaway
Dheevara at 3 people or fewer is on Remotion's **free licence**. The 4th hire triggers a Company License: **$25/month per seat** ("Creators"), or **$0.01 per render with a $100/month minimum** ("Automators", which is the tier for server-side rendering in a pipeline). Remotion Lambda compute costs roughly **$0.01–0.10 per rendered minute**, but Lambda has no GPU. Remotion's official agent skills for Claude Code and Codex are the most mature "LLM writes video code" tooling. Revideo (MIT) now has a hosted render endpoint from Midrender.

### Cited Findings
- **Who is free.** remotion.pro says the free licence covers "individuals and companies of up to 3 people", and that companies of "4+ people" need a Company License — [remotion.pro/license](https://www.remotion.pro/license). The repo LICENSE.md wording is "a for-profit organization with up to 3 employees" (see the earlier open-source notes). The two pages count differently, "people" versus "employees", which matters if founders or contractors are counted.
- **Company License prices.**
  - "Remotion for Creators: Create videos for yourself – $25/mo per seat."
  - "Remotion for Automators: Build video creation tools – $0.01 per render, $100/mo minimum", which includes 10,000 renders.
  - Enterprise is "Starting at $500 per month".
  - Source: [remotion.pro/license](https://www.remotion.pro/license).
- **Remotion 5.** The pricing page does not mention any Remotion 5 licence change — [remotion.pro/license](https://www.remotion.pro/license). The LICENSE file says the licence will "slightly change" in 5.0 (earlier notes).
- **Lambda cost.**
  - Remotion's cost-example page lists a 1-minute render at about $0.021 and a 10-minute 720p render at about $0.162 (2048 MB, warm, us-east-1).
  - An older 4.0.381 example gave about $0.10 per minute.
  - The marketing page claims about $0.01 per minute, excluding S3 and data transfer.
  - `estimatePrice()` in `@remotion/lambda` estimates the cost of each render.
  - Sources: [Remotion cost example](https://remotion.dev/docs/lambda/cost-example), [estimatePrice](https://remotion.dev/docs/lambda/estimateprice). These figures come from search-result summaries of the docs.
- **No GPU on Lambda.** "AWS Lambda instances have no GPU", so WebGL, blur and shadow content renders slowly or badly there — [Remotion GPU docs](https://www.remotion.dev/docs/gpu) (from the earlier notes, still relevant). Remotion also documents Cloud Run as an alternative — [cloudrun.remotion.dev](https://cloudrun.remotion.dev/lambda).
- **Remotion and LLMs.**
  - Remotion ships official "Agent Skills". The setup is to scaffold a project, install the skills, run the preview and launch Claude Code in that folder — [Tella guide](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code.md).
  - The launch was in early January 2026 — [StartupHub](https://www.startuphub.ai/ai-news/general/2026/remotion-ai-video-makes-production-code-from-plain-prompts).
  - An August 2026 guide says the pack has 12 skills and supports Claude Code, Codex, Kimi Code and OpenCode, with Cursor working through the same pack. It advises prompting in small units and leaving timing-heavy judgement to an editor — [Motionbox, 2 Aug 2026](https://motionbox.io/blog/remotion-for-coding-agents).
  - A tutorial uses a storyboard-approval gate before rendering — [Blotato](https://www.blotato.com/blog/make-ai-videos-with-claude-code).
  - Remotion docs are "AI-ready": append `.md` to any docs URL, or send `Accept: text/markdown`, to get raw markdown for agents — [remotion.dev/docs/ai](https://www.remotion.dev/docs/ai/).
  - Most of these sources are third-party tutorials. The skill count and agent list are not confirmed against Remotion's own changelog.
- **Revideo and Midrender hosted rendering.**
  - Hosted endpoint: `POST https://api.re.video/v1/render/{deployment-id}` with an API key, a `variables` object and `settings` (such as the worker count). It runs synchronously, or asynchronously when given a `callbackUrl`.
  - Self-hosted equivalent: `npx revideo serve --projectFile ./src/project.ts` exposes `/render`.
  - Sources: [docs.re.video render endpoint](https://docs.re.video/platform/render-endpoint), [Revideo README](https://raw.githubusercontent.com/midrender/revideo/main/README.md).
  - No hosted pricing was found.
- **Motion Canvas.** No hosted rendering service was found. It remains an MIT editor-centric library (earlier notes).

### Inferences
- **Remotion licensing.** At 3 people or fewer, Remotion costs nothing in licence fees today. Budget the Automators minimum ($100/month) once the team reaches 4, because pipeline rendering is "building video creation tools" in effect. A 13-chapter season with many re-renders stays well under 10,000 renders a month.
- **Remotion versus Revideo for Dheevara.** Remotion's advantage is the agent-skill ecosystem and a large corpus of LLM training data on Remotion code, so models write it well. Revideo's advantage is the MIT licence and no headcount trigger. Both are React or TypeScript and fit the existing pnpm/TS compiler.
- **Where Remotion fits.** Use it for the overlay and assembly layer: captions, the citation lower-third, the burned-in AI label, title cards and Ken-Burns moves on keyframes. It should not render the lamp-lit relief itself, since that needs WebGL or GPU and Lambda has no GPU.
- **Lambda cost is negligible.** At about $0.02 per minute, compositing a 2-minute chapter costs cents. The real cost sits in clip generation.

### Gaps
- Remotion 5.0 release date and licence diff are still not retrieved.
- Midrender/Revideo hosted pricing was not found.
- The official Remotion skill repo name and contents were not verified first-hand.

---

## 2. Hosted programmatic video APIs as the M4 "assembly" stage

### Takeaway
**Shotstack** is the strongest hosted JSON-timeline assembler. It has tracks and clips, `alias://` cross-references, auto-transcribed **rich captions** with word-level highlighting, a custom `output.size` for 1080×1920, and costs **10–20¢ per rendered minute**. Creatomate and JSON2Video are comparable template engines.

**Rendi** is "FFmpeg as an API", billed by GB processed rather than by minute. It is the best hosted fit if we want our own deterministic FFmpeg command (with our own libass and font build) to stay the source of truth.

**Mux** is for delivery, not assembly.

The main risk is that none of these vendors documents Indic complex-script shaping in captions. That must be tested before relying on their caption burn-in.

### Cited Findings
- **Shotstack pricing.**

  | Plan | Price | Minutes | Per minute | Max resolution |
  |---|---|---|---|---|
  | Pay as you go | $10 | 50 | 20¢ | 1080p |
  | Starter | $39/month | 250 | 15.6¢ | 1080p |
  | Pro | $99/month | 750 | 13.2¢ | 4K |
  | Scale | $199/month | 2,000 | 10¢ | 4K |
  | Volume | $499/month | 10,000 | 5¢ | 4K |

  - Minutes are billed per second, rounded down.
  - Built-in AI generation is charged in credits. Examples: Seedance 2.5 5 s 720p clip ≈ $2.96, Nano Banana 2 image ≈ 10¢, ElevenLabs voice ≈ 6¢ per 1,000 characters.
  - Source: [shotstack.io/pricing](https://shotstack.io/pricing/).
- **Shotstack features.**
  - Captions: give the audio or video clip an `alias`, then point a `rich-caption` asset's `src` at `alias://<name>`. The language is auto-detected.
  - Rich captions add word-level animations (karaoke, bounce, pop) and active-word highlighting.
  - `rich-text` is the recommended overlay asset.
  - Vertical output: presets top out at 1920×1080, so set width and height with `output.size`. A rich-caption clip without width, height and `fit: "none"` covers the whole frame.
  - Shotstack publishes "Agent conventions" docs for LLM agents.
  - Sources: [Shotstack captions guide](https://shotstack.io/docs/guide/architecting-an-application/captions/), [aliases](https://shotstack.io/docs/guide/architecting-an-application/aliases/), [agent conventions](https://shotstack.io/docs/guide/agents/conventions/), [burn subtitles](https://shotstack.io/learn/burn-subtitles-captions-api/).
- **Creatomate.**
  - Tiers: Essential (2,000 credits/month), Growth (10k–40k), Beyond (50k–200k).
  - "1 minute of 720p at 25 fps ≈ 14 credits". Dollar prices did not render on the fetched page.
  - API on all plans; the JS Preview SDK starts at Growth.
  - Renders are hosted for 30 days only.
  - Source: [creatomate.com/pricing](https://creatomate.com/pricing).
- **JSON2Video.**
  - About 1 credit per second of Full HD video.
  - Free plan: 600 credits, 1080p, 60 s maximum.
  - A third-party snapshot from May 2026 lists Hobby $16.95, Professional $49.95 and Startup $99.95 per month.
  - It markets automatic subtitles.
  - Sources: [JSON2Video docs (archived)](https://json2video.com/docs/v2/pricing), [xpay snapshot](https://www.xpay.sh/agent-ready-index/json2video/), [J2V vs Shotstack](https://json2video.com/how-to/shotstack-alternative/). Prices were not confirmed on the live page.
- **Rendi (FFmpeg API).**
  - Free tier: 4 vCPU, 50 GB per month processing, 1-minute command cap.
  - Pro: from $25/month. The processing allowance is reported inconsistently, as 100 GB or 250 GB. Higher tiers run from $50/month (8 vCPU) to $1,600/month (256 vCPU).
  - Rendi's own blog quotes "as low as $0.10/GB".
  - Sources: [rendi.dev/pricing](https://www.rendi.dev/pricing), [third-party review, Sep 2026](https://omidsaffari.com/blog/rendi-pricing), [Rendi blog](https://rendi.dev/blog/best-video-generation-apis).
- **Mux (delivery).**
  - Baseline encoding is free for on-demand assets up to 1080p.
  - Delivery: 100k free minutes per month, then from $0.0008 per minute.
  - Storage: from $0.0024 per minute per month.
  - Smart-encoding figures conflict across Mux pages ($0.025–0.032 per minute for 720p).
  - Sources: [mux.com/pricing](https://mux.com/pricing.html), [Mux video pricing docs](https://mux.com/docs/pricing/video).
- **Plainly and Bannerbear.** Not researched in depth this session. Plainly is After Effects-template based. Bannerbear is mentioned only in JSON2Video comparison pages — [J2V vs Bannerbear](https://json2video.com/how-to/bannerbear-alternative/).

### Inferences
- **Fit for M4.** M4 combines 13 generated clips, narration WAV, per-line captions with `claim:` IDs, and a fixed AI-label overlay. Every API listed can do this.
- **Option A, recommended: deterministic FFmpeg or Remotion owned by us.** Our TS compiler emits a Remotion composition (or an FFmpeg filtergraph and ASS file) from the shot contract. We render it on Lambda, Rendi, Modal or CI, and the code is the source of truth.
- **Option B, Shotstack as a fallback.** It is a reasonable hosted fallback with a clean JSON timeline, but:
  - Its auto-transcription would bypass our cited caption text. Use explicit caption text, not `alias://` transcription, so every caption maps to a `claim:` ID (rule 2).
  - Vendor lock-in: the timeline JSON is proprietary.
- **Cost.** A 2-minute chapter at Shotstack Starter is 2 × 15.6¢ ≈ $0.31 per render. Drafts plus finals, say 10 renders per chapter, cost about $3.
- **Creatomate's 30-day retention** means assets must be copied to our own storage immediately, consistent with "ledger before spend".

### Gaps
- No vendor documents Devanagari, Tamil, Telugu or similar complex-script shaping in captions. This needs a hands-on test.
- No vendor states whether customer media or JSON is used for training (relevant to rule 5); the terms were not read.
- Plainly and Bannerbear pricing was not collected.

---

## 3. Blender in the cloud, and Blender + LLM

### Takeaway
Headless Cycles with CUDA or OptiX works on rented GPUs. The cheapest flexible route for a small team is **serverless GPU**: Modal at an L4 for about $0.80/hour or an L40S for about $1.95/hour, or RunPod (pricing not collected), running our own pinned Blender container. Traditional farms (iRender, Superrenders) bill about $0.02 per frame or per OctaneBench-hour and suit big batches, not CI.

Blender reportedly has an **official Blender Lab MCP server** (Blender 5.1+). Its existence and details are secondhand only.

### Cited Findings
- **Modal prices (per second, ×3600 for hourly).** L4 $0.000222 (~$0.80/hour); A10 ~$1.10/hour; L40S $0.000542 (~$1.95/hour); A100-80GB ~$2.50/hour; H100 ~$3.95/hour; CPU ~$0.047 per physical core-hour — [modal.com/pricing](https://modal.com/pricing).
- **Headless GPU rendering.** CUDA and OptiX both work headless: `blender -b` for sequences — [Contabo guide](https://contabo.com/blog/gpu-rendering-on-a-vps-blender-cinema-4d-unreal-2026/).
- **iRender estimate.** A 200-frame Cycles animation is about $10.90 list (80 minutes on 1× RTX 4090), or about $0.022 per frame discounted. This is vendor marketing — [iRender, Jun 2026](https://irendering.net/is-cloud-rendering-too-expensive-a-real-cost-breakdown-for-3d-artists/).
- **Superrenders.** $0.003 per OctaneBench-hour, which is about $5.20 per RTX 5090 card-hour. A dedicated node (2× 5090) is $1,172.50 per week. Vendor-published — [Superrenders](https://superrendersfarm.com/article/rent-gpu-server-render-farm).
- **Blender Lab MCP server.**
  - Third-party pages say the Blender Foundation published an MCP server through Blender Lab with an official Claude connector. It requires Blender 5.1+, and generated Python "can modify or remove project data".
  - Blender 5.1 reportedly shipped in March 2026.
  - Sources: [a2a-mcp listing](https://a2a-mcp.org/entry/blender-lab-mcp-server.md), [3D AI Studio guide](https://www.3daistudio.com/3d-generator-ai-comparison-alternatives-guide/blender-mcp).
  - Not confirmed on blender.org.
- **Other MCP tools.** The community BlenderMCP (ahujasid, MIT) is separate (see earlier notes). Paid variants exist (BlenderMCP Pro, Blender 5.0+) — [ArtStation](https://www.artstation.com/marketplace/p/mDKVX/blendermcp-pro-control-blender-with-ai-claude-cursor-windsurf).

### Inferences
- **Per-frame cost (inference, not measured).** For our scene, a displaced plane with one point light, assume Cycles at 1080×1920 with a modest sample count plus the denoiser runs about 2–6 s per frame on an L40S.
  - A 2-minute chapter at 24 fps is 2,880 frames, so about 1.6–4.8 GPU-hours, or about **$3–10 per chapter final on Modal L40S**.
  - 480p drafts cost a fraction of that (about 1/9 the pixels).
  - EEVEE, if it runs headless, would be about 10× cheaper.
  - These numbers must be benchmarked; see Gaps.
- **Use Blender for keyframes and plates, not full motion.** Render one hero keyframe or a short plate per shot in Blender, then have an image-to-video API animate it. This cuts Blender frames to about 13–50 per chapter and makes Blender cost trivial (cents).
- **MCP in development only.** MCP servers (official or community) are good for in-session authoring of new procedural carving assets by Claude. The production path stays "shot contract → our compiler → `bpy` script → headless render", which matches the earlier notes.

### Gaps
- RunPod serverless, Google Cloud Run GPU, CoreWeave, Conductor, RebusFarm and GarageFarm prices were not collected.
- No measured seconds-per-frame for our scene exists.
- The official Blender Lab MCP server and any "Blender AI features 2026" were not confirmed from blender.org.

---

## 4. Hosted LLM APIs for writing specs and scene code; data terms; what changes in CLAUDE.md

### Takeaway
Frontier coding models are effectively tied at the top of SWE-bench Verified (about 96% as of Sep–Oct 2026: Claude Opus 5, GPT-5.6 "Sol", DeepSeek-V4-Pro). Benchmark differences there will not decide our choice. Schema adherence, Remotion and Blender familiarity, and data terms will.

Anthropic's API, OpenAI's API and Gemini's **paid** API do not train on inputs by default. Gemini's free tier and AI Studio do.

### Cited Findings
- **SWE-bench Verified rankings.** The sources conflict.
  - An Oct 8, 2026 report says Claude Opus 5 scored 96%, the highest — [af.net](https://af.net/?p=125041).
  - BenchLM lists Opus 5 at 96%, Claude Mythos 5 at 95.5% and Claude Fable 5 at 95% — [BenchLM](https://benchlm.ai/benchmarks/swe-bench-verified).
  - A Sep 9, 2026 index ranks DeepSeek-V4-Pro-0813 at 96.4%, GPT-5.6 Sol at 96.2% and Claude Opus 5 at 96% — [datalearner](https://www.datalearner.com/en/benchmarks/SWE-bench-Verified).
  - Gemini 3.1 Pro self-reported 80.6% (Feb 2026), and GPT-5.2 self-reported 80.0% — [Steel leaderboard](https://leaderboard.steel.dev/leaderboards/swe-bench-verified.md).
  - Contamination and scaffold caveats apply — [BenchLM explainer](https://benchlm.ai/md/blog/posts/swe-bench-explained.md).
- **Anthropic data terms.** Anthropic does not use inputs or outputs from commercial products, including the API, for training by default. It does so only on opt-in or feedback — [Anthropic support](https://support.anthropic.com/en/articles/7996868-is-my-data-used-for-model-training). Retention duration (0, 7 or 30 days) is reported inconsistently by secondary sources and was not verified.
- **OpenAI data terms.** API data is not used for training unless the organisation opts in, a policy in place since 2023-03-01. This comes from secondary sources — [vorplabs table](https://vorplabs.com/models/data-policies), [Giselle FAQ](https://docs.giselles.ai/faq/security-support/privacy-security).
- **Gemini data terms.**
  - Paid services: "do not train on your inputs".
  - Unpaid services: Google may use the data to improve products and ML, and human reviewers may read it.
  - AI Studio counts as unpaid even on paid accounts, except in the EEA, Switzerland and the UK.
  - Vertex AI is governed by Google Cloud terms (confidential).
  - Sources: [Simon Willison on the Gemini ToS (Oct 2024)](https://simonwillison.net/2024/Oct/17/gemini-terms-of-service), [Gemini CLI ToS](https://geminicli.com/docs/tos-privacy). The source is dated 2024; recheck the current wording.

### Inferences
- **Spec-writing.** Our task is filling a strict JSON shot contract and emitting Remotion TSX or a narrow `bpy` template. Any frontier model with **native structured outputs / JSON-schema mode** (Anthropic, OpenAI and Gemini all offer this; vendor docs were not re-fetched this session) will do. Choose on cost and terms.
  - Claude is the natural default, because the planning already happens in Claude sessions and the Remotion agent skills target Claude Code first.
- **Rule 5 (no training on our texts).** Allowed: the Anthropic API, the OpenAI API and **paid** Gemini through Vertex. Not allowed: Gemini free tier and AI Studio. Rule 5 already forbids sending unreleased passages to APIs whose terms allow training on inputs. Open models via Together or Fireworks need their own terms checked (not done here).
- **If the pipeline calls an LLM API, CLAUDE.md and the brief need these changes:**
  1. The line "no Anthropic key in the pipeline" is superseded. Add `ANTHROPIC_API_KEY` (or another provider key) as an environment secret (rule 8).
  2. Each LLM call becomes a provider spend, so it must write a **ledger row before the request** (rule 3), including model ID, prompt hash and a cost estimate.
  3. "Planning and QC verdicts are written by Claude in session and committed as files" should stay the review mechanism. API output is committed under `content/<chapter>/` with model, version, temperature and prompt hash, and a human or in-session Claude still signs off. Without this, LLM non-determinism breaks "code is the source of truth".
  4. Add a test that rejects any provider whose recorded terms allow training (rule 5). This needs a small provider-terms registry.
  5. Log the decision in `docs/decisions.md` with a date and reason.
- **Practical middle path.** Keep spec authoring in-session (Claude Code with Remotion skills) for now. Introduce API calls only for bulk, repeatable steps: VLM QC scoring of keyframes, and caption timing alignment.

### Gaps
- There is no code-to-scene or Blender-specific benchmark comparing hosted frontier models.
- Current pricing for Claude, GPT-5.x and Gemini 3.x was not collected (consult the claude-api skill or vendor pages).
- Together and Fireworks data terms were not checked.
- Anthropic's current retention default was not verified.

---

## 5. Captions (Indic shaping), C2PA signing, video QC

### Takeaway
Indic captions are a **real technical risk**. libass needs HarfBuzz, and FFmpeg's `subtitles` filter historically forced the "simple" shaper, breaking Devanagari conjuncts and matras.

Two safe paths:
- FFmpeg with a libass build that has HarfBuzz, with the shaper set to complex or auto, and Noto Indic fonts pinned.
- Browser rendering (Remotion or Revideo, where Chromium's HarfBuzz shapes Indic correctly; this is an inference, not tested).

For C2PA, use **c2pa-rs** (or its bindings) with a certificate from a CA on the official C2PA trust list. That list replaced the interim list on 1 Jan 2026. SSL.com offers a free claim-signing certificate tier.

### Cited Findings
- **libass and HarfBuzz.** libass without HarfBuzz renders "all Indic languages" incorrectly. Arch fixed its package in libass 0.10.2-2 — [Arch FS#38249](https://bugs.archlinux.org/task/38249).
- **FFmpeg shaping bug.** FFmpeg ticket #8738, "subtitle filter can't render indic languages": the `subtitles` filter left the shaping option uninitialised, forcing the simple shaper. A 2021 patch made `shaping` a shared subtitle filter option — [FFmpeg-trac #8738](https://ffmpeg.org/pipermail/ffmpeg-trac/2020-June/054649.html), [ffmpeg-devel patch](https://ffmpeg.org/pipermail/ffmpeg-devel/2021-March/277946.html).
- **C2PA trust list.** From 1 Jan 2026 the official C2PA trust list replaced the interim trust list. SSL.com's free tier includes one Level 1 Claim Signing Certificate (1 year) and 10,000 timestamps per year. The start date is given as May or June 2026, inconsistently across language versions — [SSL.com C2PA](https://www.ssl.com/products/content-authenticity/content-credentials/c2pa/).
- **C2PA formats.** Third-party viewers list MP4 and MOV as C2PA-supported formats — [c2paviewer](https://c2paviewer.com/articles/how-to-c2pa-verify-image-video-origins). Community bindings exist (Ruby over c2pa-rs) — [ruby-c2pa](https://github.com/eddorre/ruby-c2pa/wiki).

### Inferences
- **Recommended caption path.**
  1. Word-level timings come from forced alignment of our **own cited caption text** against the narration. Do not transcribe; that keeps rule 2.
  2. The compiler emits ASS (FFmpeg) or JSON (Remotion), with the `claim:` ID and verse citation in a lower-third.
  3. Add a CI golden-image test per script (Devanagari, Tamil, Telugu, Kannada, Bengali, Malayalam, Gujarati, IAST with diacritics) to catch shaping regressions.
- **Label and C2PA order.** Burn in the AI label at assembly. Then sign the final MP4 with c2pa-rs as the last step before upload, with an assertion that it is AI-generated plus our provenance (chapter ID, contract hash). Any later transcode, for example by Mux, strips or invalidates the manifest. So sign the delivered rendition, or treat the Mux HLS stream as unsigned and offer the signed MP4 as the canonical file.
- **QC.** The earlier notes' deterministic checks plus a VLM critic still apply. Hosted options are frontier VLM APIs (Claude or Gemini vision) scoring keyframes against the contract's `forbidden` list (rule 1), with the ID-mask check as the backstop. No dedicated "video QC API" fit for this was found.

### Gaps
- Truepic and Adobe Content Credentials API pricing was not collected.
- The c2pa-rs MP4 signing example was not verified first-hand.
- It was not confirmed whether current FFmpeg releases default to the complex shaper.
- Remotion and Shotstack Indic rendering was not tested.
- No dedicated video-QC API vendors were researched.

---

## 6. Recommendation: tool per stage, with rough cost per chapter

### Takeaway
Keep **our TS compiler as the source of truth**. Use APIs for the generative steps (keyframes, clips, voice) and use **Remotion**, free at 3 people or fewer, for deterministic assembly: captions, citations, AI label. Render on Lambda (overlay-only, no GPU) or on a Modal GPU. Sign with c2pa-rs and deliver through Mux.

The estimated cost is about **$40–120 per finished chapter**, dominated by image-to-video clips. This is an inference built from the prices above, not measured.

### Cited Findings (price anchors used)
- Image-to-video clip cost ≈ $2.96 per 5 s 720p clip (Seedance 2.5 via Shotstack); image ≈ $0.10; ElevenLabs voice ≈ $0.06 per 1,000 characters — [Shotstack pricing](https://shotstack.io/pricing/)
- Remotion Lambda ≈ $0.02 per minute — [Remotion cost example](https://remotion.dev/docs/lambda/cost-example); free licence at 3 people or fewer — [remotion.pro](https://www.remotion.pro/license)
- Modal L40S ≈ $1.95/hour — [Modal](https://modal.com/pricing)
- Mux delivery: 100k free minutes per month — [Mux](https://mux.com/pricing.html)

### Inferences (stage-by-stage recommendation)

| Stage | Tool | Why | Rough cost / chapter |
|---|---|---|---|
| Spec (shot contract) | Claude in session now (Claude Code + Remotion skills). Later the Anthropic API with JSON-schema output, ledgered | Already the workflow; strong at TS/Remotion; no-training default | $0 in session; about $1–3 via API |
| Keyframe | Blender (our compiler → `bpy`) on Modal L4 or L40S for relief plates. Optional image API for look-dev | Deterministic relief and lamp; ID mask for the no-deity-face check | Under $1 (about 13–50 frames) |
| Clip | Image-to-video API conditioned on the keyframe (pick on quality; Seedance-class at about $0.60/s at 720p). Drafts at 480p first (rule 6). Only for shots needing organic motion; others use a Remotion or Blender camera move on the plate | Diffusion only where it wins | About $30–100 (13 × ~9 s, plus drafts) |
| Narration | Existing voice stage (Vāgdhenu for ślokas, rule 7) | Unchanged | Out of scope |
| Assembly (M4) | **Remotion composition generated by our compiler**, rendered on Lambda, or on Modal or Cloud Run if GPU effects are needed. Fallbacks: Rendi (FFmpeg API) or Shotstack | Code is the source of truth; no lock-in | About $0.05–0.50 per render |
| Captions | Forced alignment of cited text, then the Remotion caption component, or ASS through FFmpeg with libass + HarfBuzz (complex shaper). Golden-image tests per script | Rule 2; Indic shaping | About $0 |
| Label + C2PA | Burned-in label in the Remotion composition, then c2pa-rs signing with a trust-list certificate (SSL.com free tier to start) | Last step before publish | About $0 at our volume |
| Delivery | Mux (free baseline encoding at 1080p or below, 100k free delivery minutes), plus the signed MP4 kept in our storage | Cheap; HLS for the KMP app | About $0 at launch volume |
| Web or JS experiences | Same compiler emitting three.js or R3F plus `@remotion/player` or a Revideo player | Shared source of truth | — |

- **Licence trigger.** When headcount reaches 4, budget $100/month for Remotion Automators, or switch the assembly target to Revideo (MIT). Keeping the compiler's output layer thin makes that switch cheap.
- **Lowest-cost variant.** Skip image-to-video for most shots and use Blender camera and lamp moves rendered on Modal (about $3–10 per chapter, per the estimate in section 3). The total falls to about $5–15 per chapter.

### Gaps
- Current per-second prices for Kling, Veo, Runway, Seedance and other image-to-video APIs were not collected here; they are presumably covered by another researcher.
- No measured Blender render times exist.
- Per-chapter numbers are estimates, not measurements.
