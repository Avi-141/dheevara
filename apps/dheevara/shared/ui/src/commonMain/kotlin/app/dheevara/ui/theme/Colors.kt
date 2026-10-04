package app.dheevara.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

/**
 * The mockups' `:root` tokens. Amber only ever marks a source (citations, verse ids, the leaf);
 * live (sindoor) only marks what is live or an opponent. Primary buttons are off-white.
 */
@Immutable
data class DheevaraColors(
    val bg: Color = Color(0xFF0B0B0A),
    val raise: Color = Color(0xFF151513),
    val raise2: Color = Color(0xFF1D1C19),
    val raise3: Color = Color(0xFF272521),
    val hair: Color = Color(0xFFF4F2EE).copy(alpha = 0.09f),
    val hair2: Color = Color(0xFFF4F2EE).copy(alpha = 0.16f),
    val fg: Color = Color(0xFFF4F2EE),
    val fg2: Color = Color(0xFFB5B0A7),
    val fg3: Color = Color(0xFF918C82),
    val amber: Color = Color(0xFFF2B04A),
    val amberDim: Color = Color(0xFFF2B04A).copy(alpha = 0.14f),
    val live: Color = Color(0xFFF0694A),
    val leaf: Color = Color(0xFFEFE6D2),
    val leaf2: Color = Color(0xFFE5D7B9),
    val ink: Color = Color(0xFF1E160C),
    val ink2: Color = Color(0xFF4A3A25),
    val leafRed: Color = Color(0xFF7A2410),
    /** Behind controls laid over a scene. */
    val glass: Color = Color(0xFF10100E).copy(alpha = 0.72f),
    /** Behind the AI label and other pills over a scene. */
    val scrim: Color = Color(0xFF0B0B0A).copy(alpha = 0.8f),
    val ok: Color = Color(0xFF8CCB8C),
)
