package app.dheevara.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assert
import androidx.compose.ui.test.assertHeightIsAtLeast
import androidx.compose.ui.test.assertIsOff
import androidx.compose.ui.test.assertIsOn
import androidx.compose.ui.test.assertIsSelected
import androidx.compose.ui.test.assertIsNotSelected
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.v2.runDesktopComposeUiTest
import androidx.compose.ui.unit.dp
import app.dheevara.ui.components.ButtonKind
import app.dheevara.ui.components.DButton
import app.dheevara.ui.components.DChip
import app.dheevara.ui.components.DCite
import app.dheevara.ui.components.DGroup
import app.dheevara.ui.components.DIcon
import app.dheevara.ui.components.DListRow
import app.dheevara.ui.components.DPill
import app.dheevara.ui.components.DSegmentedProgress
import app.dheevara.ui.components.DTabBar
import app.dheevara.ui.components.RowEnd
import app.dheevara.ui.components.Tab
import app.dheevara.ui.theme.DheevaraTheme
import kotlin.test.Test
import kotlin.test.assertEquals

/** Screen-reader roles and the 44 pt minimum target, checked on the semantics tree. */
@OptIn(ExperimentalTestApi::class)
class AccessibilityTest {
    private fun hasRole(role: Role) = SemanticsMatcher.expectValue(SemanticsProperties.Role, role)

    @Test
    fun buttonsAreButtonsAndAtLeast44High() = runDesktopComposeUiTest {
        var clicks = 0
        setContent { DheevaraTheme { DButton("Share", onClick = { clicks++ }, kind = ButtonKind.Bare, small = true) } }
        onNodeWithText("Share").assert(hasRole(Role.Button)).assertHeightIsAtLeast(44.dp).performClick()
        assertEquals(1, clicks)
    }

    @Test
    fun chipsHaveA44TargetAndReadAsAChoice() = runDesktopComposeUiTest {
        setContent {
            DheevaraTheme {
                Column {
                    DChip("All", selected = true, onClick = {})
                    DChip("தமிழ்", lang = "ta", selected = false, onClick = {})
                }
            }
        }
        onNodeWithText("All").assert(hasRole(Role.RadioButton)).assertIsSelected().assertHeightIsAtLeast(44.dp)
        onNodeWithText("தமிழ்").assertIsNotSelected().assertHeightIsAtLeast(44.dp)
    }

    @Test
    fun aToggleRowIsOneSwitchTheWholeRowToggles() = runDesktopComposeUiTest {
        var on = false
        setContent {
            DheevaraTheme {
                DGroup { DListRow("Play next chapter", end = RowEnd.Toggle(checked = on, onChange = { on = it })) }
            }
        }
        onNodeWithText("Play next chapter").assert(hasRole(Role.Switch)).assertIsOff().assertHeightIsAtLeast(56.dp).performClick()
        assertEquals(true, on)
    }

    @Test
    fun aRowWithAValueIsAButton() = runDesktopComposeUiTest {
        setContent { DheevaraTheme { DListRow("Narration", end = RowEnd.Value("தமிழ்", lang = "ta"), onClick = {}) } }
        onNodeWithText("Narration").assert(hasRole(Role.Button))
    }

    @Test
    fun theCiteSaysWhatItIsAndIsTappable() = runDesktopComposeUiTest {
        var opened = false
        setContent { DheevaraTheme { DCite("7.34.19", description = "Source: Mahābhārata 7.34.19", onClick = { opened = true }) } }
        onNodeWithContentDescription("Source: Mahābhārata 7.34.19").assert(hasRole(Role.Button)).assertHeightIsAtLeast(44.dp).performClick()
        assertEquals(true, opened)
    }

    @Test
    fun theAiLabelReadsAsOnePhrase() = runDesktopComposeUiTest {
        setContent { DheevaraTheme { DPill(listOf("AI scene", "Seen with Sañjaya")) } }
        onNode(hasContentDescription("AI scene, Seen with Sañjaya")).assertExists()
    }

    @Test
    fun progressSaysWhichPart() = runDesktopComposeUiTest {
        setContent { DheevaraTheme { DSegmentedProgress(segments = 5, current = 1, fraction = 0.5f, stateDescription = "Part 2 of 5") } }
        onNode(SemanticsMatcher.expectValue(SemanticsProperties.StateDescription, "Part 2 of 5")).assertExists()
    }

    @Test
    fun tabsAreTabsAndSayWhichIsSelected() = runDesktopComposeUiTest {
        var selected = 0
        setContent {
            DheevaraTheme {
                DTabBar(listOf(Tab("Home", DIcon.Home), Tab("Library", DIcon.Library)), selected = selected, onSelect = { selected = it })
            }
        }
        onNode(hasText("Home")).assert(hasRole(Role.Tab)).assertIsSelected().assertHeightIsAtLeast(44.dp)
        onNode(hasText("Library")).assertIsNotSelected().performClick()
        assertEquals(1, selected)
    }

    @Test
    fun toggleOnState() = runDesktopComposeUiTest {
        setContent { DheevaraTheme { DListRow("Audio only", end = RowEnd.Toggle(checked = true, onChange = {})) } }
        onNodeWithText("Audio only").assertIsOn()
    }
}
