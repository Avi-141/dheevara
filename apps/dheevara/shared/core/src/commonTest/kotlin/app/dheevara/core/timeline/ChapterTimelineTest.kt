package app.dheevara.core.timeline

import app.dheevara.core.ChapterId
import app.dheevara.core.access.Access
import app.dheevara.core.manifest.Beat
import app.dheevara.core.manifest.BeatKind
import app.dheevara.core.timeline.PlayerCommand.Pause
import app.dheevara.core.timeline.PlayerCommand.Play
import app.dheevara.core.timeline.PlayerCommand.SeekTo
import app.dheevara.core.timeline.PlayerCommand.StartChapter
import app.dheevara.core.timeline.TimelineEvent.Close
import app.dheevara.core.timeline.TimelineEvent.Elapsed
import app.dheevara.core.timeline.TimelineEvent.Finished
import app.dheevara.core.timeline.TimelineEvent.NextBeat
import app.dheevara.core.timeline.TimelineEvent.Open
import app.dheevara.core.timeline.TimelineEvent.PreviousBeat
import app.dheevara.core.timeline.TimelineEvent.Progress
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.time.Instant

class ChapterTimelineTest {
    private val beats = listOf(
        Beat(BeatKind.ColdOpen, 0, 8_000),
        Beat(BeatKind.Verse, 8_000, 26_000, verse = "mbh.7.34.19"),
        Beat(BeatKind.Scene, 26_000, 80_000),
        Beat(BeatKind.Reveal, 80_000, 100_000, reveal = "who-taught-him"),
        Beat(BeatKind.Question, 100_000, 116_000),
    )
    private val timeline = ChapterTimeline(beats, 116_000)
    private val s1e4 = ChapterId.parse("s1e4")!!

    /** Runs events in order and returns the final state with every command issued. */
    private fun run(vararg events: TimelineEvent, from: TimelineState = TimelineState()): Step {
        val commands = mutableListOf<PlayerCommand>()
        val state = events.fold(from) { s, e -> timeline.reduce(s, e).also { commands += it.commands }.state }
        return Step(state, commands)
    }

    private fun at(ms: Long) = TimelineState(positionMs = ms)

    @Test
    fun aChapterNeedsBeats() {
        assertFailsWith<IllegalArgumentException> { ChapterTimeline(emptyList(), 1_000) }
    }

    @Test
    fun knowsWhichPartIsPlaying() {
        assertEquals(Part(1, 5, beats[0]), timeline.partAt(0))
        assertEquals(Part(2, 5, beats[1]), timeline.partAt(8_000))
        assertEquals(Part(3, 5, beats[2]), timeline.partAt(79_999))
        assertEquals(Part(5, 5, beats[4]), timeline.partAt(116_000))
        assertEquals(0, timeline.beatIndexAt(-5))
    }

    @Test
    fun progressMovesThePlayheadWithinTheChapter() {
        assertEquals(30_000, run(Progress(30_000)).state.positionMs)
        assertEquals(116_000, run(Progress(200_000)).state.positionMs)
        assertEquals(0, run(Progress(-1)).state.positionMs)
        assertEquals(emptyList(), run(Progress(30_000)).commands)
    }

    @Test
    fun openingTheRevealPausesTheSceneAndClosingResumesAtTheSameMoment() {
        val opened = run(Open(Overlay.Reveal("who-taught-him")), from = at(84_000))
        assertFalse(opened.state.isRunning)
        assertEquals(listOf(Pause), opened.commands)

        val closed = run(Close, from = opened.state)
        assertTrue(closed.state.isRunning)
        assertEquals(84_000, closed.state.positionMs)
        assertEquals(listOf(Play), closed.commands)
    }

    @Test
    fun everyOverlayPausesTheScene() {
        listOf(Overlay.Controls, Overlay.Page, Overlay.People, Overlay.Share).forEach {
            assertEquals(listOf(Pause), run(Open(it)).commands, "$it")
        }
    }

    @Test
    fun switchingFromOneOverlayToAnotherDoesNotRestartTheScene() {
        val step = run(Open(Overlay.Controls), Open(Overlay.Reveal("who-taught-him")))
        assertEquals(listOf(Pause), step.commands)
        assertEquals(Overlay.Reveal("who-taught-him"), step.state.overlay)
    }

    @Test
    fun aViewerWhoPausedStaysPausedAfterClosingAnOverlay() {
        val step = run(TimelineEvent.Pause, Open(Overlay.Controls), Close)
        assertFalse(step.state.isRunning)
        assertEquals(listOf(Pause), step.commands)
        assertEquals(listOf(Play), run(TimelineEvent.Play, from = step.state).commands)
    }

    @Test
    fun nextJumpsToTheStartOfTheNextPart() {
        val step = run(NextBeat, from = at(3_000))
        assertEquals(8_000, step.state.positionMs)
        assertEquals(listOf(SeekTo(8_000)), step.commands)
    }

    @Test
    fun nextOnTheLastPartDoesNothing() {
        assertEquals(Step(at(110_000), emptyList()), run(NextBeat, from = at(110_000)))
    }

    @Test
    fun previousRestartsThePartOrGoesBackOne() {
        assertEquals(listOf(SeekTo(26_000)), run(PreviousBeat, from = at(40_000)).commands)
        assertEquals(listOf(SeekTo(8_000)), run(PreviousBeat, from = at(27_000)).commands)
        assertEquals(listOf(SeekTo(0)), run(PreviousBeat, from = at(1_000)).commands)
    }

    @Test
    fun seekingClampsToTheChapter() {
        assertEquals(listOf(SeekTo(116_000)), run(TimelineEvent.SeekTo(500_000)).commands)
    }

