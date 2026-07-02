import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Swords,
  Trophy,
  UserRound,
} from "lucide-react";

interface Question {
  type?: string;
  question: string;
  answer?: string;
  correct_answer?: string;
  options?: string[];
}

interface SummaryData {
  title?: string;
  questions?: Question[];
}

type TestMode = "menu" | "single" | "battle" | "timed" | "review" | "complete";

const normalize = (value = "") => value.trim().toLowerCase();

function normalizeQuestions(questions: Question[] = []) {
  return questions.map((item, index) => {
    const correct = item.correct_answer || item.answer || "";
    const options = item.type === "short_answer"
      ? []
      : Array.from(new Set([...(item.options || []), correct, "Not mentioned in the video"]))
        .filter(Boolean)
        .slice(0, 4);

    return {
      ...item,
      id: `${index}-${item.question}`,
      type: item.type || (options.length ? "multiple_choice" : "short_answer"),
      correct_answer: correct,
      options,
    };
  });
}

export default function TestOptionsPage() {
  const navigate = useNavigate();
  const summary = useMemo<SummaryData>(() => {
    try {
      return JSON.parse(localStorage.getItem("last_summary" ) || "{}");
    } catch {
      return {};
    }
  }, []);
  const questions = useMemo(() => normalizeQuestions(summary.questions || []), [summary.questions]);
  const [mode, setMode] = useState<TestMode>("menu");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [battleNames, setBattleNames] = useState({ one: "Player 1", two: "Player 2" });
  const [timeLeft, setTimeLeft] = useState(180);

  const submit = () => {
    const correct = questions.filter((question, index) => normalize(answers[index]) === normalize(question.correct_answer)).length;
    const nextScore = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setScore(nextScore);
    setMode("complete");

    const results = JSON.parse(localStorage.getItem("synopsis_test_results") || "[]");
    results.unshift({
      title: summary.title || "Video test",
      score: nextScore,
      date: new Date().toISOString(),
      total: questions.length,
      mode,
    });
    localStorage.setItem("synopsis_test_results", JSON.stringify(results.slice(0, 30)));
  };

  const reset = (nextMode: TestMode = "menu") => {
    setAnswers({});
    setScore(0);
    setTimeLeft(180);
    setMode(nextMode);
  };

  useEffect(() => {
    if (mode !== "timed") return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [mode, timeLeft]);

  const options = [
    { mode: "single" as const, title: "Single Test", text: "Practice alone and save your score.", icon: UserRound },
    { mode: "battle" as const, title: "Battle Friend", text: "Take turns answering and compare scores.", icon: Swords },
    { mode: "timed" as const, title: "Timed Sprint", text: "Answer fast with a focused quiz flow.", icon: Clock3 },
    { mode: "review" as const, title: "Answer Review", text: "Flip through questions and answers.", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/summary")} className="rounded-lg p-2 hover:bg-slate-100" title="Back to summary">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Video Test</p>
              <h1 className="text-2xl font-bold">{summary.title || "Practice from this summary"}</h1>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            {questions.length} questions
          </span>
        </header>

        {!questions.length ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold">No questions available yet.</p>
            <p className="mt-2 text-slate-500">Generate or hydrate a summary first, then open the test again.</p>
          </div>
        ) : mode === "menu" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.mode}
                  onClick={() => reset(option.mode)}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <Icon className="mb-5 h-8 w-8 text-emerald-600" />
                  <p className="text-xl font-bold">{option.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{option.text}</p>
                </button>
              );
            })}
          </div>
        ) : mode === "review" ? (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-emerald-600">Question {index + 1}</p>
                <p className="mt-2 text-lg font-bold">{question.question}</p>
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-700">{question.correct_answer || "No answer generated."}</p>
              </div>
            ))}
          </div>
        ) : mode === "complete" ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <Trophy className="mx-auto h-12 w-12 text-emerald-600" />
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Test Complete</p>
            <p className="mt-2 text-6xl font-black">{score}%</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => reset("single")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white">
                <RotateCcw className="h-4 w-4" /> Try Again
              </button>
              <button onClick={() => reset()} className="rounded-xl border border-slate-200 px-5 py-3 font-bold">Choose Mode</button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
            {mode === "battle" && (
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2">
                <input value={battleNames.one} onChange={(event) => setBattleNames({ ...battleNames, one: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2" />
                <input value={battleNames.two} onChange={(event) => setBattleNames({ ...battleNames, two: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2" />
              </div>
            )}

            {questions.map((question, index) => (
              <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <p className="font-bold">{index + 1}. {question.question}</p>
                  {mode === "battle" && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      Turn: {index % 2 === 0 ? battleNames.one : battleNames.two}
                    </span>
                  )}
                  {mode === "timed" && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>}
                </div>

                {question.type === "short_answer" || !question.options?.length ? (
                  <input
                    value={answers[index] || ""}
                    onChange={(event) => setAnswers({ ...answers, [index]: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Type your answer"
                  />
                ) : (
                  <div className="grid gap-2 md:grid-cols-2">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setAnswers({ ...answers, [index]: option })}
                        className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold ${answers[index] === option ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 hover:bg-slate-50"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button onClick={submit} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white">Submit Test</button>
          </div>
        )}
      </div>
    </div>
  );
}
