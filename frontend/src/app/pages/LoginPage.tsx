import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../apiService";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user?.role === "Admin" ? "/profile" : "/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#fafcff] relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- STATIC FIXED BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-300/40 to-indigo-300/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-300/40 blur-[150px] mix-blend-multiply" />
        <div className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/30 to-orange-200/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] rounded-full bg-gradient-to-t from-blue-300/30 to-transparent blur-[150px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNCkiLz48L3N2Zz4=')] pointer-events-none z-0"></div>
      </div>

      {/* --- GLASSMORPHIC LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative z-10 m-6"
      >
        {/* BACK ARROW TO LANDING PAGE */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 p-2 -ml-2 -mt-2 text-neutral-400 hover:text-black hover:bg-white/60 rounded-full transition-all"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white flex items-center justify-center mb-6 shadow-sm">
            <BrainCircuit className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight drop-shadow-sm">Sign in to Synopsis</h2>
          <p className="text-sm text-neutral-600 mt-2">Enter your details below to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-800 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3.5 bg-white/50 border border-white/60 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-neutral-800">Password</label>
              <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3.5 bg-white/50 border border-white/60 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm focus:bg-white"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-8 py-4 px-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-8">
          Don't have an account? <Link to="/signup" className="text-black font-semibold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
