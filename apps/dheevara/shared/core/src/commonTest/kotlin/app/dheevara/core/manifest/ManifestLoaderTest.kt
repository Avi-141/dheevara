package app.dheevara.core.manifest

import app.dheevara.core.ChapterId
import app.dheevara.core.fixtures.ManifestFixtures
import kotlinx.datetime.LocalTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.test.fail

class ManifestLoaderTest {
    private val s1e3 = ManifestFixtures.app.getValue("s1e3")

    private fun ok(text: String): ChapterManifest = when (val load = ManifestLoader.load(text)) {
        is ManifestLoad.Ok -> load.manifest
        else -> fail("expected the manifest to load, got $load")
    }

    @Test
    fun readsTheFixture() {
        val m = ok(s1e3)
        assertEquals(ChapterId.parse("s1e3"), m.id)
        assertEquals("The way in", m.title.pick(listOf("en"))?.text)
        assertEquals(116_000, m.durationMs)
        assertEquals(
            listOf(BeatKind.ColdOpen, BeatKind.Verse, BeatKind.Scene, BeatKind.Reveal, BeatKind.Question),
            m.beats.map { it.kind },
        )
        assertEquals(MediaStatus.Pending, m.media.video.status)
        assertNull(m.media.video.mp4)
        assertEquals(MediaStatus.Pending, m.media.narration.getValue("en").status)
        assertEquals(MediaStatus.Pending, m.media.chant?.status)
        assertEquals("web/chakravyuha.html", m.media.experience)
        assertEquals(ChapterId.parse("s1e4"), m.next?.id)
        assertEquals(LocalTime(19, 0), m.next?.releaseLocal)
        assertTrue(m.provenance.aiLabel)
        assertNull(m.provenance.signOff)
    }

    @Test
    fun resolvesClaimsToBookChapterAndVerse() {
        val m = ok(s1e3)
        val verse = m.claim("mbh.7.34.19")!!
        assertEquals("7.34.19", verse.citation)
        assertTrue(verse.devanagari!!.startsWith("उपदिष्टो"))
        assertEquals("7.33", m.claim("mbh.7.33")!!.citation)
        assertNull(m.claim("mbh.7.99"))
    }

    @Test
    fun readsTheRevealTiersAndPeople() {
        val m = ok(s1e3)
        val reveal = m.reveal("who-taught-him")!!
        assertEquals(listOf("mbh.7.34.19", "mbh.1.213"), reveal.text.claims)
        assertTrue(reveal.popular.text.isEmpty)
        assertEquals(CollectionStatus.Proofing, reveal.collection.status)
        assertNull(m.reveal("nope"))
        val abhimanyu = m.people.first { it.id == "abhimanyu" }
        assertEquals(TaggedText("sa", "अभिमन्यु"), abhimanyu.names.pick(listOf("sa")))
        assertEquals("arjuna", abhimanyu.edges.single().to)
    }

    @Test
    fun malformedJsonIsRefused() {
        assertIs<ManifestLoad.Malformed>(ManifestLoader.load("{"))
        assertIs<ManifestLoad.Malformed>(ManifestLoader.load("""{"id":"s1e3"}"""))
    }

    @Test
    fun badChapterIdIsRefused() {
        assertIs<ManifestLoad.Malformed>(ManifestLoader.load(s1e3.replace("\"id\": \"s1e3\"", "\"id\": \"chapter-3\"")))
    }

    @Test
    fun unknownBeatKindIsRefused() {
        assertIs<ManifestLoad.Malformed>(ManifestLoader.load(s1e3.replace("\"kind\": \"scene\"", "\"kind\": \"montage\"")))
    }

    @Test
    fun aReleaseTimeThatIsNotAClockTimeIsRefused() {
        assertIs<ManifestLoad.Malformed>(ManifestLoader.load(s1e3.replace("\"releaseLocal\": \"19:00\"", "\"releaseLocal\": \"7 pm\"")))
    }

    @Test
    fun aManifestThatBreaksTheContractIsInvalidNotOk() {
        val load = ManifestLoader.load(s1e3.replace("\"claims\": [\"mbh.7.33\"]", "\"claims\": [\"mbh.7.99\"]"))
        assertIs<ManifestLoad.Invalid>(load)
        assertEquals(listOf(ManifestProblem.UnresolvedClaim("captions[0]", "mbh.7.99")), load.problems)
    }

    /** Every manifest the pipeline publishes under content/ must load cleanly in the app. */
    @Test
    fun everyPublishedManifestLoads() {
        ManifestFixtures.content.forEach { (chapter, text) ->
            val load = ManifestLoader.load(text)
            assertIs<ManifestLoad.Ok>(load, "content/$chapter/manifest.json: $load")
            assertEquals(chapter, load.manifest.id.value)
        }
    }
}
