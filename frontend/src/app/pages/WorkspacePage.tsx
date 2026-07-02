'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, User } from 'lucide-react';
import { URLInput } from './URLInput';
import { RecentHistory } from './RecentHistory';
import { motion } from 'motion/react';

export const WorkspacePage = () => {
  const navigate = useNavigate();

  const [testItems] = useState([
    { id: '1', title: 'Building a SaaS with Next.js', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', date: 'Jun 7, 2026', url: '#' },
    { id: '2', title: 'AI Engineering 101', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', date: 'Jun 6, 2026', url: '#' },
    { id: '3', title: 'Full Stack Development Guide', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', date: 'Jun 5, 2026', url: '#' },
  ]);

  const trendingTopics = [
    'Artificial Intelligence', 'Programming', 'Startups', 'Business', 'Podcasts', 'Marketing', 'Education', 'Finance',
  ];

  const handleURLSubmit = (url: string, mode: string, customPrompt?: string, outputLanguage?: string) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    sessionStorage.setItem('generation_request', JSON.stringify({ type: 'summary', url, mode, customPrompt, outputLanguage }));
    navigate('/loading');
  };

  const handleCompareSubmit = (payload: { url1: string; url2: string; goal?: string; outputLanguage?: string }) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    sessionStorage.setItem('generation_request', JSON.stringify({ type: 'comparison', ...payload }));
    navigate('/loading');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 150, -50, 0], y: [0, -100, 100, 0], scale: [1, 1.2, 0.8, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-300/40 to-indigo-300/40 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, -150, 50, 0], y: [0, 150, -100, 0], scale: [1, 1.3, 0.9, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-300/40 blur-[150px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, 100, -100, 0], y: [0, 100, -50, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/30 to-orange-200/30 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] rounded-full bg-gradient-to-t from-blue-300/30 to-transparent blur-[150px] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] opacity-40" />
      </div>

      <header className="w-full max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-7 h-7 text-indigo-600" />
          <span className="text-2xl font-bold text-neutral-900">Synopsis</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-700">
          <Link to="/dashboard" className="hover:text-black">Home</Link>
          <Link to="/features" className="hover:text-black">Features</Link>
          <Link to="/pricing" className="hover:text-black">Pricing</Link>
          <Link to="/summary" className="hover:text-black">Summary</Link>
        </div>

        <Link to="/profile">
          <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 hover:scale-105 transition-all">
            <User className="w-5 h-5" />
          </div>
        </Link>
      </header>

      <main className="flex-1 relative z-10 px-6">
        <div className="max-w-6xl mx-auto min-h-[70vh] flex flex-col justify-center">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">Workspace</h1>
            <p className="text-lg text-slate-500">Paste a YouTube URL, choose a purpose, or compare two videos with AI.</p>
          </div>

          <div className="relative mb-14">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />
            <div className="relative bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl">
              <URLInput onSubmit={handleURLSubmit} onCompareSubmit={handleCompareSubmit} />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Trending Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {trendingTopics.map((topic) => (
                <span key={topic} className="px-4 py-2 rounded-full bg-white border shadow-sm text-sm font-medium hover:scale-105 transition-all cursor-pointer">
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10">
        <RecentHistory items={testItems} />
      </footer>
    </div>
  );
};
