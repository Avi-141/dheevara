# Open-source / open-weight audio and language models for Indian languages and Sanskrit (as of Oct 2026), for Dheevara

Scope note: about 16 tool calls of research. Items marked **[unverified]** come from prior knowledge or a single secondary source and need a check against the licence text before use. **NON-COMMERCIAL** licences are flagged in bold capitals.

## 1. Open Indic TTS for narration (8+ languages, voice cloning)

### Takeaway
AI4Bharat's **IndicF5 (MIT)** is the best-evidenced, commercially usable open TTS that clones a voice across the 8 target Indic languages (Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam). Indic Parler-TTS (Apache-2.0) is the fallback that needs no cloning. The most popular Western open TTS models either lack Indic languages or are non-commercial: XTTS-v2 (CPML), the F5-TTS base weights (CC-BY-NC), and Fish Audio S2 (research licence).

### Cited Findings
**IndicF5 (AI4Bharat)**
- MIT licence. It covers 11 languages: Assamese, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu. Trained on about 1,417 h from Rasa, IndicTTS, LIMMITS and IndicVoices-R. — [HF card](https://huggingface.co/ai4bharat/IndicF5)
- Voice cloning takes a reference audio clip plus its transcript. The card requires you to "only clone voices for which you have explicit permission". The repo is gated: you must log in and accept the conditions, and loading needs `trust_remote_code=True`. The card publishes no quantitative metrics. — [HF card](https://huggingface.co/ai4bharat/IndicF5)
- The IndicF5 card recommends a newer AI4Bharat model, "Indic-Speak", with 22 languages. I could not confirm a release page, licence or date for Indic-Speak (a search found nothing). — [HF card](https://huggingface.co/ai4bharat/IndicF5)
- Independent evidence (Hindi only): a 2026 arXiv paper on 50 FLEURS sentences found IndicF5 had the best results among the systems tested, with WER 0.098 and speaker similarity 0.784, ahead of MMS-TTS-hin and a distilled student. — [arXiv 2607.18662](https://arxiv.org/pdf/2607.18662)
- English is not in IndicF5's language list. English (en-IN) narration therefore needs a second model. — [HF card](https://huggingface.co/ai4bharat/IndicF5)

**Indic Parler-TTS (AI4Bharat)**
- Apache-2.0. It is a fine-tune of Parler-TTS Mini on 1,806 h. It officially supports 21 languages: English plus 20 Indic languages, including all 8 targets and **Sanskrit**. Voices are controlled by a text description; it does not clone from reference audio. — [HF card](https://huggingface.co/ai4bharat/indic-parler-tts); a secondary source says it is gated — [PromptLayer](https://www.promptlayer.com/models/indic-parler-tts)

**Svara-TTS (Kenpath)**
- 3B parameters, built on Canopy Labs Orpheus-3B. It covers 19 languages, including Hindi, Bengali, Marathi, Telugu, Kannada, Gujarati, Malayalam, Tamil, **Sanskrit** (about 51 h from RASA) and Indian English. It offers zero-shot cloning and emotion conditioning. Streaming is listed as a future goal. The blog states **no model licence** and reports no evaluation numbers. — [HF blog](https://huggingface.co/blog/kenpath/svara-tts-open-multilingual-speech-for-india)
- Orpheus itself is Apache-2.0 on its card, but its Llama-3.2 base is gated. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)

**Veena (Maya Research)**
- One secondary source calls its Hindi "Excellent" but says it is "not open source". This is unverified; check Maya Research's card. — via search summary of [vani-tts](https://github.com/vivek-541/vani-tts)

**Praxy Voice (Praxel)**
- An open project covering Hindi, Telugu, Tamil and English, with code-mixing and cloning. It is a LoRA on Chatterbox, and the authors call its benchmark preliminary. — [GitHub](https://github.com/praxelhq/praxy); [arXiv 2604.25441](https://arxiv.org/pdf/2604.25441)

**Sarvam Bulbul**
- I found no evidence of open Bulbul weights. Bulbul v3 is served through the API (`bulbul:v3`). — [Sarvam changelog](https://docs.sarvam.ai/api/getting-started/changelog); [caller.digital](https://caller.digital/blog/open-source-voice-ai-india-sarvam-ai4bharat-bhasini-2026)

**General-purpose open TTS, with licences** (from a licence-checked roundup dated Oct 2026, [Yaps](https://www.yaps.ai/blog/best-local-tts-models)). None lists Hindi or any Indic language.
- **XTTS-v2: NON-COMMERCIAL.** The weights are under CPML, which "allows only non-commercial use of a machine learning model and its outputs". Coqui shut down in Jan 2024, so there is no way to buy a commercial licence. The code is MPL-2.0. — [Coqui GitHub discussion #4304](https://github.com/coqui-ai/TTS/discussions/4304); [localaimaster](https://localaimaster.com/blog/xtts-coqui-commercial-license)
- **F5-TTS (base): code MIT, weights CC-BY-NC (NON-COMMERCIAL).** Chinese and English only. IndicF5 is AI4Bharat's own MIT-licensed Indic training. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Fish Audio S2 Pro: research licence.** Commercial use needs a separate licence from Fish Audio. It claims 80+ languages but gives no list. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **IndexTTS-2.5: bilibili licence.** Commercial use needs an agreement. Languages are Chinese, English, Japanese, Spanish and Arabic. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Fun-CosyVoice 3.0 (0.5B): Apache-2.0.** 9 languages plus Chinese dialects, streaming at about 150 ms. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Qwen3-TTS (0.6B and 1.7B): Apache-2.0.** 10 languages, cloning from about 3 s of audio. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Chatterbox: MIT.** The Multilingual model covers 23 languages and clones from about 10 s of reference. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Kokoro-82M: Apache-2.0.** No cloning. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Dia / Dia2: Apache-2.0.** English only, about 4.4 GB VRAM. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **VibeVoice: MIT.** Microsoft removed the long-form TTS code in Sept 2025. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)
- **Kyutai Pocket TTS: CC-BY-4.0 with prohibited-use terms.** 6 European languages only. — [Yaps](https://www.yaps.ai/blog/best-local-tts-models)

### Inferences
- **Primary narration:** IndicF5 cloned from one consented human narrator. One reference clip per language gives a consistent "Dheevara voice" across the 8 Indic languages.
- **English narration:** the same narrator's English through an Apache or MIT cloner, such as Chatterbox (MIT) or Qwen3-TTS (Apache-2.0). Indic Parler-TTS (Apache-2.0) also does en-IN, but with description-based rather than cloned voices. Whether Chatterbox or Qwen3 handles Indian-accented English well is untested.
- **Avoid for commercial output:** XTTS-v2, the F5-TTS base weights, Fish S2, IndexTTS and MusicGen (section 4).
- Licence-wise this beats Bulbul. Quality parity with Bulbul v3 is **unproven**: there are no published MOS figures for IndicF5 in Kannada, Tamil, Telugu and the rest. A blind listening test is needed.

### Gaps
- No MOS or CER figures for IndicF5 or Svara across the 8 languages. No head-to-head against Bulbul v3.
- VRAM figures for IndicF5 and Svara were not found. IndicF5 is F5-sized, about 337M parameters per the Vāgdhenu README, so a single 16–24 GB GPU is likely enough, but this is unverified.
- Not researched for lack of calls: Higgs Audio licence, Kyutai DSM-TTS (large), Orpheus multilingual Indic, IIT Madras IndicTTS licence, and the actual status of "Indic-Speak".
- No licence was found for Svara-TTS or Veena.

## 2. Sanskrit chant: Vāgdhenu, metre tools, singing synthesis

### Takeaway
**Vāgdhenu is real and fits this need almost exactly.** It is a metre-aware śloka-to-chant TTS from IISc Bengaluru (Prof. Prathosh A P), fine-tuned from IndicF5 with a BigVGAN-v2 vocoder. The code is Apache-2.0 and the weights are Apache-2.0 for the authors' contribution, with the IndicF5 (MIT) and NVIDIA BigVGAN terms inherited. Its limits: a single voice (the author's own), no Vedic svara, and prosody driven by the reference clip.

### Cited Findings
- It is described as "metered Sanskrit/Vedic chant text-to-speech (DiT + BigVGAN). Apache-2.0." It is a single-speaker pārāyaṇa chanter. The base is IndicF5/F5-TTS, a flow-matching DiT of about 337M parameters with no duration or pitch head. — [GitHub](https://github.com/prathoshap/vagdhenu)
- Text is routed through **Kannada script** internally, because Devanagari triggers Hindi schwa deletion. It requires Python 3.10 and CUDA 12.1. The Vocos vocoder "shivers on long vowels", so BigVGAN-v2 is mandatory. — [HF card](https://huggingface.co/prathoshap/vagdhenu)
- Metre handling uses laghu/guru (L/G) gaṇa detection and a `meter` field, for example anuṣṭubh. There is a per-metre reference bank. Batch rendering takes JSON shards with `id, meter, padas, seed, out`. — [GitHub](https://github.com/prathoshap/vagdhenu)
- Training data is about 5 h of single-speaker chant (`prathoshap/vagdhenu-data`; the dataset licence is not stated). The voice "is the author's own", and the card says "do not impersonate". There are **no Vedic svaras**, and prosody is "not arbitrarily designable". — [HF card](https://huggingface.co/prathoshap/vagdhenu)
- Evaluation is an expert MOS of about 4.6 and "100%" correct conjuncts, including retroflex aspirates. This is a **single-listener** evaluation. — [HF card](https://huggingface.co/prathoshap/vagdhenu); [AlphaSignal](https://alphasignal.ai/news/iisc-s-vagdhenu-opens-sanskrit-chant-tts-with-4-6-expert-score)
- It has been used in production for the Śrīmad Bhāgavatam (16,017 verses) and the **Mahābhārata Tātparya Nirṇaya**. It powers the Vāgbodhinī pronunciation tutor. The demo auto-detects metre and takes any Indic script, or PDF and Word files. — [GitHub](https://github.com/prathoshap/vagdhenu); [HF Space](https://huggingface.co/spaces/shwatg/vagdhenu-demo); [project page](https://prathosh.in/vagdhenu/)
- Other Sanskrit-capable TTS:
  - Indic Parler-TTS (Apache-2.0) lists Sanskrit. — [HF card](https://huggingface.co/ai4bharat/indic-parler-tts)
  - Svara-TTS lists Sanskrit, trained on about 51 h of RASA data. — [HF blog](https://huggingface.co/blog/kenpath/svara-tts-open-multilingual-speech-for-india)
  - Both are general reading voices, so Dheevara's own rule excludes them for verses.
- Metre (chandas) tools:
  - `vidyut.chandas` (Ambuda project, Rust and Python) is "experimental" and supports partial matching. — [Vidyut docs](https://vidyut.readthedocs.io/en/latest/introduction.html); [docs.rs](https://docs.rs/vidyut-chandas)
  - `sanskrit-coders/chandas` (MIT, PyPI) is derived from shreevatsa's identifier and also does syllabification. — [GitHub](https://github.com/sanskrit-coders/chandas); [PyPI](https://pypi.org/project/chandas/)
  - `sanskrit/chandas` is a rewrite. It supports sama, ardha-sama and viṣama vṛtta and jāti, including āryā, and works on SLP1 input. — [GitHub](https://github.com/sanskrit/chandas)
  - IIT Kanpur's Chandojñānam is a web identifier covering 200+ metres. — [IITK](https://sanskrit.iitk.ac.in/jnanasangraha/chanda)

### Inferences
- **Recommended:** self-host Vāgdhenu for all verse chanting. Mahābhārata ślokas are overwhelmingly anuṣṭubh, with some triṣṭubh and other metres, which matches its design. Run `vidyut.chandas` or `chandas` upstream as an independent metre check before rendering.
- The chant voice will be the **author's** voice, not Dheevara's narrator. Two options:
  - Get written consent or a licence from Prof. Prathosh to use his voice commercially. The card's "do not impersonate" line is a caution, not a prohibition on use.
  - Record the consented narrator chanting about 5 h and fine-tune with the same recipe.
- Respect NVIDIA's BigVGAN licence terms; the text was not checked here.
- Singing-voice conversion (RVC, So-VITS) for re-voicing chant would need explicit consent from the source voice. RVC and So-VITS licences were not verified here.

### Gaps
- The full list of supported metres, VRAM needs and throughput are not published.
- The training dataset's licence is not stated.
- No Vedic svara (udātta/anudātta/svarita) model was found. Vedic recitation remains unsupported by any open model I found.
- DiffSinger, So-VITS-SVC and RVC licences were not researched.
- No Vedic or epic recitation datasets with clear rights were found, apart from RASA, which Svara used.

## 3. Open ASR for the round-trip check and alignment

### Takeaway
**AI4Bharat IndicConformer-600M (MIT, 22 languages including Sanskrit, CTC and RNNT)** is the default for the Indic round-trip check. Meta Omnilingual ASR (Apache-2.0) is a cross-check. Whisper-derived IndicWhisper is strong but was weak on Sanskrit, at 48 WER in 2023.

### Cited Findings
- **IndicConformer-600M-multilingual:**
  - MIT licence, 22 scheduled languages **including Sanskrit (`sa`)**.
  - Hybrid CTC and RNNT decoding, with the mode chosen per call.
  - Hindi WER 13.2 on the Vaani benchmark.
  - Gated: you must accept conditions to download.
  - The card recommends a newer "Indic-Transcribe" (25 languages); no details were verified.
  — [HF card](https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual)
- **IndicWhisper / Vistaar (Interspeech 2023):**
  - 59 benchmarks across 12 languages.
  - IndicWhisper was fine-tuned on 10.7K h and had the lowest WER on 39 of the 59 benchmarks.
  - WER ranged from 13.6 (Hindi) to **48 (Sanskrit)**.
  - The model registry shows an empty licence field, so the licence is unconfirmed.
  — [arXiv 2305.15386](https://arxiv.org/pdf/2305.15386); [GitHub](https://github.com/AI4Bharat/vistaar)
- **Meta Omnilingual ASR (Nov 2025):**
  - Apache-2.0, 1,600+ languages, zero-shot extension to 5,400+.
  - The corpus is CC-BY.
  - 95% of languages with 10 h or more of data reach CER below 10.
  - Sanskrit coverage is not confirmed in the sources found.
  — [OpenSourceForU](https://www.opensourceforu.com/2025/11/metas-omnilingual-asr-brings-1600-languages-to-open-source-speech-ai/); [The Decoder](https://the-decoder.com/metas-omnilingual-asr-brings-speech-recognition-to-1600-languages/)
- **Sarvam Saarika:** reported as remaining API-only. — [caller.digital](https://caller.digital/blog/open-source-voice-ai-india-sarvam-ai4bharat-bhasini-2026)

### Inferences
- Run IndicConformer for each narration language, plus Whisper large-v3 (MIT **[unverified]**) for English. Diff the transcript against the script at the word level. This catches dropped negations such as न/नहीं.
- For Sanskrit chant, ASR WER will be high, so use CTC forced alignment of the *known* verse text instead and flag low-confidence words. IndicConformer's CTC head can provide the emissions, or MMS or ctc-forced-aligner can. This works better for chant than open transcription.
- Captions and word timings: ctc-forced-aligner, WhisperX or Montreal Forced Aligner. None of their licences were verified in this session.

### Gaps
- No Sanskrit CER figure for IndicConformer was found.
- Not researched: NVIDIA Parakeet and Canary multilingual Indic coverage, Whisper-turbo Indic WER, MMS licence (believed CC-BY-NC for MMS — **verify**), and the licences of MFA, WhisperX and ctc-forced-aligner.
- No source said whether Indic-Transcribe exists.

## 4. Music and ambience (tanpura drone)

### Takeaway
A tanpura drone does not need a generative model. Procedural synthesis, or a self-recorded or CC0 tanpura loop, is free of licence risk. Among generative models, **MusicGen weights are CC-BY-NC 4.0 (NON-COMMERCIAL, confirmed)**. Stable Audio's Community License allows commercial outputs below $1M in annual revenue.

### Cited Findings
- **MusicGen:** the card states "model weights are released under CC-BY-NC 4.0", with code under MIT. It was trained on about 20K h of licensed Meta, Shutterstock and Pond5 music. — [HF card](https://huggingface.co/facebook/musicgen-large)
- **Stable Audio:**
  - Under Stability's Community License you own your outputs and can use them commercially. Organisations above $1M in revenue need an Enterprise licence. Sources disagree on whether the threshold means "annual revenue" or "ARR".
  - Stable Audio 3.0 (May 2026) released open weights for 3 of its 4 models under the Community License.
  - Stable Audio Open 1.0 was trained on CC-licensed Freesound and FMA audio.
  — [Stability explainer](https://stability.ai/explainers/stable-audio-vs-competitors-licensing-export-rights-and-self-hosting-compared); [The Decoder](https://the-decoder.com/stability-ai-launches-stable-audio-3-0-with-up-to-six-minute-tracks-and-open-weights/); [Digital Music News](https://www.digitalmusicnews.com/2026/05/21/stability-ai-3-0-release/)

### Inferences
- Synthesise the tanpura in code: Sa–Pa–Sa–Sa plucks with a jawari-style buzz, using additive synthesis or Karplus–Strong. Alternatively, record a real tanpura once. Either way there is no model licence exposure and no train-on-data question.
- If generative ambience is wanted, Stable Audio Open or 3.0 is acceptable while Dheevara is under $1M revenue. Avoid MusicGen for commercial use.

### Gaps
- Licences for ACE-Step, YuE, DiffRhythm and SongBloom were not verified in this session. No specific open-source tanpura DSP repository was confirmed.

## 5. Open LLMs and translation for Indian languages and Sanskrit, plus serving and hosting

### Takeaway
For self-hosted, never-trained-on drafting and translation, use the following, all served with vLLM:
- **Sarvam-30B or Sarvam-105B (Apache-2.0, Mar 2026)** as the Indic-strong LLM.
- **IndicTrans2 (MIT)** for dedicated translation.
- **Sarvam-Translate (GPL-3.0, Gemma-3-4B base, includes Sanskrit)** as a second translator.

### Cited Findings
- **Sarvam-105B and Sarvam-30B:** open weights under **Apache-2.0**, released March 2026 on HF and AIKosh. 105B is an MoE of about 106B total parameters with about 10B active; 30B has about 32B total with about 2.4B active. **Sarvam-M** is deprecated in Sarvam's API in favour of these. — [Artificial Analysis](https://artificialanalysis.ai/articles/sarvam-105b-Sarvam-30b-everything-you-need-to-know); [Sarvam changelog](https://docs.sarvam.ai/api/getting-started/changelog); [Wikipedia](https://en.wikipedia.org/wiki/Sarvam_AI)
- **Sarvam-Translate:**
  - Licence is **GPL-3.0**. Base is Gemma-3-4B, which means Gemma's terms are also inherited.
  - 4B parameters, 8k context.
  - 23 languages **including Sanskrit**.
  - The open checkpoint does English↔Indic only; for Indic↔Indic you pivot through English.
  - Served with `vllm serve sarvamai/sarvam-translate --dtype bfloat16 --max-model-len 8192`.
  — [HF card](https://huggingface.co/sarvamai/sarvam-translate)
- **IndicTrans2:** code and checkpoints are MIT. Data is CC0 or CC-BY-4.0. It covers all 22 scheduled languages. — [GitHub](https://github.com/ai4bharat/IndicTrans2)
- **Krutrim:** under the "Krutrim Community License"; its terms were not checked. — [Krutrim](https://ai-labs.olakrutrim.com/models/Krutrim-Translate)
- **Sarvam-2B (2024):** non-commercial and research only. **Shuka v1** is a Sarvam audio encoder on Llama-3; its current licence is unknown. — [Maginative](https://www.maginative.com/article/sarvam-ai-launches-open-weights-sarvam-2b-model-and-suite-of-ai-products-for-indian-languages/)
- **Sanskrit NLP:** Vidyut (Ambuda project) provides chandas and other modules. — [Vidyut docs](https://vidyut.readthedocs.io/en/latest/introduction.html)

### Inferences
- GPL-3.0 on Sarvam-Translate affects redistribution of the model or derivatives. Running it internally to produce text likely creates no copyleft obligation on the outputs, but this needs legal confirmation.
- **Suggested setup:**
  - Sarvam-30B on vLLM handles drafting and fact-checking against cited passages, with retrieval over the critical-edition text. Its 2.4B active parameters make it cheap, though it needs roughly 64 GB of VRAM for BF16 weights (inferred from parameter count).
  - IndicTrans2 and Sarvam-Translate cross-check each other's translations.
  - All of these are self-hosted, so unreleased texts never leave the infrastructure.
- **Transliteration:** `indic_transliteration` and Aksharamukha handle the Devanagari→Kannada routing Vāgdhenu needs, and SLP1 for the chandas tools. Their licences were not verified.

### Gaps
- Not verified in this session:
  - Licences for Llama 4, Gemma 3, Qwen3, gpt-oss, DeepSeek, BharatGen Param-1, Airavata and Krutrim.
  - Licences for ByT5-Sanskrit, sanskrit_parser, the Heritage Platform, DCS, Aksharamukha and indic_transliteration.
  - Licences for vLLM, SGLang, llama.cpp and Ollama.
- **Indian GPU hosting and cost:** not researched (no data on E2E Networks, Yotta or other pricing collected). This must be filled from another researcher's notes.
- No Sanskrit translation-quality benchmarks for Sarvam-Translate or IndicTrans2 were found.

## Recommended stack (synthesis; all items as cited above)

| Job | Recommended | Licence | Fallback / note |
|---|---|---|---|
| Indic narration (8 languages) | IndicF5, cloned from a consented narrator | MIT (gated, consent clause) | Indic Parler-TTS (Apache-2.0, no cloning); Svara-TTS (licence unknown) |
| English narration | Chatterbox (MIT) or Qwen3-TTS (Apache-2.0) with the same narrator | MIT / Apache | Indic Parler-TTS en-IN |
| Sanskrit chant | Vāgdhenu, plus `vidyut.chandas` / `chandas` metre check | Apache-2.0 + MIT + BigVGAN terms | Voice is the author's: get consent, or fine-tune on the narrator's chant. No svara. |
| ASR round-trip | IndicConformer-600M (CTC/RNNT); Whisper for English | MIT | Omnilingual ASR (Apache-2.0) cross-check; forced alignment for Sanskrit |
| Music | Procedural or recorded tanpura | n/a | Stable Audio Open/3.0 (commercial use OK under $1M revenue); **avoid MusicGen (NON-COMMERCIAL)** |
| LLM / translation | Sarvam-30B or 105B; IndicTrans2; Sarvam-Translate | Apache-2.0; MIT; GPL-3.0 | Serve with vLLM |
| **Avoid (non-commercial or restricted)** | XTTS-v2 (CPML), F5-TTS base weights (CC-BY-NC), MusicGen (CC-BY-NC), Fish S2 (research), IndexTTS (bilibili), Sarvam-2B | | |
