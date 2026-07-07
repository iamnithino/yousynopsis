import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getSubtitles } from "youtube-caption-extractor";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const captionGroupSeconds = Number(process.env.CAPTION_GROUP_SECONDS || 45);

const supportedLanguages = new Map([
  ["english", "en"],
  ["en", "en"],
  ["hindi", "hi"],
  ["hi", "hi"],
  ["telugu", "te"],
  ["te", "te"],
  ["tamil", "ta"],
  ["ta", "ta"],
  ["spanish", "es"],
  ["es", "es"],
  ["french", "fr"],
  ["fr", "fr"],
  ["german", "de"],
  ["de", "de"],
  ["japanese", "ja"],
  ["ja", "ja"],
  ["arabic", "ar"],
  ["ar", "ar"],
  ["russian", "ru"],
  ["ru", "ru"],
  ["portuguese", "pt"],
  ["pt", "pt"]
]);

const youtubeVideoIdPattern = /^[A-Za-z0-9_-]{11}$/;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function secondsToTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function cleanCaptionText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLanguage(language) {
  const value = String(language || "en").trim().toLowerCase();
  return supportedLanguages.get(value) || supportedLanguages.get(value.split("-")[0]) || "en";
}

function extractVideoId(input) {
  const value = String(input || "").trim();
  if (youtubeVideoIdPattern.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const queryId = parsed.searchParams.get("v");
    if (queryId && youtubeVideoIdPattern.test(queryId)) {
      return queryId;
    }

    const host = parsed.hostname.toLowerCase();
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (host.endsWith("youtu.be") && parts[0] && youtubeVideoIdPattern.test(parts[0])) {
      return parts[0];
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      for (const marker of ["shorts", "embed", "live", "v"]) {
        const index = parts.indexOf(marker);
        if (index >= 0 && parts[index + 1] && youtubeVideoIdPattern.test(parts[index + 1])) {
          return parts[index + 1];
        }
      }
    }
  } catch {
    const match = value.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/|\/v\/)([A-Za-z0-9_-]{11})/);
    if (match) {
      return match[1];
    }
  }

  throw Object.assign(new Error("Invalid YouTube URL. Please provide a valid YouTube video link."), { statusCode: 400 });
}

function normalizeSubtitles(subtitles) {
  return subtitles
    .map((item) => {
      const start = Number(item?.start || 0);
      const duration = Number(item?.dur || item?.duration || 0);
      const text = cleanCaptionText(item?.text);
      return {
        start,
        end: duration > 0 ? start + duration : start,
        text
      };
    })
    .filter((item) => item.text);
}

async function fetchSubtitles(videoID, language) {
  const subtitles = await getSubtitles({ videoID, lang: language });
  return Array.isArray(subtitles) ? subtitles : [];
}

async function fetchSubtitlesWithFallback(videoID, requestedLanguage) {
  const requested = normalizeLanguage(requestedLanguage);
  const languageOrder = requested === "en" ? ["en"] : [requested, "en"];
  let lastError;

  for (const language of languageOrder) {
    try {
      console.log(`[transcript-service] Fetching captions for ${videoID} in ${language}`);
      const subtitles = await fetchSubtitles(videoID, language);
      const cleaned = normalizeSubtitles(subtitles);
      if (cleaned.length > 0) {
        return { language, subtitles: cleaned };
      }
    } catch (error) {
      lastError = error;
      console.warn(`[transcript-service] Caption fetch failed for ${videoID} in ${language}: ${error.message}`);
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw Object.assign(new Error("No captions were found for this video. Try a YouTube video with captions enabled."), { statusCode: 422 });
}

function groupSubtitles(subtitles) {
  const groups = [];
  for (const item of subtitles) {
    const groupStart = Math.floor(item.start / captionGroupSeconds) * captionGroupSeconds;
    let group = groups[groups.length - 1];
    if (!group || group.start_seconds !== groupStart) {
      group = {
        start_seconds: groupStart,
        end_seconds: groupStart + captionGroupSeconds,
        text_parts: []
      };
      groups.push(group);
    }
    group.end_seconds = Math.max(group.end_seconds, item.end);
    group.text_parts.push(item.text);
  }

  return groups
    .map((group) => {
      const text = cleanCaptionText(group.text_parts.join(" "));
      return {
        time: secondsToTime(group.start_seconds),
        end_time: secondsToTime(group.end_seconds),
        start_seconds: group.start_seconds,
        end_seconds: group.end_seconds,
        text
      };
    })
    .filter((group) => group.text);
}

function classifyError(error) {
  const message = error instanceof Error ? error.message : String(error);
  const statusCode = error?.statusCode || 502;
  const lowered = message.toLowerCase();
  if (
    message.includes("Video unavailable") ||
    lowered.includes("private") ||
    lowered.includes("caption") ||
    lowered.includes("subtitle")
  ) {
    return { statusCode: 422, message };
  }
  return { statusCode, message };
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/transcript", async (req, res) => {
  const startedAt = Date.now();
  try {
    const youtubeUrl = req.body?.youtube_url || req.body?.youtubeUrl || req.body?.url || req.body?.video_id;
    const requestedLanguage = req.body?.language || req.body?.lang || "en";
    const videoID = req.body?.video_id && youtubeVideoIdPattern.test(req.body.video_id)
      ? req.body.video_id
      : extractVideoId(youtubeUrl);

    const { language, subtitles } = await fetchSubtitlesWithFallback(videoID, requestedLanguage);
    const segments = groupSubtitles(subtitles);
    const transcript = cleanCaptionText(segments.map((segment) => segment.text).join(" "));

    if (!transcript || segments.length === 0) {
      return res.status(422).json({
        success: false,
        error: "No usable captions were found for this video. Try a YouTube video with captions enabled."
      });
    }

    console.log(
      `[transcript-service] Captions ready for ${videoID}: ${subtitles.length} captions, ${segments.length} groups, ${Date.now() - startedAt}ms`
    );

    return res.json({
      success: true,
      transcript,
      language,
      captionCount: subtitles.length,
      segments
    });
  } catch (error) {
    const { statusCode, message } = classifyError(error);
    console.error(`[transcript-service] ${message}`);
    return res.status(statusCode).json({
      success: false,
      error: message || "Could not retrieve captions for this video."
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`[transcript-service] Listening on port ${port}`);
});
