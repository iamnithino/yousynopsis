import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Zap,
  Sparkles,
  Crown,
  ArrowRight,
} from "lucide-react";
import { AppHeader } from "../components/AppHeader";

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  icon: React.ReactNode;
  highlighted?: boolean;
  features: { name: string; included: boolean }[];
  cta: string;
  ctaLink: string;
}

export function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      name: "Normal",
      description: "Perfect for exploring AI summaries",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        { name: "5 summaries per month", included: true },
        { name: "Normal summary mode", included: true },
        { name: "Email support", included: true },
        { name: "Advanced & Pro modes", included: false },
        { name: "Priority support", included: false },
        { name: "API access", included: false },
        { name: "Custom branding", included: false },
      ],
      cta: "Get Started Free",
      ctaLink: "/signup",
    },
    {
      name: "Advanced",
      description: "For power users and teams",
      monthlyPrice: 29,
      annualPrice: 290,
      icon: <Zap className="w-6 h-6" />,
      highlighted: true,
      features: [
        { name: "Unlimited summaries", included: true },
        { name: "Normal & Advanced modes", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced customization", included: true },
        { name: "Export to multiple formats", included: true },
        { name: "Pro mode unlock", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Free Trial",
      ctaLink: "/signup",
    },
    {
      name: "Pro",
      description: "For large organizations",
      monthlyPrice: 99,
      annualPrice: 990,
      icon: <Crown className="w-6 h-6" />,
      features: [
        { name: "Unlimited summaries", included: true },
        { name: "All summary modes", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Advanced customization", included: true },
        { name: "Export to multiple formats", included: true },
        { name: "Full API access", included: true },
        { name: "Custom branding & domain", included: true },
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#fafcff] pb-24 relative font-sans selection:bg-blue-500/30">
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
      <AppHeader />

      {/* --- HEADER SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
            Simple, Transparent <br /> Pricing
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-12 max-w-2xl mx-auto">
            Choose the perfect plan for your AI summarization needs. No hidden fees, cancel anytime.
          </p>

          {/* --- BILLING TOGGLE --- */}
          <div className="flex items-center justify-center gap-6 mb-16">
            <span
              className={`text-sm font-medium transition-colors ${
                !isAnnual ? "text-neutral-900" : "text-neutral-600"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                isAnnual ? "bg-black" : "bg-neutral-300"
              }`}
            >
              <motion.div
                layout
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                isAnnual ? "text-neutral-900" : "text-neutral-600"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* --- PRICING CARDS --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative rounded-2xl backdrop-blur-md transition-all duration-300 overflow-hidden group ${
                tier.highlighted
                  ? "md:scale-105 bg-gradient-to-br from-white/95 to-white/85 border-2 border-black shadow-2xl"
                  : "bg-white/70 border border-white/50 shadow-sm hover:shadow-lg hover:border-white/80"
              }`}
            >
              {/* Badge for highlighted tier */}
              {tier.highlighted && (
                <div className="absolute top-6 right-6 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Card Content */}
              <div className="p-8">
                {/* Icon & Header */}
                <div className="mb-6">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      tier.highlighted
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{tier.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-neutral-900">
                      ${isAnnual ? (tier.annualPrice / 12).toFixed(0) : tier.monthlyPrice}
                    </span>
                    <span className="text-neutral-600 font-medium">/month</span>
                  </div>
                  {isAnnual && tier.annualPrice > 0 && (
                    <p className="text-xs text-neutral-600 mt-2">
                      Billed ${tier.annualPrice} annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to={tier.ctaLink}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn mb-8 ${
                    tier.highlighted
                      ? "bg-black text-white hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-0.5"
                      : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                {/* Features List */}
                <div className="space-y-4">
                  {tier.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-neutral-700 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-8 md:p-12 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "Can I upgrade or downgrade anytime?",
                a: "Yes! You can change your plan at any time. We'll prorate charges based on your usage.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee if you're not satisfied with the service.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
              },
              {
                q: "Is there a free trial for Pro plan?",
                a: "Yes! Get a 14-day free trial of our Pro plan with no credit card required.",
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes! Annual billing saves you 17% compared to monthly billing across all plans.",
              },
              {
                q: "What's included in API access?",
                a: "API access includes full documentation, webhooks, priority support, and usage analytics.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className="group"
              >
                <h3 className="font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {faq.q}
                </h3>
                <p className="text-neutral-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
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
            Ready to get started?
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users leveraging AI to summarize videos instantly.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
