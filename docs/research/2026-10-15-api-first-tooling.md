# API-first tooling and positioning (15 Oct 2026)

This report answers the founder's direction of 15 Oct 2026: data stays ours, generation goes through hosted APIs, and we self-host nothing unless there is no alternative. It synthesises five notes in `docs/research/notes-2026-10-15-api-first/`:
- `hosted_keyframes_video.md`
- `hosted_voice.md`
- `code_video_tooling.md`
- `3d_worlds.md`
- `positioning_landscape.md`

Per-second video prices come from `docs/research/notes-2026-10-15-open-source/paid_offerings_and_gulab.md`.

**Provenance.**
- **Verified:** the vendor's own page was fetched on 15 Oct 2026.
- **Third-party:** a snippet, reseller, aggregator or competitor. Check before budgeting.
- **Inference / my arithmetic:** reasoning, not a source.

Prices are list USD. FX is assumed at about ₹85/$.

## 1. Summary

**Google is the spine of an API-first stack.** It is the only vendor that both:
- states, and on Vertex contracts, no training on inputs, and
- covers keyframes (Nano Banana Pro), image-to-video with first/last frame and references (Veo 3.1), and TTS/STT fallbacks.

The other pieces:
- **fal** supplies the one thing Google lacks, a custom style LoRA. Its training set holds no script text, so fal's weaker terms are tolerable there.
- **Narration** stays on **Sarvam**, with **ElevenLabs v4** as the fallback. This is where rule 5 bites hardest, because a TTS call carries the whole unreleased script.
- **Assembly** stays in our TypeScript compiler, emitting **Remotion**.

Two things cannot be bought as an API:
- metrical Sanskrit chant, which needs Vāgdhenu or a human, and
- an exportable, citable world from an interactive "world model". Only Marble exports.

**Cost, on my arithmetic: about $35–45 per chapter (≈ ₹3,000–3,800), drafts included.** The breakdown is in §9.

