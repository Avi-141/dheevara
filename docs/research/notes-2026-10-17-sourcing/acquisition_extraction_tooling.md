# Acquisition and extraction tooling for a cited Mahābhārata/Rāmāyaṇa corpus (as of 2026-10-17)

Method note: these notes come from about 20 tool calls (web search, page fetches, and live queries to archive.org and sa.wikisource.org on 2026-10-17). Items marked **[unverified this session]** are from documentation I know but did not re-fetch today. Their URLs are the canonical docs, and they should be checked before anyone relies on them. Repo context: `src/canon/fetch.mjs` fetches pinned URLs and fails loudly on a sha256 mismatch. `docs/research/sources.md` §5 already uses `advancedsearch.php` and `/metadata/<id>`, and records that uploader-set CC0 on 1958 BORI scans is not evidence that rights were released.

## 1. Internet Archive programmatic access and Indic collections

### Takeaway
archive.org has the largest open pool of Indic scans: Digital Library of India (≈579k items) and eGangotri (≈36k items tagged). For deep paging, use the cursor-based Scraping API; for single items, use the Metadata API. IA publishes no numeric rate limit. It asks bulk users to start slowly, ramp up, and email info@archive.org before a large project. Rights metadata is uneven and often set by the uploader, so treat it as a hint, not evidence.

