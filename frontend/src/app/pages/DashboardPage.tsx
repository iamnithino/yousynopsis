import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GlobalFooter } from "../components/GlobalFooter";
import { api } from "../apiService";
import {
  Play,
  PlaySquare,
  Tags,
  FileText,
  ArrowRight,
  BrainCircuit,
  User,
  MessageSquareText,
  Plus,
  Languages,
  Zap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Clock3,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

export function DashboardPage() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [recentSummaries, setRecentSummaries] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }
}, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    api.recentSummaries().then(setRecentSummaries).catch(() => setRecentSummaries([]));
    api.adminUsers()
      .then((data) => {
        setUsers(data);
        setIsAdmin(true);
      })
      .catch(() => {
        setIsAdmin(false);
        setUsers([]);
      });
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#f4f9ff]">
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

      <header className="w-full max-w-[1400px] px-4 md:px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-black" />
          <span className="text-xl font-bold text-neutral-900">Synopsis</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-800">
          <Link to="/dashboard" className="hover:text-black transition-colors">Home</Link>
          <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
          <Link to="/features" className="hover:text-black transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </span>
          )}

          <Link to="/profile" className="w-10 h-10 rounded-full bg-white border border-[#dcf0ff] shadow-sm flex items-center justify-center text-indigo-600 overflow-hidden hover:scale-105 transition-transform" title="Open profile">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center pb-12 relative z-10">
        <div className="w-full max-w-[1400px] px-4 md:px-6 pt-4">
          <div className="w-full bg-gradient-to-br from-[#dcf0ff] via-[#e5f4ff] to-[#f0f7ff] rounded-[2.5rem] px-8 md:px-16 py-16 md:py-24 overflow-hidden relative shadow-sm border border-white/60">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-between relative z-10">
              <div className="flex-1 max-w-2xl flex flex-col items-start">
                <div className="mb-8 text-sm font-medium text-neutral-800">
                  <span className="font-bold text-lg">Welcome back!</span>
                  <br />
                  <span className="text-neutral-500">{isAdmin ? "Admin Access Active" : "User Plan Active"}</span>
                </div>

                <h1 className="text-5xl lg:text-[4.5rem] font-bold tracking-tight text-neutral-900 leading-[1.1] mb-6">
                  Ready for your<br />next summary?
                </h1>

                <p className="text-lg text-neutral-700 max-w-xl mb-10 leading-relaxed">
                  Paste any YouTube URL below to instantly extract key points, action items, and structured notes using your custom AI pipeline.
                </p>

                <div className="flex flex-wrap items-center gap-8">
                  <Link to="/workspace" className="flex items-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-medium rounded-[2rem] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Go to Workspace <Sparkles className="w-4 h-4 text-white" />
                  </Link>

                  <Link to="/about" className="flex items-center gap-2 text-neutral-900 font-medium hover:text-black group transition-all">
                    <span className="border-b border-neutral-900 pb-0.5">Watch Demo</span>
                    <div className="w-7 h-7 rounded-full border-2 border-neutral-900 flex items-center justify-center group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-900 stroke-[3]" />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full max-w-[600px]">
                <div className="flex flex-col gap-4 w-full">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5 flex flex-col gap-4">
                      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-xs">Latest Note</span>
                        </div>
                        <div className="font-medium text-sm mb-1 leading-tight">{recentSummaries[0]?.summary?.slice(0, 38) || "Your next idea awaits"}</div>
                        <p className="text-[10px] text-neutral-500 mb-3">{recentSummaries.length ? "Generated recently" : "No summaries yet"}</p>
                        <Link to={recentSummaries.length ? "/history" : "/workspace"} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">{recentSummaries.length ? "Open full summary" : "Generate now"} &rarr;</Link>
                      </div>

                      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50">
                        <div className="font-medium text-sm mb-1">Weekly Goal</div>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-3 mb-2">
                          <div className="bg-black h-1.5 rounded-full" style={{ width: `${Math.min(recentSummaries.length * 10, 100)}%` }}></div>
                        </div>
                        <p className="text-[10px] text-neutral-500">{Math.min(recentSummaries.length, 10)}/10 Videos Summarized</p>
                      </div>

                      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                          <span className="font-bold text-xs">Active AI Engine</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-neutral-100 shadow-sm">
                            <span className="text-[10px] text-neutral-500 font-medium">Summarization</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Gemini</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-neutral-100 shadow-sm">
                            <span className="text-[10px] text-neutral-500 font-medium">Transcription</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Gemini Audio</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-7 flex flex-col gap-4">
                      <div
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-white/50 cursor-pointer"
                        onMouseEnter={() => setIsVideoHovered(true)}
                        onMouseLeave={() => setIsVideoHovered(false)}
                      >
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 group">
                          {isVideoHovered ? (
                            <iframe
                              className="absolute top-0 left-0 w-full h-full pointer-events-none"
                              src="https://www.youtube.com/embed/L_Guz73e6fw?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=L_Guz73e6fw"
                              title="Demo Video"
                              frameBorder="0"
                              allow="autoplay; encrypted-media"
                            />
                          ) : (
                            <div className="absolute inset-0 w-full h-full">
                              <img
                                src="https://i.ytimg.com/vi/L_Guz73e6fw/maxresdefault.jpg"
                                alt="Demo"
                                className="w-full h-full object-cover opacity-80"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 text-white ml-1 fill-white" />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 border border-white/10 z-10">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-[9px] text-white font-medium uppercase tracking-wider">Extracting</span>
                          </div>
                        </div>

                        <div className="px-2 pt-2.5 pb-1">
                          <div className="font-bold text-sm text-neutral-900 leading-tight">Sample Video</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">AI-powered summarization preview</div>
                        </div>
                      </div>

                      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50 h-full">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Tags className="w-3.5 h-3.5 text-neutral-600" />
                          <span className="font-medium text-xs">Your Top Topics</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {["Machine Learning", "Productivity", "Startups", "Education"].map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-white rounded-md border border-neutral-100 text-[10px] text-neutral-700 shadow-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-sm">Default Output Languages</div>
                      <Link to="/settings" className="text-xs text-indigo-600">Edit Settings</Link>
                    </div>
                    <p className="text-[10px] text-neutral-500 mb-3">Summaries will be automatically generated in these languages.</p>

                    <div className="flex flex-wrap gap-2">
                      {["English", "Hindi", "Telugu"].map((lang) => (
                        <span key={lang} className="px-2.5 py-1 bg-white rounded-md border border-neutral-100 text-[11px] text-neutral-700 font-medium shadow-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="w-full max-w-[1400px] px-4 md:px-6 mt-8">
          <div className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />Live workspace</div>
                <h2 className="mt-2 text-2xl font-bold text-neutral-900 md:text-3xl">Real-time analysis</h2>
                <p className="mt-1 text-sm text-neutral-500">A live view of your latest summarization activity.</p>
              </div>
              <Link to="/history" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">View full history <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Stored summaries", value: recentSummaries.length, detail: "available in history", icon: FileText, style: "bg-blue-50 text-blue-600" },
                { label: "Estimated time saved", value: `${recentSummaries.length * 38}m`, detail: "from concise playback", icon: Clock3, style: "bg-violet-50 text-violet-600" },
                { label: "Processing status", value: "Online", detail: "AI engine ready", icon: Activity, style: "bg-emerald-50 text-emerald-600" },
                { label: "Completion rate", value: recentSummaries.length ? "100%" : "0%", detail: "recent generations", icon: CheckCircle2, style: "bg-orange-50 text-orange-600" },
              ].map(({ label, value, detail, icon: Icon, style }) => (
                <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-5">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${style}`}><Icon className="h-5 w-5" /></div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {isAdmin && (
          <div className="w-full max-w-[1400px] px-4 md:px-6 mt-12">
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-black" />
                    Admin Panel - Registered Users
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Total users: {users.length} - usage and activity visible for each account
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to="/profile" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
                    Full Admin Profile
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                <table className="w-full min-w-[1050px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-700">
                      <th className="p-3 text-left border-b">ID</th>
                      <th className="p-3 text-left border-b">Name</th>
                      <th className="p-3 text-left border-b">Email</th>
                      <th className="p-3 text-left border-b">Role</th>
                      <th className="p-3 text-left border-b">Summaries</th>
                      <th className="p-3 text-left border-b">Comparisons</th>
                      <th className="p-3 text-left border-b">PPTs</th>
                      <th className="p-3 text-left border-b">Total</th>
                      <th className="p-3 text-left border-b">Last activity</th>
                      <th className="p-3 text-left border-b">Location</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-6 text-center text-neutral-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-3 border-b">{user.id}</td>
                          <td className="p-3 border-b">{user.name || "-"}</td>
                          <td className="p-3 border-b">{user.email || "-"}</td>
                          <td className="p-3 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === "Admin"
                                ? "bg-black text-white"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}>
                              {user.role || "User"}
                            </span>
                          </td>
                          <td className="p-3 border-b font-semibold">{user.usage?.summaries ?? 0}</td>
                          <td className="p-3 border-b font-semibold">{user.usage?.comparisons ?? 0}</td>
                          <td className="p-3 border-b font-semibold">{user.usage?.presentations ?? 0}</td>
                          <td className="p-3 border-b font-semibold">{user.usage?.total_requests ?? 0}</td>
                          <td className="p-3 border-b text-neutral-500">{user.usage?.last_activity ? new Date(user.usage.last_activity).toLocaleString() : "No activity"}</td>
                          <td className="p-3 border-b">{user.location || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mt-24 py-10 relative z-10 px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 z-0"></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl border border-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 hover:scale-105 transition-transform duration-300">
                <PlaySquare className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 drop-shadow-sm">1. Paste Link</h3>
              <p className="text-neutral-600 text-sm max-w-[250px]">Drop any long-form YouTube video URL into your workspace.</p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl border border-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 hover:scale-105 transition-transform duration-300">
                <BrainCircuit className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 drop-shadow-sm">2. AI Analysis</h3>
              <p className="text-neutral-600 text-sm max-w-[250px]">AI processes the audio and extracts key context.</p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl border border-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 hover:scale-105 transition-transform duration-300">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 drop-shadow-sm">3. Get Insights</h3>
              <p className="text-neutral-600 text-sm max-w-[250px]">Instantly receive structured notes, summaries, and keywords.</p>
            </div>
          </div>
        </motion.div>

        <div className="w-full max-w-[1400px] px-4 md:px-6 mt-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <FeatureCard
              icon={
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-inner">
                  <FileText className="w-8 h-8 text-blue-500 fill-blue-500/20" />
                </div>
              }
              title="Smart Summarization"
              desc="Highlights key points, action items, and decisions automatically."
              link="/history"
            />

            <FeatureCard
              icon={
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center shadow-inner">
                  <MessageSquareText className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
                </div>
              }
              title="Automatic Transcription"
              desc="Converts video audio into clean text for analysis."
              link="/notes"
            />

            <FeatureCard
              icon={
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-inner">
                  <Tags className="w-8 h-8 text-orange-500 fill-orange-500/20" />
                </div>
              }
              title="Keywords"
              desc="Organizes video content using relevant keyword extraction."
              link="/integrations"
            />

            <FeatureCard
              icon={
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-inner">
                  <Languages className="w-8 h-8 text-purple-500 fill-purple-500/20" />
                </div>
              }
              title="Language Support"
              desc="Useful for students, professionals, and multilingual learning."
              link="/settings"
            />
          </div>
        </div>

        <div className="w-full max-w-[1100px] mt-24 mb-16 px-4 flex flex-col md:flex-row gap-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 tracking-tight drop-shadow-sm">
              Frequently Asked<br />Questions
            </h2>
            <p className="text-neutral-600 mb-8 text-lg leading-relaxed">
              Got questions? Browse the FAQ or reach out anytime.
            </p>

            <button className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-black font-semibold shadow-sm hover:bg-white hover:shadow-md transition-all group">
              Reach Out <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="flex-[1.5] flex flex-col gap-4">
            {["What can I use this AI tool for?", "How does YouTube extraction work?", "Is my data secure?", "Does it support multiple languages?"].map((q, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="px-6 py-5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 flex items-center justify-between group cursor-pointer hover:bg-white/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all"
              >
                <span className="text-neutral-800 font-medium text-lg">{q}</span>
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm group-hover:rotate-90 group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <Plus className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <div className="w-full mt-auto z-10 relative">
        <GlobalFooter />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  link: string;
}) {
  return (
    <Link to={link} className="bg-white/40 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 flex items-start gap-6 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="flex-shrink-0 relative z-10">
        {icon}
      </div>

      <div className="flex flex-col flex-1 pt-1 relative z-10">
        <div className="flex items-center justify-between w-full mb-2">
          <h4 className="text-xl font-bold text-neutral-900 tracking-tight drop-shadow-sm">{title}</h4>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 hidden sm:flex">
            <ArrowRight className="w-4 h-4 text-black" />
          </div>
        </div>

        <p className="text-base text-neutral-600 leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}
