import { Link } from "react-router";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50 py-4">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-black font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span>Synopsis</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-800">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
          <Link to="/login" className="hover:text-black transition-colors">Features</Link>
          <Link to="/login" className="hover:text-black transition-colors">Pricing</Link>
          
        </div>
        
        <div className="flex items-center gap-5">
          <Link to="/login" className="text-sm font-medium text-neutral-800 hover:text-black transition-colors">
            Log In
          </Link>
          <div className="w-px h-6 bg-neutral-300 hidden sm:block" />
          <Link to="/signup" className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-full transition-colors shadow-sm">
            Try Synopsis -Free
          </Link>
        </div>
      </div>
    </nav>
  );
}