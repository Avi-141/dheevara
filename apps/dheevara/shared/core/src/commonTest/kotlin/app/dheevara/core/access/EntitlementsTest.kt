package app.dheevara.core.access

import app.dheevara.core.ChapterId
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalTime
import kotlinx.datetime.TimeZone
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlin.time.Instant

class EntitlementsTest {
    private val kolkata = TimeZone.of("Asia/Kolkata")
    private val toronto = TimeZone.of("America/Toronto")
    private val release = Release(LocalDate(2026, 10, 5))
    private val ch1 = ChapterId.parse("s1e1")!!
    private val ch4 = ChapterId.parse("s1e4")!!

    @Test
    fun chaptersLandAtSevenPmInTheViewersOwnTimezone() {
        assertEquals(Instant.parse("2026-10-05T13:30:00Z"), release.instantIn(kolkata))
        assertEquals(Instant.parse("2026-10-05T23:00:00Z"), release.instantIn(toronto))
        assertEquals(LocalTime(19, 0), release.localTime)
    }

    @Test
    fun sevenPmFollowsDaylightSaving() {
        val winter = Release(LocalDate(2026, 12, 7))
        assertEquals(Instant.parse("2026-12-08T00:00:00Z"), winter.instantIn(toronto))
    }

    @Test
    fun releasedExactlyAtSevenNotAMinuteBefore() {
        val seven = release.instantIn(kolkata)
        assertFalse(release.isOut(Instant.parse("2026-10-05T13:29:59Z"), kolkata))
        assertTrue(release.isOut(seven, kolkata))
    }

    @Test
    fun chapterOneIsFreeOnceReleased() {
        val after = Instant.parse("2026-10-06T00:00:00Z")
        assertEquals(Access.Free, Entitlements.access(ch1, release, Membership.None, after, kolkata))
    }

    @Test
    fun membersGetEveryReleasedChapter() {
        val after = Instant.parse("2026-10-06T00:00:00Z")
        assertEquals(Access.Member, Entitlements.access(ch4, release, Membership.Active(), after, kolkata))
        assertTrue(Access.Member.canPlay)
    }

    @Test
    fun everyoneElseMeetsThePaywall() {
        val after = Instant.parse("2026-10-06T00:00:00Z")
        val access = Entitlements.access(ch4, release, Membership.None, after, kolkata)
        assertEquals(Access.NeedsMembership, access)
        assertFalse(access.canPlay)
    }

    @Test
    fun nothingPlaysBeforeItsReleaseNotEvenForMembersOrChapterOne() {
        val before = Instant.parse("2026-10-05T12:00:00Z")
        val seven = release.instantIn(kolkata)
        assertEquals(Access.NotYetReleased(seven), Entitlements.access(ch4, release, Membership.Active(), before, kolkata))
        assertEquals(Access.NotYetReleased(seven), Entitlements.access(ch1, release, Membership.None, before, kolkata))
        assertFalse(Access.NotYetReleased(seven).canPlay)
    }

    @Test
    fun aLapsedMembershipNoLongerUnlocks() {
        val now = Instant.parse("2026-11-01T00:00:00Z")
        val lapsed = Membership.Active(until = Instant.parse("2026-10-31T00:00:00Z"))
        val current = Membership.Active(until = Instant.parse("2026-11-30T00:00:00Z"))
        assertEquals(Access.NeedsMembership, Entitlements.access(ch4, release, lapsed, now, kolkata))
        assertEquals(Access.Member, Entitlements.access(ch4, release, current, now, kolkata))
        assertFalse(Membership.None.isActive(now))
    }
}
