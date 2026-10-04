package app.dheevara.core

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlin.jvm.JvmInline

/** A chapter's id as manifests and links carry it: `s1e3` is season 1, chapter 3. */
@JvmInline
@Serializable(with = ChapterIdSerializer::class)
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

internal object ChapterIdSerializer : KSerializer<ChapterId> {
    override val descriptor = PrimitiveSerialDescriptor("app.dheevara.core.ChapterId", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: ChapterId) = encoder.encodeString(value.value)

    override fun deserialize(decoder: Decoder): ChapterId {
        val raw = decoder.decodeString()
        return ChapterId.parse(raw) ?: throw SerializationException("Not a chapter id: '$raw'")
    }
}