    @Test
    fun theEndCountsDownToAPlayableNextChapter() {
        val end = run(Finished(NextUp.Chapter(s1e4, Access.Member), Autoplay()), from = at(115_500))
        assertEquals(Ending.Countdown(s1e4, 10_000), end.state.ending)
        assertEquals(116_000, end.state.positionMs)
        assertEquals(listOf(Pause), end.commands)

        val two = run(Elapsed(1_000), Elapsed(1_000), from = end.state)
        assertEquals(8, (two.state.ending as Ending.Countdown).secondsLeft)
        assertEquals(emptyList(), two.commands)

        val done = run(Elapsed(8_000), Elapsed(500), from = two.state)
        assertEquals(listOf(StartChapter(s1e4)), done.commands)
        assertEquals(listOf(StartChapter(s1e4)), run(Elapsed(8_000), Elapsed(500), Elapsed(1_000), from = two.state).commands)
    }

    @Test
    fun secondsLeftRoundsUpSoTheWordsNeverSayZeroEarly() {
        assertEquals(1, Ending.Countdown(s1e4, 1).secondsLeft)
        assertEquals(0, Ending.Countdown(s1e4, 0).secondsLeft)
    }

    @Test
    fun stopEndsTheCountdownAndLeavesAPlayButton() {
        val counting = run(Finished(NextUp.Chapter(s1e4, Access.Free), Autoplay())).state
        val stopped = run(TimelineEvent.StopAutoplay, Elapsed(20_000), from = counting)
        assertEquals(Ending.UpNext(s1e4), stopped.state.ending)
        assertEquals(emptyList(), stopped.commands)
        assertEquals(listOf(StartChapter(s1e4)), run(TimelineEvent.PlayNext, from = stopped.state).commands)
    }

    @Test
    fun playingNextDuringTheCountdownStartsItOnce() {
        val counting = run(Finished(NextUp.Chapter(s1e4, Access.Free), Autoplay())).state
        assertEquals(listOf(StartChapter(s1e4)), run(TimelineEvent.PlayNext, Elapsed(20_000), from = counting).commands)
    }

    @Test
    fun theCountdownHoldsWhileSomethingIsOpenOverTheEnd() {
        val counting = run(Finished(NextUp.Chapter(s1e4, Access.Free), Autoplay())).state
        val sharing = run(Open(Overlay.Share), Elapsed(30_000), from = counting)
        assertEquals(Ending.Countdown(s1e4, 10_000), sharing.state.ending)
        assertEquals(emptyList(), sharing.commands)
    }

    @Test
    fun noCountdownWhenAutoplayIsOffOrAScreenReaderIsOn() {
        val off = run(Finished(NextUp.Chapter(s1e4, Access.Free), Autoplay(enabled = false)))
        assertEquals(Ending.UpNext(s1e4), off.state.ending)
        val reader = run(Finished(NextUp.Chapter(s1e4, Access.Free), Autoplay(screenReaderOn = true)))
        assertEquals(Ending.UpNext(s1e4), reader.state.ending)
        assertEquals(emptyList(), run(Elapsed(60_000), from = reader.state).commands)
    }

    @Test
    fun anUnreleasedNextChapterShowsItsTimeInsteadOfACountdown() {
        val at = Instant.parse("2026-10-05T13:30:00Z")
        val end = run(Finished(NextUp.Chapter(s1e4, Access.NotYetReleased(at)), Autoplay()))
        assertEquals(Ending.Upcoming(s1e4, at), end.state.ending)
        assertEquals(emptyList(), run(TimelineEvent.PlayNext, Elapsed(60_000), from = end.state).commands)
    }

    @Test
    fun aLockedNextChapterShowsThePaywallNeverACountdown() {
        val end = run(Finished(NextUp.Chapter(s1e4, Access.NeedsMembership), Autoplay()))
        assertEquals(Ending.Locked(s1e4), end.state.ending)
        assertEquals(emptyList(), run(TimelineEvent.PlayNext, Elapsed(60_000), from = end.state).commands)
    }

    @Test
    fun theLastChapterOfASeasonEndsTheSeason() {
        assertEquals(Ending.SeasonEnd, run(Finished(NextUp.None, Autoplay())).state.ending)
        assertEquals(Ending.SeasonEnd, run(TimelineEvent.StopAutoplay, from = TimelineState(ending = Ending.SeasonEnd)).state.ending)
    }

    @Test
    fun watchAgainStartsFromTheTop() {
        val ended = run(Finished(NextUp.None, Autoplay())).state
        val again = run(TimelineEvent.WatchAgain, from = ended)
        assertEquals(TimelineState(), again.state)
        assertEquals(listOf(SeekTo(0), Play), again.commands)
    }

    @Test
    fun playIsIgnoredOnTheEndScreen() {
        val ended = run(Finished(NextUp.None, Autoplay())).state
        assertEquals(Step(ended, emptyList()), run(TimelineEvent.Play, from = ended))
    }

    @Test
    fun nextIsIgnoredOnTheEndScreenAndPreviousGoesBackIntoTheLastPart() {
        val ended = run(Finished(NextUp.None, Autoplay())).state
        assertEquals(Step(ended, emptyList()), run(NextBeat, from = ended))
        val back = run(PreviousBeat, from = ended)
        assertNull(back.state.ending)
        assertEquals(listOf(SeekTo(100_000), Play), back.commands)
    }

    @Test
    fun scrubbingFromTheEndScreenResumes() {
        val ended = run(Finished(NextUp.None, Autoplay())).state
        val step = run(TimelineEvent.SeekTo(50_000), from = ended)
        assertNull(step.state.ending)
        assertEquals(listOf(SeekTo(50_000), Play), step.commands)
    }
}
