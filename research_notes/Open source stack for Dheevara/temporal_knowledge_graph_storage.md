# Temporal Knowledge Graph with Provenance and Surrounding Data Storage for Dheevara (as of October 2026)

Method note: 16 web searches/fetches done on 2026-10-15. Items marked **[unverified this session]** come from the researcher's background knowledge and the canonical spec/repo URL. They were not re-fetched this session, so check them before relying on them. Everything else is cited to a page retrieved in this session. Most licence findings come from vendor or comparison blogs, not from LICENSE files. For anything that matters legally, read the LICENSE file in the repo.

---

## Q1. Temporal and bitemporal graph databases: licences (checked against OSI) and project health

### Takeaway
No OSI-licensed, healthy database gives Dheevara a bitemporal graph out of the box.
- **XTDB v2** (MPL-2.0, stable since June 2025) is the only mature OSI-licensed bitemporal SQL database.
- **Graphiti** (Apache-2.0) is a bitemporal library for LLM agent memory. It is not a system of record. It depends on Neo4j or FalkorDB, and its Kùzu backend is deprecated.
- Several popular graph databases are not OSI open source: Memgraph (BSL-1.1), FalkorDB (SSPL), SurrealDB (BSL-1.1) and KurrentDB (KLv1).
- Kùzu was archived in October 2025, and two forks now continue it.

