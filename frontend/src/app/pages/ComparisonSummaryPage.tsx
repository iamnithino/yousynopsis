import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, GitCompareArrows, LayoutTemplate, Medal, Sparkles, Trophy } from 'lucide-react';

interface VideoInfo {
  title?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  youtube_url?: string;
}

interface DifferenceRow {
  topic: string;
  video1: string;
  video2: string;
}

interface VerdictItem {
  winner?: string;
  reasoning?: string;
}

interface ComparisonData {
  id?: number;
  goal?: string;
  language?: string;
  video_1?: VideoInfo;
  video_2?: VideoInfo;
  combined_summary?: string;
  common_points?: string[];
  differences?: DifferenceRow[];
  best_takeaways?: {
    video1_best?: string;
    video2_best?: string;
    combined_recommendation?: string;
    gold?: string;
    silver?: string;
    bronze?: string;
  };
  verdict?: Record<string, VerdictItem>;
  best_overall_video?: VerdictItem;
}

function formatDuration(duration?: number) {
  if (!duration) return 'Unknown';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function fallbackComparison(): ComparisonData {
  return {
    video_1: { title: 'Video 1', channel: '', thumbnail: '' },
    video_2: { title: 'Video 2', channel: '', thumbnail: '' },
    combined_summary: 'No comparison has been generated yet.',
    common_points: [],
    differences: [],
    best_takeaways: {},
    verdict: {},
  };
}

export default function ComparisonSummaryPage() {
  const navigate = useNavigate();
  const [comparison, setComparison] = useState<ComparisonData>(fallbackComparison());

  useEffect(() => {
    const stored = localStorage.getItem('last_comparison');
    if (!stored) return;

    try {
      setComparison({ ...fallbackComparison(), ...JSON.parse(stored) });
    } catch (error) {
      console.error('Failed to load comparison', error);
    }
  }, []);

  const takeaways = useMemo(() => {
    const best = comparison.best_takeaways || {};
    return [
      { label: 'Gold Medal Insight', value: best.gold || best.video1_best || 'Best idea from Video 1 will appear here.', icon: Trophy, className: 'bg-amber-50 text-amber-700 border-amber-100' },
      { label: 'Silver Medal Insight', value: best.silver || best.video2_best || 'Best idea from Video 2 will appear here.', icon: Medal, className: 'bg-slate-50 text-slate-700 border-slate-200' },
      { label: 'Bronze Medal Insight', value: best.bronze || best.combined_recommendation || 'Combined recommendation will appear here.', icon: Award, className: 'bg-orange-50 text-orange-700 border-orange-100' },
    ];
  }, [comparison.best_takeaways]);

  const generatePresentation = () => {
    localStorage.setItem('presentation_seed', JSON.stringify({
      seedId: `comparison-${comparison.id || comparison.video_1?.youtube_url || ''}-${comparison.video_2?.youtube_url || ''}`,
      type: 'comparison',
      data: comparison,
    }));
    navigate('/presentation-editor');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/workspace')} className="rounded-lg p-2 hover:bg-gray-100" title="Back to workspace">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600"><GitCompareArrows className="h-4 w-4" /> Video Comparison</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950 md:text-3xl">AI Comparison Summary</h1>
              </div>
            </div>
            <button onClick={generatePresentation} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800">
              <LayoutTemplate className="h-4 w-4" />
              Generate PPT
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {[comparison.video_1, comparison.video_2].map((video, index) => (
            <article key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="aspect-video bg-slate-900">
                {video?.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title || `Video ${index + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/70">Video {index + 1} Thumbnail</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Video {index + 1}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">{video?.title || `Video ${index + 1}`}</h2>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <div><p className="font-bold text-slate-900">Channel</p><p>{video?.channel || 'Unknown'}</p></div>
                  <div><p className="font-bold text-slate-900">Duration</p><p>{formatDuration(video?.duration)}</p></div>
                  <div><p className="font-bold text-slate-900">Title</p><p className="line-clamp-2">{video?.title || 'Untitled'}</p></div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Sparkles className="h-5 w-5" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Combined Summary</h2>
              {comparison.goal && <p className="text-sm text-slate-500">Goal: {comparison.goal}</p>}
            </div>
          </div>
          <p className="leading-8 text-slate-700">{comparison.combined_summary}</p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-950">Common Points</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(comparison.common_points?.length ? comparison.common_points : ['Discipline', 'Leadership', 'Consistency', 'Communication']).map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="font-semibold">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-950">Differences</h2>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[180px_1fr_1fr] bg-slate-950 text-sm font-bold text-white">
                <div className="p-4">Topic</div>
                <div className="p-4">Video 1</div>
                <div className="p-4">Video 2</div>
              </div>
              {(comparison.differences || []).map((row, index) => (
                <div key={`${row.topic}-${index}`} className="grid grid-cols-[180px_1fr_1fr] border-t border-slate-200 bg-white text-sm">
                  <div className="p-4 font-bold text-slate-900">{row.topic}</div>
                  <div className="border-l border-slate-200 p-4 text-slate-700">{row.video1}</div>
                  <div className="border-l border-slate-200 p-4 text-slate-700">{row.video2}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {takeaways.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className={`rounded-2xl border p-5 shadow-sm ${item.className}`}>
                <Icon className="h-8 w-8" />
                <h3 className="mt-4 text-lg font-bold">{item.label}</h3>
                <p className="mt-3 leading-7">{item.value}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">AI Recommendation</h2>
              <p className="text-sm text-slate-500">Which video is better for each audience.</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-4 text-indigo-900">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Best Overall Video</p>
              <p className="mt-1 font-bold">{comparison.best_overall_video?.winner || 'Balanced'}</p>
              <p className="mt-1 text-sm leading-6">{comparison.best_overall_video?.reasoning || 'Both videos offer value for different goals.'}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {['Students', 'Entrepreneurs', 'Developers', 'Content Creators', 'Professionals'].map((audience) => {
              const verdict = comparison.verdict?.[audience.toLowerCase().replace(/ /g, '_')];
              return (
                <article key={audience} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-bold text-slate-950">{audience}</p>
                  <p className="mt-2 text-sm font-semibold text-indigo-700">{verdict?.winner || 'Depends on goal'}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{verdict?.reasoning || 'The recommendation will appear after generation.'}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
