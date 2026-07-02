import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GitCompareArrows,
  LayoutDashboard,
  LogOut,
  Pencil,
  Play,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { api } from "../apiService";

interface Profile {
  id?: number;
  name: string;
  email: string;
  role: string;
  location: string;
  bio: string;
}

interface RecentSummary {
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

interface AdminWebSummary {
  id: number;
  url: string;
  title: string;
  language: string;
  created_at?: string;
}

interface AdminWebComparison {
  id: number;
  url_1: string;
  url_2: string;
  goal: string;
  language: string;
  created_at?: string;
}

interface AdminPresentationWork {
  id: number;
  type: "presentation";
  title: string;
  source_type?: string;
  source_id?: number;
  slide_count: number;
  slides: unknown[];
  created_at?: string;
  updated_at?: string;
}

interface AdminSummaryWork extends AdminWebSummary {
  type: "summary";
  keywords?: string[];
  key_points?: string[];
}

interface AdminComparisonWork extends AdminWebComparison {
  type: "comparison";
  title: string;
  best_overall_video?: Record<string, unknown>;
}

interface AdminUserUsage {
  summaries: number;
  comparisons: number;
  presentations: number;
  total_requests: number;
  last_activity?: string | null;
  web_usage: {
    summary_urls: AdminWebSummary[];
    comparisons: AdminWebComparison[];
  };
  work?: {
    summaries: AdminSummaryWork[];
    comparisons: AdminComparisonWork[];
    presentations: AdminPresentationWork[];
    recent_activity: Array<AdminSummaryWork | AdminComparisonWork | AdminPresentationWork>;
  };
}

interface AdminUser extends Profile {
  id: number;
  usage: AdminUserUsage;
}

interface AdminUsage {
  totals: {
    users: number;
    summaries: number;
    comparisons: number;
    presentations: number;
    total_requests: number;
  };
  users: AdminUser[];
}

const fallbackProfile: Profile = {
  name: "Content User",
  email: "user@synopsis.app",
  role: "User",
  location: "",
  bio: "Turning long videos into useful ideas.",
};

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [draft, setDraft] = useState<Profile>(fallbackProfile);
  const [summaries, setSummaries] = useState<RecentSummary[]>([]);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [analytics, setAnalytics] = useState<{ generations: number; daily: Record<string, number> }>({ generations: 0, daily: {} });
  const [testResults, setTestResults] = useState<Array<{ title: string; score: number; date: string; total: number }>>([]);
  const [adminUsage, setAdminUsage] = useState<AdminUsage | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    const loadAdminUsage = () => {
      setAdminLoading(true);
      api.adminUsage()
        .then((data: AdminUsage) => setAdminUsage(data))
        .catch(() => setAdminUsage(null))
        .finally(() => setAdminLoading(false));
    };
    const openAdminConsole = (role?: string) => {
      if (role === "Admin") {
        setActiveTab("Admin");
        loadAdminUsage();
      }
    };

    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsed = { ...fallbackProfile, ...JSON.parse(localUser) };
      setProfile(parsed);
      setDraft(parsed);
      openAdminConsole(parsed.role);
    }
    api.me().then((user: Profile) => {
      const parsed = { ...fallbackProfile, ...user };
      setProfile(parsed);
      setDraft(parsed);
      localStorage.setItem("user", JSON.stringify(parsed));
      openAdminConsole(parsed.role);
    }).catch(() => undefined);
    api.recentSummaries().then(setSummaries).catch(() => setSummaries([]));
    setAnalytics(JSON.parse(localStorage.getItem("synopsis_analytics") || '{"generations":0,"daily":{}}'));
    setTestResults(JSON.parse(localStorage.getItem("synopsis_test_results") || "[]"));
  }, []);

  const stats = useMemo(() => [
    { label: "Total summaries", value: Math.max(summaries.length, analytics.generations), detail: "stored generations", icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Time saved", value: `${Math.max(summaries.length * 38, 0)}m`, detail: "estimated", icon: Clock3, color: "text-violet-600 bg-violet-50" },
    { label: "Topics explored", value: new Set(summaries.flatMap((item) => item.keywords || [])).size, detail: "unique keywords", icon: Target, color: "text-emerald-600 bg-emerald-50" },
    { label: "Average test score", value: testResults.length ? `${Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)}%` : "0%", detail: `${testResults.length} completed tests`, icon: Trophy, color: "text-orange-600 bg-orange-50" },
  ], [summaries, analytics, testResults]);

  const initials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const saveProfile = async () => {
    try {
      const response = await api.updateProfile(draft);
      setProfile(response.user);
      setDraft(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      setEditing(false);
      setNotice("Profile saved");
      setTimeout(() => setNotice(""), 2500);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save profile");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openSummary = (summary: RecentSummary) => {
    let summaryToOpen = summary;
    try {
      const cached = JSON.parse(localStorage.getItem("last_summary") || "null");
      if (cached && (cached.id === summary.id || cached.youtube_url === summary.youtube_url)) {
        summaryToOpen = { ...summary, ...cached };
      }
    } catch {
      summaryToOpen = summary;
    }
    localStorage.setItem("last_summary", JSON.stringify(summaryToOpen));
    navigate("/summary");
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Saved", icon: Bookmark },
    { label: "Schedule", icon: CalendarDays },
    { label: "Statistics", icon: BarChart3 },
    { label: "Tests", icon: Trophy },
    ...(profile.role === "Admin" ? [{ label: "Admin", icon: ShieldCheck }] : []),
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8ff]">
      <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/85 p-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Sparkles className="h-5 w-5" /></div>
              <div><p className="font-bold text-slate-950">Synopsis</p><p className="text-xs text-slate-500">Personal workspace</p></div>
            </Link>
            <button onClick={logout} className="rounded-xl border p-2 text-slate-500 hover:bg-slate-50 lg:hidden"><LogOut className="h-4 w-4" /></button>
          </div>

          <div className="mt-7 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">{initials || "U"}</div>
            <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{profile.name}</p><p className="truncate text-xs text-slate-500">{profile.email}</p></div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col">
            {menuItems.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setActiveTab(label)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === label ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </nav>

          <div className="mt-7 hidden rounded-3xl bg-slate-950 p-5 text-white lg:block">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Weekly focus</p>
            <p className="mt-2 text-lg font-bold">Build your knowledge library</p>
            <div className="mt-4 h-2 rounded-full bg-white/15"><div className="h-2 w-2/3 rounded-full bg-indigo-400" /></div>
            <Link to="/workspace" className="mt-5 block rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-950">New summary</Link>
          </div>
          <button onClick={logout} className="mt-5 hidden w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 lg:flex"><LogOut className="h-4 w-4" />Sign out</button>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-7 xl:p-10">
          <header className="mb-7 flex flex-col gap-4 rounded-[2rem] border border-white bg-white/75 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">{activeTab}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Welcome back, {profile.name.split(" ")[0]}</h1>
              <p className="mt-1 text-sm text-slate-500">Your profile, summaries, and learning activity in one place.</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl border bg-white p-3 text-slate-600"><Bell className="h-5 w-5" /></button>
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><Pencil className="h-4 w-4" />Edit profile</button>
            </div>
          </header>

          {notice && <div className="mb-5 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">{notice}</div>}

          {activeTab === "Dashboard" && (
            <>
              <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, detail, icon: Icon, color }) => (
                  <div key={label} className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm">
                    <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}><Icon className="h-5 w-5" /></div>
                    <p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p>
                  </div>
                ))}
              </section>
              <section className="grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">
                <HistoryPanel summaries={summaries} openSummary={openSummary} />
                <div className="space-y-5">
                  <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl">
                    <p className="text-sm font-semibold text-indigo-100">Current plan</p><h2 className="mt-2 text-2xl font-bold">{profile.role} workspace</h2><p className="mt-3 text-sm leading-6 text-indigo-100">Generate summaries, revisit your history, and ask AI about every video.</p>
                    <Link to="/workspace" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700"><Play className="h-4 w-4" />Start generating</Link>
                  </div>
                  <div className="rounded-3xl border border-white bg-white/85 p-6 shadow-sm"><p className="font-bold text-slate-900">Profile completeness</p><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 w-4/5 rounded-full bg-emerald-500" /></div><p className="mt-3 text-sm text-slate-500">{profile.bio || "Add a bio to complete your profile."}</p></div>
                </div>
              </section>
            </>
          )}

          {activeTab === "Saved" && <HistoryPanel summaries={summaries} openSummary={openSummary} />}
          {activeTab === "Statistics" && <StatisticsPanel summaries={summaries} analytics={analytics} />}
          {activeTab === "Tests" && <TestsPanel results={testResults} />}
          {activeTab === "Admin" && profile.role === "Admin" && <AdminPanel data={adminUsage} loading={adminLoading} />}
          {activeTab === "Schedule" && <EmptyPanel icon={CalendarDays} title="Schedule summaries" text="Scheduled generation is ready for your next recurring learning plan." action="Create from workspace" href="/workspace" />}
          {activeTab === "Settings" && <SettingsPanel profile={profile} onEdit={() => setEditing(true)} />}
        </main>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between"><div><p className="text-sm font-semibold text-indigo-600">Account details</p><h2 className="text-2xl font-bold text-slate-950">Edit profile</h2></div><button onClick={() => setEditing(false)} className="rounded-full bg-slate-100 p-2"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
              <label><span className="mb-2 block text-sm font-semibold text-slate-700">Role</span><input value={draft.role} disabled className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500" /></label>
              <div className="sm:col-span-2"><ProfileField label="Location" value={draft.location} onChange={(value) => setDraft({ ...draft, location: value })} /></div>
              <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-700">Bio</span><textarea rows={4} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500" /></label>
            </div>
            <button onClick={saveProfile} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-bold text-white"><Save className="h-4 w-4" />Save changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryPanel({ summaries, openSummary }: { summaries: RecentSummary[]; openSummary: (summary: RecentSummary) => void }) {
  return (
    <section className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-950">Recent summaries</h2><p className="text-sm text-slate-500">Your latest generated work</p></div><Link to="/history" className="text-sm font-bold text-indigo-600">View full history</Link></div>
      <div className="space-y-3">
        {summaries.length ? summaries.slice(0, 5).map((summary) => (
          <button key={summary.id} onClick={() => openSummary(summary)} className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><FileText className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900">{summary.summary?.slice(0, 75) || "Generated video summary"}</p><p className="mt-1 text-xs text-slate-500">{summary.created_at ? new Date(summary.created_at).toLocaleString() : "Recently generated"}</p></div>
            <Download className="h-4 w-4 text-slate-400" />
          </button>
        )) : <EmptyPanel icon={FileText} title="No summaries yet" text="Your generated videos will appear here." action="Generate first summary" href="/workspace" compact />}
      </div>
    </section>
  );
}

