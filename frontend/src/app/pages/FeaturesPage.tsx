import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  GitBranch,
  Accessibility,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { AppHeader } from "../components/AppHeader";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

interface FeatureCategory {
  title: string;
  description: string;
  features: Feature[];
}

export function FeaturesPage() {
  const [activeTab, setActiveTab] = useState(0);

  const featureCategories: FeatureCategory[] = [
    {
      title: "AI & Intelligence",
      description: "Powered by cutting-edge artificial intelligence",
      features: [
        {
          icon: <Brain className="w-8 h-8" />,
          title: "Dual-Engine AI Pipeline",
          description: "Advanced transcription and synthesis powered by Google Gemini",
          details: [
            "Gemini 2.5 Flash for transcription",
            "Multi-stage processing pipeline",
            "Automatic error recovery",
            "Rate limit handling",
          ],
        },
        {
          icon: <Sparkles className="w-8 h-8" />,
          title: "Multiple Summary Modes",
          description: "Choose from Normal, Advanced, Pro, or Custom modes",
          details: [
            "Normal: 2-paragraph concise summary",
            "Advanced: 4-5 paragraph deep analysis",
            "Pro: 6-8 paragraph masterclass breakdown",
            "Custom: User-defined instructions",
          ],
        },
        {
          icon: <FileText className="w-8 h-8" />,
          title: "Smart Keyword Extraction",
          description: "Automatically extract top 8 relevant keywords",
          details: [
            "AI-powered extraction",
            "Context-aware ranking",
            "Export in multiple formats",
            "Search optimization",
          ],
        },
        {
          icon: <Zap className="w-8 h-8" />,
          title: "Instant Processing",
          description: "Get summaries in seconds, not minutes",
          details: [
            "Fast audio extraction",
            "Parallel processing",
            "Optimized pipeline",
            "Minimal latency",
          ],
        },
      ],
    },
    {
      title: "User Experience",
      description: "Intuitive and powerful interface for everyone",
      features: [
        {
          icon: <Smartphone className="w-8 h-8" />,
          title: "Responsive Design",
          description: "Works seamlessly on desktop, tablet, and mobile",
          details: [
            "Mobile-first approach",
            "Touch-optimized",
            "Fast load times",
            "Offline support",
          ],
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: "User Profiles",
          description: "Personalized experience with profile management",
          details: [
            "Custom user data",
            "Role-based access",
            "Profile customization",
            "Team collaboration",
          ],
        },
        {
          icon: <Clock className="w-8 h-8" />,
          title: "History & Tracking",
          description: "Keep track of all your summaries in one place",
          details: [
            "Full summary history",
            "Search & filter",
            "Favorites & stars",
            "Export history",
          ],
        },
        {
          icon: <Accessibility className="w-8 h-8" />,
          title: "Accessibility First",
          description: "Built with WCAG 2.1 accessibility standards",
          details: [
            "Screen reader support",
            "Keyboard navigation",
            "High contrast mode",
            "Text scaling",
          ],
        },
      ],
    },
    {
      title: "Security & Performance",
      description: "Enterprise-grade security and reliability",
      features: [
        {
          icon: <Shield className="w-8 h-8" />,
          title: "Data Security",
          description: "Your data is encrypted and protected",
          details: [
            "End-to-end encryption",
            "GDPR compliant",
            "SOC 2 certified",
            "Regular audits",
          ],
        },
        {
          icon: <BarChart3 className="w-8 h-8" />,
          title: "Analytics & Insights",
          description: "Detailed metrics and performance tracking",
          details: [
            "Usage analytics",
            "Performance metrics",
            "Custom reports",
            "Export data",
          ],
        },
        {
          icon: <GitBranch className="w-8 h-8" />,
          title: "API Access",
          description: "Integrate Synopsis into your workflow",
          details: [
            "RESTful API",
            "Webhooks support",
            "Comprehensive docs",
            "SDKs available",
          ],
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: "Team Collaboration",
          description: "Built for teams and organizations",
          details: [
            "Multi-user accounts",
            "Permission control",
            "Shared workspaces",
            "Admin dashboard",
          ],
        },
      ],
    },
  ];

  const features = featureCategories[activeTab];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#fafcff] pb-24 relative font-sans selection:bg-blue-500/30">
      <AppHeader />
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-300/40 to-indigo-300/40 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{
            x: [0, -150, 50, 0],
            y: [0, 150, -100, 0],
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-300/40 blur-[150px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, 100, -100, 0], y: [0, 100, -50, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/30 to-orange-200/30 blur-[120px] mix-blend-multiply"
        />
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
            Powerful Features <br /> Built for You
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-12 max-w-2xl mx-auto">
            Everything you need to summarize videos, extract insights, and save time.
            Powered by advanced AI and designed for simplicity.
          </p>
        </motion.div>
      </div>

      {/* --- CATEGORY TABS --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {featureCategories.map((category, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveTab(idx)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === idx
                  ? "bg-black text-white shadow-lg"
                  : "bg-white/70 text-neutral-900 border border-white/50 hover:bg-white/90"
              }`}
            >
              {category.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 p-8 shadow-sm hover:shadow-lg hover:border-white/80 transition-all duration-300 hover:bg-white/80"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Details List */}
                <ul className="space-y-3">
                  {feature.details.map((detail, detailIdx) => (
                    <motion.li
                      key={detailIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + detailIdx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- HIGHLIGHTS SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-12">
            Why Choose Synopsis?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Lightning Fast",
                description: "Get summaries in seconds with our optimized AI pipeline",
                icon: "⚡",
              },
              {
                title: "Highly Accurate",
                description: "Powered by Google's latest Gemini AI for precise extraction",
                icon: "🎯",
              },
              {
                title: "Easy to Use",
                description: "Simple, intuitive interface that anyone can master instantly",
                icon: "✨",
              },
              {
                title: "Affordable",
                description: "Flexible pricing from free to enterprise at great value",
                icon: "💰",
              },
              {
                title: "Secure",
                description: "Enterprise-grade security and data protection standards",
                icon: "🔒",
              },
              {
                title: "Always Learning",
                description: "Continuous improvements and new features every month",
                icon: "📈",
              },
            ].map((highlight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                className="bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 rounded-2xl p-8 text-center hover:shadow-lg hover:border-white/80 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="font-bold text-lg text-neutral-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-neutral-600">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- COMPARISON TABLE --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-12">
            How Synopsis Stands Out
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-sm">
              <thead className="bg-black/5 border-b border-white/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-neutral-900">Feature</th>
                  <th className="px-6 py-4 text-center font-bold text-neutral-900">Synopsis</th>
                  <th className="px-6 py-4 text-center font-bold text-neutral-900">Traditional Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {[
                  { feature: "AI-Powered Summarization", synopsis: true, traditional: false },
                  { feature: "YouTube Integration", synopsis: true, traditional: false },
                  { feature: "Multiple Summary Modes", synopsis: true, traditional: false },
                  { feature: "Keyword Extraction", synopsis: true, traditional: false },
                  { feature: "User Accounts", synopsis: true, traditional: true },
                  { feature: "API Access", synopsis: true, traditional: false },
                  { feature: "Team Collaboration", synopsis: true, traditional: false },
                  { feature: "Export Formats", synopsis: true, traditional: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.synopsis ? (
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-neutral-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.traditional ? (
                        <CheckCircle className="w-6 h-6 text-neutral-400 mx-auto" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-neutral-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-black to-neutral-900 rounded-3xl p-12 md:p-20 text-center text-white shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Power of Synopsis
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Start summarizing videos with AI today. No credit card required.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
