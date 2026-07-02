import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { api } from "../apiService";

interface HistorySummary {
  id: number;
  youtube_url: string;
  title?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  transcript?: string;
  caption_segments?: unknown[];
  caption_summaries?: unknown[];
  summary: string;
  keywords: string[];
  chapters?: unknown[];
  key_points?: string[];
  questions?: unknown[];
  action_items?: string[];
  language?: string;
  created_at?: string;
}

function getVideoId(url = "") {
  return url.match(/(?:v=|youtu\.be\/)([^?&#]+)/)?.[1] || "";
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistorySummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.recentSummaries()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return items;
    return items.filter((item) =>
      `${item.summary} ${item.keywords?.join(" ")}`.toLowerCase().includes(normalized)
    );
  }, [items, query]);

  const openSummary = (item: HistorySummary) => {
    let summaryToOpen = item;
    try {
      const cached = JSON.parse(localStorage.getItem("last_summary") || "null");
      if (cached && (cached.id === item.id || cached.youtube_url === item.youtube_url)) {
        summaryToOpen = { ...item, ...cached };
      }
    } catch {
      summaryToOpen = item;
    }
    localStorage.setItem("last_summary", JSON.stringify(summaryToOpen));
    navigate("/summary");
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white bg-white/75 p-5 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-7">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/profile")} className="rounded-full border bg-white p-3 hover:bg-slate-50" title="Back to profile">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-indigo-600">Your library</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Full summary history</h1>
              <p className="mt-1 text-sm text-slate-500">{items.length} saved summaries, ready when you are.</p>
            </div>
          </div>
          <Link to="/workspace" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">
            <Sparkles className="h-4 w-4" /> Generate new
          </Link>
        </header>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search summaries or keywords..." className="w-full bg-transparent outline-none" />
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-12 text-center text-slate-500">Loading your history...</div>
        ) : filtered.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const videoId = getVideoId(item.youtube_url);
              return (
                <button key={item.id} onClick={() => openSummary(item)} className="group overflow-hidden rounded-3xl border border-white bg-white/85 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-cyan-100">
                    {videoId ? (
                      <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><FileText className="h-12 w-12 text-indigo-400" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recently"}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />Ready</span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-700">{item.summary || "Open this generated summary."}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(item.keywords || []).slice(0, 3).map((keyword) => (
                        <span key={keyword} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"><Tag className="h-3 w-3" />{keyword}</span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-indigo-200 bg-white/75 p-12 text-center">
            <FileText className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900">No summaries found</h2>
            <p className="mt-2 text-slate-500">Generate a video synopsis or try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
