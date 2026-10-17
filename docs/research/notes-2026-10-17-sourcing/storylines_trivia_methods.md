# Methods for turning a cited corpus into storylines, character bibles and trivia (Dheevara, as of 17 Oct 2026)

Scope: methods and precedents, not raw sources. Read against `docs/architecture/temporal-knowledge-graph.md` (§2.1 story time, §2.1.1 tellings, §3.3 knowledge layer, §6 agents on the graph). Research budget: about 20 tool calls. Some key scholarly works (Fitzgerald, Hiltebeitel, Brockington on war chronology) could **not** be retrieved; they are listed as gaps, not cited.

## 1. Precedents in digital humanities and computational narrative

### Takeaway
No published project extracts a verse-cited event timeline from the Mahābhārata automatically. The Indology precedents are hand-annotated knowledge graphs (Sangrahaka), ontology designs (GENOME), and character co-occurrence networks. General tools such as BookNLP, TimeML and Allen-based fabula models are English-first or need annotation. This supports the design's rule that LLM extraction feeds only a candidate queue (§6.2).

### Cited Findings
- **Sangrahaka** (Terdalkar and Bhattacharya, ESEC/FSE 2021, pp. 1520–1524) is a web tool for annotating entities and relations in a corpus and querying the resulting knowledge graph through "templatized natural language queries". It is described as language- and corpus-agnostic — [arXiv 2107.02782](https://arxiv.org/abs/2107.02782)
- The Sangrahaka paper says Sanskrit NLP is not yet strong enough to extract entities and relations reliably, so its knowledge graph is built by human annotation. It also shows spaCy misclassifying entities in a single English sentence — [arXiv 2107.02782 (PDF)](https://arxiv.org/pdf/2107.02782)
- **GENOME** (Varadarajan, Bagchi, Tiwari and Satija, 2022; DOI 10.1633/JISTaP.2023.11.1.5) is a generic method for ontological modelling of epics, building by reuse or from scratch, with a "first brief implementation" for the Mahābhārata. The abstract gives no metrics and does not mention narration frames or time — [arXiv 2202.13751](https://arxiv.org/abs/2202.13751)
- **Character networks:** Gultepe and Mathangi (*Heritage*, 2023) build Mahābhārata social networks from TF-IDF and LSA similarity over verses. They validate the networks by recovering known relationships and by separating Pandava and Kaurava communities with spectral clustering — [DOAJ, Heritage 2023](https://doaj.org/article/1585d5ca9cc24f16b86fd09783a97e39); [MDPI review report](https://www.mdpi.com/2571-9408/6/11/366/review_report)
- Schauf and Escobar Varela (*Journal of Historical Network Research*, 2018) build weighted co-occurrence networks from Javanese wayang kulit versions of the epic, and find the Kaurava antagonists at the network's margins — [JHNR via DOAJ](https://doaj.org/article/5910adf2d4a94fe88ce4e58870ac9451); [reference-global](https://reference-global.com/article/10.25517/jhnr.v2i1.42)
- Elwert, Gerhards and Sellmer, "Gods, graves and graphs" (*Digital Classics Online*, 2017), apply social and semantic network analysis to Ancient Egyptian and Indian corpora, including the Mahābhārata — [Mainz bibliography](https://bibliographie.ub.uni-mainz.de/catalog/publication-100543)
- A 2024 comparative study of mythological networks includes the Mahābhārata, which has one of the lowest shares of well-connected female characters — [arXiv 2409.11482](https://arxiv.org/pdf/2409.11482)
- A Neo4j NODES 2024 talk (Siddhant Agarwal) describes a Mahābhārata chatbot built on GraphRAG over a character, event and relation graph. It is a conference talk, not a paper — [Neo4j NODES 2024](https://neo4j.com/videos/nodes-2024-from-ancient-epic-to-modern-marvel-demystifying-the-mahabharata-chatbot-with-graphrag/)
- **BookNLP** is an English pipeline for long texts: NER, character name clustering, pronominal coreference and quote-to-mention linking. It is trained on LitBank (100 chapters of public-domain books) — [BookNLP repository mirror](https://github.com/anilsener/book-nlp); [arXiv 2307.03734](https://arxiv.org/html/2307.03734v1)
- On full-length novels (the Project Dialogism Novel Corpus), state-of-the-art models are "still quite poor" at character identification and coreference, which hinders quotation attribution — [arXiv 2307.03734](https://arxiv.org/pdf/2307.03734); [PDNC, arXiv 2204.05836](https://arxiv.org/pdf/2204.05836)
- BookNLP's errors cluster on anaphoric and implicit quotes. Stylometric character embeddings improve speaker identification on 28 novels — [arXiv 2406.11368](https://arxiv.org/pdf/2406.11368)
- **TimeML:** ISO 24617-1:2012 (ISO-TimeML) defines TLINK (temporal), ALINK (aspectual) and SLINK (subordination) links — [ISO 24617-1 catalogue](https://iteh.es/catalog/standards/iso/4c169c0c-9ca6-437b-bfb0-7f88d6fcd6d0/iso-24617-1-2012); [ACL P11-2023](https://preview.aclanthology.org/fix_video/P11-2023.pdf)
  - A TLINK can relate two events, two time expressions, or an event and a time — [TimeBank 1.2, LDC2006T08](https://catalog.ldc.upenn.edu/LDC2006T08)
  - Relation detection usually follows Allen's 13 interval relations — [Lefeuvre-Halftermeyer et al. 2016](https://halshs.archives-ouvertes.fr/halshs-01318792v1/file/Lefeuvre%26al_2016.pdf)
  - TLINK also has an IDENTITY value for same-event coreference — [Italian TimeBank, LREC 2010](https://lexitron.nectec.or.th/public/LREC-2010_Malta/pdf/776_Paper.pdf)
  - TimeBank itself is 183 documents — [ISO catalogue](https://iteh.es/catalog/standards/iso/4c169c0c-9ca6-437b-bfb0-7f88d6fcd6d0/iso-24617-1-2012); TempEval-3 standardised the evaluation — [arXiv 1206.5333](https://arxiv.org/pdf/1206.5333)
- **Fabula and syuzhet:** A CMN 2016 story-structure paper models each event's time as an interval and relates events with Allen's logic, plus part-of and causal relations. It keeps a separate plot layer that maps events to the text that tells them — [Dagstuhl OASIcs CMN 2016](https://drops.dagstuhl.de/storage/01oasics/oasics-vol053_cmn2016/OASIcs.CMN.2016.4/OASIcs.CMN.2016.4.pdf)
- A graph storyworld model argues that a single timestamped timeline cannot separate chronological causality from the viewing experience — [StoryGraph, "Don't Blink"](https://storygraph.substack.com/p/dont-blink)
- "Time maps" plot fabula (vertical axis) against syuzhet (horizontal axis) — [Time Maps, OSU](https://kb.osu.edu/items/44e45211-5bea-4ce6-94b4-6b0319562418); [DH abstracts](https://dh-abstracts.library.virginia.edu/works/10147)

### Inferences
- Dheevara's `story.event` + `story.account(event, telling, claim, mode)` + `passage.ord` is a clean fabula/syuzhet split. Event placement on the war clock or in `event_order` is the fabula; `passage.ord` of each account's claim is the syuzhet.
- A time map (war tick against CE `ord`) is a cheap QA view. It would expose, for example, Sañjaya's early report of Droṇa's fall against the later narration of the days before it.
- Borrow the TimeML vocabulary rather than invent one: Allen relations on `event_order`, plus IDENTITY for "7.41 retells 3.256" (`mode = retold`). It is enough to store `before` and `includes`/`during` (for `part_of`); the full 13 relations are not needed.
- Use BookNLP-style tooling, if at all, only on English translations (Ganguli) to propose candidates. The research shows coreference on long narratives is weak, and epithets make it worse (see §3).
- Character networks are a QC and discovery tool, for example "who co-occurs with Abhimanyu in Droṇa 7.33–51". They are not evidence.

### Gaps
- I found no published verse-level event timeline of the Mahābhārata, and no Indology project that models narration frames computationally. The frame structure in §2.1.1 is standard scholarship but needs a scholar's citation, not a DH precedent.
- The GENOME classes and the Sangrahaka corpora (reportedly Rāmāyaṇa and Bhagavad Gītā annotation) were not confirmed from the abstract pages; check the PDFs.
- I did not check Wikidata's coverage of epic characters (open question 6 in the architecture doc).

## 2. Story-time reconstruction for the Mahābhārata

### Takeaway
The day count of the war follows the parvan division in popular summaries: Bhīṣma days 1–10, Droṇa 11–15, Karṇa 16–17, Śalya 18. That is a reading convention, not a fact any single verse states. Day placement must be cited to the verses that mark a day ("on the thirteenth day", sunrise or sunset). Uncertain ordering should be stored as a partial order with Allen relations, never forced onto a clock. Absolute dates (astronomical "dating of the war") are contested and outside the model.

### Cited Findings
- Popular summaries split the 18 days by parvan as Bhīṣma 1–10, Droṇa 11–15, Karṇa 16–17 and Śalya 18, then Sauptika. This is a popular schema, not scholarship — [Gaudiya Treasures of Bengal](https://thegaudiyatreasuresofbengal.com/2023/08/20/18-days-of-the-mahabharata-war-battle-of-kurukshetra/); [Vedicfeed](https://vedicfeed.com/18-days-of-the-mahabharata-war-summary-of-the-war/)
- Fighting is usually described as stopping at sunset — [Kurukshetra War (fandom wiki; low quality)](https://military-history.fandom.com/wiki/Kurukshetra_War). Day 14 is a known exception, because the fighting continues into the night in the Droṇaparvan. I have not verified this with a citation; it needs a scholar check.
- Wikipedia's Bhīṣma Parva article and Ganguli's translation present Bhīṣma's fall as the tenth day — [Wikipedia: Bhishma Parva](https://en.wikipedia.org/wiki/Bhishma_Parva); [sacred-texts, Ganguli 6.116](https://sacred-texts.com/hin/m06/m06116.htm)
- One blog points to uneven narration of Bhīṣma's fall across Ganguli's sections CXIX–CXX: first Arjuna with Śikhaṇḍin in front, then "all the Pāṇḍavas" surrounding him. Treat it as an example of the kind of internal variation that needs per-account claims, not as scholarship — [Boloji](https://www.boloji.com/articles/7380/mahabharata-the-myth-of-the-death)
- **Absolute dating is contested and not scholarly consensus.** Astronomical datings differ by millennia: one series puts the war in 3136 BCE and treats the 58-day (Bhīṣma) and 56-day (Kṛṣṇa) waiting periods as data, while Nilesh Oak puts Bhīṣma's fall on 25 October 5561 BCE — [Saranathan thread](https://threadreaderapp.com/thread/1351127078259847173.html); [Nilesh Oak](https://nileshoak.wordpress.com/2013/07/24/mahabharata-war-timeline-summary/)
- The interval of time between Bhīṣma's fall and his death (58 vs 56 days) is a textual discrepancy that dating authors use — [Saranathan thread](https://threadreaderapp.com/thread/1351127078259847173.html). It is a good example of a contested placement to store as two accounts.
- **Representation:** Allen's interval algebra gives all 13 qualitative relations between two intervals on a linear order — [arXiv 1909.01128](https://arxiv.org/pdf/1909.01128). OWL-Time supports ordinal and relative positions such as a custom "war day N" reference system, and SEM has "view" (according-to) constraints that suit narrator frames — [Dheevara research note, temporal KG storage](../notes-2026-10-15-open-source/temporal_knowledge_graph_storage.md) (which cites [OWL-Time](https://www.w3.org/TR/owl-time/))

### Inferences
- Use three tiers of placement, matching §2.1:
  1. **Stated:** a verse names the day or the boundary (sunrise, sunset, "tomorrow"). `kn.support.role = 'dates'` points at that verse.
  2. **Derived:** the day follows by counting from stated anchors, for example "the next morning" after a stated day. Store the derivation chain as `event_order` edges, and let the tick be computed rather than asserted. Mark the placement `derived`.
  3. **Conventional:** the parvan = days mapping. Never store it as a claim. At most it is a popular attestation (`pa.*`) or an editorial note.
- Contested placements, such as the 58 vs 56 days, the night fighting of day 14 and 15, or vulgate against CE ordering, get one `account` per telling or expression with its own claim, never one averaged value. The reveal format (popular vs CE vs "our collection") is exactly this.
- The 13-year exile clock (`exile.year`) and pre-war eras will be mostly partial order. Expect `clock_span = NULL` for most of them; that is correct, not missing data.
- Do not model absolute (BCE) dates. Dating the war is a live controversy, and the architecture already excludes composition dates (§2.2).

### Gaps
- **Not found:** scholarly chronologies of the war days. Fitzgerald's Droṇa/Strī/Śānti translation volumes and introductions, Hiltebeitel's *Rethinking the Mahābhārata* (2001), Brockington's *The Sanskrit Epics* (1998), and the BORI CE introductions (Sukthankar, De) could not be retrieved in this pass. Their positions on the war-day count, night battles and the Sañjaya frame are unverified and must not be quoted until a scholar or a later pass checks them.
- I did not compile a list of the CE verses that explicitly state day numbers; that is corpus work for the scholar (or a regex pass over the GRETIL e-text for ordinals with *ahan*/*divasa*, then human review).

## 3. Character bibles from text: aliases, relations with time qualifiers, attributes

### Takeaway
Model a character bible as a projection of cited statements, never as a free-text profile. Store names and epithets as rows, each with a language and a script, the passage that attests it, and the gloss the text itself gives. Relations get time qualifiers from eras, events or ticks. Attributes are statements with citations. Conflicts between editions are kept side by side with ranks, the Wikidata pattern.

### Cited Findings
- Arjuna recites his ten names to Uttara in the Virāṭaparvan (CE 4.39; Ganguli numbers it as section 44): Arjuna, Phalguna, Jiṣṇu, Kirīṭin, Śvetavāhana, Bībhatsu, Vijaya, Kṛṣṇa, Savyasācin and Dhanañjaya. Each name comes with an in-text etymology, for example Savyasācin because he draws Gāṇḍīva with either hand, and Phalguna for birth under Uttara Phalgunī — [Ganguli 4.44 (mahabharataonline)](https://mahabharataonline.com/translation/mahabharata_04044.php); [sacred-texts 4.44](https://sacred-texts.com/hin/m04/m04044.htm); [Adhyāya 39 (vedapath)](https://vedapath.app/en/mahabharata/virata-parva/39). The CE verse numbers must be confirmed against `bori-ce`.
- **Wikidata's model** for conflicting attestations: every statement can carry qualifiers and references (`prov:wasDerivedFrom` → `pr:P248` "stated in"). Statements have ranks: preferred (current or consensus), normal (the default, with no judgement on accuracy) and deprecated (erroneous or outdated). Query "truthy" results return preferred values if any exist, otherwise normal, and never deprecated — [UMBC Wikibase slides](https://courses.cs.umbc.edu/graduate/691/fall22/kg/notes/24_wikidata/wikibase.pdf); [qwikidata claim docs](https://qwikidata.readthedocs.io/en/stable/qwikidata.claim.html)
- **SNAP:DRGN** (King's College London, 2014–15, with LGPN, Trismegistos, Papyri.info and Pelagios) recommended minimal RDF person records. It acts as an index of people across datasets ("an ancient world VIAF") rather than a new prosopography, and it focuses on identity matching and on the provenance of assertions. It produced about 650,000 records, a 2015 ontology and a 2024 Cookbook — [Digital Classicist wiki: SNAP](https://wiki.digitalclassicist.org/SNAP); [Stoa blog intro](https://blog.stoa.org/archives/1958); [DH abstracts](https://dh-abstracts.library.virginia.edu/works/2065)
- Long-text coreference is weak even in English novels — [arXiv 2307.03734](https://arxiv.org/pdf/2307.03734). Sanskrit relation extraction is not reliable enough to replace annotation — [Sangrahaka](https://arxiv.org/pdf/2107.02782)

### Inferences
- **Name table** (`story.entity_name`): `(entity, name, script, lang, kind ∈ {name, epithet, patronymic, metronymic, title}, attested_by claim, gloss_claim)`. Arjuna's ten names are ten rows citing the 4.39 range, and each gloss is its own claim. The epithet "Kṛṣṇa" for Arjuna is a direct test case for the entity resolver: it must never merge into `krishna`. That is the "silent merge" risk in §6.2. Patronymics (Pārtha, Kaunteya, Pāṇḍava) are ambiguous across brothers and must be resolved per passage, never globally.
- **Relations with time:** `student_of` holds from an event or era (`via_event` = Droṇa's instruction) and may have an end. `spouse_of` starts at a marriage event. `killed_by` is anchored to the event that produces it, which carries the day. Store the temporal scope as a start event plus an optional end event; ticks only where the text gives them. This matches CIDOC/Wikidata qualifier practice (start time and end time as qualifiers; Wikidata properties P580 and P582, a standard pattern I have not checked in this pass).
- **Attributes** (Gāṇḍīva, white horses, the monkey banner, Devadatta the conch): each is a relation `(entity, has_weapon / has_banner / has_conch, object)` with its own support claim. The text's own epithet glosses double as attribute evidence (Śvetavāhana → white horses).
- **Conflicts:** adopt Wikidata ranks, mapped to Dheevara's rules:
  - **preferred** = the `bori-ce` main text;
  - **normal** = another expression (vulgate, regional recension, translation), shown with its label;
  - **deprecated** = a former Dheevara reading that was withdrawn (this is just a superseded claim version);
  - popular tellings are never ranks on a claim. They stay `pa.*` attestations.

  The bible view renders "CE says X (7.x.y); some manuscripts add Y (*NNN); popular tellings say Z" straight from these rows. That is the reveal grammar again.
- **Bible generation:** an LLM can draft the prose bible only through the `facts()` tool, with every sentence carrying claim ids. The validator in §6.1 (each named entity must have a supporting fact) applies unchanged.

### Gaps
- I did not verify that BORI CE numbering puts the ten names at 4.39 (vedapath and enjoylearningsanskrit use adhyāya 39, and Ganguli uses section 44).
- I found no published Sanskrit epithet lexicon in machine-readable form. Sources worth checking later: Sörensen's *Index to the Names in the Mahābhārata* (1904), and the Cologne PE (Purāṇic Encyclopaedia) scans, which showed up in search — [Cologne PE scan](https://sanskrit-lexicon.uni-koeln.de/scans/PEScan/PEScanpdf/pg_060.pdf)

## 4. Trivia and "hidden detail" generation that stays truthful

### Takeaway
The safe pattern is: **select** from signed claims, then **template**, then let an LLM **paraphrase** the surface, then **decompose** into atomic facts, then **entail-check** each fact against the cited passages (FActScore or RAGAS-faithfulness style), then **human review**. A generated item may never introduce a fact that is not already a signed claim. Automated checks are judges, not authorities.

### Cited Findings
- **FActScore** (Min et al., EMNLP 2023) splits a generation into atomic facts and reports the share that a knowledge source supports. In a human study, ChatGPT biographies scored 58%. An automated estimator (retrieval plus an LM) comes within 2% error, and it is available via `pip install factscore` — [ACL Anthology](https://preview.aclanthology.org/setup/2023.emnlp-main.741); [Hugging Face 2305.14251](https://huggingface.co/papers/2305.14251)
- **RAGAS faithfulness:** an LLM breaks the answer into statements, then a judge gives each statement a yes or no against the retrieved context. The score is supported statements divided by all statements. Caveats:
  - the score depends on the judge model and prompt;
  - "faithful" is not "correct" if the source itself is wrong;
  - some versions return NaN when no statements are extracted, so report coverage alongside the score.

  Sources: [arXiv 2407.12873](https://arxiv.org/pdf/2407.12873); [OneUptime, Aug 2026](https://oneuptime.com/blog/post/2026-08-31-rag-faithfulness-retrieval-vs-answer-quality/view). I did not read the RAGAS docs directly.
- **KG → question pipelines:** KG-FPQ (COLING 2025) builds questions automatically from Wikidata-subset triples, including false-premise variants made by editing true triples, with human correction of the WH questions. Its judge reaches 93% accuracy on manually annotated sets. LLMs struggle most with false premises that are semantically close to the truth — [arXiv 2407.05868](https://arxiv.org/pdf/2407.05868); [COLING 2025](https://preview.aclanthology.org/setup/2025.coling-main.698)
- KGHaluBench (Feb 2026) checks open-ended answers in three stages: an abstention filter, an entity-level misalignment filter, and a fact-level check against grounded facts — [arXiv 2602.19643](https://arxiv.org/pdf/2602.19643)
- KGLens argues that generating questions from a KG can be fully automated at scale — [arXiv 2312.11539](https://arxiv.org/html/2312.11539v3)

### Inferences
- **Item types**, each a template over graph queries:
  1. "Who / what / which day": single relation or placement, with the answer and its claim.
  2. "Which name": epithet → entity, using the in-text gloss.
  3. "Text vs telling": a signed claim plus a `pa.*` popular attestation plus an optional star passage. This is the reveal; it is the highest value and the highest risk.
  4. "Order": two events with a cited `event_order` edge.
  5. "Who told whom": a telling.
- **Distractors** must come from the graph too: same type, same era, and **not** true for this slot. KG-FPQ shows that near-true distractors are where models fail, so a distractor must never be something some expression actually attests. Check every distractor against all expressions, not just the CE. A distractor that is a vulgate reading turns a quiz into misinformation.
- **Verification stack for each item:**
  1. A deterministic check: the answer entity and slot match a graph row, and its supporting claim is `signed`.
  2. The LLM paraphrase is decomposed into atomic facts (FActScore style).
  3. Each atomic fact is entailment-checked against the claim's statement and translation, and against the passage where `data_class` permits (rule 5). Any unsupported atom rejects the item, with zero tolerance, not a threshold.
  4. A second-model judge, advisory only (Jev #1).
  5. Editorial and sensitivity review, then scholar sign-off of the item as a record tied to the exact claim versions (rule 9).
- **Framing guardrails:**
  - The reveal compares *tellings*. Copy says "the critical edition's text does not tell it; some manuscripts do (*259)" (the approved wording pattern in §3.3). It never says "myth", "wrong", "actually" or "debunked".
  - A banned-phrase lint plus a framing rubric go in QC.
  - Sensitivity review covers revered figures (rule 1 extends to wording), caste and community references, and regional traditions that hold the "popular" version as their own.
- Cliffhanger questions are the same objects as trivia items, with the answer withheld. They must have a cited answer in the *next* chapter's claims (see §5).

### Gaps
- I found no published work on trivia generation for religious or mythological texts with a sensitivity review. The guardrails above are inferred from news-fact-checking practice and from Dheevara's own rules.
- I did not find published entailment accuracy for Sanskrit or Indic-language claim checking. Run the checks over the English statement and translation, and treat Sanskrit as id-matched (the architecture note already says this, §6.1).

## 5. Storyline planning from a graph

### Takeaway
Recent work (STORYTELLER 2025, KG-guided storytelling 2025, PLOTTER 2026) converges on planning over an explicit event and character graph, then generating text from the plan with a revise loop. For Dheevara the plan is a constrained selection over the verified event graph: pick a window, a witness, a reveal and a question. A planner checks hard constraints, for example "the next chapter answers the last question" means the answer's claim appears in chapter N+1. The LLM proposes; the constraints and the scholar decide.

### Cited Findings
- **STORYTELLER** (ACL Findings 2025) plans with plot nodes built from subject-verb-object triples. It keeps two interacting modules, a storyline and a narrative-entity knowledge graph, to address weak coherence in LLM story generation — [arXiv 2506.02347](https://arxiv.org/pdf/2506.02347)
- "Guiding Generative Storytelling with Knowledge Graphs" (2025) links a story engine and a KG in both directions. Users edit the graph, and later scenes stay consistent with it — [arXiv 2505.24803](https://arxiv.org/pdf/2505.24803)
- **PLOTTER**, "Planning Beyond Text" (April 2026), runs an Evaluate–Plan–Revise loop over an event graph and a character graph. It reports large gains over baselines (abstract only) — [arXiv 2604.21253](https://arxiv.org/pdf/2604.21253)
- Story Plan Graph (CEUR 2024) treats a story plan as a KG that captures causal links between events — [CEUR Vol-3818 paper 7](https://ceur-ws.org/Vol-3818/paper7.pdf)
- The Neo4j Mahābhārata chatbot uses GraphRAG over a character and event graph — [Neo4j NODES 2024](https://neo4j.com/nodes2024/agenda/from-ancient-epic-to-modern-marvel-demystifying-the-mahabharata-chatbot-with-graphrag/). Dheevara's design restricts GraphRAG to local search over verified rows, with no community summaries as evidence — [Dheevara architecture §6.1](../../architecture/temporal-knowledge-graph.md)

### Inferences
- **Chapter as a typed plan** (fits the existing beats):
  - `window`: era plus a tick range or event set;
  - `witness`: an entity with `can_witness`, and a telling;
  - `cold_open`: an event inside the window;
  - `verse`: one signed claim with a chantable passage;
  - `scene`: events in story order;
  - `reveal`: a claim, a popular attestation and an optional star passage;
  - `question`: an open edge whose answer claim is in the next window.
- **Hard constraints** (a validator, the same shape as the citation validator):
  1. Every beat references signed claims, or `etext` for drafts only.
  2. `question(N)` is answered by a claim in `claims(N+1)`. This is today's s1e3 → s1e4 decision: "The way in" asks, and "The gatekeeper" (3.256, 7.41–42) answers.
  3. The window is contiguous in story time, or it is a flashback marked by `account.mode = recalled/retold`.
  4. No reveal repeats within the season.
  5. The witness is present at or narrates the events (participation role `witness`, or the narrator of the account's telling).
  6. Rules 1 and 7 hold (no deity POV; the śloka is chanted).
- **Soft scoring** for candidate arcs: graph centrality of the protagonists (the character networks in §1), the density of signed claims (cheaper to verify), whether a reveal exists (popular vs CE divergence), and continuity with the previous chapter.
- **Search:** small enough to enumerate. For a season, list candidate windows from the event graph (for example the per-day event sets for days 13–14), score them, and let Claude in session propose 2–3 season orderings with rationales. A human picks, and the pick is written to `docs/decisions.md`. A full narrative planner (PDDL-style) is overkill at about 10–20 chapters per season.
- **Writers' room:** I found no documented AI-assisted writers' room that preserves sourcing (gap). The closest analogue is the KG-in-the-loop editing of arXiv 2505.24803. Build the room as: Claude drafts from `facts()`, the validator rejects uncited lines, the scholar reviews, and the plan is committed as files under `content/<chapter>/`.

### Gaps
- Benchmarks for PLOTTER and STORYTELLER were read only at abstract level.
- I found no production case study of an AI writers' room with mandatory citation.

## 6. Scholar workflow, sign-off and community contributions

### Takeaway
Comparable projects use a draft → submit → editor review → publish state machine, keep named credit on each record, version everything, and run periodic review parties for backlog. Wikidata adds per-statement references and ranks. Dheevara's `kn.review` (PROV activities pinned to claim versions) already matches. What is missing is a choice of tool and a "tell our scholar" intake that creates candidates, never claims.

### Cited Findings
- **Pleiades:** a contributor drafts a resource, then sets it from "Drafting" to "Submit for review". Editors email the contributor with questions or publish it, and on publication the contributor is credited under "Creators". There is a separate Reviewers' Guide — [Pleiades: adding a name resource](https://pleiades.stoa.org/help/add-a-new-name-resource); [Adding data](https://pleiades.stoa.org/help/adding-data-to-pleiades)
- Pleiades roles: senior editors, a managing editor, associate editors and reviewers — [Pleiades credits](https://pleiades.stoa.org/credits). A search result summarised a February 2026 weekly post that reports 3 new and 128 updated places and names the editors involved. I did not open that post or get its URL, so treat this as unconfirmed.
- Pleiades has held community "review parties" against a backlog of about 1,000 items (2013–14) — [Pleiades blog](https://pleiades.stoa.org/news/blog/review-parties-in-december-and-january). Its editorial guidelines were circulated for public comment in 2016 — [RFC post](https://pleiades.stoa.org/news/blog/request-for-comment-new-editorial-guidelines)
- **Wikidata:** references per statement plus ranks (preferred, normal, deprecated) — [UMBC slides](https://courses.cs.umbc.edu/graduate/691/fall19/07/notes/24_wikidata/wikibase.pdf)
- **SNAP:DRGN:** provenance of assertions and identity matching across datasets — [Digital Classicist wiki](https://wiki.digitalclassicist.org/SNAP)
- **Sangrahaka:** the annotation tool has roles and curation for building knowledge graphs from Sanskrit texts — [arXiv 2107.02782](https://arxiv.org/abs/2107.02782)

### Inferences
- Map the Pleiades states onto `kn.review`:
  - `candidate` (scratch, from an LLM or a viewer report) → `etext` (a claim is registered with a main-text target, by an editor) → `proofed` (text checked against print, double-keyed for quoted verses) → `signed` (by the scholar, on the exact version) → `withdrawn`.
  - A statement edit drops the claim back to `etext` automatically (§2.3).
- **Sign-off record:** a signed JSON over `{claim_id@version: sha256(statement ‖ targets)}` plus scholar id, method and date, stored as an object-store asset and referenced by `kn.review`. It is cheaper and more diffable than PDFs, and it can be batch-signed per chapter.
- **"Tell our scholar":** the in-app report creates a `scratch.candidate` (origin `viewer`) linked to the clip or reveal and the manifest version shown. The editor triages it, and the scholar answers. If the claim changes, a `pub.correction` is published with a public notice, and the reporter is credited Pleiades-style if they opt in. No viewer text ever becomes a claim directly.
- Hold monthly "review parties" (Pleiades) to clear the `etext → proofed` backlog. Proofing can be delegated; signing cannot.

### Gaps
- I did not research Perseus or Sanskrit Library editorial workflows in this pass; nothing is cited for them.
- I found no public Indology project with a per-claim sign-off record format to copy.

## 7. Recommended method for Dheevara (synthesis)

### Takeaway
The pipeline has six gated stages: candidates are cheap and machine-made, the record is human-made, and every output is a projection of signed claims checked by deterministic validators before any judge model.

### Cited Findings
- The stages below combine the precedents cited in §1–6. The authority rule (LLM candidates live in `scratch`, people promote them) is from [Dheevara architecture §6.2](../../architecture/temporal-knowledge-graph.md).

### Inferences
| # | Stage | Who / what | Output | Quality gate |
|---|---|---|---|---|
| 1 | **Corpus → passages** | Ingest (deterministic parser) over pinned e-texts (`bori-ce`, `bori-ce-app`, Ganguli as translation) | `txt.passage` with `ord`, main text separate from apparatus | Sha256 pins; star-passage guard (§4.4); Devanagari check |
| 2 | **Passages → candidates** | Claude in session, or an open model, proposing events, participations, relations, epithets, placements and accounts per adhyāya, each with a span. Optional helpers: regex for day markers and *iti* frames, character co-occurrence for QC | `scratch.candidate` rows (origin `llm`, model, span) | Schema-valid; the span resolves to a main-text `ord` range; entity ids are resolved against the existing register (no auto-merge; epithet collisions such as Kṛṣṇa/Arjuna and Pārtha are flagged) |
| 3 | **Candidates → claims** | Editor (human) promotes: writes the statement, translation and target. Placements are tagged stated, derived or conventional (conventional never becomes a claim) | `kn.claim@v1` (`etext`), `story.*` rows with `kn.support` | Loader: every edge supported; `event_order` acyclic; ticks only with a `dates` support; tellings nested correctly |
| 4 | **Verify** | Proofreader (text vs print, double-keyed quotes), then **scholar sign-off** on exact versions; conflicts stored as accounts per expression with ranks | `kn.review` signed records | Rule 9: `signed` is derived from the review rows; edits reset the status |
| 5 | **Graph → season and chapter plan** | Claude enumerates candidate windows and arcs via `facts()` (GraphRAG local search, signed only for finals); a human picks; the decision is logged | `content/<ch>/plan.json`: window, witness, cold open, verse, scene, reveal, question → next chapter | Plan validator: question(N) answered in claims(N+1); witness present or narrating; no repeated reveal; rule 1/7 checks |
| 6 | **Plan → script, bible, trivia** | Claude drafts narration, the character bible (projection of names, relations and attributes) and trivia from templates, then paraphrases | Drafts with `claims: [ids]` on every sentence and item | (a) deterministic citation validator; (b) atomic-fact decomposition and entailment against claim statements and translations, zero unsupported atoms; (c) distractor check against **all** expressions; (d) framing lint (no "myth/wrong/actually"); (e) second-model judge, advisory; (f) sensitivity and editorial review; (g) scholar sign-off of the items as records |
| 7 | **Release and feedback** | Publishing workflow; "Tell our scholar" intake | Manifest pins claim versions; reports → `scratch.candidate` | Corrections are new manifest versions with a notice; reporters credited |

Measures to track:
- the share of drafted atoms supported (FActScore-style, target 100% before review);
- the claim backlog by status;
- time from report to scholar answer;
- the share of chapter questions answered in the next chapter (must be 100%).

### Gaps
- Who the scholar is, and which review tool to use (Payload CMS vs a Studio screen), remain open (architecture §7.4 Q2).
- The war-day authority (§7.4 Q4) needs the Fitzgerald, Hiltebeitel and BORI introductions, which this pass could not retrieve.
