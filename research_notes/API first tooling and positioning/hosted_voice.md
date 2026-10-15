# Hosted voice providers (TTS, STT, chant, music) for Dheevara, as of 15 Oct 2026

Scope note: 16 tool calls. These notes add to `docs/research/sarvam.md` (Bulbul v3 API facts, dictionary limits, Sarvam terms) and `docs/research/notes-2026-10-15-open-source/indic_audio_language.md` (open models, Vāgdhenu, IndicConformer). They don't repeat those files.

Several sources here are secondary (resellers, blogs), and they're flagged as such. **Not researched for lack of calls:** Azure, Hume, Smallest.ai, Murf, Inworld TTS, MiniMax Speech, Resemble and AssemblyAI. They appear only under Gaps, so the report writer shouldn't treat them as evaluated.

## 1. Fish Audio: which open-weights model, its licence, and whether the hosted API serves it

### Takeaway
The model is **Fish Audio Drama 3**, released 13 Oct 2026, with open weights at `huggingface.co/fishaudio/drama-3` under the **Fish Audio Community License v1.0**. That licence is free for commercial use below US$500k annual revenue, and it forbids offering the model to others as a hosted service. The hosted API also serves it, as model `drama-3` at $50 per million characters ($10 per million until 12 Nov 2026). It claims 83 languages but publishes no list, so Hindi and the other Indic languages are unconfirmed. Its docs mention no phoneme control and no timestamps.

