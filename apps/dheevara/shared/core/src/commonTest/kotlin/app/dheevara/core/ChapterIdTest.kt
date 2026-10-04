package app.dheevara.core

import app.dheevara.core.manifest.ManifestLoader
import kotlinx.serialization.SerializationException
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class ChapterIdTest {
    @Test
    fun parsesSeasonAndChapter() {
        val id = ChapterId.parse("s1e3")!!
        assertEquals(1, id.season)
        assertEquals(3, id.chapter)
        assertEquals("s1e3", id.toString())
    }

    @Test
    fun parsesMultiDigitParts() {
        val id = ChapterId.parse("s12e140")!!
        assertEquals(12, id.season)
        assertEquals(140, id.chapter)
    }

    @Test
    fun rejectsMalformedIds() {
        listOf("", "s1", "e3", "s0e3", "s1e0", "S1E3", "s1e3/", " s1e3", "s01e3", "s1e3x", "s1234e1").forEach {
            assertNull(ChapterId.parse(it), "expected '$it' to be rejected")
        }
    }

    @Test
    fun serializesAsItsString() {
        val id = ChapterId.parse("s1e3")!!
        assertEquals("\"s1e3\"", ManifestLoader.json.encodeToString(ChapterId.serializer(), id))
        assertEquals(id, ManifestLoader.json.decodeFromString(ChapterId.serializer(), "\"s1e3\""))
        assertFailsWith<SerializationException> { ManifestLoader.json.decodeFromString(ChapterId.serializer(), "\"s1\"") }
    }
}
