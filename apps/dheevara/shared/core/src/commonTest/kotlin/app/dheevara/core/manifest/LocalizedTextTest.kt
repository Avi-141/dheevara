package app.dheevara.core.manifest

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class LocalizedTextTest {
    private val names = LocalizedText(mapOf("sa" to "अभिमन्यु", "en" to "Abhimanyu", "ta" to "அபிமன்யு"))

    @Test
    fun takesTheFirstPreferredLanguagePresent() {
        assertEquals(TaggedText("ta", "அபிமன்யு"), names.pick(listOf("hi", "ta", "en")))
    }

    @Test
    fun fallsBackToEnglishThenToAnything() {
        assertEquals(TaggedText("en", "Abhimanyu"), names.pick(listOf("kn")))
        assertEquals(TaggedText("sa", "अभिमन्यु"), LocalizedText(mapOf("sa" to "अभिमन्यु")).pick(listOf("kn")))
    }

    @Test
    fun emptyTextHasNothingToPick() {
        assertNull(LocalizedText.Empty.pick(listOf("en")))
    }
}