### Cited Findings
- The Scraping API (`/services/search/v1/scrape`) uses a cursor: each response returns a cursor to pass back. Its parameters are `q`, `fields`, `sorts`, `count` (min 100), `cursor` and `total_only`. The older Advanced Search caps sorted paged results at 10,000, which is why the Scraping API exists. That help page covers metadata search only, not the text inside items. — [archive.org help: About search](https://archive.org/help/aboutsearch.htm); [IA Item Search APIs docs](https://doc-tools.readthedocs.io/en/ia-test-gsod/item-search-apis.html)
- Live counts from `advancedsearch.php` (`rows=0`), 2026-10-17. — queried at [archive.org/advancedsearch.php](https://archive.org/advancedsearch.php)
  - `collection:digitallibraryindia` → **578,535**; with `language:san` → **54,278**
  - `subject:egangotri` → **35,758**; `uploader:egangotri*` → **3,128**. eGangotri uploads under several accounts, so the subject tag is the better handle.
  - `language:san AND mediatype:texts` → **90,880**; `language:sanskrit AND mediatype:texts` → **3,333**. Language codes are inconsistent, so query both.
  - `title:mahabharata AND mediatype:texts` → **1,645**; `title:mahabharata AND language:san` → **262**. The first hits include `india.history.resource.*` items and a manuscript with `licenseurl` CC0.
  - `collection:muktabodha*` → **0**. Muktabodha is not an archive.org collection under that id; it runs its own site.
  - Anomaly: with `total_only=true`, the Scraping API returned `total: 3128` for every query I sent. That looks like a caching or parsing quirk on my side or theirs. Use advancedsearch `numFound` for counts until this is re-checked.
- Full-text (OCR) search exists through the beta endpoint `/services/search/beta/page_production/?service_backend=fts`. The query `"dronaparvan"` returned `total: 757`. The endpoint is undocumented or beta, so expect it to change. — queried at [archive.org FTS beta](https://archive.org/services/search/beta/page_production/?user_query=%22dronaparvan%22&service_backend=fts)
- Bulk-use expectations: in May 2023, "tens of thousands of requests per second for our public domain OCR files" from "64 virtual hosts on amazon's AWS" took archive.org down for about an hour, twice. IA asks bulk users to "start slowly, and ramp up", to contact info@archive.org "if you are starting a large project", and, if blocked, to "please don't just start again, reach out." No numeric limit is published. — [IA blog, 2023-05-29](https://blog.archive.org/2023/05/29/let-us-serve-you-but-dont-bring-us-down/)
- eGangotri gets non-copyrighted hard copies, scans them at high resolution and uploads them to archive.org. — [sanskritdocuments.org scanned books](https://sanskritdocuments.org/scannedbooks/); example item [GayatriTantra 1946 Kashi Sanskrit Series](https://archive.org/details/GayatriTantra1431946KashiSanskritSeries/page/n1/mode/2up)
- Rights fields already seen in this repo: `possible-copyright-status: NOT_IN_COPYRIGHT`, `copyright-region`, `copyright-evidence` (scanning-centre items such as Princeton/Toronto); `dc.rights: In Public Domain` (DLI); `licenseurl` set by uploaders (CC0 or CC BY-NC-ND on public-domain books). — `docs/research/sources.md` §5
- **[unverified this session]** The `internetarchive` Python library and CLI (`pip install internetarchive`; `ia search`, `ia metadata`, `ia download --glob='*.pdf'`, `ia configure` for S3 keys) wraps the search, metadata and download APIs. Each item's files carry `md5`/`sha1` in `/metadata/<id>` (`files[]`), so the hash can be checked against IA's value before computing our own sha256. Download URL: `https://archive.org/download/<id>/<file>`. — [internetarchive docs](https://archive.org/developers/internetarchive/)

### Inferences
- An item's metadata already holds an IA-side hash (md5/sha1) for every file. Our pin can record `{ia_id, file, ia_sha1, sha256, retrieved_at, metadata_snapshot}`, so the evidence chain is "IA said X, we got X". This fits `fetch.mjs` without changing its fail-loud contract.
- DLI items (`in.ernet.dli.2015.*`) usually have poor OCR on Devanagari (sources.md: "wrong script"). Plan to re-OCR the images rather than use `_djvu.txt`.
- Rights rule for the ledger: only `NOT_IN_COPYRIGHT` from a scanning centre, or a publication date we can verify, counts as evidence. An uploader's `licenseurl` is recorded but never trusted.

### Gaps
- No official numeric rate limit for archive.org downloads. Need to confirm whether the current Terms of Use say anything specific about automated bulk download.
- The Scraping API `total_only` anomaly is unexplained.
- Exact eGangotri totals across all its uploader accounts are unknown.

## 2. Wayback Machine, alternatives and WARC tooling

### Takeaway
Save Page Now 2 (SPN2) is enough to give every web citation a third-party timestamped capture: with S3 keys it allows 30k captures/day, 7/min, and 5 captures per URL per day. We should also keep our own WARC copies, because Wayback access from this environment has been unreliable (sources.md §3: the connection reset).

### Cited Findings
- SPN2 limits, verbatim: "Max captures per minute for authenticated users = 7 and for anonymous users = 3"; "Max captures per day for authenticated users = 30k"; "anonymous users = 200"; "Max captures per day for a URL = 5". There is also a limit on concurrent sessions ("User has reached the limit of concurrent active capture sessions"). Auth header: `authorization: LOW accesskey:secret` (S3 keys from archive.org/account/s3.php). Key POST options are `capture_all=1`, `capture_outlinks=1`, `if_not_archived_within=<timedelta>` and `skip_first_archive=1`. Poll status at `GET https://web.archive.org/save/status/<job_id>` within an hour. — [SPN2 Public API Docs](https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/mobilebasic)
- Wrapper libraries: `savepagenow` (Python) documents 3/min anonymous and 6/min authenticated. This differs slightly from the 7/min in the official doc, so the official doc should win. Also available: `spn2` (npm). — [savepagenow docs](https://palewi.re/docs/savepagenow/); [spn2 on npm](https://www.npmjs.com/package/spn2)
- **[unverified this session]** CDX API: `https://web.archive.org/cdx/search/cdx?url=<u>&output=json&fl=timestamp,original,digest,statuscode` returns the capture list with a SHA-1 `digest`. The Availability API `https://archive.org/wayback/available?url=<u>&timestamp=YYYYMMDD` returns the closest capture. Raw bytes come from the `id_` modifier (`/web/<ts>id_/<url>`). — [Wayback CDX server README](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server)
- **[unverified this session]** Alternatives: perma.cc (law-library-run, account-based, has an API, free tier limited, institution plans paid); archive.today (no official API, uses CAPTCHAs, so it is unsuitable for automation and we must not bypass it). — [perma.cc docs](https://perma.cc/docs/developer)
- **[unverified this session]** Self-held evidence: `warcio` (Webrecorder, Python) reads and writes WARC and can record `requests` traffic (`capture_http`); `browsertrix-crawler` (Docker, Puppeteer) does high-fidelity crawls to WACZ; `pywb` replays WARC/WACZ; WACZ packages WARCs with an index and optional signing. — [warcio](https://github.com/webrecorder/warcio); [browsertrix-crawler](https://github.com/webrecorder/browsertrix-crawler); [pywb](https://github.com/webrecorder/pywb); [WACZ spec](https://specs.webrecorder.net/wacz/latest/)

### Inferences
- At retrieval time, write a WARC record ourselves (warcio around the same fetch, so the sha256 is of the exact bytes) **and** fire SPN2 with `if_not_archived_within=30d`, storing the returned Wayback timestamp. The ledger then holds a local, hash-pinned copy plus an independent public witness. The 5-per-URL-per-day cap does not matter at our volume.
- Store WARCs outside git (an object store or Drive). Commit only the CDXJ index and hashes.

### Gaps
- perma.cc pricing as of Oct 2026 is not checked.
- Whether SPN2 is reachable through this environment's proxy is not tested.

## 3. Other libraries and APIs

### Takeaway
The HathiTrust Data API is gone (retired 2024-07-17); bulk public-domain text now goes through HTRC or Research Datasets. Sanskrit Wikisource has ProofreadPage namespaces and a standard MediaWiki API, which suits page-anchored citations. BORI's own digital library is a subscription portal with no IIIF evidence.

### Cited Findings
- HathiTrust "retired the HathiTrust Data API … effective July 17, 2024" because of low usage and security concerns. It points users to Research Datasets and HTRC. The Bibliographic API remains (metadata only, for small numbers of items). — [HathiTrust: Retirement of Data API](https://hathitrust.org/press-post/retirement-data-api)
- Sanskrit Wikisource (sa.wikisource.org), live siteinfo on 2026-10-17: **20,446 articles, 164,370 pages**. ProofreadPage namespaces exist: `Page:` = ns **104** (पृष्ठम्) and `Index:` = ns **106** (अनुक्रमणिका). A `Page:` is one scan page with its transcription and proofreading status, so citations can anchor to scan page plus revision id. — [sa.wikisource API siteinfo](https://sa.wikisource.org/w/api.php?action=query&meta=siteinfo&siprop=statistics|namespaces&format=json)
- BORI Digital Library (borilib.com) works by individual or corporate subscription, about $50–$600/yr, with some free content behind a sign-up. BORI holds about 28,000 manuscripts and over 140,000 books. I found no IIIF evidence. — [CRL e-Desiderata: BORI Digital Library](https://edesiderata.crl.edu/node/2398)
- **[unverified this session]** Google Books API v1 (`/books/v1/volumes`) gives metadata and `accessInfo` (viewability, `publicDomain`, PDF/EPUB download link only for full-view public-domain volumes). It offers no bulk full text. — [Google Books API](https://developers.google.com/books/docs/v1/using)
- **[unverified this session]** Project Gutenberg forbids automated harvesting of the main site and asks robots to use mirrors or the `robot/harvest` endpoint and the offline catalogue (RDF/CSV feeds). — [Gutenberg robot access policy](https://www.gutenberg.org/policy/robot_access.html)
- **[unverified this session]** IIIF manuscript holders with Indic material: British Library, Cambridge Digital Library (large Sanskrit manuscript holdings) and Wellcome Collection (Indic manuscripts, open IIIF). Europeana has a REST/Search API with IIIF. National Digital Library of India (IIT Kharagpur) is mostly a metadata aggregator that requires login, with no public bulk API that I know of. — [IIIF Presentation API 3.0](https://iiif.io/api/presentation/3.0/); [Cambridge Digital Library](https://cudl.lib.cam.ac.uk/); [Wellcome IIIF](https://iiif.wellcomecollection.org/); [Europeana APIs](https://pro.europeana.eu/page/apis)
- Zenodo/GitHub datasets: DCS CoNLL-U is on GitHub under CC BY 4.0 (the website says CC BY 3.0). The DCS web text pages sit behind proof-of-work, and we did not bypass it. — `docs/research/sources.md` §7; [DCS data readme](https://raw.githubusercontent.com/OliverHellwig/sanskrit/master/dcs/data/readme.md)

### Inferences
- Priority order for Dheevara: archive.org (scans) → Wikisource `Page:` (human-proofread transcriptions tied to scans) → GRETIL/Smith e-texts (already pinned) → IIIF manuscripts (illustrative and scholarly, not core text) → HathiTrust (only for volumes missing elsewhere).
- An IIIF canvas plus a region `xywh` is the cleanest "page" anchor for a scan citation, even for archive.org items. IA serves IIIF manifests for books [unverified this session].

### Gaps
- NDLI API access terms are unverified.
- BL/Cambridge/Wellcome Mahābhārata/Rāmāyaṇa manuscript counts are not checked.
- Current HTRC access for non-member individuals is not checked.

## 4. OCR for Indic and Sanskrit scans

### Takeaway
No public benchmark yet compares the hosted OCR services on **printed Devanagari Sanskrit with diacritics and critical apparatus**. The best evidence is Hindi real-scan chrF++ (Gemini 2.5 Flash 86.3 leads) and a small Sanskrit-manuscript panel (Gemini 3.1 Pro 9.86% CER against a specialised pipeline at 3.45%). Sarvam Vision is the India-built, Indic-first option at ₹0.5–1.5/page. Mistral OCR is the cheapest hosted option at $1–2 per 1,000 pages and is not used for training. Dheevara must build its own 50–100-page gold set from its actual editions.

### Cited Findings
- **Sarvam Vision** (`sarvam-vision`, a 3B state-space VLM): 23 languages (22 Indian plus English); PDF/PNG/JPG/ZIP input; **10 pages per PDF**, 10 images per ZIP, 200 MB max; **10 requests/min on all plans**. Output is HTML or Markdown plus page-level JSON, with tables to HTML/MD and layout and reading order kept. SDK: `doc_ai.digitise` / `get_status` / `get_download_url` (the older `document_intelligence` job API is legacy). The docs page gives no pricing, benchmark or data-retention terms. — [Sarvam Vision docs](https://docs.sarvam.ai/api/getting-started/models/sarvam-vision.md)
- Sarvam pricing conflicts: the official page shows ₹1.5/page base; later reports say a 67% cut to ₹0.5/page. A Sept 2026 report on "Vision 2.1" cites olmOCR-Bench 87.3, which I did not verify with Sarvam. — [Sarvam document digitisation](https://www.sarvam.ai/apis/document-digitisation); [ai-market-watch report](https://www.ai-market-watch.com/news/sarvam-ai-cuts-vision-api-prices-by-67-after-digitizing-35-million-documents-in--dlhinv); [Angel One report on Vision 2.1](https://www.angelone.in/news/unlisted-companies/sarvam-launches-vision-2-1-ai-model-for-documents-and-indian-languages)
- **Devanagari stress test** (arXiv 2606.29213, A. P. Singh, 2026-06-28), ten systems, real-scan chrF++: Gemini 2.5 Flash **86.3**, Claude Opus 4.7 **82.2**, Qwen3-VL-8B **75.2**, GPT-5.5 **58.5**, EasyOCR **58.3** (93.6 on synthetic), olmOCR-7B **40.5**. Mistral OCR was evaluated, but its number is not in the abstract. Synthetic renders overstate quality. A ByT5 post-corrector gained +1.2 to +1.5 chrF++ on the engine it was trained for and **did not transfer** to other engines. — [arXiv 2606.29213](https://arxiv.org/abs/2606.29213)
- **Sanskrit manuscripts** (MIDF/eGangotri, HF `tadad/midf-sanskrit-ocr`): on 220 pages of one manuscript style, the MIDF pipeline v1.2 scores **3.45% CER** and Gemini 3.1 Pro **9.86%** with the same references. The authors warn that the panel is one style, the segmenter had seen that manuscript, and margins and crossed-out marks are not consistently captured. A search snippet quoted "10.49% on nine pages" for Gemini; the fetched page says 9.86% on 220. — [MIDF Sanskrit OCR](https://huggingface.co/tadad/midf-sanskrit-ocr)
- Sanskrit post-OCR correction benchmarks and data: [Sanskrit post-OCR benchmark, arXiv 2211.07980](https://arxiv.org/pdf/2211.07980); RoundTripOCR (Tesseract baseline across six Devanagari languages including Sanskrit; Hindi Tesseract CER 2.25%) — [arXiv 2412.15248](https://arxiv.org/pdf/2412.15248); in-context/retrieval strategies for Devanagari post-OCR — [arXiv 2609.21595](https://arxiv.org/pdf/2609.21595)
- **Mistral OCR 3** (`mistral-ocr-2512`): **$2 per 1,000 pages**, **$1 per 1,000** via the Batch API. — [The Decoder](https://the-decoder.com/mistral-ocr-3-promises-better-cheaper-document-analysis/); [PyImageSearch review](https://pyimagesearch.com/2025/12/23/mistral-ocr-3-technical-review-sota-document-parsing-at-commodity-pricing/). Data: Mistral's help centre says Mistral OCR "does not fall under our data training programs for both the Experiment and Scale plans and benefits from Zero Data Retention by default". Commercial terms revised effective 2026-08-05 allow training on **Labs/experimental** models even if you opted out elsewhere. — [Mistral help: training opt-out](https://help.mistral.ai/en/articles/347614-can-i-opt-out-of-my-input-or-output-data-being-used-for-training); [ConductAtlas change record](https://conductatlas.com/change/2026-08-08-mistral-ai-mistral-ai-commercial-terms-4262/)
- **Gemini API**: on the paid tier, Google does not use prompts, files or responses "to improve our products", but logs them for a limited period to detect abuse. The free tier **is** used for improvement and may be read by human reviewers. — [Gemini API billing/pricing](https://ai.google.dev/gemini-api/docs/billing); [Simon Willison on Gemini terms](https://feeds.simonwillison.net/2024/Oct/17/gemini-terms-of-service/)
- **[unverified this session]** Open/self-host options: Tesseract 5 with `tessdata_best` `san`, `hin`, `tel`, `tam`, `kan` and `script/Devanagari` models (free, weak on diacritics and small apparatus type); Surya (multilingual OCR with layout and reading order, GPL-family licence with commercial limits); Marker (PDF→Markdown on Surya); docling (IBM, MIT, layout/table models, pluggable OCR); olmOCR (AI2, a Qwen-VL fine-tune, scores weakly on Devanagari above). Azure Document Intelligence Read supports Hindi/Devanagari printed text. Google Document AI Enterprise OCR covers Indic scripts. Bhashini/IIT-Bombay OCR (Udaan/"Indic OCR") offers Indic printed-text APIs via the Bhashini ULCA platform. — [tessdata_best](https://github.com/tesseract-ocr/tessdata_best); [Surya](https://github.com/datalab-to/surya); [Marker](https://github.com/datalab-to/marker); [docling](https://github.com/docling-project/docling); [olmOCR](https://github.com/allenai/olmocr); [Bhashini](https://bhashini.gov.in/)

### Inferences
- Critical apparatus (small-type variant readings with siglum codes beneath the verses) is a layout problem first. Plan: run layout detection (docling, Surya or Sarvam's layout JSON) to split **text block / apparatus / footnotes / running head / page number** into separate regions, OCR each, and store each region with its page bbox. Only the text block feeds the verse-aligned corpus. The apparatus is kept as evidence and not parsed in v1.
- Recommended evaluation: two engines, one Indian (Sarvam Vision) and one global (Gemini paid tier or Mistral OCR), on a 50-page gold set from the BORI CE and a Ganguli page-image volume. Measure CER after Unicode NFC and nukta/anusvāra normalisation. For CE Sanskrit we already have Smith's e-text, so OCR→e-text alignment gives a free, automatic CER on every page (see §5).
- Rule 5 (no training on our texts): Gemini **paid** tier, Mistral OCR (ZDR by default, but not Labs models) and Sarvam (terms **unverified**) are candidates. Free-tier Gemini is excluded.
- Cost at 100k pages: Mistral ≈ $100–200; Sarvam ≈ ₹50k–150k (≈ $600–1,800); Gemini depends on tokens (not computed).

### Gaps
- No CER figures for printed Devanagari Sanskrit with IAST/apparatus from any hosted vendor.
- Sarvam's data-retention and training terms were not found.
- Google Document AI and Azure pricing as of Oct 2026 were not fetched.
- The Bhashini OCR API status was not verified.

## 5. Text alignment, Sanskrit NLP and transliteration

### Takeaway
Alignment is the step that turns OCR into citations: map each OCR line or translation paragraph to a CE verse id (`7.34.19`). For Sanskrit OCR→CE, character-level alignment against Smith/GRETIL (Needleman–Wunsch or difflib-style on normalised SLP1) is enough. For Ganguli→CE, use section-level anchoring plus multilingual embeddings, then human review. Vidyut (Ambuda, MIT) is the modern Sanskrit toolkit for transliteration, segmentation and lookup.

### Cited Findings
- Vidyut (Rust, Python bindings, MIT, part of Ambuda) includes `vidyut-cheda` (segments Sanskrit into words with morphological annotation), `vidyut-kosha` (compact store for tens of millions of inflected forms), `vidyut-lipi` (transliteration), `vidyut-chandas` (experimental meter classifier) and `vidyut-prakriya` (word generation). Its docs say some Python modules are production-ready and others experimental. — [Vidyut docs](https://vidyut.readthedocs.io/en/latest/introduction.html); [vidyut-lipi README](https://github.com/ambuda-org/vidyut/blob/main/vidyut-lipi/README.md); [ISCLS 2024 paper](https://aclanthology.org/2024.iscls-1.7.pdf)
- DCS has lemma and morphology data in CoNLL-U (CC BY 4.0), but its sentence counter is not the CE verse number and drifts (CE 1.1.174 = counter 176). — `docs/research/sources.md` §7
- **[unverified this session]** Other tools: CollateX (multi-witness collation, Java/Python); passim (text-reuse detection at scale, Spark); `indic_transliteration` (Python, wraps sanscript); Aksharamukha (100+ scripts, web API and Python package); `sanskrit_parser` (Python, sandhi/morph); ByT5-Sanskrit (Nehrdich, Hellwig et al., 2024, a byte-level model for segmentation, lemmatisation and morphological tagging); multilingual embeddings (e.g. LaBSE) for verse↔translation alignment. — [CollateX](https://collatex.net/); [passim](https://github.com/dasmiq/passim); [indic_transliteration](https://github.com/indic-transliteration/indic_transliteration_py); [Aksharamukha](https://github.com/virtualvinodh/aksharamukha-python); [sanskrit_parser](https://github.com/kmadathil/sanskrit_parser); [ByT5-Sanskrit, EMNLP Findings 2024](https://aclanthology.org/2024.findings-emnlp.805/)

### Inferences
- OCR→CE pipeline: transliterate OCR output to SLP1 (vidyut-lipi) → strip punctuation and daṇḍas → align against the pinned Smith text for the expected adhyāya → each OCR line gets `{verse_id, char_span, page, bbox, edit_distance}`. A per-page CER drops out of this, and any page above a threshold is routed to review.
- Ganguli→CE: Ganguli's "Section N" numbering follows the Calcutta/vulgate recension, not the CE, so mapping is many-to-many with star passages. Use a published concordance where one exists, then embedding similarity between Ganguli paragraphs and CE verses (via an English gloss or a multilingual model). Every link is stored as a *proposed* alignment with a score until a human accepts it.
- Store alignments as W3C Web Annotations (see §6), with `TextQuoteSelector` + `TextPositionSelector` on the pinned e-text and a `FragmentSelector` (`xywh=`) on the IIIF canvas.

### Gaps
- No existing Ganguli-section↔CE-adhyāya concordance was found this session. It needs a targeted search, e.g. Brodbeck or the CE "Concordance" volumes.
- Production-readiness of each Vidyut Python module is unconfirmed.

## 6. Extraction into a graph with evidence, and human review

### Takeaway
LangExtract (Google, Apache-2.0) matches the "every fact keeps its evidence" requirement: each extraction is grounded to character offsets in the source. It works with Gemini or OpenAI models, or local models through Ollama, and makes an HTML review view. Pair it with JSON-schema structured outputs, W3C Web Annotation for span anchoring, and a review tool (INCEpTION or Label Studio). Conflicting sources should be modelled as separate, attributed assertions, never merged into one "truth".

### Cited Findings
- LangExtract gives "precise source grounding": each extracted entity is tied to exact character offsets in the input. It uses few-shot schema definitions, chunking, parallel and multi-pass extraction for long documents, and self-contained HTML visualisation. It supports Gemini, OpenAI and local models via Ollama. Licence Apache-2.0; v1.6.0 listed as 2026-07-02 (third-party listing). — [Google Developers Blog: Introducing LangExtract](https://developers.googleblog.com/introducing-langextract-a-gemini-powered-information-extraction-library/); [dev.co LangExtract profile](https://dev.co/ai/frameworks/langextract); [W&B tutorial](https://wandb.ai/wandb_fc/genai-research/reports/LangExtract-Transform-text-into-structured-data-with-AI--VmlldzoxNDI1OTMyNw)
- **[unverified this session]** W3C Web Annotation Data Model (Recommendation, 2017) defines `TextQuoteSelector` (exact/prefix/suffix), `TextPositionSelector` (start/end), `FragmentSelector` (media fragments `xywh=` for images) and `SpecificResource` + `state` (a `TimeState` pinned to a cached copy, i.e. the Wayback URL). — [W3C Web Annotation Data Model](https://www.w3.org/TR/annotation-model/)
- **[unverified this session]** Review tools: INCEpTION (TU Darmstadt, Apache-2.0, span and relation annotation, knowledge-base linking, active recommenders; widely used in DH); Label Studio (Apache-2.0 community edition, NER and relations, ML backend); Argilla (now part of Hugging Face, feedback datasets for LLM output review); Recogito Studio / Recogito-js (Pelagios, annotation of texts and IIIF images, emits W3C annotations). GLiNER is a small zero-shot NER model you can run locally, useful as a cheap first pass. — [INCEpTION](https://inception-project.github.io/); [Label Studio](https://labelstud.io/); [Argilla](https://github.com/argilla-io/argilla); [Recogito](https://recogito.github.io/); [GLiNER](https://github.com/urchade/GLiNER)
- **[unverified this session]** How DH knowledge graphs handle uncertainty and conflicting sources: the CIDOC-CRM `E13 Attribute Assignment` pattern (each assertion is an event carried out by an actor citing a source); Wikidata statements with ranks (preferred/normal/deprecated), qualifiers and references; RDF named graphs or nanopublications (assertion + provenance + publication info); Factoid prosopography (KCL: "source S says person P did X"). — [CIDOC CRM](https://cidoc-crm.org/); [Wikidata: Help:Ranking](https://www.wikidata.org/wiki/Help:Ranking); [Nanopublications](https://nanopub.net/); [Factoid prosopography](https://www.kcl.ac.uk/research/factoid-prosopography)

### Inferences
- Graph model for Dheevara: `Assertion{subject, predicate, object, time?(narrative-relative), source_ref → Evidence}`, where `Evidence{edition, verse_id | page+bbox, quote, char_span, sha256 of source file, retrieved_at, wayback_ts}`. Conflicts (CE vs vulgate, Vālmīki vs regional Rāmāyaṇas) live side by side, each with its own evidence. A `status` field (proposed / reviewed / scholar-approved) maps to rule 9.
- LLM extraction is a *proposal*. LangExtract's offsets satisfy rule 2 mechanically, but the claim id becomes citable only after review. Reject any extraction whose span text does not match the pinned source bytes exactly; this is a cheap test.
- Rule 5: run LangExtract only against paid, no-training endpoints (Gemini paid, or local Ollama). Our own unreleased translations must never go to free tiers.

### Gaps
- No head-to-head data on LangExtract against Instructor or structured outputs for span accuracy on Sanskrit or IAST.
- GLiNER's performance on Indic names is unknown.
- Recogito Studio's hosting and pricing in 2026 are unchecked.

## 7. Legal and ethical scraping

### Takeaway
We should obey robots.txt and site terms, identify ourselves, ramp up slowly, keep a crawl log, and never get around access controls: no Cloudflare challenge solving, no DCS proof-of-work, no CAPTCHA services. The repo already follows this (sources.md §3 and §7).

### Cited Findings
- IA asks for slow ramp-up, prior contact for large projects, and contact rather than automatic retry after a block. — [IA blog, 2023-05-29](https://blog.archive.org/2023/05/29/let-us-serve-you-but-dont-bring-us-down/)
- sacred-texts.com is behind a Cloudflare managed challenge (403). The repo did not try to get past it and used mirrors instead. DCS pages use a proof-of-work check meant to stop "automated mass downloads", and the repo did not bypass it. — `docs/research/sources.md` §3, §7
- SPN2 has per-URL, per-minute and per-day caps (see §2). — [SPN2 docs](https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/mobilebasic)
- Gutenberg requires robots to use mirrors or harvest feeds [unverified this session]. — [Gutenberg robot policy](https://www.gutenberg.org/policy/robot_access.html)
- **[unverified this session]** RFC 9309 (Robots Exclusion Protocol, 2022) is the standard for robots.txt parsing. — [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309)

### Inferences
- Crawl-log contract (append-only JSONL, committed under `content/canon/crawl-log/`): `{ts, url, method, status, bytes, sha256, robots_ok, robots_txt_sha256, user_agent, delay_ms, purpose, warc_file, wayback_ts}`. The fetcher reads robots.txt first, applies one request per second per host by default (or Crawl-delay if larger), backs off on 429/503, and **fails loudly** on a 403 challenge without retrying, consistent with CLAUDE.md's "no local stand-ins / fail loudly".
- User-Agent: `DheevaraCorpusBot/0.1 (+contact URL)`. Email IA before any job over about 10k files.
- Copyright gate before download is separate from crawl ethics. Fetching a public-domain-looking scan is fine for research; publishing derived text requires the rights record (sources.md §8, the BORI CE status).

### Gaps
- Indian legal position on text-and-data mining (Copyright Act s.52 has no explicit TDM exception) is not researched here; it needs a legal note.

---

## Recommended toolchain for a 2–3 person team (end-of-notes synthesis, built from the findings above)

| Stage | Tool | Why | Cost (est.) |
|---|---|---|---|
| Discover | archive.org advancedsearch/Scraping API + `internetarchive` CLI; MediaWiki API (Wikisource `Page:`/`Index:`); HathiTrust Bibliographic API | Biggest Indic scan pools, metadata includes rights hints and file hashes | Free |
| Acquire | Extend `src/canon/fetch.mjs`: robots check → polite fetch → sha256 pin → crawl-log line; wrap in `warcio` (Python sidecar) or a Node WARC writer | Keeps the existing fail-loud pin contract | Free |
| Preserve | Local WARC/WACZ in object storage (or Drive "Dheevara — Build Output") + SPN2 capture per cited URL (S3 keys; 30k/day) | Our own bytes plus an independent timestamped witness | Storage ≈ $1–5/mo at 100–200 GB |
| Layout + OCR | Sarvam Vision (Indic-first, India-hosted) as primary; Mistral OCR 3 batch or Gemini paid tier as second engine; Tesseract `tessdata_best` as free baseline | Two-engine disagreement flags bad pages; all candidates are no-training (Sarvam terms to verify) | 100k pages: Mistral ≈ $100–200; Sarvam ≈ ₹50k–150k |
| Normalise + align | vidyut-lipi (→SLP1/IAST/Devanagari), char-level alignment to pinned Smith/GRETIL text, embeddings for Ganguli↔CE; CollateX for multi-edition comparison | Every OCR line gets a CE verse id and a measured CER | Free (+ embedding API pennies) |
| Extract | LangExtract with Gemini paid (or local Ollama) + JSON schema; GLiNER as a cheap pre-pass | Character-offset grounding = rule 2 by construction | Approximately tens of dollars per full parva (not computed precisely) |
| Represent | Assertion + Evidence model; W3C Web Annotation selectors; Wikidata-style ranks and nanopub-style provenance for conflicts | Conflicting sources coexist with attribution | Free |
| Review | INCEpTION (self-hosted, span + relation + KB) or Label Studio CE; scholar sign-off stored as a record (rule 9) | Proposed → reviewed → approved workflow | Free self-hosted; a small VM ≈ $10–20/mo |

Cost figures are estimates from the cited unit prices. Verify Sarvam's live price and data terms, and run the 50-page gold-set OCR bake-off before committing to an engine.