function AdminPanel({ data, loading }: { data: AdminUsage | null; loading: boolean }) {
  if (loading) {
    return <div className="rounded-3xl bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">Loading admin usage...</div>;
  }

  if (!data) {
    return <EmptyPanel icon={ShieldCheck} title="Admin usage unavailable" text="Sign in with an admin account to review users and web usage." action="Back to dashboard" href="/dashboard" />;
  }

  const totals = [
    { label: "Users", value: data.totals.users, detail: "registered accounts", icon: Users, color: "bg-slate-950 text-white" },
    { label: "Summaries", value: data.totals.summaries, detail: "YouTube URLs processed", icon: FileText, color: "bg-blue-50 text-blue-600" },
    { label: "Comparisons", value: data.totals.comparisons, detail: "video pairs resolved", icon: GitCompareArrows, color: "bg-emerald-50 text-emerald-600" },
    { label: "Presentations", value: data.totals.presentations, detail: "saved slide decks", icon: Sparkles, color: "bg-amber-50 text-amber-600" },
    { label: "Requests", value: data.totals.total_requests, detail: "total backend usage", icon: BarChart3, color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {totals.map(({ label, value, detail, icon: Icon, color }) => (
          <div key={label} className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm">
            <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}><Icon className="h-5 w-5" /></div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Users and usage</h2>
            <p className="text-sm text-slate-500">Backend totals per registered account.</p>
          </div>
          <ShieldCheck className="h-6 w-6 text-slate-900" />
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Summaries</th>
                <th className="p-3">Comparisons</th>
                <th className="p-3">Presentations</th>
                <th className="p-3">Total</th>
                <th className="p-3">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="p-3"><p className="font-semibold text-slate-900">{user.name || "Unnamed user"}</p><p className="text-xs text-slate-500">{user.email}</p></td>
                  <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.role === "Admin" ? "bg-slate-950 text-white" : "bg-blue-50 text-blue-700"}`}>{user.role || "User"}</span></td>
                  <td className="p-3 font-semibold">{user.usage.summaries}</td>
                  <td className="p-3 font-semibold">{user.usage.comparisons}</td>
                  <td className="p-3 font-semibold">{user.usage.presentations}</td>
                  <td className="p-3 font-semibold">{user.usage.total_requests}</td>
                  <td className="p-3 text-slate-500">{user.usage.last_activity ? new Date(user.usage.last_activity).toLocaleString() : "No activity"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">All user work</h2>
          <p className="text-sm text-slate-500">Summaries, comparisons, presentations, and recent actions by account.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {data.users.map((user) => (
            <div key={`usage-${user.id}`} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{user.name || "Unnamed user"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{user.usage.total_requests} requests</span>
              </div>
              <div className="space-y-3">
                {(user.usage.work?.recent_activity || []).slice(0, 8).map((item) => (
                  <div key={`${item.type}-${item.id}`} className="rounded-xl bg-white p-3">
                    <div className={`flex items-center gap-2 text-xs font-bold ${item.type === "summary" ? "text-blue-600" : item.type === "comparison" ? "text-emerald-600" : "text-amber-600"}`}>
                      {item.type === "summary" ? <FileText className="h-3.5 w-3.5" /> : item.type === "comparison" ? <GitCompareArrows className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                      {item.type}
                    </div>
                    <p className="mt-1 font-semibold text-slate-800">{item.title || "Untitled work"}</p>
                    {"slide_count" in item && <p className="mt-1 text-xs text-slate-500">{item.slide_count} slides saved {item.updated_at ? `- updated ${new Date(item.updated_at).toLocaleString()}` : ""}</p>}
                    {"url" in item && <p className="mt-1 break-all text-xs text-slate-500">{item.url}</p>}
                    {"url_1" in item && <><p className="mt-1 break-all text-xs text-slate-500">{item.url_1}</p><p className="mt-1 break-all text-xs text-slate-500">{item.url_2}</p></>}
                    {item.created_at && <p className="mt-2 text-[11px] font-semibold text-slate-400">{new Date(item.created_at).toLocaleString()}</p>}
                  </div>
                ))}
                {!(user.usage.work?.recent_activity || []).length && user.usage.web_usage.summary_urls.map((item) => (
                  <div key={`summary-${item.id}`} className="rounded-xl bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600"><FileText className="h-3.5 w-3.5" />Summary</div>
                    <p className="mt-1 font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-1 break-all text-xs text-slate-500">{item.url}</p>
                  </div>
                ))}
                {!(user.usage.work?.recent_activity || []).length && user.usage.web_usage.comparisons.map((item) => (
                  <div key={`comparison-${item.id}`} className="rounded-xl bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600"><GitCompareArrows className="h-3.5 w-3.5" />Comparison</div>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Goal: {item.goal || "General comparison"}</p>
                    <p className="mt-1 break-all text-xs text-slate-500">{item.url_1}</p>
                    <p className="mt-1 break-all text-xs text-slate-500">{item.url_2}</p>
                  </div>
                ))}
                {!user.usage.web_usage.summary_urls.length && !user.usage.web_usage.comparisons.length && !(user.usage.work?.recent_activity || []).length && (
                  <p className="rounded-xl bg-white p-4 text-sm text-slate-500">No user work recorded yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatisticsPanel({ summaries, analytics }: { summaries: RecentSummary[]; analytics: { daily: Record<string, number> } }) {
  const topics = summaries.flatMap((summary) => summary.keywords || []);
  const counts = topics.reduce<Record<string, number>>((all, topic) => ({ ...all, [topic]: (all[topic] || 0) + 1 }), {});
  const lastSeven = Array.from({ length: 7 }, (_, offset) => { const date = new Date(); date.setDate(date.getDate() - (6 - offset)); const key = date.toISOString().slice(0, 10); return { label: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1), count: analytics.daily[key] || 0 }; });
  const max = Math.max(1, ...lastSeven.map((item) => item.count));
  return <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Stored learning activity</h2><div className="mt-7 flex h-56 items-end gap-3">{lastSeven.map((item, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-bold text-indigo-600">{item.count}</span><div className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-cyan-400" style={{ height: `${Math.max(4, (item.count / max) * 85)}%` }} /><span className="text-xs text-slate-400">{item.label}</span></div>)}</div></div><div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Top topics</h2><div className="mt-5 space-y-3">{Object.entries(counts).slice(0, 6).map(([topic, count]) => <div key={topic} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="font-medium text-slate-700">#{topic}</span><span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-indigo-600">{count}</span></div>)}{!topics.length && <p className="text-sm text-slate-500">Topics will appear after your first summary.</p>}</div></div></div>;
}

function TestsPanel({ results }: { results: Array<{ title: string; score: number; date: string; total: number }> }) {
  return <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-2xl font-bold">Tests and scores</h2><p className="text-sm text-slate-500">Scores are stored in this profile.</p></div><Link to="/history" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Choose summary</Link></div><div className="space-y-3">{results.length ? results.map((result, index) => <div key={`${result.date}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{result.title}</p><p className="text-xs text-slate-500">{new Date(result.date).toLocaleString()} · {result.total} questions</p></div><div className={`rounded-full px-4 py-2 text-lg font-bold ${result.score >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}>{result.score}%</div></div>) : <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Complete a test from a summary page to see scores here.</p>}</div></div>;
}

function SettingsPanel({ profile, onEdit }: { profile: Profile; onEdit: () => void }) {
  return <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-sm md:p-8"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Account settings</h2><p className="text-sm text-slate-500">Manage the details used across Synopsis.</p></div><button onClick={onEdit} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Edit</button></div><div className="mt-7 grid gap-5 sm:grid-cols-2">{Object.entries(profile).map(([key, value]) => <div key={key} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{key}</p><p className="mt-2 font-semibold text-slate-800">{value || "Not set"}</p></div>)}</div></div>;
}

function EmptyPanel({ icon: Icon, title, text, action, href, compact = false }: { icon: typeof User; title: string; text: string; action: string; href: string; compact?: boolean }) {
  return <div className={`rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/40 text-center ${compact ? "p-7" : "p-12"}`}><Icon className="mx-auto h-9 w-9 text-indigo-500" /><h2 className="mt-3 text-xl font-bold text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-500">{text}</p><Link to={href} className="mt-5 inline-block rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">{action}</Link></div>;
}

function ProfileField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" /></label>;
}
