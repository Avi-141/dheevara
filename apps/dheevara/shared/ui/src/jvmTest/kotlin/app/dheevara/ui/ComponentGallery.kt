package app.dheevara.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.dheevara.ui.components.ButtonKind
import app.dheevara.ui.components.DButton
import app.dheevara.ui.components.DChip
import app.dheevara.ui.components.DCite
import app.dheevara.ui.components.DGroup
import app.dheevara.ui.components.DIcon
import app.dheevara.ui.components.DLeafCard
import app.dheevara.ui.components.DListRow
import app.dheevara.ui.components.DPill
import app.dheevara.ui.components.DSegmentedProgress
import app.dheevara.ui.components.DTabBar
import app.dheevara.ui.components.DText
import app.dheevara.ui.components.RowEnd
import app.dheevara.ui.components.Tab
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.Dimens

/** The A2 components in the states the mockups use, on two pages, for screenshot tests. */
enum class GalleryPage { Scene, Controls }

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ComponentGallery(page: GalleryPage) {
    val c = DheevaraTheme.colors
    val t = DheevaraTheme.type
    Column(Modifier.fillMaxSize().background(c.bg)) {
        Column(
            Modifier.weight(1f).padding(horizontal = Dimens.gutter).padding(top = 20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            when (page) {
                GalleryPage.Scene -> {
                    DSegmentedProgress(segments = 5, current = 1, fraction = 0.4f, stateDescription = "Part 2 of 5")
                    DPill(listOf("AI scene", "Seen with Sañjaya"))
                    DText("The way in", t.display)
                    DText("Abhimanyu knows how to break the array. Nobody taught him how to leave it.", t.sub, color = c.fg2)
                    DLeafCard(Modifier.fillMaxWidth()) {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            DText("Droṇa Parva", t.label, color = c.ink2)
                            DText("7.34.19", t.cite, color = c.leafRed)
                        }
                        DText("उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने ।", t.verse, lang = "sa")
                        DText("नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि ॥", t.verse, lang = "sa")
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        DCite("7.34.19", description = "Source: Mahābhārata 7.34.19, open the page", onClick = {})
                        Box(Modifier.weight(1f))
                        DChip("Who taught him?", source = true, icon = DIcon.Leaf, onClick = {})
                    }
                    Box(Modifier.weight(1f))
                    DButton("Play chapter 4", onClick = {}, kind = ButtonKind.Primary, icon = DIcon.Play, filledIcon = true, modifier = Modifier.fillMaxWidth())
                    Row(horizontalArrangement = Arrangement.Center, modifier = Modifier.fillMaxWidth().padding(bottom = 20.dp)) {
                        DButton("Share", onClick = {}, kind = ButtonKind.Bare, small = true, icon = DIcon.Share)
                        DButton("Watch again", onClick = {}, kind = ButtonKind.Bare, small = true)
                    }
                }
                GalleryPage.Controls -> {
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        DChip("All", selected = true, onClick = {})
                        DChip("Mahābhārata", selected = false, onClick = {})
                        listOf(
                            "hi" to "हिन्दी", "ta" to "தமிழ்", "te" to "తెలుగు", "kn" to "ಕನ್ನಡ", "bn" to "বাংলা", "ml" to "മലയാളം",
                            "mr" to "मराठी", "gu" to "ગુજરાતી", "pa" to "ਪੰਜਾਬੀ", "or" to "ଓଡ଼ିଆ",
                        ).forEach { (lang, name) -> DChip(name, lang = lang, selected = false, onClick = {}) }
                    }
                    DGroup(Modifier.fillMaxWidth()) {
                        DListRow("Narration", icon = DIcon.Headphones, end = RowEnd.Value("தமிழ்", lang = "ta"), onClick = {})
                        DListRow("Play next chapter", end = RowEnd.Toggle(checked = true, onChange = {}))
                        DListRow("Reduce motion", subtitle = "Follow phone", end = RowEnd.Toggle(checked = false, onChange = {}), divider = false)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                        DButton("Resume", onClick = {}, modifier = Modifier.weight(1f))
                        DButton("Stop", onClick = {}, kind = ButtonKind.Line, small = true, modifier = Modifier.weight(1f))
                    }
                }
            }
        }
        if (page == GalleryPage.Controls) {
            DTabBar(
                tabs = listOf(Tab("Home", DIcon.Home), Tab("Explore", DIcon.Compass), Tab("Library", DIcon.Library)),
                selected = 0,
                onSelect = {},
            )
        }
    }
}
