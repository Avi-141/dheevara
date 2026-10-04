package app.dheevara.core.manifest

import app.dheevara.core.ChapterId
import kotlinx.datetime.LocalTime
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject

/**
 * One chapter as the pipeline publishes it in `content/<chapter>/manifest.json`.
 * Shape: `docs/handoff/pipeline-session.md` section 7. Fields that section leaves open
 * (`popular.source`, people `edges`, `provenance.signOff`) are provisional until
 * `schema/chapter-manifest.schema.json` lands.
 */
@Serializable
data class ChapterManifest(
    val id: ChapterId,
    val season: String,
    val title: LocalizedText,
    val edition: String,
    val durationMs: Long,
    val witness: String,
    val beats: List<Beat>,
    val media: Media,
    val captions: List<Caption> = emptyList(),
    val reveals: List<Reveal> = emptyList(),
    val people: List<Person> = emptyList(),
    val claims: Map<String, Claim> = emptyMap(),
    val next: NextChapter? = null,
    val provenance: Provenance,
) {
    fun claim(id: String): Claim? = claims[id]

    fun reveal(id: String): Reveal? = reveals.firstOrNull { it.id == id }
}

@Serializable
data class Beat(
    val kind: BeatKind,
    val startMs: Long,
    val endMs: Long,
    /** Claim id of the verse, on a [BeatKind.Verse] beat. */
    val verse: String? = null,
    /** Reveal id, on a [BeatKind.Reveal] beat. */
    val reveal: String? = null,
)

/** The chapter grammar: cold open, the verse chanted, witness scene, hidden detail, the question. */
@Serializable
enum class BeatKind {
    @SerialName("cold_open") ColdOpen,
    @SerialName("verse") Verse,
    @SerialName("scene") Scene,
    @SerialName("reveal") Reveal,
    @SerialName("question") Question,
}

@Serializable
data class Media(
    val video: Video,
    /** Narration per language tag. */
    val narration: Map<String, Track> = emptyMap(),
    val chant: Track? = null,
    /** Path of the JS experience under `web/`, if the chapter has one. */
    val experience: String? = null,
)

@Serializable
data class Video(val status: MediaStatus, val hls: String? = null, val mp4: String? = null)

@Serializable
data class Track(val status: MediaStatus, val url: String? = null)

/** `pending` means nothing exists yet: the player shows stills and captions, never invented media. */
@Serializable
enum class MediaStatus {
    @SerialName("pending") Pending,
    @SerialName("draft") Draft,
    @SerialName("final") Final,
}

@Serializable
data class Caption(
    val startMs: Long,
    val endMs: Long,
    val text: LocalizedText,
    val claims: List<String>,
)

/** A hidden detail. The sheet shows its three tiers in this fixed order. */
@Serializable
data class Reveal(
    val id: String,
    val title: LocalizedText,
    /** What many heard. */
    val popular: PopularTelling,
    /** What the text says. */
    val text: TextTier,
    /** From our collection; hidden when its status is [CollectionStatus.None]. */
    val collection: CollectionTier,
)

@Serializable
data class PopularTelling(val text: LocalizedText, val source: LocalizedText = LocalizedText.Empty)

@Serializable
data class TextTier(val text: LocalizedText, val claims: List<String>)

@Serializable
data class CollectionTier(val status: CollectionStatus, val text: LocalizedText = LocalizedText.Empty)

@Serializable
enum class CollectionStatus {
    @SerialName("proofing") Proofing,
    @SerialName("ready") Ready,
    @SerialName("none") None,
}

@Serializable
data class Person(val id: String, val names: LocalizedText, val edges: List<PersonEdge> = emptyList())

@Serializable
data class PersonEdge(val to: String, val kind: String, val claims: List<String> = emptyList())

/** A cited passage: book, adhyāya and (when the claim is that narrow) verse. */
@Serializable
data class Claim(
    val book: Int,
    val adhyaya: Int,
    val verse: Int? = null,
    val edition: String,
    val devanagari: String? = null,
    val iast: String? = null,
    val translation: LocalizedText = LocalizedText.Empty,
) {
    /** What the UI prints in amber beside a caption: `7.34.19`, or `7.33` for a whole adhyāya. */
    val citation: String get() = if (verse == null) "$book.$adhyaya" else "$book.$adhyaya.$verse"
}

@Serializable
data class NextChapter(val id: ChapterId, val releaseLocal: LocalTime)

@Serializable
data class Provenance(val aiLabel: Boolean, val signOff: JsonObject? = null)
