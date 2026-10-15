# Open-source orchestration, model serving, GPU hosting, observability, media delivery and app backend for Dheevara (as of Oct 2026)

Method note: licences were checked by reading the LICENSE file on each project's default branch on 15 Oct 2026 (raw.githubusercontent.com). The GitHub API was not reachable from this session, so star counts and release dates were not collected. Prices come from vendor pages where possible and otherwise from dated third-party roundups. Anything not re-verified this session is marked "(not re-verified)" or listed under Gaps.

Licence legend: **OSI** = OSI-approved open source (MIT, Apache-2.0, BSD, MPL, GPL, AGPL). **SA** = source-available, not OSI (BSL, SSPL, ELv2, Sustainable Use, fair-source). **Open core** = OSI core plus a proprietary `ee/` or `enterprise/` directory.

## 1. Durable workflow orchestration (long GPU jobs, human approval, retries without double billing, budgets)

### Takeaway
For a TypeScript/pnpm pipeline that needs long waits for human approval and must never pay twice for the same call, **Temporal (MIT)** is the most mature choice, and **Hatchet (MIT)** is a lighter Postgres-based option with first-class durable event waits in TypeScript. Restate is BSL and Inngest is SSPL, so neither is OSI open source. n8n is fair-code (Sustainable Use). Windmill's licensing is mixed. Prefect, Dagster and Flyte are Python-first. Argo is Kubernetes-YAML-first.

