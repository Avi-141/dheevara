package app.dheevara.core.manifest

import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json

/** Reads a manifest and refuses it, with reasons, if it breaks the contract. */
object ManifestLoader {
    /** Unknown keys are ignored so an app in the field keeps working when the pipeline adds fields. */
    val json = Json { ignoreUnknownKeys = true }

    fun load(text: String): ManifestLoad {
        val manifest = try {
            json.decodeFromString(ChapterManifest.serializer(), text)
        } catch (e: SerializationException) {
            return ManifestLoad.Malformed(e.message ?: "unreadable manifest")
        } catch (e: IllegalArgumentException) {
            return ManifestLoad.Malformed(e.message ?: "unreadable manifest")
        }
        val problems = ManifestCheck.problems(manifest)
        return if (problems.isEmpty()) ManifestLoad.Ok(manifest) else ManifestLoad.Invalid(manifest, problems)
    }
}

sealed interface ManifestLoad {
    data class Ok(val manifest: ChapterManifest) : ManifestLoad
    data class Invalid(val manifest: ChapterManifest, val problems: List<ManifestProblem>) : ManifestLoad
    data class Malformed(val reason: String) : ManifestLoad
}
