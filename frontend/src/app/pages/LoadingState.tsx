import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, GitCompareArrows, Loader2, Sparkles } from 'lucide-react';
import { api } from '../apiService';

const summarySteps = [
  'Preparing your video',
  'Generating a clean transcript',
  'Finding key ideas and actions',
  'Almost there - shaping your summary',
];

const comparisonSteps = [
  'Preparing both videos',
  'Reading transcripts side by side',
  'Finding common themes and differences',
  'Building the comparison verdict',
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isComparison, setIsComparison] = useState(false);
  const requestStartedRef = useRef(false);
  const navigate = useNavigate();
  const loadingSteps = isComparison ? comparisonSteps : summarySteps;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 1800);

    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  useEffect(() => {
    if (requestStartedRef.current) {
      return;
    }
    const rawRequest = sessionStorage.getItem('generation_request');
    if (!rawRequest) {
      navigate('/workspace', { replace: true });
      return;
    }
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true });
      return;
    }

    const request = JSON.parse(rawRequest);
    const nextIsComparison = request.type === 'comparison';
    requestStartedRef.current = true;
    setIsComparison(nextIsComparison);

    const generation = nextIsComparison
      ? api.compareVideos(request.url1, request.url2, request.goal, request.outputLanguage)
      : api.summarize(request.url, request.mode, request.customPrompt, request.outputLanguage);

    generation
      .then((result) => {
        const analytics = JSON.parse(localStorage.getItem('synopsis_analytics') || '{"generations":0,"comparisons":0,"daily":{}}');
        const today = new Date().toISOString().slice(0, 10);

        if (nextIsComparison) {
          localStorage.setItem('last_comparison', JSON.stringify(result.data));
          analytics.comparisons = (analytics.comparisons || 0) + 1;
        } else {
          localStorage.setItem('last_summary', JSON.stringify(result.data));
          analytics.generations = (analytics.generations || 0) + 1;
        }

        analytics.daily[today] = (analytics.daily[today] || 0) + 1;
        localStorage.setItem('synopsis_analytics', JSON.stringify(analytics));
        sessionStorage.removeItem('generation_request');
        setCurrentStep(loadingSteps.length);
        setTimeout(() => navigate(nextIsComparison ? '/comparison-summary' : '/summary', { replace: true }), 650);
      })
      .catch((generationError) => {
        const status = generationError instanceof Error ? (generationError as Error & { status?: number }).status : undefined;
        if (status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        requestStartedRef.current = false;
        setError(generationError instanceof Error ? generationError.message : 'Generation failed. Please try again.');
      });
  }, [navigate, loadingSteps.length]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8ff] px-6">
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-300/30 blur-[100px]" />
      <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-purple-300/30 blur-[100px]" />
      <div className="relative w-full max-w-xl rounded-[2.5rem] border border-white bg-white/80 p-8 text-center shadow-[0_30px_100px_rgba(80,80,180,0.14)] backdrop-blur-xl md:p-12">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl">
          {isComparison ? <GitCompareArrows className="h-11 w-11" /> : <Loader2 className="h-11 w-11 animate-spin" />}
          <Sparkles className="absolute -right-2 -top-2 h-7 w-7 text-indigo-500" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Synopsis AI</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {isComparison ? 'Comparing your videos' : 'Generating your summary'}
        </h1>
        <p className="mt-3 text-slate-500">
          {isComparison ? 'Keep this page open while we turn both videos into a clear comparison.' : 'Keep this page open while we turn the video into clear, useful notes.'}
        </p>

        <div className="mt-9 space-y-3 text-left">
          {loadingSteps.map((step, index) => (
            <div key={step} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${index === currentStep ? 'border-indigo-200 bg-indigo-50 text-indigo-900' : index < currentStep ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-white text-slate-400'}`}>
              {index < currentStep ? <Check className="h-5 w-5" /> : <Loader2 className={`h-5 w-5 ${index === currentStep ? 'animate-spin' : ''}`} />}
              <span className="text-sm font-semibold">{step}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 max-w-full rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <p className="break-words leading-6">{error}</p>
            <button onClick={() => navigate('/workspace')} className="mt-3 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white">Back to workspace</button>
          </div>
        )}
      </div>
    </div>
  );
}
