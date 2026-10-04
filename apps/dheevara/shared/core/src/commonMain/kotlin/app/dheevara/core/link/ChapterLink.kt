package app.dheevara.core.link

import app.dheevara.core.ChapterId

/**
 * A link into a chapter: `https://dheevara.app/s1e3/who-taught-him?ref=ab12`.
 * [reveal] opens that hidden detail; [ref] is the sharer's token, kept for attribution only.
 */
data class ChapterLink(val chapter: ChapterId, val reveal: String? = null, val ref: String? = null) {
    init {
        require(reveal == null || slug.matches(reveal)) { "bad reveal id '$reveal'" }
        require(ref == null || refToken.matches(ref)) { "bad ref '$ref'" }
    }

    fun toUrl(): String = buildString {
        append("https://").append(HOST).append('/').append(chapter.value)
        if (reveal != null) append('/').append(reveal)
        if (ref != null) append("?ref=").append(ref)
    }

    companion object {
        const val HOST = "dheevara.app"
        private val hosts = setOf(HOST, "www.$HOST")
        private val slug = Regex("[a-z0-9]+(-[a-z0-9]+)*")
        private val refToken = Regex("[A-Za-z0-9_-]{1,64}")
        private const val MAX_SLUG = 64

        /**
         * Reads a link from anywhere (an App Link, a Universal Link, a pasted URL). Returns null for
         * anything that is not a chapter on our host, so the app falls back to home. A malformed reveal
         * or ref is dropped rather than failing the whole link.
         */
        fun parse(url: String): ChapterLink? {
            val rest = url.trim().let {
                when {
                    it.startsWith("https://", ignoreCase = true) -> it.substring(8)
                    it.contains("://") -> return null
                    else -> it
                }
            }.substringBefore('#')

            val authorityAndPath = rest.substringBefore('?')
            val query = rest.substringAfter('?', missingDelimiterValue = "")
            val host = authorityAndPath.substringBefore('/').lowercase()
            if (host !in hosts) return null

            val segments = authorityAndPath.substringAfter('/', missingDelimiterValue = "").trimEnd('/')
                .split('/').filter { it.isNotEmpty() }
            if (segments.isEmpty() || segments.size > 2) return null
            val chapter = ChapterId.parse(segments[0]) ?: return null
            val reveal = segments.getOrNull(1)?.takeIf { it.length <= MAX_SLUG && slug.matches(it) }

            val ref = query.split('&').firstNotNullOfOrNull { pair ->
                pair.takeIf { it.startsWith("ref=") }?.substring(4)?.takeIf(refToken::matches)
            }
            return ChapterLink(chapter, reveal, ref)
        }
    }
}