### Cited Findings
- **Release and code:** Drama 3 came out 13 Oct 2026. The weights are at `huggingface.co/fishaudio/drama-3` and the code at GitHub `fishaudio/fish-speech`. It is available on fish.audio, in the iOS and Android apps, and through the API. — [Fish Audio blog](https://fish.audio/blog/fish-audio-drama-3/)
- **Licence (Fish Audio Community License v1.0):**
  - Free for research and non-commercial use.
  - Free commercially if you and your affiliates have "less than US$500,000 in annual revenue".
  - Above that, or "to offer Drama 3 to others as a TTS, voice-cloning, or inference service or API", you need a licence from business@fish.audio.
  - The licence "bans cloning a real person's voice without their consent".
  - The older S2 stays under the Fish Audio *Research* License.
  — [Fish Audio blog](https://fish.audio/blog/fish-audio-drama-3/)
- **Hosted API:**
  - Endpoint `https://api.fish.audio/v1/tts` with the `model: drama-3` header.
  - List price $50 per 1M characters, or $10 per 1M from 13 Oct to 12 Nov 2026 (80% off).
  - Voice is chosen by `reference_id`.
  — [Fish Audio blog](https://fish.audio/blog/fish-audio-drama-3/)
- **Third-party pricing disagrees:** AlphaSignal quotes drama-3-preview at $15 per 1M UTF-8 bytes, and OpenRouter lists $2 per 1M UTF-8 bytes. Indic scripts take about 3 bytes per character in UTF-8, so per-byte pricing triples the effective cost for Devanagari or Kannada text. — [AlphaSignal](https://alphasignal.ai/news/fish-audio-s-drama-3-lets-developers-direct-ai-voices-like-a-film-script); [OpenRouter](https://openrouter.ai/fish-audio/drama-3)
- **Architecture:** 35B-parameter MoE with about 3B active per token. Third parties say the download is about 40 GB and self-hosting needs a GPU of at least 48 GB in FP8. — [AlphaSignal](https://alphasignal.ai/news/fish-audio-s-drama-3-lets-developers-direct-ai-voices-like-a-film-script); [ccleaks](https://ccleaks.com/news/fish-audio-drama-3-open-weights-oct-2026) (secondary)
- **Languages:** "speaks 83 languages", with no list. AlphaSignal names English, Chinese, Japanese and Korean. I found no source confirming Hindi or any Indic language. — [Fish Audio blog](https://fish.audio/blog/fish-audio-drama-3/); [AlphaSignal](https://alphasignal.ai/news/fish-audio-s-drama-3-lets-developers-direct-ai-voices-like-a-film-script)
- **Controls:**
  - Direction goes in square brackets, plus paired tags such as `<emphasis>…</emphasis>`.
  - Word-level audio inpainting and interactive editing are invite-only, and the editing API is "coming soon".
  - The blog doesn't mention phoneme or IPA control or timestamps.
  — [Fish Audio blog](https://fish.audio/blog/fish-audio-drama-3/)
- **Benchmarks (vendor-reported):**
  - Overall: Drama 3 is #1 on Artificial Analysis' Pronunciation Robustness leaderboard at 93.2%, against 88.1% for S2.1 Pro.
  - Brand, place and technical names: 95.9%.
  — [Fish Audio blog](https://fish.audio/blog/fish-audio-drama-3/)
  - A preview reportedly topped the open-weights Speech Arena. — [OrcaRouter](https://www.orcarouter.ai/blog/fish-audio-drama-3-tops-open-weights-speech-arena) (secondary)

### Inferences
- **Correction to the earlier open-source notes:** they listed "Fish S2 Pro: research licence". The new Drama 3 is commercially usable for Dheevara while it earns under $500k, which S2 was not.
- The pronunciation-robustness score is almost certainly measured on English and other major languages. It says nothing about "Jayadratha" read in Kannada.
- Drama 3 is a candidate only for **en-IN** until Indic support is shown in a listening test.
- The training-on-inputs terms of Fish's hosted API are unknown (see Gaps). Self-hosting the weights would satisfy rule 5 by construction.

### Gaps
- No official language list and no Indic quality evidence.
- Hosted API data-use and retention terms were not found. The blog is silent, and Fish's ToS and privacy policy were not fetched.
- The HF model card itself was not fetched, so the licence was read from Fish's blog only.

## 2. ElevenLabs: Indic coverage, pronunciation control, timestamps, cloning, data use, price

### Takeaway
**Eleven v4** (alongside v4 Turbo and v3) lists all eight target Indic languages. Multilingual v2 and Flash v2.5 cover only Hindi and Tamil. The catch for Dheevara is pronunciation control:
- True phoneme tags work only on `eleven_flash_v2`, which is English-only.
- v4 "understands IPA symbols when they are wrapped in forward slashes".
- Pronunciation dictionaries in `.PLS` or TXT support phoneme and alias rules.

Zero Retention Mode is Enterprise-only. Self-serve accounts get a training opt-out toggle that third parties say applies prospectively only.

### Cited Findings
**Models and languages**

| Model | Languages | Character limit |
|---|---|---|
| Eleven v4, v4 Turbo | 90+ | 10,000 (v4) |
| Eleven v3 | 70+ | 5,000 |
| Multilingual v2 | 29 | 10,000 |
| Flash v2.5 | 32 | 40,000 |

- v4 is described as "Our most emotive, high quality speech synthesis model". — [ElevenLabs TTS capabilities](https://elevenlabs.io/docs/overview/capabilities/text-to-speech)
- On the models page, v4, v4 Turbo and v3 list Hindi, Tamil, Kannada, Telugu, Marathi, Bengali, Gujarati and Malayalam. Multilingual v2 and Flash v2.5 list only Hindi and Tamil among these. No model lists Sanskrit. — [ElevenLabs models](https://elevenlabs.io/docs/overview/models)
- A user on Retell's forum reports that Kannada and Marathi resolve only to eleven_v3, at $0.20/min against $0.04/min for Turbo (Retell's pricing, not ElevenLabs'). — [Retell community](https://community.retellai.com/t/eleven-tts-billing-issue/2590)

**Pronunciation and delivery controls**
- "Phoneme tags are only compatible with the `eleven_flash_v2` model". They take CMU Arpabet or IPA, per word. — [ElevenLabs controls](https://elevenlabs.io/docs/best-practices/prompting/controls)
- "Eleven v4 understands IPA symbols when they are wrapped in forward slashes in your text." — same page
- Alias tags replace a word with another spelling and are recommended for models without phoneme support, such as Multilingual v2. — same page
- **Pronunciation dictionaries:**
  - TXT or `.PLS` files; "we only support pronunciation dictionaries that specify replacements using phoneme or alias tags".
  - Matching is case-sensitive and the first match wins.
  - Usable via the API, Studio and Dubbing.
  - No size limits are stated.
  — same page
- **Pauses and audio tags:**
  - `<break time="x.xs"/>` allows up to 3 s, but **v3 and v4 don't support break tags**; they use audio tags such as `[whispers]` and `[sighs]`, plus ellipses.
  - v4 follows tags more reliably than v3.
  — same page

**STT**
- Scribe v2 covers 90+ languages.
- Word-level timestamps.
- Keyterm prompting of "up to 1000 terms".
- Diarization of up to 32 speakers.
- A Realtime variant at about 150 ms.
- I found no Scribe v3.
— [ElevenLabs models](https://elevenlabs.io/docs/overview/models)

**Price**
- About $0.10 per 1k characters for Multilingual v2 and v3, and $0.05 for Flash and Turbo. — [ModelsLab, checked 23 Sep 2026](https://modelslab.com/elevenlabs-api-pricing); [Puter, Jun 2026](https://developer.puter.com/tutorials/elevenlabs-api-pricing/) (both secondary)
- No v4 price was found.

**Data use**
- **Zero Retention Mode** is "available to select enterprise customers". It is API-only, enabled with `enable_logging=false`, and access may be withdrawn "at ElevenLabs' sole discretion". — [ElevenLabs ZRM docs](https://elevenlabs.io/docs/developer-guides/zero-retention-mode)
- The privacy policy lets users opt out of training on personal data from an account menu. — [ConductAtlas summary](https://conductatlas.com/platform/elevenlabs/elevenlabs-privacy-policy/provision/CA-P-064748/right-to-opt-out-of-training-data-use/)
- Deepgram, a competitor, says the opt-out is prospective only, that Enterprise defaults to training off, and that voice-cloning workflows are excluded from ZRM. I did not verify this. — [Deepgram](https://deepgram.com/learn/how-elevenlabs-uses-your-audio-data)
- **Music:**
  - Eleven Music is described as trained on licensed data (deals with Merlin and Kobalt are cited) and "cleared for nearly all commercial uses". — [ElevenLabs music docs](https://elevenlabs.io/docs/overview/capabilities/music); [MindStudio](https://www.mindstudio.ai/blog/elevenlabs-music-v2-commercial-content-licensed-ai-music)
  - Self-serve plans reportedly exclude film, TV and games; Enterprise covers all uses. — [MindStudio](https://www.mindstudio.ai/blog/elevenlabs-music-v2-commercial-content-licensed-ai-music) (secondary)

### Inferences
- **Fallback narrator:** ElevenLabs v4 is the strongest hosted fallback that covers all nine languages with one provider and a professional voice clone. Its forward-slash IPA mechanism is the only documented route to phoneme-level control for Indic text there. Whether v4 honours IPA inside Kannada or Tamil script is untested.
- **Rule 5:** before sending unreleased scripts, the account needs the training opt-out turned on (documented in `docs/decisions.md`), or Enterprise with ZRM.
- **Pauses:** with v3 and v4, pauses must come from splitting the text or from punctuation, not `<break>`. That matches how the Sarvam pipeline already works.

### Gaps
- Official v4 per-character price and pronunciation-dictionary entry limits.
- Professional Voice Cloning consent and verification flow (not fetched).
- Whether IPA-in-slashes works for non-Latin scripts.
- India hosting (only EU residency was mentioned).
- MOS for Indic languages.

## 3. Sarvam (update beyond `sarvam.md`) and STT for the round-trip check

### Takeaway
**Saaras v4** (released September 2026, all 22 scheduled languages) is Sarvam's current STT. Independent evidence is mixed:
- A public Hindi leaderboard puts Saaras v3 near the top, at 3.69% OI-WER against 8.94% for Deepgram Nova-3.
- A small independent repo finds v4 *worse* than v3 on fresh conversational Hindi (23.8% against 21.0% WER).

For a round-trip check on clean studio narration, Saaras plus ElevenLabs Scribe v2 as a second opinion is defensible. Deepgram's Indic coverage is narrower: it lacks Kannada and Malayalam in the cited list.

### Cited Findings
- **Saaras v4:** released September 2026, covering 22 Indian languages plus English. Sarvam claims an LLM-WER less than half that of Deepgram Nova-3 and GPT-4o Transcribe on noisy Kathbath audio (vendor claim). — [MarkTechPost](https://www.marktechpost.com/2026/09/26/sarvam-ai-releases-saaras-v4-a-speech-to-text-model-for-all-22-indian-languages-and-global-english/)
- **logatra-benchmark (independent, Hindi only):**
  - Saaras v4 is best on the public split and fastest, at a 0.6 s median.
  - On fresh 2026 Hindi it trails v3 at 23.8% against 21.0% WER.
  - The Deepgram, ElevenLabs, Google and AssemblyAI adapters have not been run yet.
  — [GitHub logatra-benchmark](https://github.com/Nemukai/logatra-benchmark)
- **Voice of India leaderboard (Hindi OI-WER, 21,020 samples, as reported in search results):**

  | Engine | Hindi OI-WER |
  |---|---|
  | Bodhan Indic Transcribe Core | 3.39% |
  | Saaras v3 | 3.69% |
  | Gemini 3.5 Transcribe | 5.59% |
  | Gemini 3.8 Flash | 6.25% |
  | Deepgram Nova-3 | 8.94% |

  — [voiceofindia.ai](https://voiceofindia.ai/). When I fetched the page directly it returned only a tagline, so I could not confirm these figures.
- **Sthanika (IndicVoices, 357k+ utterances):** Deepgram's Hindi has an unusual error profile, with high CER relative to WER. — [Sthanika](https://sthanika.ai/research/what-it-actually-said)
- **Deepgram Indic monolingual coverage:** Hindi, Bengali, Marathi, Tamil, Telugu and Gujarati. — [telenow](https://telenow.ai/blog/deepgram-speech-to-text-models-benchmarks-pricing-and-when-to-use-it/) (secondary)
- **Vendor-reported figures:**
  - Saaras v3 at 19.31% WER on IndicVoices across 10 languages. — [Sarvam STT page](https://www.sarvam.ai/speech-to-text)
  - BodhanAI reports Indic-Transcribe Core at 8.9 WER against Saaras v3 at 10.1 and Gemini 3 Pro at 18.9; this is self-reported. — [aitechnews](https://aitechnews.in/indic-transcribe-iit-madras-ai-model-review/)

### Inferences
- **Narration is clean studio TTS,** so absolute WER on conversational audio overstates the errors we'd see. The real risk is semantic errors: a dropped न, or a negation hallucinated or "corrected" away.
- **Use two independent engines and diff both against the script.** A word flagged by both is a real error. A word flagged by one is a human-review item. Suggested pairs:
  - Saaras for all nine languages.
  - Scribe v2 for all nine.
  - Gemini Transcribe as a tiebreak.
- **Scribe v2 for captions:** its keyterm prompting (up to 1,000 terms) suits the canon name list. Its word timestamps can drive captions when the TTS doesn't return alignment.
- **Saaras keyterms:** v4 takes 50 keyterms (per `sarvam.md`), which suits a per-chapter name list.

### Gaps
- No independent WER for Kannada, Tamil, Telugu, Malayalam, Gujarati, Bengali or Marathi for any hosted engine.
- Not researched: AssemblyAI Universal Indic coverage, Google Chirp 3 STT figures, and Scribe v2 data terms.
- No benchmark measures negation-drop detection specifically.

## 4. Other TTS alternatives (Cartesia, Google) and Bland.ai

### Takeaway
- **Bland.ai is a phone-agent company** with a conversational TTS (Bland Speech v3, `btts-3`) built for calls. Its docs show no Indic language list and no pronunciation dictionary, so it isn't a fit for narration.
- **Google Chirp 3 HD** (about $30 per 1M characters, IPA and X-SAMPA in 26 of 53 locales) is a credible Indic fallback, but only on secondary evidence.
- **Cartesia** advertises Indic languages and custom IPA, but one 2026 review says its multilingual quality pass skipped the Indic languages.

### Cited Findings
- **Bland:**
  - Bland Speech v3 is marketed as a conversational TTS, served via `POST /v2/tts` with WAV output, streaming and a WebSocket.
  - An OpenAI-compatible `/v2/audio/speech` endpoint takes `model: btts-3`.
  - Voices are cloned from short clips "with consent".
  — [Bland Speech](https://www.bland.ai/speech); [Bland TTS docs](https://docs.bland.ai/tts/welcome); [audio-speech](https://docs.bland.ai/api-v2/post/audio-speech.md)
  - Pricing conflicts: a "limited-time" $0.015 per 1k characters against $0.02 per 100 characters in the v1 docs. — [Bland Speech](https://www.bland.ai/speech); [v1 speak](https://docs.bland.ai/api-v1/post/speak.md)
- **Google Chirp 3 HD:**
  - 53 locales.
  - IPA or X-SAMPA pronunciation control in 26 of them.
  - No SSML on streaming.
  - About $30 per 1M characters.
  — [Cekura](https://www.cekura.ai/blogs/top-multilingual-tts-voice-ai-platforms) (secondary)
  - Gemini TTS is priced per token. Gemini 3.8 Flash TTS ranks near the top of the Speech Arena. — [Speechify comparison](https://speechify.ai/blog/best-tts-providers-2026-comparison) (secondary)
- **Cartesia:**
  - Coverage is quoted as 42 to 44 languages including Hindi, Tamil and Kannada, with custom IPA pronunciations. — [Cekura](https://www.cekura.ai/blogs/top-multilingual-tts-voice-ai-platforms)
  - One review says its multilingual quality pass "left out Hindi and the other Indic languages". — [texttolab](https://texttolab.com/blog/cartesia-ai-review) (secondary, conflicting)
  - Sonic 3.6 is reported at or near #1 in the Speech Arena (Aug and Sep 2026 sources). — [Coval](https://www.coval.ai/blog/best-text-to-speech-providers-in-2026-how-to-choose-(and-why-vendor-benchmarks-lie)/)
- **Independent Indic evidence:** no source found tested Tamil or Kannada pronunciation accuracy for any of these. — (search across [Coval](https://www.coval.ai/blog/best-text-to-speech-providers-in-2026-how-to-choose-(and-why-vendor-benchmarks-lie)/), [Cekura](https://www.cekura.ai/blogs/top-multilingual-tts-voice-ai-platforms))

### Inferences
- Speech Arena rankings are dominated by English and don't transfer to Indic narration.
- A blind in-house test is needed. One way to run it:
  - Take one fixed 1,500-character script per language, rich in Sanskrit names.
  - Render it on Sarvam, ElevenLabs v4, Chirp 3 HD and Cartesia.
  - Have native listeners rate it.
  - Count name errors with STT plus a human.
- **Bland:** drop it from the shortlist.

### Gaps
- Not researched: Azure (Indic neural voices, custom lexicons, which are known to exist but unverified here), Hume Octave, Smallest.ai Lightning, Murf Falcon, Inworld TTS, MiniMax Speech, Resemble.
- No official Google pricing or locale list was fetched.

## 5. Sanskrit chant: can any hosted provider do it?

### Takeaway
I found **no hosted commercial API that chants Sanskrit in metre**. ElevenLabs, Sarvam and Fish list no Sanskrit TTS at all, and their music models have no chandas control. Rule 7 stands: use Vāgdhenu (self-hosted, CUDA) or a human reciter.

### Cited Findings
- Vāgdhenu's only hosted form is an HF Space demo, capped at one śloka per chant and 10 chants per day, with auto-detected metre. I found no public API. — [Vāgdhenu Space](https://prathoshap-vagdhenu-demo.hf.space/)
- **Update to the earlier notes:** the 5.3 h chant training corpus is reported as **CC BY 4.0**; the earlier notes had "dataset licence not stated". — [hyper.ai](https://hyper.ai/en/datasets/53050) (secondary; verify on HF)
- Vāgbodhinī pairs Vāgdhenu with "Su-shroota", a speech recogniser for chant feedback. — [OfficeChai](https://officechai.com/ai/iisc-professor-creates-vagbodhini-which-uses-ai-to-chant-any-shloka-in-perfect-sanskrit/)
- No ElevenLabs model lists Sanskrit. — [ElevenLabs models](https://elevenlabs.io/docs/overview/models)
- Bulbul v3 has no `sa-IN`. — `docs/research/sarvam.md`

### Inferences
- The Su-shroota recogniser, if its weights are available, could serve as the chant round-trip check in place of general STT.
- ElevenLabs Music can sing lyrics, but nothing indicates metre (laghu/guru) control. Using it for ślokas would also break rule 7's intent.

### Gaps
- Su-shroota's availability and licence.
- Whether any singing-voice API (for example Suno or ElevenLabs Music vocals) accepts syllable-duration input.

## 6. Recommended setup (synthesis; all inputs cited above or in the two earlier files)

### Takeaway
1. **Narration:** keep Sarvam Bulbul v3 as the primary for all nine languages. It is cheapest, India-native and already integrated.
2. **Fallback:** add ElevenLabs v4 with a consented Professional Voice Clone of the cast narrator. It covers all nine languages and offers IPA.
3. **STT:** run a dual-engine round trip with Saaras and Scribe v2.
4. **Chant:** Vāgdhenu or a human reciter.
5. **Score:** procedural or recorded tanpura, with ElevenLabs Music only for the score, under checked terms.

### Cited Findings
- **Sarvam:** Bulbul v3 costs ₹30 per 10k characters, about ₹4.5 per 1,500-character track; Saaras costs ₹30 per hour. — `docs/research/sarvam.md`
- **ElevenLabs:** about $0.10 per 1k characters for v3-class models (secondary); v4 is unpriced. — [ModelsLab](https://modelslab.com/elevenlabs-api-pricing)
- **Fish Drama 3:** $50 per 1M characters, or $10 during the promo. — [Fish blog](https://fish.audio/blog/fish-audio-drama-3/)

### Inferences
**Per-language plan**

| Language | Primary | Fallback | Notes |
|---|---|---|---|
| en-IN | Sarvam (ratan) or ElevenLabs v4 clone | Fish Drama 3 hosted, after a listening test | Drama 3 is strongest on pronunciation robustness but its Indic accent is unverified |
| hi-IN, ta-IN | Sarvam | ElevenLabs v4; Chirp 3 HD | |
| kn, te, mr, bn, gu, ml | Sarvam | ElevenLabs v4 | Multilingual v2 and Flash don't cover these |

**One consistent narrator**
- Sarvam doesn't clone (no cloning is documented in `sarvam.md`). A cast human narrator is therefore only possible on ElevenLabs PVC, Fish or Cartesia, or the self-hosted IndicF5.
- **Decision for Avi:** a stock Sarvam voice per language, or a cloned cast voice. The cloned voice would move the primary to ElevenLabs v4 or IndicF5.

**Pronunciation-lexicon workflow**
1. Build one canon lexicon: name → IAST → IPA → per-language respelling.
2. Compile it per provider:
   - Sarvam: plain-text respelling dictionary, 100 words max.
   - ElevenLabs: a `.PLS` with alias rules, plus `/IPA/` inline for v4.
   - Chirp: IPA phoneme tags.
3. Render.
4. Run STT round-trip with keyterms.
5. Flag any name the STT doesn't return; a human spot-listens.

**STT round-trip**
- Saaras v4 as primary (keyterms ≤ 50), with Scribe v2 as an independent cross-check (keyterms ≤ 1,000) and the source of word timestamps for captions.
- Diff both against the script at the word level and alert on negation tokens (न, नहीं, मत, not, and their equivalents per language).

**Cost per chapter, per language** (about 1,500 characters, about 2 min, one draft and one final)
- Sarvam: about ₹9 for two renders, plus about ₹1 for Saaras STT.
- ElevenLabs: about $0.30 for two renders, plus Scribe (unpriced here).
- Across nine languages:
  - Sarvam-only: about ₹90, roughly US$1.
  - ElevenLabs-only: about US$2.7.

All of this is negligible next to video.

**Rule 5 actions**
- Sarvam: opt-out (already pending, per `sarvam.md`).
- ElevenLabs: training opt-out toggle, or Enterprise ZRM.
- Fish hosted: terms unknown, so self-host Drama 3 for any unreleased text.

**Music**
- Tanpura drone: procedural or recorded (per the open-source notes).
- Score: ElevenLabs Music only after reading its music terms, since self-serve reportedly excludes film and TV. Or use Stable Audio under the community licence.
- Suno and Udio terms were not researched.

### Gaps
- No head-to-head Indic MOS for any hosted provider. The blind test above is the missing evidence.
- Not verified: ElevenLabs v4 pricing, PVC consent flow, ElevenLabs and Fish India hosting, Suno, Udio and Stable Audio API licence terms.
- Not covered: the eight providers named under the scope note.