| Stage | Primary | Fallback | Price | Rule 5 verdict (no training on unreleased scripts) |
|---|---|---|---|---|
| Shot spec / plan | Claude in session (Claude Code + Remotion skills) | Anthropic API, JSON-schema output, ledgered | $0; ~$1–3 per chapter via API (inference) | **Pass.** No training by default ([Anthropic](https://support.anthropic.com/en/articles/7996868-is-my-data-used-for-model-training)). Retention unverified. |
| Style LoRA | fal `flux-lora-fast-training`, `is_style: true` | Replicate trainings | ~$2 per run, verified ([fal](https://fal.ai/models/fal-ai/flux-lora-fast-training)) | **Conditional.** fal has no ZDR or DPA, and its §6(c) "Usage Data … AI models" clause is flagged. OK only because the payload is rights-cleared relief photos. |
| Character sheets, keyframes | Nano Banana Pro (Gemini API paid tier or Vertex) | FLUX.2 [pro] on Together; Seedream 4.x; FLUX-dev + our LoRA on fal | $0.134 / $0.03 per image, verified ([Together](https://www.together.ai/pricing)) | **Google: pass** ([Vertex data governance](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/data-governance)). **Together and BFL: unknown.** Visual prompts only. |
| Keyframe fixes | Qwen-Image-Edit-Plus or FLUX Kontext | — | $0.03–0.04 | Unknown. Visual only. |
| Draft image-to-video | Veo 3.1 Lite, 720p | Wan 3.0, 480p, on Runware or fal | $0.05/s, verified | Google: pass. Runware states uploads are "not … used for training" (verified). **H3 Turbo ($0.025/s) is `india_only` per the 4 Oct decision.** |
| Final image-to-video | Veo 3.1 Fast: `image` + `lastFrame`, or 3 references; 8 s, 9:16 | Kling 3.0 Omni (O3) Elements | $0.10–0.12/s verified; Kling ~$0.084–0.14/s third-party | Google: pass. **Kling: unknown.** |
| Narration, 9 languages | Sarvam Bulbul v3 | ElevenLabs v4, with a consented Professional Voice Clone (PVC) | ₹30 per 10k chars; ElevenLabs ~$0.10 per 1k chars for v3-class (third-party; v4 unpriced) | **Strictest stage.** Sarvam opt-out pending. ElevenLabs: opt-out toggle (third-party says prospective only) or Enterprise Zero Retention Mode (ZRM). |
| STT round-trip | Saaras v4 **and** Scribe v2 | Gemini Transcribe as tiebreak | Saaras ₹30/h; Scribe unpriced | Sarvam pending. Scribe not researched. Gemini paid: pass. |
| Śloka chant | Human reciter, or Vāgdhenu (CUDA) | — | Fee; GPU-minutes | n/a. **Collides with "no self-hosting"** (see §5). |
| Music | Recorded or procedural tanpura; human score | ElevenLabs Music on terms that cover our use | — | Self-serve reportedly excludes film and TV (third-party). |
| Assembly, captions, AI label | TS compiler → Remotion → Lambda | Rendi (FFmpeg API); Shotstack | ~$0.02/min; Shotstack 10–20¢/min (verified) | Remotion runs on our infra. **Shotstack and Rendi terms not read.** |
| Relief plates (optional) | Compiler → `bpy` → headless Blender on Modal L4 or L40S | — | $0.80–1.95/h, verified | n/a. Our code on rented compute. |
| C2PA | c2pa-rs + SSL.com trust-list certificate | — | Free tier | n/a |
| Delivery | Mux, plus the signed MP4 in our storage | — | Free baseline; $0.0008/min after 100k min | Released media |
| 3D world | World Labs Marble API, exporting PLY/GLB | WorldMirror on a third-party host | $0.12–2.50 per world; GLB $2.80, verified | Unknown. Visual references only. |
| 3D props | Hunyuan3D v3.1 or TRELLIS 2 on fal | Meshy, Tripo | $0.225–0.375 per asset | Unknown. Visual only. |

**Rule 5 should classify the payload, not just the provider.** The payloads differ in kind:
- Image, video and 3D calls carry short **visual descriptions**.
- TTS calls carry the **entire unreleased script** in nine languages.
- LLM calls, if any, carry **passages and canon**.

§8 turns this into a registry.

## 2. "GPU via Google, Together, Fireworks?"

**None of these is a GPU decision.** Each is a hosted model catalogue. Under API-first we rent no GPUs for generation, with two exceptions:
- Blender plates (optional), and
- Vāgdhenu.

| Platform | What it offers for media | Verdict |
|---|---|---|
| **Google** (Gemini API paid tier; Vertex, now "Gemini Enterprise Agent Platform") | **Veo 3.1, Fast and Lite** ([docs](https://ai.google.dev/gemini-api/docs/veo), verified):<br>• 9:16; 4, 6 or 8 s clips<br>• 3 reference images<br>• `image` + `lastFrame` interpolation<br>• 7 s extensions<br>• 4K on 3.1 and Fast<br>**Nano Banana Pro:** 6 object, 5 character and 3 style references ([docs](https://ai.google.dev/gemini-api/docs/image-generation), verified).<br>**Also:** Gemini TTS, Chirp 3 HD, Transcribe.<br>**No LoRAs and no open models.** | **Primary; strongest terms.**<br>Vertex: "won't use your data to train or fine-tune … without your prior permission". Paid Gemini API: "not used to improve products". Caching can be disabled (`disableCache`), and logging is off by default.<br>**Caveats:**<br>• The governance page doesn't name Veo or Imagen.<br>• Veo in Mumbai (asia-south1) is unconfirmed.<br>• **AI Studio counts as unpaid**, and Google may train on unpaid use, even on paid accounts outside the EEA, CH and UK ([Willison, 2024](https://simonwillison.net/2024/Oct/17/gemini-terms-of-service); recheck). Pipeline keys must be paid-API or Vertex. |
| **Together AI** | Cheap per-image catalogue (verified):<br>• FLUX.2 [pro] $0.03<br>• Nano Banana 2 $0.05<br>• Qwen Image 2.0 $0.04<br>• Imagen 4 $0.02–0.06/MP<br>• Seedream 4.0 $0.03/MP<br>Per-clip video from $0.115 (Seedance 2.5).<br>FLUX LoRA path **deprecated**; no image fine-tuning (third-party). | **Volume keyframes only.** No data statement on the page. |
| **Fireworks AI** | **No image or video models listed**: text, embeddings, fine-tuning and GPUs only ([pricing](https://fireworks.ai/pricing), verified). | **Irrelevant for media.** |
| **fal** | Broadest aggregator. FLUX LoRA training $2 per run (verified), LoRA URL passed at inference. Wan LoRA $0.005/step (third-party). | **The LoRA host.** Weak terms, so non-sensitive payloads only. |
| **Replicate** | Hardware-second trainings (H100 $0.001525/s). API data **deleted after 1 h** (verified). Stale pricing page. | **LoRA fallback.** Good retention; no training statement. |
| **Runware** | Qwen-Image-2.1-Turbo $0.014; Wan 3.0 480p $0.05/s. LoRA training and model upload. "Custom models and content you upload … are not … used for training" (verified). EU and US residency. | **Best-stated aggregator terms.** Confirm LoRA upload. |

**If GPUs are ever needed:**
- **Modal:** L4 ~$0.80/h, L40S ~$1.95/h. All inputs route through a Virginia control plane (third-party), and there is no India region.
- **Comfy Cloud:** hosts a node graph as an API. H100 $6.23/h; LoRA import from the $35/mo plan. No data statement.

Generation is asynchronous, so region barely matters.

## 3. Keyframes and consistency

Our figures are identified by costume, weapon, vāhana and posture, never by face (rule 1). That suits reference-based models, and it makes face-ID adapters unnecessary. The InsightFace-based adapters are also non-commercial.

| Model | References per call | Basis | Note |
|---|---|---|---|
| Nano Banana Pro | 6 object + 5 character + 3 style | Verified | SynthID on all outputs. 9:16 unconfirmed. |
| FLUX.2 [pro] | ~8–10 | Third-party | US and EU endpoints. BFL terms not found. |
| Seedream 4.5 | 6, 9 or 14 (sources conflict) | Third-party | 2K–4K |
| Runway gen4_image | 3, @-tagged | Third-party | **Standard Runway terms reportedly license inputs for training. Enterprise only.** |
| Qwen-Image-Edit-Plus | 1–3 | Third-party | ~$0.031; for fixes |
| Veo 3.1 / Fast (video) | 3 references (8 s clips only); first/last frame | Verified | **Lite: no references, no extension** |
| Kling 3.0 Omni (O3) (video) | Elements of ≤4 images each, plus 7 raw references; 3–15 s | Third-party | Parameters vary by reseller |

Other models:
- Midjourney has no API, and its ToS bans automation.
- Ideogram Character is single-reference and face-centric.
- Recraft's style API is unconfirmed.

### Recommended five-step workflow

1. **Asset bible.**
   - 20–40 rights-cleared relief photos under raking warm light. Sources: our own photography (Belur, Halebidu, Ellora), commissioned work, or CC0 museum images.
   - Plus a fixed style block: "carved basalt high relief, single oil-lamp raking light from frame-left, near-monochrome, chisel marks, medium-wide".
2. **Style LoRA** on fal (`is_style: true`, ~$2).
   - The file is ours and portable to Runware or Comfy Cloud.
   - A Wan LoRA (~$2) would also lock style on the *video* side, which closed models can't.
   - **Caveat:** LoRA inference runs on FLUX [dev]-family endpoints. Nano Banana and FLUX.2 [pro] apparently take no custom LoRA, so style reaches Google as **style reference images**.
3. **Faceless character sheets.** A 3-view turnaround plus a weapon sheet for each recurring figure:
   - Abhimanyu: chakra-ring armour, sword and shield, broken wheel later.
   - Droṇa: elder, bow, matted hair, sacred thread.
   - Hanumān: mace, tail; back or ¾ view only.
   - Deities as back, silhouette or symbol only.
   - Costume details carry `claim:` ids. Sheets are human-approved and committed as canon assets.
4. **First/last keyframes.**
   - Nano Banana Pro with ≤3 style references, ≤5 character sheets and a location plate. FLUX.2 pro or FLUX-dev + LoRA is the cheap route.
   - Make a last frame for pushes: same composition, tighter crop.
   - Fix with Qwen-Image-Edit-Plus or Kontext.
5. **Image-to-video.**
   - Drafts on Veo 3.1 Lite or Wan 3.0 (rule 6).
   - Finals on **Veo 3.1 Fast `image` + `lastFrame`**. Interpolating between two approved stone frames is the strongest guard against style drift. Use 3 asset references for figure-heavy shots instead. Kling O3 is the fallback.
   - **Unconfirmed:** whether Lite accepts `lastFrame`.

Rule 3 applies at every step: each row, with its reference-asset ids, is ledgered before the call. That makes consistency auditable.

**Why not Google alone.** It has the cleanest terms but no trained style. Script-derived prompts go only to Google; only public relief photos go to fal.

### Content-policy risks

- **Deities.** No vendor was found to ban Hindu deity depictions. Google's policy has no religion clause and exempts "educational, documentary, … artistic" uses ([policy](https://policies.google.com/terms/generative-ai/use-policy), verified).
- **Violence.** Kling reportedly rejects "realistic weapons fire, blood, or physical impact" with a generic error (third-party).
  - Keep the planner's vocabulary non-graphic: dust, a fallen wheel, implied impact.
  - Ledger every refusal.
- **Age.** Veo image-to-video and reference modes allow only `allow_adult`. Abhimanyu is 16, so describe **carved figures**, not "a teenage boy".
- **Audience offence is the bigger risk.** Nepal's Department of Archaeology has issued a notice against AI deity imagery (third-party). Rules 1 and 9 carry this risk.

### Test first

- A 3-shot bake-off: one figure, one formation, one deity-adjacent (§9).
- A 10-prompt red-team per vendor.
- **Stone texture through image-to-video is untested on every model.** It is the biggest unknown in this section.

## 4. Video from code

**Our TS compiler stays the source of truth.** It already turns a strict Ajv shot contract into deterministic output. API-first changes what the compiler calls, not what it owns.

- **Remotion: assembly and overlay.** Captions, the citation lower-third, the burned-in AI label, title cards, and Ken Burns moves on keyframes.
  - **Licence wording differs.** It is free for companies "of up to 3 people" ([remotion.pro](https://www.remotion.pro/license)), but LICENSE.md says "up to 3 employees". Founders and contractors may count differently, so get Remotion's reading in writing.
  - At 4+ people, budget **Automators ($0.01 per render, $100/month minimum)**, or retarget to Revideo (MIT).
  - Lambda costs ~$0.02/min (third-party summary) but has **no GPU**, so it is not for lamp-lit relief.
  - Remotion's official Claude Code agent skills are the most mature LLM-video tooling. Skill count and agent list are third-party claims.
- **Hosted assembly: fallback only.**
  - **Rendi** (FFmpeg API, from $25/mo, billed per GB) runs *our* filtergraph and ASS.
  - **Shotstack** (10–20¢/min, 1080×1920 via `output.size`) is fine **without** its auto-transcribed `rich-caption`. That feature would replace cited text with an ASR guess and break rule 2.
  - Creatomate deletes renders after 30 days.
  - No vendor's terms were read.
- **Blender for the relief look.**
  - Path: compiler → `bpy` → headless Cycles on Modal.
  - A full 2,880-frame chapter is an estimated **$3–10** on an L40S at 2–6 s per frame (inference).
  - Better: render only **hero keyframes or short plates** (13–50 frames, cents) and let Veo animate them. The ID mask then becomes a code-level "no deity face" check.
  - Optional. Do it only if the bake-off shows diffusion keyframes drifting.
  - A Blender Lab MCP server is reported (third-party, unconfirmed on blender.org). It belongs in session, not in production.
- **Indic captions are a real risk.**
  - libass without HarfBuzz mis-renders "all Indic languages" ([Arch FS#38249](https://bugs.archlinux.org/task/38249)).
  - FFmpeg's `subtitles` filter historically forced the simple shaper ([#8738](https://ffmpeg.org/pipermail/ffmpeg-trac/2020-June/054649.html)).
  - No hosted vendor documents Indic shaping. Chromium in Remotion should shape correctly (inference, untested).
  - Add **CI golden-image tests** for Devanagari, Tamil, Telugu, Kannada, Bengali, Malayalam, Gujarati and IAST.
  - Timings come from aligning **our cited text** to the narration, never from transcription.
- **C2PA signing order.**
  - Burn the label in at assembly. Sign the **final** MP4 with c2pa-rs as the last step, with an AI-generated assertion plus chapter id and contract hash. Use a certificate from the official trust list, which replaced the interim list on 1 Jan 2026; SSL.com has a free tier.
  - **Signing and then letting Mux transcode is wrong.** The transcode strips or invalidates the manifest.
  - Either deliver the signed MP4 **unmodified** as the canonical file, or **re-sign** each rendition. Treat HLS as unsigned, pointing to the signed master.
  - c2pa-rs MP4 signing was not verified first-hand.
- **Spec writing: in session or via an LLM API?**
  - Frontier models tie at about 96% on SWE-bench Verified, and sources conflict on order. The deciding factors are JSON-schema output, Remotion and `bpy` familiarity, and terms.
  - Anthropic, OpenAI and paid Gemini don't train by default. Gemini free tier and AI Studio do.
  - **Recommendation: keep contract authoring in session**, as CLAUDE.md requires. Use the API only for bulk, repeatable steps: VLM scoring of keyframes against `forbidden`, and caption alignment.
  - For anything canon-bearing, the LLM emits **data**, not scene code, so the claim test can validate it.
- **If the pipeline calls an LLM API**, these changes are needed (carried into §8):
  1. Drop "no Anthropic key in the pipeline"; read the key from the environment (rule 8).
  2. Ledger every call before the request, with model, prompt hash and cost (rule 3).
  3. Commit outputs with model, version, temperature and prompt hash, and keep human or in-session sign-off.
  4. Add a terms-registry test (rule 5).
  5. Add a dated `docs/decisions.md` entry.

## 5. Narration and voice

| Provider | Verdict | Why |
|---|---|---|
| **Sarvam** (Bulbul v3; Saaras v4) | **Primary narrator and primary STT** | Cheapest (~₹4.5 per 1,500-character track), India-native, already integrated. **No cloning.**<br>Saaras evidence is mixed. v3 scores 3.69% Hindi OI-WER on one leaderboard (from search; the page didn't load). A small independent repo finds **v4 worse than v3** on fresh Hindi, 23.8% vs 21.0% ([logatra](https://github.com/Nemukai/logatra-benchmark)).<br>Opt-out pending. |
| **Fish Audio Drama 3** | **en-IN candidate only; blocked for unreleased text until API terms are read** | Released 13 Oct 2026. Weights under the Fish Audio Community License v1.0 ([blog](https://fish.audio/blog/fish-audio-drama-3/)):<br>• free commercially below **US$500k annual revenue**<br>• no reselling as a hosted service<br>• no cloning without consent<br>Self-hosting was the rule-5-safe route, which we are dropping.<br>Hosted `drama-3`: $50 per 1M chars ($10 until 12 Nov). Third parties price per UTF-8 byte, which **≈3× the cost for Indic scripts**.<br>"83 languages" but **no list; Indic unconfirmed**. No phoneme control or timestamps. Its 93.2% pronunciation score is vendor-reported, almost certainly non-Indic. |
| **ElevenLabs v4** | **Fallback narrator; the cloning route; Scribe v2 as STT cross-check** | v4, v4 Turbo and v3 list all eight Indic targets. v2 and Flash list only hi/ta ([models](https://elevenlabs.io/docs/overview/models), verified).<br>Phoneme tags only on English-only `eleven_flash_v2`. v4 reads "/IPA/" in slashes, **untested in Indic script**. `.PLS` dictionaries support alias and phoneme rules.<br>v3/v4 ignore `<break>`, so pauses come from text splits.<br>v4 price not found. ZRM is Enterprise-only. |
| **Bland.ai** | **Drop** | A phone-agent company. `btts-3` is a call voice with no Indic list and no dictionary. Its pricing pages conflict. |
| Google Chirp 3 HD / Gemini TTS | Second fallback for hi/ta | ~$30 per 1M chars; IPA in 26 of 53 locales (third-party). Google terms. |
| Cartesia | Blind test only | Indic support claimed, but one review says its quality pass skipped Indic (conflicting). |

Not evaluated: Azure, Hume, Smallest.ai, Murf, Inworld, MiniMax Speech, Resemble, AssemblyAI.

### Cloning vs stock Sarvam (decision for Avi)

- **Stock Sarvam:** one voice per language. Cheapest, but there is no single Dheevara voice.
- **Cloned narrator:** a consented ElevenLabs PVC of a cast narrator gives one voice in nine languages at ~3× cost (still ~$3 per chapter) and moves the primary to ElevenLabs. Cross-lingual accent quality and the PVC consent flow are untested.
- **Positioning angle:** a **named, paid, credited** narrator also answers the labour objection (§7). An anonymous clone feeds it.

### Pronunciation lexicon from the canon

Each canon name gets a lexicon entry: **name → IAST → IPA → per-language respelling**. `src/voice` compiles it per provider:
- **Sarvam:** respelling dictionary, **≤100 words**, chosen per chapter.
- **ElevenLabs:** `.PLS` aliases plus inline `/IPA/` for v4.
- **Chirp:** IPA tags.

The same list feeds STT keyterms: Saaras ≤50, Scribe ≤1,000.

### STT round-trip with two engines

- Transcribe every render with **Saaras v4 and Scribe v2**, and diff both against the script.
  - Flagged by both: an error.
  - Flagged by one: human review.
  - Gemini Transcribe is the tiebreak.
- **Hard-alert on negation tokens** (न, नहीं, मत, "not", and their equivalents in each language). A dropped negation inverts a cited claim.
- Scribe's word timestamps, mapped onto our cited text, can time captions.
- There is no independent non-Hindi WER for any hosted engine. Scribe's terms were not researched.

### Chant stays Vāgdhenu or human

- **No hosted API chants Sanskrit in metre.** No Sanskrit on ElevenLabs, Sarvam or Fish; no `sa-IN` in Bulbul; no laghu/guru control in music models. Vāgdhenu exists only as an HF Space demo (10 chants a day), with no API.
- Rule 7 stands. Under no-self-hosting:
  - **default to a human reciter**, which is also a credit, or
  - keep `services/vagdhenu/` as the **one sanctioned GPU service**, run on demand for a few ślokas per chapter.
- Its corpus is reported CC BY 4.0 (third-party; verify on HF).
- The "Su-shroota" recogniser could serve as the chant check, if its weights are released.

### Music

- Tanpura: recorded or procedural.
- Score: a human composer, or ElevenLabs Music. Music is described as trained on licensed data, but **self-serve reportedly excludes film and TV**, so go Enterprise or read the terms first.
- Suno, Udio and Stable Audio were not researched.

### Cost per chapter

| Route | One language (≈1,500 chars, draft + final) | Nine languages |
|---|---|---|
| Sarvam | ~₹9, plus ~₹1 STT | **~₹90 (~$1)** |
| ElevenLabs | ~$0.30, plus Scribe | **~$2.7** |

Both are negligible next to video.

### Blind test

- One fixed 1,500-character, name-dense script per language (e.g. the Jayadratha passage).
- Render on Sarvam, ElevenLabs v4 (stock, plus a PVC if one exists), Chirp 3 HD and Cartesia; Fish for en-IN only.
- Native listeners rate it blind.
- Names checked by STT round-trip plus a human.
- **Pass bar:** zero negation errors, and ≤1 name error per 1,500 characters after the lexicon.

## 6. 3D worlds with LLMs

**What exists.** The products split cleanly in two:
- **Persistent, exportable 3D: World Labs Marble** is the only one with a public, priced API (since 21 Jan 2026; [pricing](https://docs.worldlabs.ai/api/pricing), verified).
  - Draft world ~$0.12–0.20. Full world ~$1.20–2.48.
  - **PLY splat export free.** GLB $2.80.
  - Inputs: text, image, multi-image or video.
  - The page is silent on commercial rights and rate limits.
  - Open-weight alternatives: Tencent HunyuanWorld-Mirror (reconstruction) and Voyager (~80 GB VRAM, conditional licence, territory clauses unread).
- **Interactive world models are frame generators with no export.** Genie 3 (Labs only, Ultra subscribers, 60 s at 720p, no API), Runway GWM-1 (API promised), HY-World 1.5, Odyssey and Decart.
  - Each session re-imagines the scene, so they cannot hold `claim:`-cited details or run on cheap phones.
  - **Watch them; don't adopt them.**

**Props APIs.**
- Hunyuan3D v3.1 on fal: $0.225 (Rapid) or $0.375 (Pro), plus $0.15 for PBR.
- TRELLIS 2 on fal: $0.30. fal silently dropped a parameter, so validate request schemas ([3DStreet](https://github.com/3DStreet/3dstreet/pull/2075)).
- Meshy and Tripo: ~$0.10–0.60, with auto-rig. Rodin: $0.50+.
- All export GLB. Most prices are third-party and conflict.
- A 30-prop canon library costs **under $50**.
- Expect Western bias in chariots and weapons. Generate from approved relief-style art, with a `claim:` and a scholar check per prop.

**How the LLM fits.** Claude writes the **data and the deterministic loader**, not the world:
- **`content/<chapter>/scene.json`:** rings, gates, warriors and entry points, each with a `claim:` checked in session against the critical edition. The rule-2 claim test validates it.
- **Camera paths as data** at witness eye height. A test checks camera positions against tagged deity volumes, which puts rule 1 into code.
- **A three.js r179+ page with Spark** that loads the Marble splat and instances GLB props from a manifest.

No API key is needed, which matches the current "planning in session" rule.

**Delivery with the Spark splat viewer.**
- Spark is WebGL2. Its docs budget ~1–2M splats on Android ([perf](https://sparkjs.dev/docs/performance/), verified).
- Spark 2.0 adds LoD streaming and the `.RAD` format. SPZ is ~10× smaller than PLY.
- For ₹8–10k phones, target **300–500K splats at SH0, ~5–10 MB** (inference).
- Fall back to the Marble pano or an MP4.
- In the app, host the page in a WebView.

**World → video.**
- Render a fixed camera path through the splat at 480p, then restyle it with **Runway Aleph 2.0** guided by one approved style frame.
  - Aleph keeps camera and motion. Extreme restyles drift. Clip limits conflict (2–30 s vs ~5 s).
  - The result is identical geography in every chapter.
- **Caveats:**
  - Aleph is unpriced.
  - **Runway's standard terms reportedly allow training on inputs**, so send renders only, or use Enterprise.
  - Stability on splat floaters is untested.

### One-week chakravyūha prototype

| Day | Work | Cost |
|---|---|---|
| 1 | Claude drafts `content/chakravyuha/scene.json` from the critical-edition Droṇa Parva, with a `claim:` per item. Decision entry. | $0 |
| 2 | Ledger first. 3–5 Marble drafts from a relief-style image; one full world; PLY export; SPZ/RAD at SH0, ≤500K splats. | ~$2.50 |
| 3 | 6–8 GLB props on fal (ratha, dhvaja, soldier silhouette, elephant, bow, conch); Draco; instanced silhouettes. | ~$3 |
| 4 | `web/chakravyuha-3d.html`: Spark backdrop, rings from data, one warm light, stone shader, witness camera with the deity-volume test. | $0 |
| 5 | Tap a gate for its holder and citation; scrub Abhimanyu's advance using `web/chakravyuha.html` data; MP4 fallback. | $0 |
| 6 | Low-end Android (WebView and Chrome) and iPhone: load time, fps, memory. | $0 |
| 7 | 10 s camera path through Aleph vs text-to-video. Go/no-go in `docs/decisions.md`. Upload to "Dheevara — Build Output". | Aleph unpriced |

### Risks

- **The AMD–World Labs report is unverified.** A single secondary source ([beri.net](https://www.beri.net/article/amd-world-labs-acquisition-marble-world-api-continuity-world-model-hardware-lock-in)) reports a 28 Sep 2026 deal worth ~$8.2B, with no word on the API. The same source cites ToS clauses allowing assignment without consent (§12.7) and termination for convenience (§11.2(a)).
  - **Mitigation:** own every export, and never call World Labs at runtime.
- Marble output rights are unstated.
- World Labs, fal and Runway training terms are unchecked, so send visual inputs only.

## 7. Positioning

**The empty cell.** Plot the field on two axes, sourced vs unsourced and long-form vs micro:
- **Sourced, long-form:** Ami Ganatra, Pattanaik, *Suno Mahabharata*, Bala Vihar.
- **Unsourced, long-form:** JioHotstar's AI Mahabharat, ZEE5 × Historyverse, Mythik.
- **Unsourced, micro:** Kuku TV, AI deity Reels.
- **Sourced, micro: empty.**

On the second axis pair, literary vs devotional × education vs entertainment, the textual voices code as nationalist ("debunking") or liberal-interpretive. **Neutral, cited, cinematic and under two minutes is the white space.**

Nobody uses "cited", "witness" or "check it yourself". The placements are the researcher's judgement.

### Three lines

- **A. Trust: "The epics, as the text tells them."** Every line cited, tap for the verse.
  - Pros: owns the empty cell, answers AI slop, works across ideologies.
  - Cons: can sound pedantic. Compare on sourcing, never on AI ("you use AI too").
- **B. Witness: "Stand beside the story."**
  - Pros: distinctive, already the splash line, answers the sanctity objection.
  - Cons: abstract until seen, and it competes on craft against bigger budgets.
- **C. Reveal: "What many heard. What the text says."**
  - Pros: built on the unique mechanic, shareable, strongest for the film window.
  - Cons: highest political risk, and it can slide into "debunking".

**Recommendation:**
- **A** is the umbrella.
- **C** is the campaign layer, for share cards and the *Ramayana* release on **6 Nov 2026, three weeks away**.
- **B** is the brand line.
- Test A against C separately with diaspora parents and urban-India adults.

API-first reinforces the rule: **never lead with "AI"**. Disclosure stays compliant.

### New competitors

- **ZEE5 × Collective Studios' Historyverse.** Six "AI-driven" originals in **seven Indian languages**, announced 21 Jul 2026: *Garud*, *Shiv Sati*, *Tirupati Balaji*, *Vikram Betal* and two others. Devotional melodrama, no sourcing claim, no dates ([Eastern Eye](https://www.easterneye.biz/the-biggest-ai-bet-in-indian-streaming-is-built-on-hindu-mythology/)).
  - **Regional languages are no longer a moat on their own.** The defensible bundle is language **plus** chanted śloka **plus** a citation per line.
- **Collective Artists Network** now supplies AI mythology to two OTTs, plus *Chiranjeevi Hanuman* (release unconfirmed). It is the "AI spectacle" foil, and a possible later licensee of a cited canon.
- **Mythik** features "Ram: The First Trial" for the film window, under "for the whole family". It self-claims 3.7M members and **makes no research claim on its site** ([mythik.com](https://www.mythik.com/)).

### AI-backlash triggers

There are two strands:
- **Sanctity:** the Karni Sena complaint against Rinku Singh's AI deity reel; the "cringe" AI Krishna in *Kyunki Saas Bhi Kabhi Bahu Thi 2* after *Naagin 7*.
- **Labour:** "sabka rozgar cheen rahi hai" (she is taking everyone's jobs); the filmmaker backlash to *Chiranjeevi Hanuman*.

Answers:
- The witness rule and faceless deities answer sanctity.
- **Visible human credits** (scholar, reciter, narrator, art director) answer labour.
- GitaGPT clones showed partisan bias, so never voice a deity or give advice.

The evidence is anecdotal. No survey was found.

### Diaspora price anchor

- Chinmaya Bala Vihar costs **$300 per child to $750 per family per year** (2025–27 centre forms). That is 8–19× the planned $39.
- This supports **$49–69 family pricing**, framed as "less than a month of Bala Vihar".
- In India, ₹999 may read as cheap. ₹1,499–1,999 sits between ACK and Mythik.
- Run 10–15 parent interviews before launch.

## 8. What changes in our rules and decisions (proposed, for Avi)

Nothing below is enacted. Each would become a dated `docs/decisions.md` entry if Avi agrees.

1. **Decision: API-first generation.**
   - No self-hosted model inference.
   - `docs/research/2026-10-15-open-source-stack.md` becomes the fallback and cost benchmark.
   - Named exceptions: Vāgdhenu (rule 7), and optionally headless Blender on rented serverless GPU (our code, not a model).
   - Reason: founder direction; team size; ~$35–45 per chapter is affordable.
2. **Rule 4: reword, don't delete.**
   - "Self-hosted H3" is moot, but **the 4 Oct decision keeps hosted H3 `india_only`**, so the $0.025/s draft route stays barred from worldwide contracts.
   - Proposed wording: *"Any model whose licence restricts territory (MiniMax H3, hosted or self-hosted; Hunyuan family) is tagged; a `worldwide` contract routed to it throws."*
   - The `assertTerritory` test stays.
3. **Rule 5 stands and becomes a provider-terms registry**, e.g. `src/providers/terms.json`.
   - Each endpoint records: training on inputs (`no` / `opt_out_set` / `unknown` / `yes`), retention, source URL and date read.
   - Each call declares a payload class: `script_text`, `visual_prompt` or `public_asset`.
   - A test rejects:
     - `script_text` to anything not `no` or `opt_out_set`, and
     - any call to `yes`.
   - Immediate actions:
     - Sarvam and ElevenLabs opt-outs (or ZRM).
     - Gemini keys on paid API or Vertex only, never AI Studio.
     - Read terms for fal, Together, Kling, Fish, World Labs, Shotstack and Rendi.
     - Runway only under Enterprise.
4. **Rule 7 stands.** Default to a human reciter. Vāgdhenu is the one on-demand GPU service.
5. **Anthropic key in the pipeline: only if adopted.** If bulk LLM steps (VLM QC, alignment) move to the API:
   - Supersede "no Anthropic key in the pipeline" in CLAUDE.md.
   - Read the key from the environment (rule 8).
   - Ledger each call before the request (rule 3).
   - Commit outputs with model, version and prompt hash.
   - Keep in-session or human sign-off.
   - Default: spec writing stays in session.
6. **Rule 3 scope.** The ledger also covers LLM, STT, 3D and assembly-API calls.
7. **Assembly.**
   - Remotion as the compiler target; revisit at headcount 4.
   - C2PA signs the final MP4 last. Transcoded renditions are re-signed or declared unsigned.
   - No vendor auto-captions (rule 2).
8. **Voice:** stock Sarvam, or a consented, credited cloned narrator on ElevenLabs.
9. **Pricing hypothesis:** $49–69 family in the diaspora, and ₹1,499–1,999 in India, against $39 / ₹999.

## 9. First experiments, ranked

Ranked by what unblocks the stack or is time-boxed by the film window. Costs are list-price arithmetic.

| # | Experiment | Decides | Cost |
|---|---|---|---|
| 1 | **Terms sweep.** Fill the rule-5 registry; turn on the Sarvam and ElevenLabs opt-outs; confirm Gemini paid or Vertex keys. | Who may receive script text | $0, ~1 day |
| 2 | **Keyframe bake-off.** 3 shots × first+last × 3 tries on Nano Banana Pro, FLUX.2 [pro], Seedream 4.x, and FLUX-dev + fal style LoRA. Abhimanyu and Droṇa sheets first. | Keyframe primary; whether the LoRA earns its place | ≈ **$10** ($2.40 + $0.55 + ~$1 + $2 LoRA + ~$1 inference) |
| 3 | **Image-to-video on 2 shots.** Veo 3.1 Fast `image` + `lastFrame` (8 s, 9:16) vs Kling O3 Elements, 3 takes each; plus a Lite `lastFrame` check. | Final video model; whether stone texture survives | ≈ **$15** (Veo $5.80, Kling $4–7, Lite $2.40) |
| 4 | **Voice blind test** (§5 protocol), with dual-STT and the negation alert. | Narrator; clone vs stock | **<$10**, plus listeners' time |
| 5 | **Content red-team.** 10 prompts per video vendor. | Planner vocabulary rules | **~$5–10** |
| 6 | **Indic caption golden tests**: Remotion vs FFmpeg+libass/HarfBuzz, 8 scripts. | Caption renderer | $0, 1–2 days |
| 7 | **A vs C ad test**, plus 10–15 parent interviews, before 6 Nov. | Umbrella vs hook; price band | Ad spend (not estimated) |
| 8 | **Marble chakravyūha world** (§6 plan). | Whether 3D becomes a surface and a video set | **~$6**, plus Aleph |
| 9 | **Blender plate on Modal L40S.** Seconds per frame for one keyframe and a 5 s plate. | Deterministic plates vs diffusion keyframes | **<$5** |

### Implied per-chapter budget

My arithmetic, for 13 shots × 8 s (Veo reference mode needs 8 s clips):

| Item | Calculation | Cost |
|---|---|---|
| Keyframes | 13 × 2 frames × 3 tries on Nano Banana Pro | ~$10 (FLUX.2 pro ~$2.30) |
| Drafts | 13 × 8 s × 2 takes on Veo Lite | ~$10.40 |
| Finals | 13 × 8 s × 1.5 takes on Veo Fast 1080p | ~$18.70 |
| Voice, 9 languages | — | $1–3 |
| Assembly | — | <$1 |
| **Total** | | **≈ $35–45** |

That sits within the code note's $40–120 range. It is not measured.

## 10. Gaps

- **Terms.**
  - Unread: fal (beyond §6(c)), Together, BFL, Kling, Fish's hosted API, World Labs, Shotstack, Rendi, Mux, Comfy Cloud, Scribe v2, Runway's API.
  - Unconfirmed: whether Vertex caching and ZDR cover Veo and Imagen.
  - Anthropic's retention period is unverified, and the AI Studio wording dates from 2024.
- **Models.**
  - Unconfirmed: Veo Lite `lastFrame`; Veo in asia-south1; Veo reference-mode pricing; 9:16 on Nano Banana Pro; LoRA support on any Google or Together model.
  - Not retrieved: official reference limits for FLUX.2 and Seedream; Kling's official schema and price.
- **Quality.** None of these has been tested:
  - stone texture through image-to-video
  - refusals
  - Indic MOS for any hosted TTS
  - non-Hindi WER
  - ElevenLabs IPA in Indic script
  - Fish Drama 3 in any Indic language
- **Code video.**
  - Not retrieved or confirmed: the Remotion 5 licence diff and the "people vs employees" reading; Revideo hosted pricing; c2pa-rs MP4 signing; FFmpeg's default shaper; the Blender Lab MCP.
  - No measured Blender render times.
- **3D.**
  - Not confirmed: the AMD–World Labs deal (primary source).
  - Not found: Marble output licence, rate limits and SPZ export; Aleph price and terms.
  - Not done: low-end Android splat benchmarks; Hunyuan territory clauses.
- **Voice.**
  - Not found: ElevenLabs v4 price, PVC consent flow, India hosting; Su-shroota availability.
  - Not read: music terms.
  - Not evaluated: eight TTS providers.
- **Positioning.**
  - Missing: an attitude survey; Historyverse and *Chiranjeevi Hanuman* dates; Mythik+ USD and Stage official prices; conversion evidence.
  - ACK's tagline is from memory.
- **Cost.** Every per-chapter figure is arithmetic on list prices, not a measured run.
