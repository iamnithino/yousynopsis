import { BrainCircuit, User } from "lucide-react";
import { Link } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="relative z-20 w-full border-b border-white/60 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-5 md:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-black" />
          <span className="text-xl font-bold text-neutral-900">Synopsis</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-neutral-700 md:flex">
          <Link to="/dashboard" className="hover:text-black">Home</Link>
          <Link to="/features" className="hover:text-black">Features</Link>
          <Link to="/pricing" className="hover:text-black">Pricing</Link>
          <Link to="/workspace" className="hover:text-black">Workspace</Link>
        </nav>
        <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm" title="Profile">
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
