import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Download,
  HelpCircle,
  Play,
  Send,
  Share2,
  Tags,
  ChevronDown,
  ChevronRight,
  CircleDot,
  ExternalLink,
  FileDown,
  Languages,
  Lightbulb,
  Trophy,
  LayoutTemplate,
} from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { api } from "../apiService";

interface CaptionSegment {
  time: string;
  end_time?: string;
  start_seconds?: number;
  end_seconds?: number;
  text: string;
}

interface CaptionSummary {
  start_seconds: number;
  end_seconds: number;
  start_time: string;
  end_time: string;
  text: string;
  summary: string;
  captions?: CaptionSegment[];
}

interface Question {
  type?: string;
  question: string;
  answer?: string;
  correct_answer?: string;
  options?: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SummaryData {
  id?: number;
  title?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  summary: string;
  keywords: string[];
  youtube_url?: string;
  transcript?: string;
  caption_segments?: CaptionSegment[];
  caption_summaries?: CaptionSummary[];
  key_points?: string[];
  questions?: Question[];
  action_items?: string[];
  chapters?: Array<{ title: string; description: string }>;
  language?: string;
}

const emptySummary: SummaryData = {
  summary: "",
  keywords: [],
  youtube_url: "",
  transcript: "",
  caption_segments: [],
  caption_summaries: [],
  key_points: [],
  questions: [],
  action_items: [],
  chapters: [],
};

function secondsToTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function timeToSeconds(timeString: string) {
  const parts = timeString.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return parts[0] * 60 + parts[1];
}

function getSegmentStart(segment: CaptionSegment) {
  return typeof segment.start_seconds === "number"
    ? segment.start_seconds
    : timeToSeconds(segment.time);
}

function fallbackCaptionSummaries(segments: CaptionSegment[] = [], duration?: number) {
  if (!segments.length) return [];

  const lastSecond =
    duration || Math.max(...segments.map((segment) => getSegmentStart(segment))) + 30;
  const windows: CaptionSummary[] = [];

  for (let start = 0; start < lastSecond; start += 30) {
    const end = Math.min(start + 30, lastSecond);
    const captions = segments.filter((segment) => {
      const segmentStart = getSegmentStart(segment);
      return segmentStart >= start && segmentStart < end;
    });
    const text = captions.map((caption) => caption.text).join(" ").trim();
    if (!text) continue;

    const words = text.split(/\s+/);
    windows.push({
      start_seconds: start,
      end_seconds: end,
      start_time: secondsToTime(start),
      end_time: secondsToTime(end),
      text,
      summary: words.length > 26 ? `${words.slice(0, 26).join(" ")}...` : text,
      captions,
    });
  }

  return windows;
}

function getYouTubeId(url = "") {
  const patterns = [
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/watch\?v=([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  try {
    return new URL(url).searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function BulletList({ items, empty }: { items?: string[]; empty: string }) {
  if (!items?.length) {
    return <p className="p-4 text-gray-500">{empty}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex gap-3 rounded-xl bg-gray-50 p-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-gray-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

function hasMissingGeneratedDetails(data: SummaryData) {
  if (!data.summary && !data.youtube_url) return false;
  return (
    !data.transcript ||
    !data.caption_segments?.length ||
    !data.caption_summaries?.length ||
    !data.key_points?.length ||
    !data.questions?.length ||
    !data.action_items?.length
  );
}

export default function SummaryPage() {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<SummaryData>(emptySummary);
  const [activeTab, setActiveTab] = useState("Summary");
  const [activeVideoTab, setActiveVideoTab] = useState("Captions");
  const [selectedWindow, setSelectedWindow] = useState<CaptionSummary | null>(null);
  const [playerStart, setPlayerStart] = useState(0);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [testMode, setTestMode] = useState<"idle" | "guidelines" | "active" | "complete">("idle");
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testScore, setTestScore] = useState(0);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<number, boolean>>({});
  const [exportOpen, setExportOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isHydratingDetails, setIsHydratingDetails] = useState(false);
  const [hydrationAttempted, setHydrationAttempted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me anything about this video, the current 30-second section, or the generated summary.",
    },
  ]);

  useEffect(() => {
    const data = localStorage.getItem("last_summary");
    if (!data) return;

    try {
      setSummaryData({ ...emptySummary, ...JSON.parse(data) });
    } catch (error) {
      console.error("Failed to parse summary data", error);
    }
  }, []);

  useEffect(() => {
    if (hydrationAttempted || isHydratingDetails || !hasMissingGeneratedDetails(summaryData)) {
      return;
    }

    setHydrationAttempted(true);
    setIsHydratingDetails(true);

    const hydrateFromVideo = () =>
      api
        .videoFeatures(summaryData.youtube_url || "", summaryData.transcript)
        .then((details) => ({ ...summaryData, ...details }));

    const hydrate = summaryData.id
      ? api.hydrateSummary(summaryData.id).then((result) => result.data).catch(hydrateFromVideo)
      : hydrateFromVideo();

    hydrate
      .then((hydrated) => {
        const nextData = { ...emptySummary, ...summaryData, ...hydrated };
        setSummaryData(nextData);
        localStorage.setItem("last_summary", JSON.stringify(nextData));
      })
      .catch((error) => {
        console.error("Failed to hydrate saved summary details", error);
      })
      .finally(() => setIsHydratingDetails(false));
  }, [hydrationAttempted, isHydratingDetails, summaryData]);

  const captionSummaries = useMemo(() => {
    if (summaryData.caption_summaries?.length) return summaryData.caption_summaries;
    return fallbackCaptionSummaries(summaryData.caption_segments, summaryData.duration);
  }, [summaryData]);

  useEffect(() => {
    if (!selectedWindow && captionSummaries.length) {
      setSelectedWindow(captionSummaries[0]);
    }
  }, [captionSummaries, selectedWindow]);

  const videoId = getYouTubeId(summaryData.youtube_url);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?start=${Math.floor(playerStart)}&autoplay=${
        shouldAutoplay ? 1 : 0
      }&rel=0&modestbranding=1`
    : "";

  const playWindow = (window: CaptionSummary) => {
    setSelectedWindow(window);
    setPlayerStart(window.start_seconds);
    setShouldAutoplay(true);
  };

  const downloadBlob = (content: BlobPart, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: "doc" | "pdf" | "ppt") => {
    setExportOpen(false);
    const title = summaryData.title || "Synopsis Summary";
    const exportHtml = `<html><head><title>${title}</title><style>body{font-family:Arial;padding:48px;line-height:1.6;color:#182033}h1{font-size:32px}li{margin:8px 0}</style></head><body><h1>${title}</h1><div>${summaryData.summary}</div><h2>Key points</h2><ul>${summaryData.key_points?.map((point) => `<li>${point}</li>`).join("") || ""}</ul></body></html>`;
    if (format === "pdf") {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(exportHtml);
      printWindow?.document.close();
      printWindow?.print();
      return;
    }
    if (format === "doc") {
      downloadBlob(exportHtml, "application/msword", "synopsis-summary.doc");
      return;
    }
    const customContent = window.prompt("What should be included in the presentation?", "Summary, key concepts, action items") || "Summary and key concepts";
    const { default: PptxGenJS } = await import("pptxgenjs");
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "Synopsis";
    pptx.subject = customContent;
    pptx.title = title;
    pptx.company = "Synopsis";
    pptx.theme = {
      headFontFace: "Aptos Display",
      bodyFontFace: "Aptos",
    };

    const cleanText = (value = "") =>
      value.replace(/[#*_>`~-]/g, "").replace(/\n{3,}/g, "\n\n").trim();
    const addHeader = (slide: any, heading: string, eyebrow = "SYNOPSIS") => {
      slide.background = { color: "F7F8FC" };
      slide.addText(eyebrow, { x: 0.65, y: 0.35, w: 3.5, h: 0.25, fontSize: 10, bold: true, color: "4F46E5", charSpacing: 2 });
      slide.addText(heading, { x: 0.65, y: 0.67, w: 8.8, h: 0.55, fontSize: 26, bold: true, color: "111827", margin: 0 });
      slide.addShape(pptx.ShapeType.line, { x: 0.65, y: 1.35, w: 12, h: 0, line: { color: "DDE2EE", width: 1 } });
    };
    const addImagePlaceholder = (slide: any, label = "Add a relevant image here") => {
      slide.addShape(pptx.ShapeType.rect, { x: 9.3, y: 1.75, w: 3.35, h: 4.6, rectRadius: 0.1, fill: { color: "EEF2FF" }, line: { color: "A5B4FC", dashType: "dash", width: 1.5 } });
      slide.addText(label, { x: 9.65, y: 3.75, w: 2.65, h: 0.7, align: "center", valign: "mid", fontSize: 15, bold: true, color: "6366F1", margin: 0 });
    };

    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: "111827" };
    titleSlide.addText("SYNOPSIS", { x: 0.7, y: 0.55, w: 3, h: 0.3, fontSize: 11, bold: true, color: "A5B4FC", charSpacing: 3 });
    titleSlide.addText(title, { x: 0.7, y: 1.35, w: 8, h: 1.8, fontSize: 30, bold: true, color: "FFFFFF", breakLine: false, margin: 0 });
    titleSlide.addText(customContent, { x: 0.72, y: 3.45, w: 7.4, h: 0.75, fontSize: 16, color: "CBD5E1", margin: 0 });
    titleSlide.addShape(pptx.ShapeType.rect, { x: 9.25, y: 1.15, w: 3.3, h: 4.8, fill: { color: "1E293B" }, line: { color: "6366F1", dashType: "dash", width: 1.5 } });
    titleSlide.addText("COVER IMAGE\nPLACEHOLDER", { x: 9.7, y: 3.1, w: 2.4, h: 0.9, align: "center", fontSize: 15, bold: true, color: "A5B4FC", margin: 0 });

    const summarySlide = pptx.addSlide();
    addHeader(summarySlide, "Executive summary");
    summarySlide.addText(cleanText(summaryData.summary).slice(0, 2200) || "No summary available.", { x: 0.7, y: 1.7, w: 8.05, h: 4.95, fontSize: 15, color: "334155", breakLine: false, valign: "top", margin: 0.08, paraSpaceAfter: 8, fit: "shrink" });
    addImagePlaceholder(summarySlide);

    const keyPoints = summaryData.key_points?.length ? summaryData.key_points : summaryData.keywords || [];
    if (keyPoints.length) {
      const pointsSlide = pptx.addSlide();
      addHeader(pointsSlide, "Key concepts");
      pointsSlide.addText(keyPoints.slice(0, 10).map((point) => ({ text: cleanText(point), options: { bullet: { indent: 16 }, hanging: 4, breakLine: true } })), { x: 0.8, y: 1.7, w: 7.9, h: 4.95, fontSize: 18, color: "334155", breakLine: false, margin: 0.08, paraSpaceAfter: 14, fit: "shrink" });
      addImagePlaceholder(pointsSlide, "Concept illustration placeholder");
    }

    if (summaryData.action_items?.length) {
      const actionSlide = pptx.addSlide();
      addHeader(actionSlide, "Action items");
      actionSlide.addText(summaryData.action_items.slice(0, 10).map((item) => ({ text: cleanText(item), options: { bullet: { indent: 16 }, hanging: 4, breakLine: true } })), { x: 0.8, y: 1.7, w: 7.9, h: 4.95, fontSize: 18, color: "334155", margin: 0.08, paraSpaceAfter: 14, fit: "shrink" });
      addImagePlaceholder(actionSlide, "Action visual placeholder");
    }

    await pptx.writeFile({ fileName: "synopsis-presentation.pptx" });
  };

  const handleGeneratePresentation = () => {
    localStorage.setItem(
      "presentation_seed",
      JSON.stringify({
        seedId: `summary-${summaryData.id || summaryData.youtube_url || summaryData.title || Date.now()}`,
        type: "summary",
        data: { ...summaryData, caption_summaries: captionSummaries },
      })
    );
    navigate("/presentation-editor");
  };
  const handleShare = async () => {
    const shareData = { title: summaryData.title || "Synopsis summary", text: summaryData.summary?.slice(0, 180), url: window.location.href };
    if (navigator.share) await navigator.share(shareData);
    else {
      await navigator.clipboard?.writeText(`${shareData.title}\n${shareData.url}`);
      alert("Share link copied to clipboard.");
    }
  };

  const testQuestions = useMemo(() => (summaryData.questions || []).map((item, index) => {
    const correct = item.correct_answer || item.answer || "";
    const options = item.options?.length ? item.options : [correct, "None of the above", "All of the above", "Not mentioned in the video"];
    return { ...item, type: item.type || "multiple_choice", correct_answer: correct, options: Array.from(new Set(options)).slice(0, 4), index };
  }), [summaryData.questions]);

  const submitTest = () => {
    const correct = testQuestions.filter((question, index) => testAnswers[index]?.trim().toLowerCase() === question.correct_answer?.trim().toLowerCase()).length;
    const score = testQuestions.length ? Math.round((correct / testQuestions.length) * 100) : 0;
    setTestScore(score);
    setTestMode("complete");
    const results = JSON.parse(localStorage.getItem("synopsis_test_results") || "[]");
    results.unshift({ title: summaryData.title || "Video test", score, date: new Date().toISOString(), total: testQuestions.length });
    localStorage.setItem("synopsis_test_results", JSON.stringify(results.slice(0, 30)));
  };

  const changeLanguage = async (language: string) => {
    if (language === summaryData.language || isTranslating) return;
    setIsTranslating(true);
    try {
      const response = await api.translateSummary(language, {
        summary: summaryData.summary,
        transcript: summaryData.transcript,
        key_points: summaryData.key_points,
        questions: summaryData.questions,
        action_items: summaryData.action_items,
        chapters: summaryData.chapters,
        keywords: summaryData.keywords,
      });
      const translated = { ...summaryData, ...response.data, language };
      setSummaryData(translated);
      localStorage.setItem("last_summary", JSON.stringify(translated));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAskAi = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question || isAsking) return;

    setChatInput("");
    setIsAsking(true);
    setChatMessages((messages) => [...messages, { role: "user", content: question }]);

    try {
      const data = await api.askSummaryAi(
        question,
        { ...summaryData, caption_summaries: captionSummaries },
        selectedWindow
      );
      setChatMessages((messages) => [
        ...messages,
        { role: "assistant", content: data.answer || "I could not generate an answer." },
      ]);
    } catch (error) {
      setChatMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Ask AI failed. Please check the backend.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
  <div className="mx-auto max-w-[1600px] px-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 150, -50, 0], y: [0, -100, 100, 0], scale: [1, 1.2, 0.8, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-300/40 to-indigo-300/40 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, -150, 50, 0], y: [0, 150, -100, 0], scale: [1, 1.3, 0.9, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-300/40 blur-[150px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, 100, -100, 0], y: [0, 100, -50, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/30 to-orange-200/30 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] rounded-full bg-gradient-to-t from-blue-300/30 to-transparent blur-[150px] mix-blend-multiply"
        />
      </div>

        {/* Added overflow-visible and increased z-index to 50 */}
        <div className="relative z-50 mb-6 rounded-2xl bg-white p-6 shadow-sm overflow-visible">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg p-2 hover:bg-gray-100"
                title="Back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {summaryData.title || "YouTube Video Synopsis"}
                </h1>
                {summaryData.channel && (
                  <p className="text-sm text-gray-500">{summaryData.channel}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select value={summaryData.language || "English"} onChange={(event) => changeLanguage(event.target.value)} disabled={isTranslating} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold">
                {["English", "Hindi", "Telugu", "Spanish"].map((language) => <option key={language}>{language}</option>)}
              </select>
              <div className="relative">
                <button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"><Download className="h-4 w-4" />Export<ChevronDown className="h-4 w-4" /></button>
                {exportOpen && (<div className="absolute right-0 top-full z-[100] mt-2 w-56 rounded-xl border bg-white p-2 shadow-2xl">{(["doc", "pdf", "ppt"] as const).map((format) => <button key={format} onClick={() => handleExport(format)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-gray-50"><FileDown className="h-4 w-4" />Export {format.toUpperCase()}</button>)}<button onClick={handleGeneratePresentation} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-indigo-700 hover:bg-indigo-50"><LayoutTemplate className="h-4 w-4" />Generate PPT</button></div>)}
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex gap-2 border-b border-gray-200">
              {["Summary", "Transcript", "Questions", "Actions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="max-w-none text-base leading-8 text-gray-700">
              {activeTab === "Summary" && (
                summaryData.summary ? (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{summaryData.summary}</ReactMarkdown>
                    {!!summaryData.keywords?.length && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {summaryData.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                          >
                            <Tags className="h-3 w-3" />
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500">No summary available yet.</p>
                )
              )}

              {activeTab === "Transcript" && (
                <p className="max-h-[620px] overflow-y-auto whitespace-pre-line rounded-xl bg-gray-50 p-4 leading-7 text-gray-700">
                  {summaryData.transcript || (isHydratingDetails ? "Loading transcript..." : "No transcript available.")}
                </p>
              )}

              {activeTab === "Questions" && (
                <div className="space-y-4">
                  <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-bold text-emerald-900">Ready to test your understanding?</p><p className="text-xs text-emerald-700">MCQ, true/false, and short-answer practice from this video.</p></div>
                    <button onClick={() => navigate("/test-options")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-bold text-white"><Trophy className="h-4 w-4" />Take test</button>
                  </div>
                  {testMode === "guidelines" && <div className="rounded-2xl border border-emerald-200 bg-white p-5"><h3 className="font-bold text-gray-900">Test guidelines</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600"><li>Answer every question from the video concepts.</li><li>Your score is saved to your profile.</li><li>Stay on this page until you submit.</li></ul><button onClick={() => setTestMode("active")} className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white">Start test</button></div>}
                  {testMode === "active" && <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-5"><p className="mb-5 inline-flex items-center gap-2 font-bold text-emerald-700"><CircleDot className="h-4 w-4 fill-emerald-500" />Test in progress</p><div className="space-y-5">{testQuestions.map((item, index) => <div key={index} className="rounded-xl bg-white p-4 shadow-sm"><p className="font-semibold text-gray-900">{index + 1}. {item.question}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-600">{item.type}</p>{item.type === "short_answer" ? <input value={testAnswers[index] || ""} onChange={(event) => setTestAnswers({ ...testAnswers, [index]: event.target.value })} className="mt-3 w-full rounded-lg border px-3 py-2" placeholder="Type your answer" /> : <div className="mt-3 grid gap-2">{item.options?.map((option) => <button key={option} onClick={() => setTestAnswers({ ...testAnswers, [index]: option })} className={`rounded-lg border px-3 py-2 text-left text-sm ${testAnswers[index] === option ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "hover:bg-gray-50"}`}>{option}</button>)}</div>}</div>)}</div><button onClick={submitTest} className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white">Submit test</button></div>}
                  {testMode === "complete" && <div className="rounded-2xl bg-emerald-600 p-6 text-center text-white"><Trophy className="mx-auto h-10 w-10" /><p className="mt-3 text-sm font-semibold">Test complete</p><p className="text-5xl font-bold">{testScore}%</p><button onClick={() => { setTestMode("active"); setTestAnswers({}); }} className="mt-4 rounded-xl bg-white px-4 py-2 font-bold text-emerald-700">Try again</button></div>}
                  {testMode === "idle" && (summaryData.questions?.length ? (
                    summaryData.questions.map((item, index) => (
                      <div key={`${item.question}-${index}`} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <button
                          type="button"
                          onClick={() => setExpandedAnswers((current) => ({ ...current, [index]: !current[index] }))}
                          className="flex w-full items-start gap-3 p-4 text-left hover:bg-gray-50"
                        >
                          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                          <span className="min-w-0 flex-1 font-semibold text-gray-900">{item.question}</span>
                          <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${expandedAnswers[index] ? "rotate-90" : ""}`} />
                        </button>
                        {expandedAnswers[index] && (
                          <div className="border-t border-gray-100 bg-gray-50 px-10 py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Answer</p>
                            <p className="mt-1 leading-6 text-gray-700">{item.answer || item.correct_answer || "No answer generated for this question."}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500">{isHydratingDetails ? "Loading questions..." : "No questions generated."}</p>
                  ))}
                </div>
              )}

              {activeTab === "Actions" && (
                <BulletList
                  items={summaryData.action_items}
                  empty={isHydratingDetails ? "Loading action items..." : "No action items generated."}
                />
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="aspect-video bg-gray-950">
              {embedUrl ? (
                <iframe
                  key={`${videoId}-${playerStart}-${shouldAutoplay}`}
                  src={embedUrl}
                  title={summaryData.title || "YouTube video"}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/70">
                  Paste and summarize a YouTube URL to play the video here.
                </div>
              )}
            </div>

            <div className="flex gap-1 border-b border-gray-200 p-2">
              {["Captions", "Key Points", "Transcript", "Ask AI"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveVideoTab(tab)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    activeVideoTab === tab
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-[650px] overflow-y-auto p-5">
              {activeVideoTab === "Captions" && (
                <div className="space-y-3">
                  {captionSummaries.length ? (
                    captionSummaries.map((window) => {
                      const isSelected = selectedWindow?.start_seconds === window.start_seconds;
                      return (
                        <button
                          key={`${window.start_time}-${window.end_time}`}
                          onClick={() => playWindow(window)}
                          className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            isSelected
                              ? "border-gray-900 bg-gray-950 text-white"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className={`text-xs font-mono ${isSelected ? "text-indigo-200" : "text-indigo-600"}`}>
                              {window.start_time} - {window.end_time}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>
                              <Play className="h-3.5 w-3.5" />
                              Play
                            </span>
                          </div>
                          <p className={`text-sm font-medium leading-6 ${isSelected ? "text-white" : "text-gray-800"}`}>
                            {window.summary}
                          </p>
                          <p className={`mt-2 line-clamp-2 text-xs leading-5 ${isSelected ? "text-white/60" : "text-gray-500"}`}>
                            {window.text}
                          </p>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">{isHydratingDetails ? "Loading caption summaries..." : "No caption summaries available."}</p>
                  )}
                </div>
              )}

              {activeVideoTab === "Key Points" && (
                <BulletList
                  items={summaryData.key_points}
                  empty={isHydratingDetails ? "Loading key points..." : "No key points generated."}
                />
              )}

              {activeVideoTab === "Transcript" && (
                <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                  {summaryData.transcript || (isHydratingDetails ? "Loading transcript..." : "No transcript available.")}
                </p>
              )}

              {activeVideoTab === "Ask AI" && (
                <div className="flex h-full flex-col">
                  <div className="mb-3 rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-indigo-900">
                    <Bot className="mr-1 inline h-4 w-4" />
                    {selectedWindow
                      ? `Using current section ${selectedWindow.start_time} - ${selectedWindow.end_time} plus the full summary.`
                      : "Using the full generated summary and transcript."}
                  </div>

                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                    {chatMessages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`rounded-xl p-3 text-sm leading-6 ${
                          message.role === "user"
                            ? "ml-8 bg-gray-900 text-white"
                            : "mr-8 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {message.content}
                      </div>
                    ))}
                    {isAsking && (
                      <div className="mr-8 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                        Thinking...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAskAi} className="mt-4 flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Ask about this summary..."
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                    />
                    <button
                      type="submit"
                      disabled={isAsking}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-white disabled:opacity-50"
                      title="Send"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="relative z-10 mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-3 text-amber-600"><Lightbulb className="h-5 w-5" /></div><div><h2 className="text-xl font-bold text-gray-900">Smart suggestions</h2><p className="text-sm text-gray-500">Recommended YouTube searches based on concepts in this summary.</p></div></div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {(summaryData.keywords?.length ? summaryData.keywords : ["Related concepts", "Beginner guide", "Deep dive", "Practice"]).slice(0, 4).map((keyword) => (
              <a key={keyword} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${keyword} explained`)}`} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 p-4 transition hover:border-red-200 hover:bg-red-50">
                <p className="font-bold text-gray-900">{keyword}</p><p className="mt-1 text-xs text-gray-500">Find the best related videos</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-600">Open YouTube <ExternalLink className="h-3 w-3" /></span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

