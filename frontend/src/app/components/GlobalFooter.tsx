import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

export function GlobalFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight mb-4">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            <span>Synopsis</span>
          </Link>
          <p className="text-sm max-w-sm mb-8 leading-relaxed">
            The premium AI-powered personal researcher that turns long-form YouTube videos into instant, structured knowledge. Save hours of watch time.
          </p>
          <div className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Synopsis Inc. All rights reserved.
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link to="/features" className="hover:text-white transition-colors">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}