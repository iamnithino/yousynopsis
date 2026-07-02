import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Users,
  Star,
  BrainCircuit,
  PlaySquare,
  PlayCircle,
  FileText,
  MessageSquareText,
  Tags,
  Languages,
  MonitorPlay,
  PenTool,
  Play,
  Plus,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export function LandingPage() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#fafcff] pb-24 relative font-sans selection:bg-blue-500/30">
      
      {/* --- STATIC FIXED BACKGROUND --- */}
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNCkiLz48L3N2Zz4=')] pointer-events-none z-0"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 pt-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-gradient-to-br from-[#dcf0ff] via-[#e5f4ff] to-[#f0f7ff] rounded-[2.5rem] px-8 md:px-16 py-16 md:py-24 overflow-hidden relative shadow-sm border border-white/80"
        >
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center justify-between relative z-10">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl flex flex-col items-start">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="flex gap-0.5 items-center justify-center h-4">
                    <div className="w-0.5 h-2 bg-white rounded-full"></div>
                    <div className="w-0.5 h-4 bg-white rounded-full"></div>
                    <div className="w-0.5 h-3 bg-white rounded-full"></div>
                    <div className="w-0.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-sm font-medium text-neutral-800">
                  <span className="font-bold">20M+ User</span>
                  <br />
                  <span className="border-b border-neutral-800 pb-0.5 cursor-pointer">Read Our Success Stories</span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-[4.5rem] font-bold tracking-tight text-neutral-900 leading-[1.1] mb-6">
                Advancing the Next<br />Era of AI
              </h1>

              <p className="text-lg text-neutral-700 max-w-xl mb-10 leading-relaxed">
                Synopsis is your personal AI researcher. Paste any YouTube URL and instantly receive a highly structured, readable summary powered by a dual-engine AI pipeline.
              </p>

              <div className="flex items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-[#e5f4ff] flex items-center justify-center shadow-sm text-neutral-400">
                        <Users className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium text-neutral-800 leading-tight">
                    Over 1M Monthly<br />Active Users
                  </div>
                </div>
                <div className="w-px h-10 bg-neutral-300"></div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-black text-black" />
                  <span className="font-bold text-lg">4.9/5</span>
                </div>
              </div>

              {/* Buttons Layout */}
              <div className="flex flex-wrap items-center gap-8">
                <Link to="/login" className="flex items-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-medium rounded-[2rem] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Try Synopsis -Free <Sparkles className="w-4 h-4 text-white" />
                </Link>
                
                <Link to="/about" className="flex items-center gap-2 text-neutral-900 font-medium hover:text-black group transition-all">
                  <span className="border-b border-neutral-900 pb-0.5">About us</span>
                  <div className="w-7 h-7 rounded-full border-2 border-neutral-900 flex items-center justify-center group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-900 stroke-[3]" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Content - Mockup Cards */}
            <div className="flex-1 w-full max-w-[600px] relative h-[500px]">
              <div className="absolute top-0 right-0 w-full h-full flex flex-col gap-4">
                <div className="flex gap-4">
                  
                  {/* Left Col */}
                  <div className="flex flex-col gap-4 w-5/12">
                    {/* Card 1: AI Typing / Extraction (UPDATED WITH AVATAR PHOTOS) */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BrainCircuit className="w-4 h-4 text-black" />
                        <span className="font-bold text-xs">Synopsis AI</span>
                      </div>
                      <div className="font-medium text-sm mb-2">Extracting insights|</div>
                      <div className="flex -space-x-2">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" 
                          alt="Avatar 1" 
                          className="w-8 h-8 rounded-full border-[1.5px] border-white object-cover shadow-sm"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces" 
                          alt="Avatar 2" 
                          className="w-8 h-8 rounded-full border-[1.5px] border-white object-cover shadow-sm"
                        />
                        <div className="w-8 h-8 rounded-full bg-black border-[1.5px] border-white flex items-center justify-center relative z-10 shadow-sm">
                          <div className="w-3 h-3 text-white"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg></div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 2: Export Integrations */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50">
                      <div className="font-medium text-sm mb-1">Export Anywhere</div>
                      <p className="text-[10px] text-neutral-500 mb-3 leading-tight">Push structured notes directly to Notion, Obsidian, or save as Markdown.</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center"><MonitorPlay className="w-3 h-3 text-white" /></div>
                        <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center"><PenTool className="w-3 h-3 text-white" /></div>
                        <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center"><Users className="w-3 h-3 text-white" /></div>
                      </div>
                    </motion.div>

                    {/* Card 3: Timestamps Feature */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-600" />
                        <span className="font-medium text-xs">Smart Timestamps</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        Every summarized point links back to the exact second in the video, ensuring perfect context instantly.
                      </p>
                    </motion.div>
                  </div>

                  {/* Right Col */}
                  <div className="flex flex-col gap-4 w-7/12">
                    
                    {/* Card 4: HOVER-TO-PLAY YOUTUBE VIDEO */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: 0.4, duration: 0.6 }} 
                      className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-white/50 cursor-pointer"
                      onMouseEnter={() => setIsVideoHovered(true)}
                      onMouseLeave={() => setIsVideoHovered(false)}
                    >
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 group">
                        
                        {isVideoHovered ? (
                          <iframe 
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            src="https://www.youtube.com/embed/L_Guz73e6fw?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=L_Guz73e6fw" 
                            title="Lex Fridman Podcast" 
                            frameBorder="0" 
                            allow="autoplay; encrypted-media" 
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full relative">
                            <img 
                              src="https://i.ytimg.com/vi/L_Guz73e6fw/maxresdefault.jpg" 
                              alt="Lex Fridman" 
                              className="w-full h-full object-cover opacity-80"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white ml-1 fill-white" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Live processing overlay badge */}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 border border-white/10 z-10">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-[9px] text-white font-medium uppercase tracking-wider">Extracting</span>
                        </div>
                      </div>
                      <div className="px-2 pt-2.5 pb-1">
                        <div className="font-bold text-sm text-neutral-900 leading-tight">Lex Fridman Podcast</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">Elon Musk: SpaceX, Mars, Tesla</div>
                      </div>
                    </motion.div>

                    {/* Card 5: Chapter Detection */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50">
                      <div className="font-medium text-xs mb-2">Auto-Chaptering</div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white">
                          <Play className="w-3 h-3 ml-0.5 fill-white" />
                        </div>
                        <div className="flex-1 flex items-end gap-[1px] h-6 overflow-hidden opacity-60">
                          {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-1 bg-black rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Card 6: Translation Feature */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 w-full">
                  <div className="font-medium text-sm mb-1">Global Translation</div>
                  <p className="text-[10px] text-neutral-500 mb-3">Paste a video in any language and output the structured summary in your native tongue instantly.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Spanish", "French", "German", "Chinese", "Japanese", "Korean"].map(lang => (
                      <span key={lang} className="px-2.5 py-1 bg-neutral-100 rounded-md text-[10px] text-neutral-700 font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- HOW IT WORKS (3-Step Process) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl mt-24 py-10 relative z-10 px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Line (Desktop only) */}
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
            <p className="text-neutral-600 text-sm max-w-[250px]">Our dual-engine AI processes the audio and extracts key context.</p>
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl border border-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 hover:scale-105 transition-transform duration-300">
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2 drop-shadow-sm">3. Get Insights</h3>
            <p className="text-neutral-600 text-sm max-w-[250px]">Instantly receive structured notes, action items, and timestamps.</p>
          </div>
        </div>
      </motion.div>

      {/* --- FEATURE CARDS --- */}
      <div className="w-full max-w-[1200px] px-4 md:px-6 mt-24 relative z-10" id="features">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight drop-shadow-sm">Turning videos into <br/> intelligent outcomes</h2>
          <p className="text-neutral-600 max-w-2xl text-lg">AI that understands context, intent, and nuance helping your research move from raw data to impact.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <FeatureCard 
              icon={<div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm"><FileText className="w-8 h-8 text-blue-500" /></div>}
              title="Smart Summarization"
              desc="Highlights key points, action items, and decisions automatically so you never miss a detail."
              link="/login"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <FeatureCard 
              icon={<div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm"><MessageSquareText className="w-8 h-8 text-yellow-500" /></div>}
              title="Automatic Transcription"
              desc="Converts long-form conversation audio into structured, readable text in real-time."
              link="/login"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <FeatureCard 
              icon={<div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm"><Tags className="w-8 h-8 text-orange-500" /></div>}
              title="Tagging and Categorization"
              desc="Automatically organizes notes with tags based on context, projects, or speakers."
              link="/login"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
            <FeatureCard 
              icon={<div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm"><Languages className="w-8 h-8 text-purple-500" /></div>}
              title="Language Support"
              desc="AI-powered pipeline offers instant multilingual transcription and translation."
              link="/login"
            />
          </motion.div>
        </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="w-full max-w-[1100px] mt-32 px-4 flex flex-col md:flex-row gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 tracking-tight drop-shadow-sm">Frequently Asked<br/>Questions</h2>
          <p className="text-neutral-600 mb-8 text-lg leading-relaxed">Got questions? We've got answers. Browse our FAQ, or reach out anytime, we're here to help.</p>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-black font-semibold shadow-sm hover:bg-white hover:shadow-md transition-all group">
            Reach Out <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        
        <div className="flex-[1.5] flex flex-col gap-4">
          {["What can I use this AI tool for?", "How does the YouTube extraction work?", "Is my data and history secure?", "Does it support multiple languages?"].map((q, i) => (
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

      {/* --- BOTTOM CTA --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[1200px] mt-32 mb-16 px-4 relative z-10"
      >
        <div className="w-full bg-white/30 backdrop-blur-3xl rounded-[3rem] p-12 md:p-24 text-center border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col items-center">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-200/40 to-purple-200/40 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight relative z-10 drop-shadow-sm">
            Ready to start researching <br/><span className="text-neutral-600 font-serif italic font-normal">smarter?</span>
          </h2>
          <p className="text-neutral-700 mb-12 text-xl max-w-2xl relative z-10">
            Kick things off with a 7-day free trial—no pressure, just progress. Join the thousands upgrading their workflow today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/login" className="flex items-center gap-2 px-10 py-5 bg-black hover:bg-neutral-800 text-white text-lg font-semibold rounded-full transition-all shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 px-10 py-5 bg-white/80 backdrop-blur-md hover:bg-white text-neutral-900 text-lg font-medium rounded-full transition-all border border-white/80 shadow-sm hover:shadow-lg hover:-translate-y-1">
              <PlayCircle className="w-6 h-6 text-neutral-600" /> Watch Demo
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

function FeatureCard({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) {
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
  )
}