### Cited Findings
**Graphiti (Zep)**
- Graphiti is an Apache-2.0 Python library maintained by Zep. Zep Cloud is the commercial managed product built on it. — [D. Vaughan, Graphiti review, Mar 2026](https://codex.danielvaughan.com/2026/03/30/graphiti-agent-memory-store/)
- Supported backends: Neo4j ≥5.26 (the default), FalkorDB 1.1.2, Kùzu 0.11.2, and Amazon Neptune (Database or Analytics) together with OpenSearch Serverless. — [graphiti-core 0.29.1 on PyPI](https://pypi.org/project/graphiti-core/0.29.1/)
- In graphiti-core 0.29.3, the Kùzu backend is deprecated and "will be removed in a future release" because upstream Kùzu is unmaintained. New projects are told to use Neo4j or FalkorDB. — [graphiti-core 0.29.3 on PyPI](https://pypi.org/project/graphiti-core/0.29.3/)
- **[unverified this session]** Graphiti's edges carry `valid_at`/`invalid_at` (event time) as well as `created_at`/`expired_at` (ingestion time). The edges are extracted by an LLM from "episodes". This is bitemporal in the agent-memory sense; it is not a curated, human-verified register. See [Graphiti GitHub](https://github.com/getzep/graphiti).

**XTDB v2**
- XTDB v2 had its first stable release on 12 June 2025, with a stable SQL API and storage format. It tracks system time and valid time automatically, based on SQL:2011. All of its code is MPL-2.0. — [XTDB blog: launching v2](https://www.xtdb.com/blog/launching-xtdb-v2)
- It supports SQL:2011 bitemporal SQL and also XTQL. — [XTDB v2 hub](https://www.xtdb.com/v2)
- XTDB 2.1 ("ATTACH to integrate") is listed as released 2025-12-01. The source is an aggregator and the date is unconfirmed. — [XTDB blog index](https://www.xtdb.com/blog); [dev.co listing](https://dev.co/databases/open-source/xtdb)

**Kùzu and its forks**
- The Kùzu GitHub repo was archived on 10 Oct 2025, and v0.11.3 was the last release. A DMA filing reportedly shows Apple agreeing to acquire Kùzu Inc. on 9 Oct 2025; that claim is secondary-source only. — [OneUptime blog, Aug 2026](https://oneuptime.com/blog/post/2026-08-12-kuzu-archived-pin-0-11-3-fork-or-migrate/view)
- RyuGraph is a fork by Predictable Labs. Its 25.9.x releases date from late 2025. — [RyuGraph docs](https://docs.ryugraph.io); [lib.rs ryugraph](https://lib.rs/crates/ryugraph); [Predictable Labs blog](https://blog.ryugraph.io/posts/introducing-predictable-labs-and-ryugraph)
- LadybugDB is described as "the database formerly known as Kuzu" and was still active in Aug 2026. It is MIT-licensed. — [DBDB.io LadybugDB](https://dbdb.io/db/ladybugdb); [ArcadeDB comparison 2026](https://arcadedb.com/blog/open-source-knowledge-graph-graphrag-databases-compared/)

**Licences that are not OSI-approved**
- Memgraph Community is under BSL-1.1, which is not OSI-approved. Enterprise is proprietary. — [DB-Engines Memgraph](https://db-engines.com/en/system/Memgraph); [ArcadeDB comparison](https://arcadedb.com/blog/neo4j-alternatives-in-2026-a-fair-look-at-the-open-source-options/)
- The FalkorDB core is under SSPL v1, which is source-available and not OSI. — [Atlan FalkorDB page 2026](https://atlan.com/know/ai-agent/knowledge-graph/falkordb-graph-database-for-graphrag/)
- ArangoDB is BUSL and has a 100 GiB cap on its community edition. ArcadeDB and Apache HugeGraph are Apache-2.0. — [ArcadeDB comparison 2026](https://arcadedb.com/blog/open-source-knowledge-graph-graphrag-databases-compared/) (ArcadeDB is a vendor and interested party)
- SurrealDB core is BSL-1.1. The 3.0 LICENSE file gives a change date of 2030-01-01, when it converts to Apache-2.0. The restriction covers offering SurrealDB as a database service to third parties. SDKs are Apache-2.0 or MIT. — [SurrealDB LICENSE](https://github.com/surrealdb/surrealdb/blob/main/LICENSE); [SurrealDB licence FAQ](https://surrealdb.com/license); [surrealdb/license repo](https://github.com/surrealdb/license)
- KurrentDB (formerly EventStoreDB) moved to the Kurrent License v1 at 25.0. Kurrent's own docs say KLv1 is not OSI-approved, and enterprise features need a key. — [KurrentDB 25.0 release notes](https://kurrentdb.kurrent.io/releases/kurrentdb/25-0/); [DB-Engines KurrentDB](https://db-engines.com/en/system/KurrentDB+(aka+EventStoreDB))

**OSI-licensed databases**
- TypeDB is MPL-2.0. It is written in Rust, and 3.0.0 shipped on 20 Dec 2024. — [typedb GitHub](https://github.com/typedb/typedb); [Wikipedia TypeDB](https://en.wikipedia.org/wiki/TypeDB)
- Dgraph is labelled Apache-2.0, but its LICENSE.md says code is "variously licensed under the Apache Public License 2.0 and the Dgraph Community License". Treat it as mixed licensing. — [dgraph LICENSE.md](https://github.com/dgraph-io/dgraph/blob/master/LICENSE.md); [dgraph repo](https://github.com/dgraph-io/dgraph)

**[unverified this session]**, from background knowledge:
- Neo4j Community Edition is GPLv3. Clustering and online backup are in the commercial Enterprise edition. See [neo4j repo](https://github.com/neo4j/neo4j).
- Apache AGE is Apache-2.0. It is an ASF project that adds openCypher to Postgres, but it lags the newest PG majors, so check whether it supports PG 18. See [apache/age](https://github.com/apache/age).
- TerminusDB is Apache-2.0 and offers git-like branch, merge and time-travel for a JSON/RDF document graph. Its community has been small since 2023; DFRNT became the maintainer, which was not confirmed this session. See [terminusdb repo](https://github.com/terminusdb/terminusdb).
- Dolt is Apache-2.0 and gives MySQL-compatible versioned SQL with git semantics. DoltgreSQL (the Postgres flavour) was beta in 2025. See [dolthub/dolt](https://github.com/dolthub/dolt) and [dolthub/doltgresql](https://github.com/dolthub/doltgresql).
- Datomic has been free (Apache-2.0-licensed binaries) since April 2023, but its source is closed, so it is not OSI open source.
- Gel (formerly EdgeDB) is Apache-2.0 and sits on Postgres. Its maintainers were reported joining Vercel in late 2025, so check its health.
- NebulaGraph is Apache-2.0.
- RDF stores: Oxigraph (MIT/Apache-2.0, Rust), Apache Jena/Fuseki (Apache-2.0), QLever (Apache-2.0) and Virtuoso Open Source (GPLv2) are all OSI-licensed.

### Inferences
- **Graphiti** suits an agent-memory or retrieval side layer. It is not suited to Dheevara's system of record:
  - its facts are extracted by an LLM, but Dheevara requires human-verified, verse-cited claims;
  - it pulls in Neo4j (GPLv3) or FalkorDB (SSPL).
- **XTDB v2** is the best purpose-built bitemporal option. Its "valid time" maps naturally to "what was true for viewers when", and system time maps to "when we asserted it". It is a niche, JVM-based project with a small vendor (JUXT), which is a bus-factor risk for a 2–5 person team.
- **Avoid as the core** if strict OSI licensing is a requirement: Memgraph, FalkorDB, SurrealDB, KurrentDB, and arguably Dgraph and Datomic.
- **Kùzu** was the attractive embedded choice. A LadybugDB or RyuGraph fork is usable only as a disposable, rebuildable read model.

### Gaps
- None of these were confirmed from primary sources this session: Neo4j 2026 licence details, Apache AGE's PG 18 support, TerminusDB release cadence and maintainer, Dolt/DoltgreSQL GA status, Gel's status after Vercel, and Nebula and Virtuoso health.
- Graphiti's exact temporal field names were not re-verified against 2026 code.
- No primary source was found for the Kùzu/Apple acquisition (only a secondary blog).

---

## Q2. Postgres-centred option (PG 18 temporal keys, pgvector, AGE, pg_bitemporal)

### Takeaway
PostgreSQL 18 has native temporal primary/unique keys (`WITHOUT OVERLAPS`) and temporal foreign keys (`PERIOD`). PG 19 adds `UPDATE/DELETE … FOR PORTION OF`. Together with append-only history tables and pgvector, this makes Postgres a viable and low-risk bitemporal system of record for a small team. Graph traversal can be done with recursive CTEs or with AGE as an optional add-on.

### Cited Findings
- PG 18 adds `WITHOUT OVERLAPS` on PRIMARY KEY and UNIQUE constraints, and `PERIOD` on foreign keys. The range column must be listed last. Mixing scalar and range columns needs `btree_gist`. — [Atlas changelog](https://atlasgo.io/changelog/postgres-temporal-constraints); [Neon PG18 temporal constraints](https://neon.com/postgresql/postgresql-18/temporal-constraints)
- A temporal foreign key checks range containment: the referenced row(s) must cover the whole period of the referencing row. — [Npgsql temporal constraints docs](https://www.npgsql.org/efcore/misc/temporal-constraints.html)
- Migration gotcha: Postgres rejects converting a temporal PK or FK to a plain one in a single migration. CockroachDB and YugabyteDB do not support temporal keys. — [Atlas changelog](https://atlasgo.io/changelog/postgres-temporal-constraints)
- PG 19 Beta 1 adds `UPDATE/DELETE ... FOR PORTION OF`. — [Xata: Postgres as a temporal DB](https://xata.io/blog/postgres-as-a-temporal-db)
- Further PG 18 temporal-constraint talks and guides: [PGConf.EU 2025 slides, G. Yildirim Jelinek](https://www.postgresql.eu/events/pgconfeu2025/sessions/session/7133/slides/801/Constraints%20in%20PG18%20Gulcin%20Yildirim%20Jelinek.pdf); [Aiven blog](https://aiven.io/blog/exploring-how-postgresql-18-conquered-time-with-temporal-constraints)
- **[unverified this session]**
  - Postgres has no native system-versioned (transaction-time) tables. The usual approach is a trigger-based history table or the `temporal_tables` extension.
  - `pg_bitemporal` (scalegenius) is an older PL/pgSQL library with low activity.
  - pgvector is under the PostgreSQL licence (OSI) and supports HNSW/IVFFlat.

### Inferences
- **Valid time** (and narrative or edition ranges) can be stored as `tstzrange`, `int4range` or `daterange` columns protected by `WITHOUT OVERLAPS`. Story days can use `int4range` (e.g. war day 13), and verse ranges can use a custom ordinal range.
- **Transaction time** is best handled as append-only rows with `recorded_at` and `superseded_at` written by triggers, or by event-sourcing into an `events` table (a Postgres outbox) and projecting from it. This is the most portable way to get "as of release date" queries.
- One Postgres instance can hold the system of record, the claims register, the cost ledger, the approvals, and the vectors. That is operationally simple for 2–5 people. Apache AGE is optional, because recursive CTEs cover genealogy and student_of traversal at epic scale (thousands of nodes).

### Gaps
- PG 18 docs were not fetched directly, so check the exact syntax in the official docs.
- No first-hand evidence on AGE plus PG 18 compatibility, or on pg_bitemporal maintenance in 2026.

---

## Q3. Ontologies and standards for the domain

### Takeaway
Use a lightweight internal schema that maps to these standards; do not adopt any of them wholesale:
- LRMoo for Work, Expression and Manifestation: the Mahābhārata as a work, the BORI critical text, the vulgate and Dutt as expressions, and printed volumes as manifestations.
- PROV-O for who asserted or verified what.
- Web Annotation for claim→verse-range targets.
- OWL-Time or SEM for events.
- CTS-style URNs and DTS 1.0 (stable since Feb 2026) for verse citation and an API.
- TEI for texts and IIIF for manuscript images.

RDF 1.2 triple terms (the successor to RDF-star) reached Candidate Recommendation in April 2026. They are the standard way to annotate individual statements with provenance.

### Cited Findings
- DTS 1.0, the first stable release, was published 13 Feb 2026. RC1 came out 11 July 2025. DTS succeeds CTS and is not tied to CTS URNs, because CTS URNs "do not support citation systems used by more modern content". DTS does not prescribe an identifier scheme. It returns JSON-LD for collections and navigation, and its minimum text format is TEI XML. — [Balisage 2026 paper: DTS 1.0](https://balisage.net/Proceedings/vol31/html/Scott01/BalisageVol31-Scott01.html); [DTS GitHub](https://github.com/distributed-text-services/distributed-text-services.github.io)
- RDF 1.2 Concepts and RDF 1.2 Semantics became Candidate Recommendation Snapshots on 7 April 2026. Neither could advance before 5 May 2026. In RDF 1.2 a triple can appear as a term in the object position of another triple ("triple terms"). — [W3C RDF 1.2 Concepts CR](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/); [W3C news: implementations invited](https://www.w3.org/news/2026/w3c-invites-implementations-of-rdf-1-2-concepts-and-abstract-data-model-and-rdf-1-2-semantics); [W3C review announcement](https://lists.w3.org/Archives/Public/public-review-announce/2026Apr/0003.html)
- **[unverified this session]**, using canonical spec URLs:
  - [PROV-O](https://www.w3.org/TR/prov-o/) (W3C Rec 2013) defines Entity, Activity and Agent, with `wasAttributedTo`, `wasDerivedFrom`, `wasGeneratedBy` and `generatedAtTime`. These map to "who asserted or verified the claim" and "which render job produced the shot".
  - [Web Annotation Data Model](https://www.w3.org/TR/annotation-model/) (W3C Rec 2017) has a body/target structure, `TextQuoteSelector` and `FragmentSelector`, and motivations such as `commenting`, `linking` and `tagging`. A claim can be modelled as an annotation whose target is a verse range.
  - [OWL-Time](https://www.w3.org/TR/owl-time/) supports relative and ordinal temporal positions, including custom TRS such as "war day N". SEM (Simple Event Model, van Hage et al. 2011) has Event, Actor, Place, Time, and roles with "view" constraints (according to whom) that suit narrator frames.
  - [CIDOC-CRM](https://cidoc-crm.org/) (ISO 21127) and [LRMoo](https://cidoc-crm.org/lrmoo/) (the successor to FRBRoo; LRMoo 1.0 was approved in 2024) cover F1 Work / F2 Expression / F3 Manifestation and E5 Event / E7 Activity.
  - TEI has Sanskrit and Indic usage, e.g. SARIT encodes Sanskrit texts in TEI.
  - IIIF Presentation 3.0 is the standard for manuscript images.
  - [schema.org CreativeWork](https://schema.org/CreativeWork) and `Episode`/`VideoObject` cover chapters, with `citation` and `isBasedOn`.

### Inferences
- **Recommended identifier scheme:** a CTS-like URN `urn:cts:sktlit:mbh.bori:7.34.19`, or keep the existing `mbh.7.34.19` and expose it through DTS. Add an edition component (bori / vulgate / southern) so axis 2, textual time, is explicit.
- **Star passages** belong to a distinct expression or apparatus class, e.g. `edition=bori-apparatus` with flag `citable=false`. That lets the "never cite as main text" rule become a database constraint or check.
- **Narrator frames** are best modelled as reified "telling" events, for example Telling(narrator=Sanjaya, addressee=Dhritarashtra, frame_parent=Telling(Vaishampayana→Janamejaya)). Each story event links to the telling(s) that report it, following SEM's "view" or CIDOC's E7 approach.

### Gaps
- None of the following were fetched this session: the LRMoo, PROV-O, SEM or OWL-Time spec pages, SPARQL 1.2 status, the DTS 1.0 spec text (including its CTS URN guidance), or TEI Sanskrit guidelines. They are well known, but cite them from the specs.

---

## Q4. Open datasets and projects to reuse

### Takeaway
There is no reusable, openly licensed, verse-anchored Mahābhārata/Rāmāyaṇa event KG. What exists:
- character-network papers;
- an auto-built Sanskrit QA KG (arXiv 2310.07848);
- Neo4j blog demos;
- the Itihāsa corpus, which comes from M. N. Dutt's translation (the vulgate, not BORI) and has no clear data licence;
- Ambuda, whose epic texts come from John Smith's site and GRETIL, with licences that need checking.

Plan to build the KG yourselves and reconcile entities to Wikidata QIDs.

### Cited Findings
- Ambuda says it releases texts "under permissive licenses, with a public domain license being ideal", and that its code and data are also permissively licensed. — [Ambuda values](https://ambuda.org/about/values)
- Individual Ambuda files (Upanishads) are marked CC0 1.0. — [Ambuda text page](https://ambuda.org/texts/atmapujopanishat)
- Ambuda says its Rāmāyaṇa and Mahābhārata texts come from John Smith's website, most other texts from a GRETIL snapshot, and parse data from the Digital Corpus of Sanskrit (DCS). No public API documentation was found. — [Ambuda (search summary of file headers)](https://ambuda.org/about/mission); [ambuda-org GitHub](https://www.github.com/ambuda-org)
- Itihāsa has 93,000 Sanskrit shlokas with English translations taken from M. N. Dutt's works (WAT 2021, Aralikatte et al.). The IndiaAI listing says IP stays with the original authors and the data is for academic and educational purposes. The Apache-2.0 header on the HF loader script likely covers the script only. — [ACL Anthology 2021.wat-1.22](https://aclanthology.org/2021.wat-1.22); [AIKosh Itihasa](https://aikosh.indiaai.gov.in/home/datasets/details/itihasa.html); [HF itihasa.py](https://huggingface.co/datasets/rahular/itihasa/blame/main/itihasa.py)
- An automated KG construction framework for Sanskrit QA covers the Mahābhārata. — [arXiv 2310.07848](https://arxiv.org/pdf/2310.07848)
- Other relevant work:
  - Mahābhārata character relationship analysis using TF-IDF/LSA. — [Heritage 2023, Gultepe & Mathangi](https://doi.org/10.3390/heritage6110366)
  - NER and sentiment over events across the 18 parvas. — [ICON 2022](https://aclanthology.org/2022.icon-main.37)
  - Practitioner Neo4j models of character relations (not peer-reviewed). — [Neo4j blog pt 1](https://neo4j.com/blog/developer/mahabharata-epic-graph-database-1/); [pt 2](https://neo4j.com/blog/developer/mahabharata-epic-graph-database-2/)
- The DCS repo (OliverHellwig/sanskrit) shows folders corpus, dcs/data, texts and translations. No licence was visible on the landing page. — [GitHub OliverHellwig/sanskrit](https://github.com/OliverHellwig/sanskrit)

### Inferences
- **Licence and edition mismatch:** the BORI and Baroda critical-edition texts that circulate electronically (John Smith's e-texts, GRETIL) are the source of most derivatives. Copyright in the critical editions themselves (BORI, Oriental Institute Baroda) is a separate question from the e-text licence. Dheevara's "e-text / proofed / scholar-signed" status ladder is exactly the right hedge.
- Itihāsa and Dutt follow the vulgate, so they are useful only as "popular/other expression" material on axis 2, never as the cited canon.
- Wikidata QIDs for major characters are a cheap win for entity reconciliation and outward linking.

### Gaps
- Not verified this session:
  - licences for the DCS data, GRETIL texts and John Smith's e-texts;
  - Sanskrit Heritage Platform terms;
  - The Sanskrit Library terms;
  - BORI's digitisation status of the critical edition and its apparatus;
  - how fully Wikidata covers epic characters and relations;
  - "IndicKG";
  - other Valmiki Rāmāyaṇa datasets (e.g. valmikiramayan.net, the IIT Kanpur Valmiki Ramayana site);
  - whether Ambuda has an API.
- Any Dheevara use of these needs a licence review.

---

## Q5. GraphRAG and LLM-on-graph tooling, and Indic embeddings

### Takeaway
Graphiti is Apache-2.0 and the most temporally aware option, but it extracts facts with an LLM. Dheevara's "cite or don't say" rule favours a different approach: let agents retrieve only from the curated claims register through a typed tool/API, where each fact carries its claim id and verse URN. Avoid tools that auto-extract triples (GraphRAG, LightRAG, Cognee) as sources of truth. They are acceptable for discovery or drafting suggestions that must then be matched to registered claims.

### Cited Findings
- Graphiti is Apache-2.0. Its supported stores are Neo4j, FalkorDB, Neptune, and Kùzu (deprecated). — [PyPI graphiti-core 0.29.3](https://pypi.org/project/graphiti-core/0.29.3/)
- **[unverified this session]**
  - Microsoft GraphRAG (MIT), LightRAG (MIT, HKUDS), Cognee (Apache-2.0) and LlamaIndex PropertyGraphIndex (MIT) all use LLMs to extract entities and relations from text into a graph.
  - Embeddings:
    - BGE-M3 (MIT): multilingual, dense plus sparse plus ColBERT;
    - multilingual-e5 (MIT);
    - Jina embeddings v3 (CC BY-NC 4.0, not commercial-free);
    - IndicBERT and MuRIL (Apache-2.0 encoders, not tuned for retrieval).

### Inferences
- Sanskrit retrieval quality in IAST, Devanagari or with sandhi is unproven for all of these models. Searching through English glosses and IAST-normalised text, plus exact verse-id lookup, will matter more than the choice of model.

### Gaps
- No benchmarks were retrieved for Sanskrit retrieval with BGE-M3, e5 or Jina.
- Jina v3's licence was not re-verified.
- GraphRAG, LightRAG and Cognee release health in 2026 was not checked.

---

## Q6. Asset and artefact storage (object stores, media versioning, analytics, event sourcing)

### Takeaway
MinIO community edition is effectively dead:
- the console was stripped in 2025;
- binaries stopped in Oct 2025;
- maintenance mode began Dec 2025;
- the repo was archived in Feb–Apr 2026 (sources disagree on the date).

For self-hosting, use SeaweedFS (Apache-2.0) or Garage (AGPL-3.0, small clusters). Managed S3 or R2 is the simpler choice for 2–5 people. Store media content-addressed (sha256 keys) and keep only manifests in git or Postgres. Event-source the ledger and approvals inside Postgres rather than adopting KurrentDB, which is not OSI.

### Cited Findings
- The MinIO community edition lost its web admin console in 2025. Release RELEASE.2025-05-24 deprecated the embedded console, and the full console moved to the paid AIStor. — [Blocks & Files, Jun 2025](https://blocksandfiles.com/2025/06/19/minio-removes-management-features-from-basic-community-edition-object-storage-code/); [vonng blog](https://blog.vonng.com/en/db/minio-resurrect/index.md)
- MinIO stopped publishing Docker images around Oct 2025. The repo entered maintenance mode on 3 Dec 2025 (no features, no PRs, security fixes case by case). It was marked "no longer maintained" and archived on 12 Feb 2026 per one source, and on 25 Apr 2026 per another. — [InfoQ Dec 2025](https://infoq.com/news/2025/12/minio-s3-api-alternatives/); [youngju.dev Jul 2026](https://www.youngju.dev/blog/2026-07-17-minio-archived-garage-seaweedfs-ceph-rgw.en); [glukhov.org: MinIO CE in 2026](https://glukhov.org/data-infrastructure/object-storage/minio-dead/)
- Licence table as of Aug 2026: MinIO AGPL-3.0 (archived), Garage AGPL-3.0 (hosted on Deuxfleurs' own infrastructure), SeaweedFS Apache-2.0 (10+ years old, actively maintained), RustFS Apache-2.0 (newer, with an "alpha caution"), Ceph LGPL. — [glukhov.org self-hosted S3 alternatives 2026](https://www.glukhov.org/pl/data-infrastructure/object-storage/self-hosted-s3-alternatives/); [pinggy.io](https://pinggy.io/amp/blog/minio_archived_self_hosted_s3_alternatives/)
- KurrentDB uses the non-OSI KLv1 licence. — [KurrentDB 25.0 notes](https://kurrentdb.kurrent.io/releases/kurrentdb/25-0/)
- **[unverified this session]**
  - lakeFS is Apache-2.0 and gives git-like branches over S3.
  - DVC is Apache-2.0.
  - git-annex is GPL/AGPL and suitable for large media pointers.
  - Git LFS is MIT, but LFS bandwidth billing on GitHub matters at video scale.
  - Apache Iceberg is Apache-2.0, DuckDB is MIT, and Parquet is an Apache format. DuckDB can read Parquet and Iceberg on S3 directly.

### Inferences
- **Media storage:** finished renders and audio stems are large and immutable. Name them by content hash (`sha256/ab/cd…`) in an S3 bucket, and reference them from manifests and the render-job table. That gives dedup and tamper evidence without lakeFS. Adopt lakeFS only if branching whole asset sets becomes necessary.
- **Analytics:** the cost ledger and render telemetry can be exported nightly to Parquet and queried with DuckDB. Iceberg is overkill at this scale.

### Gaps
- Not verified this session: lakeFS, DVC or Iceberg licences and health in 2026; RustFS maturity; Ceph RGW operating cost; Cloudflare R2 or Backblaze B2 pricing.

---

## Recommended layered architecture for a 2–5 person team (synthesis; inferences built on findings above)

### Takeaway
Use Postgres 18 as the bitemporal, event-sourced system of record:
- the claims register, canon index, people and events, releases and the ledger live there;
- assets live in S3-compatible, content-addressed storage;
- graph and RAG views are derived and rebuildable: recursive SQL or AGE first, optionally an RDF/Oxigraph export (PROV-O, LRMoo, Web Annotation) and a Graphiti or embedding index for agents;
- git stays the authoring surface during migration.

### Inferences (design)
1. **System of record: PostgreSQL 18 (+ pgvector, btree_gist).**
   - Tables:
     - `work`, `expression` (bori_ce, bori_apparatus, vulgate, southern, popular:<source>), `verse` (urn, expression, ordinal, text, `citable` boolean);
     - `claim`, `claim_target` (verse ranges), `verification` (status, agent, at);
     - `entity` (person, place, object, with a Wikidata QID), `relation`, `event`, `telling` (narrator, addressee, parent_telling);
     - `chapter_release`, `caption` → `claim_id`;
     - `render_job`, `asset` (sha256);
     - `cost_ledger` (append-only), `approval`.
   - Enforce star-passage safety with a check or trigger: `claim_target.verse` must be `citable=true` in a main-text expression.
2. **The three time axes:**
   - **Story time:** `event.story_order` (a partial order or sequence key) plus `event.war_day int4range` / `epoch` (e.g. parva/adhyāya span). Narrative frame is `event_reported_in(telling_id)`. A query like "Abhimanyu events before day 13 with narrator" becomes a join over `event_participant`, `war_day`, and `telling`.
   - **Textual/source time:** model as LRMoo-style `expression` rows (edition, recension, manuscript, retelling) with dates where known. Each claim targets a specific expression, and "popular vs text vs collection" reveals become claims that compare expressions.
   - **System/transaction time:** keep append-only versions of `claim`/`verification`/`caption` with `sys_period tstzrange`, plus `WITHOUT OVERLAPS` on (claim_id, sys_period). Release records pin `released_at`. The query "what viewers of ch.3 saw about Jayadratha's boon as of release" then becomes: captions in release 3 → claim versions where `sys_period @> released_at` → verse URNs.
3. **Provenance model:**
   - Use PROV-O semantics in relational form: Entity = claim/asset/shot, Activity = verification/render_job/approval, Agent = person/model.
   - Export to RDF 1.2 triple terms or to Web Annotation JSON-LD for publishing, so the "cite every claim" trail is externally inspectable.
4. **Graph/query layer:**
   - Start with recursive CTEs; add Apache AGE if Cypher ergonomics are wanted (licence Apache-2.0).
   - Optionally run a nightly export to Oxigraph or Jena (OSI) for SPARQL and LOD publishing, and a DTS endpoint for verses.
   - Do not make Neo4j, Memgraph, FalkorDB or SurrealDB the store of record, for licence and ops reasons.
5. **Agents:**
   - Agents get read-only tool access to "verified claims as of now" with verse URNs, plus pgvector search over claim text and verse glosses.
   - Any drafted sentence must resolve to a claim id, otherwise CI fails.
   - Graphiti is optional, only for agent conversational memory, never as canon.
6. **Assets:** managed S3/R2, or SeaweedFS if self-hosting. Use content-addressed keys and do not use MinIO CE.
7. **Migration from git files:**
   - (a) Keep git as the authoring source.
   - (b) Write an idempotent loader that parses canon, claims, people and manifests into Postgres on each merge. The git commit SHA becomes `prov:wasDerivedFrom` and the `sys_period` start.
   - (c) Back-fill transaction history by replaying `git log` of the claims register.
   - (d) Once stable, move writes for verifications and approvals into the database or app, and export snapshots back to git for review and diff.
   - (e) Add an RDF/DTS export and agent tools last.
   - Reconsider XTDB v2 (MPL-2.0) only if bitemporal SQL ergonomics in Postgres become painful.

### Gaps
- The architecture above is the researcher's synthesis. It has not been tested against Dheevara's real data volume or tooling.
- Specific load and query performance was not benchmarked.
