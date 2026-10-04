package app.dheevara.core

import kotlin.jvm.JvmInline

/** A chapter's id as manifests and links carry it: `s1e3` is season 1, chapter 3. */
@JvmInline
value class ChapterId private constructor(val value: String) {
    val season: Int get() = value.substring(1, value.indexOf('e')).toInt()
    val chapter: Int get() = value.substring(value.indexOf('e') + 1).toInt()

    override fun toString(): String = value

    companion object {
        private val pattern = Regex("s[1-9][0-9]{0,2}e[1-9][0-9]{0,2}")

        /** Returns null for anything that is not a well-formed id, so links from outside cannot crash the app. */
        fun parse(raw: String): ChapterId? = if (pattern.matches(raw)) ChapterId(raw) else null
    }
}
