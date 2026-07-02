import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Sparkles,
  Zap,
  Brain,
  PenTool,
  Wand2,
  Youtube,
  Link2,
  CheckCircle2,
  GitCompareArrows,
  GraduationCap,
  Code2,
  Mic2,
  TrendingUp,
  Rocket,
  BookOpen,
  BriefcaseBusiness,
  Clapperboard,
  LineChart,
  Target,
} from 'lucide-react';

const MODES = [
  { id: 'normal', name: 'Normal', icon: Sparkles },
  { id: 'advanced', name: 'Advanced', icon: Zap },
  { id: 'pro', name: 'Pro', icon: Brain },
  { id: 'custom', name: 'Custom', icon: PenTool },
  { id: 'compare', name: 'Compare Videos', icon: GitCompareArrows },
];

const USE_CASES = [
  { id: 'study_notes', name: 'Study Notes', icon: GraduationCap, description: 'Chapter notes, exam points, questions, and revision sheet.' },
  { id: 'coding_tutorial', name: 'Coding Tutorial', icon: Code2, description: 'Concepts, workflow, code ideas, and interview questions.' },
  { id: 'podcast_summary', name: 'Podcast Summary', icon: Mic2, description: 'Discussion themes, opinions, quotes, and actions.' },
  { id: 'business_insights', name: 'Business Insights', icon: TrendingUp, description: 'SWOT, risks, growth strategy, and opportunities.' },
  { id: 'startup_ideas', name: 'Startup Ideas', icon: Rocket, description: 'MVP ideas, revenue model, advantage, and execution plan.' },
  { id: 'research_notes', name: 'Research Notes', icon: BookOpen, description: 'Abstract, methodology, findings, limitations, and references.' },
  { id: 'marketing_plan', name: 'Marketing Plan', icon: Target, description: 'Audience, positioning, campaign ideas, channels, and metrics.' },
  { id: 'finance_brief', name: 'Finance Brief', icon: LineChart, description: 'Financial drivers, risks, assumptions, metrics, and recommendations.' },
  { id: 'career_coach', name: 'Career Coach', icon: BriefcaseBusiness, description: 'Skills, learning path, portfolio work, interview prep, and weekly actions.' },
  { id: 'content_creator', name: 'Creator Toolkit', icon: Clapperboard, description: 'Hooks, clip ideas, titles, thumbnails, and audience takeaways.' },
];

interface CompareSubmitPayload {
  url1: string;
  url2: string;
  goal?: string;
  outputLanguage?: string;
}

interface URLInputProps {
  onSubmit: (
    url: string,
    mode: string,
    customPrompt?: string,
    outputLanguage?: string
  ) => void;
  onCompareSubmit?: (payload: CompareSubmitPayload) => void;
}

export const URLInput = ({ onSubmit, onCompareSubmit }: URLInputProps) => {
  const [url, setUrl] = useState('');
  const [url2, setUrl2] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [comparisonGoal, setComparisonGoal] = useState('');
  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [outputLanguage, setOutputLanguage] = useState('English');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const ActiveIcon = activeMode.icon;
  const isCompareMode = activeMode.id === 'compare';
  const selectedUseCase = USE_CASES.find((item) => item.id === activeMode.id);

  const isValidYoutube = (value: string) =>
    value.includes('youtube.com') || value.includes('youtu.be');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCompareMode) {
      if (!url.trim() || !url2.trim()) return;
      onCompareSubmit?.({
        url1: url,
        url2,
        goal: comparisonGoal.trim() || undefined,
        outputLanguage,
      });
      return;
    }

    if (!url.trim()) return;

    onSubmit(
      url,
      activeMode.id,
      activeMode.id === 'custom' ? customPrompt : undefined,
      outputLanguage
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:flex-1">
            <Youtube className="h-6 w-6 shrink-0 text-red-500" />

            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={isCompareMode ? 'Video URL 1' : 'Paste YouTube video URL here...'}
              className="min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />

            {url && <Link2 className="h-4 w-4 text-slate-400" />}

            <div ref={dropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50"
              >
                <ActiveIcon className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium">{activeMode.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full z-[9999] mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                  {MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setActiveMode(mode);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 ${activeMode.id === mode.id ? 'bg-indigo-50' : ''}`}
                      >
                        <ModeIcon className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">{mode.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {!isCompareMode && (
            <button
              type="submit"
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-black px-8 py-3 font-semibold text-white transition-all hover:bg-slate-900"
            >
              <Wand2 className="h-5 w-5" />
              Generate
            </button>
          )}
        </div>

        {isCompareMode && (
          <div className="grid gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Video URL 1</span>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Video URL 2</span>
              <input
                type="url"
                required
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                placeholder="https://youtu.be/..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Comparison Goal (Optional)</span>
              <textarea
                value={comparisonGoal}
                onChange={(e) => setComparisonGoal(e.target.value)}
                placeholder="Compare business strategies, learning methods, startup advice, leadership lessons..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-black px-8 py-3 font-semibold text-white transition-all hover:bg-slate-900 md:col-span-2"
            >
              <GitCompareArrows className="h-5 w-5" />
              Compare Videos
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Choose summary and transcription language</p>
        <div className="flex flex-wrap gap-2">
          {['English', 'Hindi', 'Telugu', 'Spanish'].map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => setOutputLanguage(language)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${outputLanguage === language ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600'}`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {url.length > 0 && !isCompareMode && (
        <div className="flex items-center gap-2 text-sm">
          {isValidYoutube(url) ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Valid YouTube URL detected</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 text-orange-500" />
              <span className="text-orange-500">Enter a valid YouTube URL</span>
            </>
          )}
        </div>
      )}

      {isCompareMode && (url || url2) && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={isValidYoutube(url) ? 'text-green-600' : 'text-orange-500'}>
            Video 1 {isValidYoutube(url) ? 'ready' : 'needs a YouTube URL'}
          </span>
          <span className={isValidYoutube(url2) ? 'text-green-600' : 'text-orange-500'}>
            Video 2 {isValidYoutube(url2) ? 'ready' : 'needs a YouTube URL'}
          </span>
        </div>
      )}

      {activeMode.id === 'custom' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <label className="mb-3 block text-sm font-semibold">Custom Instructions</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe how you want the synopsis generated..."
            rows={5}
            className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">Popular Use Cases</p>
          {selectedUseCase && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              Selected: {selectedUseCase.name}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {USE_CASES.map((item) => {
            const UseCaseIcon = item.icon;
            const isActive = activeMode.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveMode(item);
                  setComparisonGoal('');
                }}
                title={item.description}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm transition-all hover:shadow-md ${isActive ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <UseCaseIcon className="h-4 w-4" />
                {item.name}
              </button>
            );
          })}
        </div>
        {selectedUseCase && (
          <p className="mt-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-600">
            {selectedUseCase.description}
          </p>
        )}
      </div>
    </form>
  );
};