### Cited Findings
- **Temporal** server is under the MIT License ("Copyright (c) 2025 Temporal Technologies Inc... (c) 2020 Uber Technologies") — [temporalio/temporal LICENSE](https://github.com/temporalio/temporal/blob/main/LICENSE)
- Temporal's Approval pattern: the workflow blocks until an external decision arrives through Signals that carry metadata, records approver identity, reason and timestamp, and must handle timeouts when no decision comes — [Temporal docs: Approval pattern](https://docs.temporal.io/design-patterns/approval)
- While a Temporal workflow waits on a condition it frees its worker. When a Signal arrives or a timeout fires, the server schedules a new Workflow Task and the worker replays Event History to rebuild state — [Temporal: Reliable document approvals with human-in-the-loop](https://docs.temporal.io/guides/reliable-document-approvals)
- Retries are only safe when Activities are idempotent; non-idempotent activities are a common pitfall — [Temporal HITL blog](https://temporal.io/blog/human-in-the-loop-approvals) (the idempotency point itself comes from a third-party skills page, so it is weaker evidence)
- **Hatchet** is under the MIT License ("Copyright (c) 2023-present Hatchet Technologies Inc.") — [hatchet-dev/hatchet LICENSE](https://github.com/hatchet-dev/hatchet/blob/main/LICENSE)
- In TypeScript, a Hatchet durable task (`hatchet.durableTask`) can call `ctx.waitForEvent(key)` to pause until an external event arrives, either pushed through the SDK or through an incoming webhook. While it waits, the worker slot is freed. If the task is interrupted, the event is still processed and the task resumes from the durable event log. A CEL filter expression on the payload is supported — [Hatchet docs: Durable Event Waits](https://docs.hatchet.run/v1/durable-event-waits), [Hatchet durable tasks](https://docs.hatchet.run/llms/v1/patterns/durable-task-execution.md)
- **Restate** is under the **Business Source License 1.1** (not OSI). The Additional Use Grant forbids only running a "Public Restate Platform Service", meaning a managed service where third parties register and invoke their own services. Any production deployment that runs the licensee's own services or workflows is explicitly permitted — [restatedev/restate LICENSE](https://github.com/restatedev/restate/blob/main/LICENSE)
- **Inngest** is under the **Server Side Public License v1** (not OSI), with an "Apache 2.0 Future License" grant that takes effect on the third anniversary of each release (DOSP-style delayed open source) — [inngest/inngest LICENSE.md](https://github.com/inngest/inngest/blob/main/LICENSE.md)
- **n8n** is under the **Sustainable Use License** (fair-code, not OSI). Files named `.ee.` require an n8n Enterprise License — [n8n-io/n8n LICENSE.md](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)
- **Windmill**'s source is "variously licensed under the Apache License 2.0 ... or the AGPLv3 License ... and a proprietary license for certain enterprise features" — [windmill-labs/windmill LICENSE](https://github.com/windmill-labs/windmill/blob/main/LICENSE)
- **Kestra**: Apache-2.0 — [kestra-io/kestra LICENSE](https://github.com/kestra-io/kestra/blob/develop/LICENSE)
- **Prefect**: Apache-2.0 — [PrefectHQ/prefect LICENSE](https://github.com/PrefectHQ/prefect/blob/main/LICENSE); **Dagster**: Apache-2.0 — [dagster LICENSE](https://github.com/dagster-io/dagster/blob/master/LICENSE); **Flyte**: Apache-2.0 — [flyte LICENSE](https://github.com/flyteorg/flyte/blob/master/LICENSE); **Argo Workflows**: Apache-2.0 — [argo-workflows LICENSE](https://github.com/argoproj/argo-workflows/blob/main/LICENSE)

### Inferences
- **Recommendation: Temporal (self-host, or Temporal Cloud for the first months) with the TypeScript SDK.** Each paid call (fal.ai, Sarvam, a self-hosted GPU job) becomes an Activity. The current pattern of "append to the cost ledger before every paid call" maps onto a separate `reserveBudget` Activity that writes a ledger row keyed on `(runId, shotId, contentHash)` with a unique constraint, followed by the paid Activity, which reuses the same content hash as the provider idempotency key and cache key. A retry then hits the cache or the existing reservation instead of billing again. The human-approval files become a Signal or Update ("approve final render") with a timeout. The per-run budget cap stays as workflow state checked before each reservation.
- **Hatchet** is the leaner alternative: one Go binary plus Postgres, MIT, a good TypeScript SDK and `waitForEvent` for approvals. It suits a team that wants a queue-plus-durable-execution system without Temporal's operational weight (Temporal self-hosted needs Cassandra/Postgres/MySQL plus Elasticsearch for advanced visibility; not re-verified).
- Restate's BSL grant allows Dheevara's use case, so it is legally usable but not "open source". Flag it if an open-source-only policy is strict.
- Avoid Inngest (SSPL) and n8n (Sustainable Use) when OSI-only is a requirement. Prefect, Dagster and Flyte are Python-centric and fit poorly with a TS pipeline. Argo/Kestra are YAML/DAG-centric and weaker for human-in-the-loop than Temporal or Hatchet.

### Gaps
- Temporal TypeScript-specific Update-validator code and Hatchet's exact `waitForEvent` signature were not confirmed from official SDK type definitions; the Hatchet signature came partly from a mintlify mirror.
- Current Temporal Cloud and Hatchet Cloud prices were not collected.

## 2. Model serving, GPU autoscaling and gateways

### Takeaway
Every major serving engine is OSI-licensed. For LLMs use vLLM or SGLang (Apache-2.0). For image and video diffusion graphs the de facto tool is ComfyUI, which is **GPL-3.0** (fine to run as a server, but it matters if you distribute modified code). Wrap custom models (TTS, ASR) with LitServe or BentoML (Apache-2.0). Use SkyPilot (Apache-2.0) or dstack (MPL-2.0) to launch jobs across Indian and overseas GPU clouds. LiteLLM and Portkey gateway are MIT outside their enterprise folders, and Envoy AI Gateway is Apache-2.0.

### Cited Findings
- **SGLang**: Apache-2.0 — [sgl-project/sglang LICENSE](https://github.com/sgl-project/sglang/blob/main/LICENSE)
- **llama.cpp**: MIT ("Copyright (c) 2023-2026 The ggml authors") — [ggml-org/llama.cpp LICENSE](https://github.com/ggml-org/llama.cpp/blob/master/LICENSE)
- **Ollama**: MIT — [ollama/ollama LICENSE](https://github.com/ollama/ollama/blob/main/LICENSE)
- **BentoML**: Apache-2.0 — [bentoml/BentoML LICENSE](https://github.com/bentoml/BentoML/blob/main/LICENSE)
- **LitServe**: Apache-2.0 — [Lightning-AI/LitServe LICENSE](https://github.com/Lightning-AI/LitServe/blob/main/LICENSE)
- **ComfyUI**: **GNU GPL v3** — [comfyanonymous/ComfyUI LICENSE](https://github.com/comfyanonymous/ComfyUI/blob/master/LICENSE)
- **SkyPilot**: Apache-2.0 — [skypilot-org/skypilot LICENSE](https://github.com/skypilot-org/skypilot/blob/master/LICENSE)
- **dstack**: Mozilla Public License 2.0 — [dstackai/dstack LICENSE.md](https://github.com/dstackai/dstack/blob/master/LICENSE.md)
- **LiteLLM**: "All content that resides under the `enterprise/` directory ... is licensed under ... enterprise/LICENSE. Content outside ... is available under the MIT license" — [BerriAI/litellm LICENSE](https://github.com/BerriAI/litellm/blob/main/LICENSE)
- **Portkey AI Gateway**: MIT — [Portkey-AI/gateway LICENSE](https://github.com/Portkey-AI/gateway/blob/main/LICENSE)
- **Envoy AI Gateway**: Apache-2.0 — [envoyproxy/ai-gateway LICENSE](https://github.com/envoyproxy/ai-gateway/blob/main/LICENSE)

### Inferences
- vLLM (Apache-2.0), TensorRT-LLM (Apache-2.0), NVIDIA Triton (BSD-3-Clause), Ray/Ray Serve (Apache-2.0), KServe (Apache-2.0) and KEDA (Apache-2.0) are also OSI-licensed (not re-verified this session; the LICENSE fetch for these repos was not run).
- **Lean serving plan:**
  - **LLMs** (script drafting, translation help, QA): vLLM, or SGLang for structured output and prefix-cache-heavy workloads, on one L40S or H100 behind LiteLLM proxy (MIT core). The same OpenAI-compatible endpoint then fronts the self-hosted models and any approved hosted fallback, with per-key budgets.
  - **Video and image diffusion:** ComfyUI in headless API mode (`/prompt` + websocket) with pinned workflow JSONs. Treat each workflow JSON plus its model hashes as part of the content-addressed cache key. GPL-3.0 does not restrict internal server use, but any modified ComfyUI code that is distributed must be released under the GPL.
  - **TTS/ASR** (for example Indic models): wrap them in LitServe or BentoML containers.
  - **Scheduling:** Temporal or Hatchet workers call SkyPilot/dstack to bring GPU nodes up and down. Kubernetes + KEDA can wait until steady load justifies a cluster.
- Hosted ComfyUI platforms (ComfyDeploy, Comfy's own API) are optional. Licence and self-hostability were not verified this session.

### Gaps
- No 2025–2026 benchmark comparisons (vLLM vs SGLang vs TensorRT-LLM throughput) were fetched this session.
- The ComfyDeploy licence and the state of "comfy-api" were not verified.
- Serverless GPU options with India regions were not researched (Modal, RunPod Serverless and Replicate are overseas).

## 3. GPU clouds in India, prices, and the IndiaAI Mission subsidised compute

### Takeaway
Indian GPU clouds now publish hourly INR rates that compete with US neoclouds. Approximate on-demand H100 prices: E2E ₹379/hr (spot ₹70), Krutrim ₹213/hr, JarvisLabs ~₹218/hr, versus about $10–12/GPU-hr on AWS/GCP/Azure Mumbai, which are 8-GPU instances only. E2E lists L4 at ₹49/hr and L40S at ₹102/hr, which suits diffusion and TTS drafts. IndiaAI Mission compute is subsidised to roughly ₹65–92/GPU-hr after up to 40% subsidy, but access is application-based and discretionary, prioritising projects of "national importance". A content startup should treat it as a possible bonus, not the base plan.

### Cited Findings
- **E2E Networks** on-demand (spot) prices, ex-18% GST, page dated 2026-10-14: L4 ₹49/hr; L40S ₹102/hr; A100 80GB ₹189 (₹66 spot); H100 ₹379.05 (₹70 spot); H200 ₹502.55 (₹88 spot); B200 ₹759.05; RTX PRO 6000 ₹236.55 — [E2E Networks pricing](https://www.e2enetworks.com/pricing.md)
  - Conflict: E2E's own H200 blog lists ₹300.14/hr on-demand, and E2E articles cite H100 at ₹249/hr, so prices differ across E2E pages — [E2E H200 price blog](https://e2enetworks.com/blog/nvidia-h200-price-india), [E2E H100 price blog](https://e2enetworks.com/blog/nvidia-h100-price-india)
- **Ola Krutrim Cloud**: H100-NVLINK-1x ₹213/hr on-demand; ₹198 (monthly), ₹186 (6-month), ₹173 (1-year) reserved; 2x ₹426, 4x ₹852. The docs page is undated. An older launch-era press report said "from ₹490/hr" — [Krutrim Cloud docs: compute](https://docs.cloud.olakrutrim.com/basics/core-infrastructure/compute); [OfficeChai launch report](https://officechai.com/startups/ola-launches-krutrim-cloud-with-nvidia-gpus-for-indian-developers/)
- **Yotta Shakti Cloud**: the official pricing page appears to list an 8×H100 HGX cluster at about $5.77/GPU-hr on-demand, falling to about $2.74 on 48-month terms, plus INR monthly plans such as an 80GB H100 workstation at ₹1,40,000/month. Extracted column labels were garbled, so this needs confirmation. A July 2026 roundup says Yotta is quote-based — [Shakti Cloud pricing](https://shakticloud.ai/pricing.html); [dev.to India GPU pricing 2026](https://dev.to/mr_manushukla/gpu-cloud-pricing-in-india-2026-h100-h200-and-b200-rates-compared-bo7)
- July 2026 snapshot (third-party), per hour:

  | Provider | GPU | Rate |
  |---|---|---|
  | JarvisLabs | H100 | ₹217.89 (per-minute billing) |
  | Cyfuture AI | H100 | ₹329 (₹219 on 12-month reserved) |
  | AceCloud | H100 HGX | from ₹1,80,000/month |
  | AWS Mumbai | p5.48xlarge (8×H100) | ~$98 |
  | GCP Mumbai | a3-highgpu-8g | ~$85 |
  | Azure India | ND96isr_H100_v5 | ~$83 |
  | RunPod | H100 PCIe | $1.99 |
  | RunPod | H200 | ~$3.59 |
  | RunPod | B200 | $5.98 |
  | Lambda | H100 | $3.99–4.29 |
  | Lambda | H200 | $4.99+ |
  | Vast.ai | H100 | ~$1.55–2.50 (marketplace, no SLA) |
  | Vast.ai | A100 | from ~$0.67 |

  — [dev.to: GPU cloud pricing in India 2026 (snapshot July 2026)](https://dev.to/mr_manushukla/gpu-cloud-pricing-in-india-2026-h100-h200-and-b200-rates-compared-bo7)
- **IndiaAI Mission compute**:
  - Over 38,000 GPUs are empanelled (about 15,000 of them H100/H200-class), against a target of 100,000. Winning L1 bids were ₹115.85/GPU-hr (standard) and ₹150/GPU-hr (H100-class). Eligible users get up to 40% off, giving about ₹67/hr standard and about ₹92/hr H100-class. Approved foundational-model builders can get a 100% subsidy. Applications go through the IndiaAI Compute Portal, and "approval is discretionary and prioritises projects of national importance". Named recipients include Sarvam AI, Gnani.ai, Soket AI Labs and GAN.ai — [dev.to roundup, July 2026](https://dev.to/mr_manushukla/gpu-cloud-pricing-in-india-2026-h100-h200-and-b200-rates-compared-bo7)
  - A PIB press note (about 289 days old, so roughly early 2026) gives a subsidised rate of ₹65/hr — [PIB press note](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=156786&lang=1&reg=3) (the page returned 403 to direct fetch; the figure comes from a search snippet)
  - Other secondary sources give ₹65–92/hr, "under ₹100/hr", or ₹115–150/hr (pre-subsidy) — [Careerindia](https://www.careerindia.com/news/indiaai-mission-2026-access-subsidized-gpus-boost-ai-careers-scale-startups-011-66885.html), [abhs.in](https://abhs.in/blog/indiaai-mission-34000-gpus-cheap-compute-developers-2026), [TechDodo](https://techdodo.in/articles/india-ai-impact-summit-2026-gpu-access-guide)

### Inferences
- **Draft renders** (cheap, interruptible): E2E L40S at ₹102/hr or L4 at ₹49/hr for TTS, ASR, image and small video models, and E2E A100/H100 spot (₹66–70/hr) for video diffusion batches. Spot preemption is acceptable because Temporal/Hatchet retries plus the content-addressed cache make preempted jobs resumable without re-billing completed shots.
- **Final renders and unreleased scripts:** Indian on-demand capacity (E2E, Krutrim, JarvisLabs) keeps data in India. All three are far cheaper than AWS/GCP/Azure Mumbai, which only sell H100s as 8-GPU instances.
- Overseas RunPod or Vast can be used only for non-sensitive drafts such as public-domain source text or style tests, if data residency allows.
- **IndiaAI:** apply (an Indic-language cultural-heritage AI project may qualify), but do not plan around it. The portal rate is the strongest price signal, but the eligibility criteria for a content (non-foundation-model) startup are unclear.

### Gaps
- No primary IndiaAI portal page was fetched (indiaai.gov.in / compute portal), so the exact 2026 eligibility rules, application form and current rate table are unverified. Secondary sources conflict (₹65 vs ₹67 vs ₹92 vs ₹115–150).
- Netweb (Tyrone/"Skylus") cloud GPU prices were not found.
- The date of the Krutrim docs pricing is unknown, and the Yotta figures need manual confirmation.
- E2E's H100 price conflicts across its own pages (₹249, ₹350, ₹379).

## 4. LLM/agent observability and evals

### Takeaway
Langfuse's core is MIT outside its `ee/` directories, and its copyright line now names ClickHouse, Inc. Arize Phoenix is **Elastic License 2.0** (source-available, not OSI). Opik (Apache-2.0), OpenLLMetry (Apache-2.0), promptfoo (MIT) and Inspect AI (MIT) are all OSI.

### Cited Findings
- **Langfuse** LICENSE: "Copyright (c) 2023-2026 ClickHouse, Inc." Content under `ee/`, `web/src/ee/` and `worker/src/ee/` falls under ee/LICENSE, and everything else is "MIT Expat" — [langfuse/langfuse LICENSE](https://github.com/langfuse/langfuse/blob/main/LICENSE)
- **Arize Phoenix**: Elastic License 2.0 (ELv2) — [Arize-ai/phoenix LICENSE](https://github.com/Arize-ai/phoenix/blob/main/LICENSE)
- **Opik** (Comet): Apache-2.0 — [comet-ml/opik LICENSE](https://github.com/comet-ml/opik/blob/main/LICENSE)
- **OpenLLMetry** (Traceloop): Apache-2.0 — [traceloop/openllmetry LICENSE](https://github.com/traceloop/openllmetry/blob/main/LICENSE)
- **promptfoo**: MIT ("Copyright (c) Promptfoo 2025") — [promptfoo LICENSE](https://github.com/promptfoo/promptfoo/blob/main/LICENSE)
- **Inspect AI**: MIT ("Copyright (c) 2024 UK AI Security Institute") — [inspect_ai LICENSE](https://github.com/UKGovernmentBEIS/inspect_ai/blob/main/LICENSE)

### Inferences
- The Langfuse copyright holder suggests ClickHouse acquired Langfuse. The MIT core remains, but watch for licence drift.
- **Recommended:** instrument the TS pipeline with OpenTelemetry using the GenAI semantic conventions, via OpenLLMetry or Langfuse's OTel endpoint. Self-host Langfuse (Postgres + ClickHouse + Redis + S3) in India so prompts with unreleased chapter text never leave the country. Use promptfoo (MIT, Node-native) for regression evals of translation, script and safety prompts in CI. Inspect AI is a Python option for deeper evals.
- Phoenix's ELv2 is fine for internal use but is not OSI.

### Gaps
- The current stability status of the OTel GenAI semantic conventions (still "Development"/experimental, or stable) was not verified for Oct 2026.
- The Langfuse/ClickHouse acquisition date and terms were not confirmed beyond the LICENSE copyright line.

## 5. Media processing and delivery

### Takeaway
The open toolchain is FFmpeg with SVT-AV1/x264 to encode, Shaka Packager or Bento4/GPAC to package CMAF fMP4 as HLS plus DASH, WebVTT subtitles, and Media3/ExoPlayer, AVPlayer, Shaka Player and hls.js for playback. Delivery uses an object store plus a commercial CDN, or nginx/Varnish caches. Licences were not re-verified this session, apart from the confirmation that Varnish and Shaka repos exist.

### Cited Findings
- Licence fetches for FFmpeg, Shaka Packager, Bento4, Shaka Player, hls.js, Video.js, Media3, SVT-AV1 and Varnish were not completed in this session, so no primary citation is available here (see Gaps).

### Inferences (from prior knowledge, not re-verified this session)
- **Licences:**
  - FFmpeg: LGPL-2.1+, or GPL if built with x264/x265.
  - SVT-AV1: BSD-3-Clause-Clear plus the AOM patent licence.
  - Shaka Packager and Shaka Player: Apache-2.0 and BSD-style.
  - Bento4: GPL-2.0, with a commercial licence also available.
  - GPAC/MP4Box: LGPL-2.1.
  - hls.js: Apache-2.0.
  - Video.js: Apache-2.0.
  - AndroidX Media3: Apache-2.0.
  - Varnish: BSD-2-Clause.
  - nginx: BSD-2-Clause.
- **Encoding ladder for cheap Android on patchy networks** (2-min vertical 9:16 chapters):
  - Ship H.264 (AVC) as the universal baseline, with AV1 renditions on top. Hardware AV1 decode is still missing on many low-end Android SoCs, though dav1d software decode is acceptable at 360–540p.
  - Low rungs of about 150–250 kbps at 360p let a 2-minute chapter fit in a few MB.
  - HEVC needs royalties through multiple pools (Access Advance, Via LA) and some patent holders sit outside any pool. Avoid HEVC for distribution unless it is needed for iOS hardware efficiency.
  - Use CMAF fMP4 segments with one set of files for both HLS (iOS/AVPlayer) and DASH (Android/Shaka/Media3).
- **Subtitles:** WebVTT sidecars for HLS and DASH across 8+ languages. TTML/IMSC only if a distribution partner requires it.
- **DRM:** Widevine, FairPlay and PlayReady are proprietary and need licence-server contracts, though Widevine is free to integrate via a provider. The open option is ClearKey (W3C EME, supported in Shaka/Media3/Chrome but not by Safari/AVPlayer for HLS). With raw AES-128 HLS encryption or Media3 offline downloads using app-private encrypted storage, keys are deliverable only to authenticated members. That deters casual copying but does not provide hardware-backed protection.
  - For 2-minute mythology retellings with a free first chapter, signed short-lived URLs plus app-private encrypted offline storage is probably enough at first. Add Widevine/FairPlay through a multi-DRM vendor only if piracy becomes material.
- **Self-hosted streaming servers** (Owncast for live, PeerTube for federated VOD) do not fit a membership VOD app. Static CMAF on S3-compatible storage (MinIO, or an Indian cloud object store) behind a CDN with India PoPs is simpler.
- **7 pm weekly release:** pre-warm the CDN cache and publish the manifest JSON at release time via signed URLs and a feature flag.

### Gaps
- No primary citations were collected for media-tool licences, HEVC pool terms, AV1 hardware-decode share on Indian Android devices, or Compose Multiplatform video-player libraries. These need a follow-up pass.

## 6. App backend (BaaS, auth, billing, flags, analytics, push, i18n, CMS)

### Takeaway
A lean OSI backend is Supabase (Apache-2.0, self-hostable Postgres + auth + storage) or PocketBase (MIT, single binary) for the earliest stage, with Hyperswitch (Apache-2.0, by Juspay) or direct Razorpay/Stripe for payments and Lago (AGPL-3.0) or Kill Bill (Apache-2.0) for membership billing. Licence traps:
- Directus has moved to a "Monospace Sustainable Core License" (fair-source, not OSI).
- n8n is Sustainable Use.
- Zitadel, Unleash, Plausible and Lago are AGPL-3.0.
- PostHog, GrowthBook, Strapi, Tolgee, Langfuse, LiteLLM and authentik are open core (`ee/` proprietary).

### Cited Findings
- **Supabase** monorepo: Apache-2.0 — [supabase/supabase LICENSE](https://github.com/supabase/supabase/blob/master/LICENSE)
- **PocketBase**: MIT — [pocketbase LICENSE.md](https://github.com/pocketbase/pocketbase/blob/master/LICENSE.md)
- **Appwrite**: BSD-3-Clause-style ("Redistribution and use in source and binary forms...") — [appwrite LICENSE](https://github.com/appwrite/appwrite/blob/main/LICENSE)
- **Directus**: "Monospace Sustainable Core License, Version 1.0 (MSCL-1.0-GPL), Copyright 2026 Monospace Inc." It permits use for any "Permitted Purpose" other than a "Competing Use" (making the software available as a competing product or service). This is not OSI — [directus/directus license](https://github.com/directus/directus/blob/main/license)
- **Hasura** graphql-engine: Apache-2.0 root LICENSE, and LICENSE-community is MIT — [hasura LICENSE](https://github.com/hasura/graphql-engine/blob/master/LICENSE)
- **Keycloak**: Apache-2.0 — [keycloak LICENSE.txt](https://github.com/keycloak/keycloak/blob/main/LICENSE.txt); **Ory Kratos**: Apache-2.0 — [ory/kratos LICENSE](https://github.com/ory/kratos/blob/master/LICENSE); **Zitadel**: AGPL-3.0 — [zitadel LICENSE](https://github.com/zitadel/zitadel/blob/main/LICENSE); **authentik**: `authentik/enterprise/` under its own licence, website CC BY-SA 4.0, remainder MIT — [authentik LICENSE](https://github.com/goauthentik/authentik/blob/main/LICENSE)
- **Lago** billing: AGPL-3.0 — [getlago/lago LICENSE](https://github.com/getlago/lago/blob/main/LICENSE); **Kill Bill**: Apache-2.0 — [killbill LICENSE](https://github.com/killbill/killbill/blob/master/LICENSE); **Hyperswitch** (Juspay payments orchestrator): Apache-2.0 — [juspay/hyperswitch LICENSE](https://github.com/juspay/hyperswitch/blob/main/LICENSE)
- **Unleash**: the LICENSE file on `main` reads GNU AGPL v3 (verify, since Unleash was historically Apache-2.0) — [Unleash LICENSE](https://github.com/Unleash/unleash/blob/main/LICENSE); **GrowthBook**: open core, with specified directories under the GrowthBook Enterprise License — [growthbook LICENSE](https://github.com/growthbook/growthbook/blob/main/LICENSE); **Flagsmith**: BSD-3-Clause-style — [Flagsmith LICENSE.md](https://github.com/Flagsmith/flagsmith/blob/main/LICENSE.md)
- **PostHog**: `ee/` under ee/LICENSE, remainder "MIT Expat" — [PostHog LICENSE](https://github.com/PostHog/posthog/blob/master/LICENSE); **Plausible**: AGPL-3.0 — [plausible LICENSE.md](https://github.com/plausible/analytics/blob/master/LICENSE.md); **Umami**: MIT — [umami LICENSE](https://github.com/umami-software/umami/blob/master/LICENSE); **Matomo**: GPL-3.0 — [matomo LICENSE](https://github.com/matomo-org/matomo/blob/5.x-dev/LICENSE)
- **ntfy**: Apache-2.0 — [ntfy LICENSE](https://github.com/binwiederhier/ntfy/blob/main/LICENSE); **Gotify**: MIT — [gotify LICENSE](https://github.com/gotify/server/blob/master/LICENSE)
- **Weblate**: GPL-3.0 — [Weblate LICENSE](https://github.com/WeblateOrg/weblate/blob/main/LICENSE); **Tolgee**: multiple licences, with `ee/` and `/webapp/src/ee` under a separate licence — [tolgee LICENSE](https://github.com/tolgee/tolgee-platform/blob/main/LICENSE)
- **Payload CMS**: MIT — [payload LICENSE.md](https://github.com/payloadcms/payload/blob/main/LICENSE.md); **Strapi**: `ee/` under the Enterprise Edition licence, remainder open — [strapi LICENSE](https://github.com/strapi/strapi/blob/develop/LICENSE); **Decap CMS**: MIT — [decap-cms LICENSE](https://github.com/decaporg/decap-cms/blob/main/LICENSE)

### Inferences
- **Recommended now:**
  - Managed or self-hosted Supabase (Postgres, Auth with phone OTP, Storage, Row-Level Security) as the system of record for members, entitlements and the chapter manifest index.
  - Payload CMS (MIT, TypeScript, Postgres adapter), which fits the TS team, for editorial and scholar review workflows with draft/approve states that feed Temporal approval Signals.
  - Payments through Razorpay/Stripe directly, or self-hosted Hyperswitch (Juspay, Apache-2.0) for routing UPI, cards and international diaspora payments.
  - Entitlements kept in Postgres. Lago (AGPL, which is fine unmodified or internal) only when plans multiply.
  - Umami (MIT) for web analytics, or self-hosted PostHog (MIT core) for product funnels.
  - Flagsmith (BSD) or GrowthBook for flags. Tolgee or Weblate for 8+ languages.
  - ntfy is not a substitute for FCM/APNs on mobile, so push still needs FCM and APNs.
- **Later:** Keycloak or Zitadel only if SSO or B2B needs appear. Supabase Auth or Ory Kratos is enough before then.
- AGPL components (Lago, Plausible, Zitadel, Unleash) are safe to self-host unmodified. Network-use obligations apply only to modifications offered over a network.

### Gaps
- The Flagsmith, Tolgee and GrowthBook non-ee base licences were inferred from LICENSE excerpts rather than read in full.
- The Unleash licence change needs confirmation.
- Hyperswitch India readiness (RBI payment-aggregator rules, UPI Autopay mandates for recurring memberships) was not researched.

## 7. KMP-specific libraries

### Takeaway
Licences and versions for the KMP-specific libraries were not fetched this session.

### Cited Findings
- None collected this session.

### Inferences (prior knowledge, not re-verified)
- Ktor (Apache-2.0), SQLDelight (Apache-2.0), Koin (Apache-2.0), Coil 3 (Apache-2.0, multiplatform since 3.0) and kotlinx-serialization (Apache-2.0) are all OSI.
- **Video in Compose Multiplatform:** use expect/actual wrappers around Media3 ExoPlayer on Android and AVPlayer on iOS. The community multiplatform players (for example "ComposeMediaPlayer" and "KMP video player" projects) vary in maturity.
- Media3's DownloadManager gives offline downloads on Android. The iOS equivalent is AVAssetDownloadURLSession for HLS.

### Gaps
- No verified licences, current versions or maturity data for the KMP libraries or Compose Multiplatform video-player projects. This needs a follow-up pass.

---

### Recommended lean stack (2–5 people): synthesis of the above

| Layer | Now (month 0–6) | Later (when needed) |
|---|---|---|
| Orchestration | Temporal TS SDK (Temporal Cloud or a small self-host), or Hatchet (MIT, Postgres) if simpler ops matter more. Ledger reservation Activity + content-hash idempotency + approval Signal | Self-host Temporal in India on Postgres |
| Serving | ComfyUI (GPL-3.0) headless for diffusion; vLLM/SGLang for LLMs; LitServe/BentoML for TTS/ASR; LiteLLM (MIT core) as the gateway with budgets | Kubernetes + KEDA autoscaling; Triton/TensorRT-LLM for heavy throughput |
| GPUs | E2E L4/L40S on-demand and A100/H100 spot; Krutrim/JarvisLabs H100 for finals; apply to IndiaAI | Reserved Indian capacity (Krutrim 1-year at ₹173/hr, or Yotta contracts) |
| GPU launch | SkyPilot (Apache-2.0) or dstack (MPL-2.0) | Kubernetes cluster |
| Observability | OpenTelemetry + self-hosted Langfuse (MIT core) in India; promptfoo (MIT) in CI | Opik/Inspect for deeper evals |
| Media | FFmpeg + SVT-AV1/x264; Shaka Packager CMAF HLS/DASH; WebVTT; S3-compatible storage + CDN | Multi-DRM vendor (Widevine/FairPlay) if piracy matters |
| Backend | Supabase (Apache-2.0); Payload CMS (MIT); Razorpay/Stripe or Hyperswitch (Apache-2.0); Umami/PostHog; Flagsmith; Tolgee/Weblate; FCM/APNs | Lago/Kill Bill billing; Keycloak/Zitadel |
| Avoid (OSI-strict policy) | n8n (Sustainable Use), Inngest (SSPL), Restate (BSL, though permitted for own use), Phoenix (ELv2), Directus (MSCL fair-source) | |
