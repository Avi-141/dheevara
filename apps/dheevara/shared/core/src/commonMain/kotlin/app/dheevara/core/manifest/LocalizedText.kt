package app.dheevara.core.manifest

import kotlinx.serialization.Serializable
import kotlin.jvm.JvmInline

/** Text keyed by BCP 47 language tag (`en`, `hi`, `sa`, `ta`…), as the manifest carries it. */
@JvmInline
@Serializable
value class LocalizedText(val byLanguage: Map<String, String>) {
    val isEmpty: Boolean get() = byLanguage.isEmpty()

    /**
     * The best text for a viewer, with its language tag so the UI can set the right font and
     * screen-reader voice. Tries [preferred] in order, then English, then whatever exists.
     */
    fun pick(preferred: List<String>): TaggedText? {
        val lang = preferred.firstOrNull { it in byLanguage }
            ?: "en".takeIf { it in byLanguage }
            ?: byLanguage.keys.firstOrNull()
            ?: return null
        return TaggedText(lang, byLanguage.getValue(lang))
    }

    companion object {
        val Empty = LocalizedText(emptyMap())
    }
}

/** Text that always travels with its language tag. */
data class TaggedText(val lang: String, val text: String)
