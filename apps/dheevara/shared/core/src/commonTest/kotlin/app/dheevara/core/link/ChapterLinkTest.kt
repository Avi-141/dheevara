package app.dheevara.core.link

import app.dheevara.core.ChapterId
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class ChapterLinkTest {
    private val s1e3 = ChapterId.parse("s1e3")!!

    @Test
    fun readsAChapterRevealAndRef() {
        assertEquals(
            ChapterLink(s1e3, "who-taught-him", "Xy_9-k"),
            ChapterLink.parse("https://dheevara.app/s1e3/who-taught-him?ref=Xy_9-k"),
        )
    }

    @Test
    fun readsTheShortForms() {
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("https://dheevara.app/s1e3"))
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("dheevara.app/s1e3/"))
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("  HTTPS://WWW.Dheevara.App/s1e3#top "))
        assertEquals(ChapterLink(s1e3, "who-taught-him"), ChapterLink.parse("dheevara.app/s1e3/who-taught-him/"))
    }

    @Test
    fun keepsRefAmongOtherParameters() {
        assertEquals(ChapterLink(s1e3, ref = "abc"), ChapterLink.parse("https://dheevara.app/s1e3?utm_source=wa&ref=abc&x"))
    }

    @Test
    fun dropsABadRevealOrRefButKeepsTheChapter() {
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("https://dheevara.app/s1e3/Who%20Taught?ref=<script>"))
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("https://dheevara.app/s1e3/" + "a".repeat(65)))
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("https://dheevara.app/s1e3?ref=" + "a".repeat(65)))
        assertEquals(ChapterLink(s1e3), ChapterLink.parse("https://dheevara.app/s1e3?ref="))
    }

    @Test
    fun refusesAnythingThatIsNotAChapterOnOurHost() {
        listOf(
            "https://evil.example/s1e3",
            "https://dheevara.app.evil.example/s1e3",
            "http://dheevara.app/s1e3",
            "javascript://dheevara.app/s1e3",
            "https://dheevara.app",
            "https://dheevara.app/",
            "https://dheevara.app/home",
            "https://dheevara.app/s1e3/who-taught-him/extra",
            "",
        ).forEach { assertNull(ChapterLink.parse(it), "expected '$it' to be refused") }
    }

    @Test
    fun buildsTheLinkASharerSends() {
        assertEquals("https://dheevara.app/s1e3", ChapterLink(s1e3).toUrl())
        assertEquals("https://dheevara.app/s1e3/who-taught-him?ref=ab12", ChapterLink(s1e3, "who-taught-him", "ab12").toUrl())
        assertEquals("https://dheevara.app/s1e3?ref=ab12", ChapterLink(s1e3, ref = "ab12").toUrl())
    }

    @Test
    fun aBuiltLinkReadsBackTheSame() {
        val link = ChapterLink(s1e3, "who-taught-him", "ab12")
        assertEquals(link, ChapterLink.parse(link.toUrl()))
    }

    @Test
    fun cannotBuildALinkWithABadRevealOrRef() {
        assertFailsWith<IllegalArgumentException> { ChapterLink(s1e3, reveal = "Who Taught") }
        assertFailsWith<IllegalArgumentException> { ChapterLink(s1e3, ref = "a b") }
    }
}
