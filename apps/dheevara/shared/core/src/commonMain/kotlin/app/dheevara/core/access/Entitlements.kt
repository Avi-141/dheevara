package app.dheevara.core.access

import app.dheevara.core.ChapterId
import kotlinx.datetime.TimeZone
import kotlin.time.Instant

/** Whether the viewer is a member. There are no coins and no per-chapter purchases, so nothing else unlocks a chapter. */
sealed interface Membership {
    data object None : Membership

    /** [until] is null for a subscription with no known end (it renews). */
    data class Active(val until: Instant? = null) : Membership

    fun isActive(now: Instant): Boolean = this is Active && (until == null || now < until)
}

sealed interface Access {
    val canPlay: Boolean get() = this == Free || this == Member

    /** Chapter 1 of a season, once released. */
    data object Free : Access

    data object Member : Access

    /** Not out yet for this viewer; [at] is 7 pm (or the chapter's time) in their timezone. */
    data class NotYetReleased(val at: Instant) : Access

    /** Released, but only members can play it. */
    data object NeedsMembership : Access
}

/**
 * The one rule table for free, member and released (product review, finding 3):
 * nothing plays before its release; chapter 1 of every season is free; members get every
 * released chapter; everyone else gets the paywall.
 */
object Entitlements {
    fun access(chapter: ChapterId, release: Release, membership: Membership, now: Instant, zone: TimeZone): Access = when {
        !release.isOut(now, zone) -> Access.NotYetReleased(release.instantIn(zone))
        chapter.chapter == 1 -> Access.Free
        membership.isActive(now) -> Access.Member
        else -> Access.NeedsMembership
    }
}
