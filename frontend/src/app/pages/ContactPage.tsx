import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Twitter,
  Github,
  MessageSquare,
  Clock,
  ArrowRight,
  Link,
  BrainCircuit,
  User,
} from "lucide-react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Send us an email anytime",
      value: "support@synopsis.ai",
      link: "mailto:support@synopsis.ai",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      description: "Call us Mon-Fri, 9am-6pm EST",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      description: "Visit us in person",
      value: "San Francisco, CA",
      link: "#",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      description: "Usually within 24 hours",
      value: "Live Chat Available",
      link: "#",
    },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter", url: "https://twitter.com" },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", url: "https://linkedin.com" },
    { icon: <Github className="w-5 h-5" />, label: "GitHub", url: "https://github.com" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Discord", url: "https://discord.com" },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#fafcff] pb-24 relative font-sans selection:bg-blue-500/30 pt-8">
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
{/* HEADER */}
      <header className="w-full max-w-[1400px] px-4 md:px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-black" />
          <span className="text-xl font-bold text-neutral-900">Synopsis</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-800">
          <Link to="/dashboard" className="hover:text-black transition-colors">Home</Link>
          <Link to="/features" className="hover:text-black transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link>
          <Link to="/summary" className="hover:text-black transition-colors">Summary</Link>
        </div>

        <Link to="/profile" className="flex items-center gap-4">
  <div className="w-10 h-10 rounded-full bg-white border border-[#dcf0ff] shadow-sm flex items-center justify-center text-indigo-600 overflow-hidden hover:bg-gray-50 transition-colors">
    <User className="w-5 h-5" />
  </div>
</Link>
      </header>
      {/* --- HEADER SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-8 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Reach out anytime
            and we'll respond as soon as possible.
          </p>
        </motion.div>
      </div>

      {/* --- CONTACT METHODS --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, idx) => (
            <motion.a
              key={idx}
              href={method.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 hover:bg-white/90 hover:shadow-lg hover:border-white/80 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">{method.title}</h3>
              <p className="text-xs text-neutral-600 mb-3">{method.description}</p>
              <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                {method.value}
              </p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- CONTACT FORM --- */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 md:p-12 shadow-sm"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Status */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm font-medium"
                >
                  ✓ Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm font-medium"
                >
                  ✗ Something went wrong. Please try again.
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* --- INFO SECTION --- */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-8"
          >
            {/* Info Card 1 */}
            <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Sales Inquiries
              </h3>
              <p className="text-neutral-600 mb-4">
                Interested in our Pro or Enterprise plans? Contact our sales team for
                custom pricing and demonstrations.
              </p>
              <a
                href="mailto:sales@synopsis.ai"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                sales@synopsis.ai <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Info Card 2 */}
            <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Technical Support
              </h3>
              <p className="text-neutral-600 mb-4">
                Having technical issues? Our support team is here to help with API
                integration, bugs, or account problems.
              </p>
              <a
                href="mailto:support@synopsis.ai"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                support@synopsis.ai <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Social Links */}
            <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 hover:shadow-lg transition-all"
                    title={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">
                Looking for answers?
              </h3>
              <p className="text-blue-100 mb-4">
                Check out our FAQ and documentation for common questions.
              </p>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg font-semibold transition-all"
              >
                View FAQ <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="w-full max-w-[1400px] px-4 md:px-6 relative z-10 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-black to-neutral-900 rounded-3xl p-12 md:p-20 text-center text-white shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Our team is ready to help. Expect a response within 24 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
