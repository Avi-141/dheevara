package app.dheevara.core.manifest

import app.dheevara.core.fixtures.ManifestFixtures
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ManifestCheckTest {
    private val base = ManifestLoader.json.decodeFromString(ChapterManifest.serializer(), ManifestFixtures.app.getValue("s1e3"))

    private fun problems(m: ChapterManifest) = ManifestCheck.problems(m)

    @Test
    fun theFixtureIsClean() {
        assertEquals(emptyList(), problems(base))
    }

    @Test
    fun aCaptionMustCiteAClaimThatResolves() {
        val uncited = base.copy(captions = listOf(base.captions[0].copy(claims = emptyList())))
        assertEquals(listOf(ManifestProblem.Uncited("captions[0]")), problems(uncited))

        val unresolved = base.copy(captions = listOf(base.captions[0].copy(claims = listOf("mbh.7.33", "mbh.9.9"))))
        assertEquals(listOf(ManifestProblem.UnresolvedClaim("captions[0]", "mbh.9.9")), problems(unresolved))
    }

    @Test
    fun theTextTierOfARevealMustCite() {
        val r = base.reveals[0]
        val m = base.copy(reveals = listOf(r.copy(text = r.text.copy(claims = emptyList()))))
        assertEquals(listOf(ManifestProblem.Uncited("reveals.who-taught-him.text")), problems(m))
    }

    @Test
    fun aVerseBeatNeedsAVerseThatResolves() {
        val missing = base.copy(beats = base.beats.mapIndexed { i, b -> if (i == 1) b.copy(verse = null) else b })
        assertEquals(listOf(ManifestProblem.DanglingBeat(1, "verse beat without a verse")), problems(missing))

        val unresolved = base.copy(beats = base.beats.mapIndexed { i, b -> if (i == 1) b.copy(verse = "mbh.7.34.99") else b })
        assertEquals(listOf(ManifestProblem.UnresolvedClaim("beats[1].verse", "mbh.7.34.99")), problems(unresolved))
    }

    @Test
    fun aRevealBeatMustPointAtARevealThatExists() {
        val m = base.copy(beats = base.beats.mapIndexed { i, b -> if (i == 3) b.copy(reveal = "missing") else b })
        assertEquals(listOf(ManifestProblem.DanglingBeat(3, "reveal beat points at 'missing'")), problems(m))
        val none = base.copy(beats = base.beats.mapIndexed { i, b -> if (i == 3) b.copy(reveal = null) else b })
        assertEquals(listOf(ManifestProblem.DanglingBeat(3, "reveal beat points at 'null'")), problems(none))
    }

    @Test
    fun beatsMustCoverTheChapterWithoutGaps() {
        assertEquals(listOf(ManifestProblem.BrokenTimeline("no beats")), problems(base.copy(beats = emptyList(), captions = emptyList())))

        val late = base.copy(beats = listOf(base.beats[0].copy(startMs = 500)) + base.beats.drop(1))
        assertEquals(listOf(ManifestProblem.BrokenTimeline("first beat starts at 500, not 0")), problems(late))

        val gap = base.copy(beats = base.beats.mapIndexed { i, b -> if (i == 2) b.copy(startMs = 27_000) else b })
        assertEquals(listOf(ManifestProblem.BrokenTimeline("beat 2 starts at 27000, previous ends at 26000")), problems(gap))

        val short = base.copy(durationMs = 120_000)
        assertEquals(listOf(ManifestProblem.BrokenTimeline("last beat ends at 116000, chapter at 120000")), problems(short))

        val backwards = base.copy(beats = base.beats.dropLast(1) + base.beats.last().copy(endMs = 100_000), durationMs = 100_000)
        assertTrue(ManifestProblem.BrokenTimeline("beat 4 ends before it starts") in problems(backwards))
    }

    @Test
    fun captionsMustSitInsideTheChapter() {
        val c = base.captions[0]
        listOf(c.copy(startMs = -1), c.copy(endMs = c.startMs), c.copy(endMs = base.durationMs + 1)).forEach {
            assertEquals(listOf(ManifestProblem.CaptionOutOfRange(0)), problems(base.copy(captions = listOf(it))))
        }
    }

    @Test
    fun peopleEdgesMustPointAtPeopleAndCiteRealClaims() {
        val abhimanyu = base.people[0]
        val edge = abhimanyu.edges[0]
        val m = base.copy(people = listOf(abhimanyu.copy(edges = listOf(edge.copy(to = "drona", claims = listOf("mbh.7.32"))))))
        assertEquals(
            listOf(ManifestProblem.UnknownPerson("abhimanyu", "drona"), ManifestProblem.UnresolvedClaim("people.abhimanyu->drona", "mbh.7.32")),
            problems(m),
        )
    }
}
