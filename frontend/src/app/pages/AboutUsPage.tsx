import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function AboutUsPage() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Chief Executive Officer",
      image: "https://i.pravatar.cc/400?img=1"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      image: "https://i.pravatar.cc/400?img=13"
    },
    {
      name: "Emily Thompson",
      role: "Head of Product",
      image: "https://i.pravatar.cc/400?img=5"
    },
    {
      name: "David Kim",
      role: "Lead AI Engineer",
      image: "https://i.pravatar.cc/400?img=14"
    },
    {
      name: "Jessica Martinez",
      role: "VP of Engineering",
      image: "https://i.pravatar.cc/400?img=9"
    },
    {
      name: "Robert Johnson",
      role: "Data Scientist",
      image: "https://i.pravatar.cc/400?img=12"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gradient */}
      <section className="relative min-h-[600px] overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-green-50"></div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(156, 163, 175, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(156, 163, 175, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              We built the AI that builds<br />your data future
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're the architects of tomorrow, not merely engineering a platform built by<br />
              engineers, for engineers, powered by AI.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all">
              Request a demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At our core, we believe that human ingenuity in intelligent systems should
                empower everyone to build the future of data. We're building a platform where
                innovation meets accessibility, where complex data challenges become opportunities
                for growth and transformation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to democratize AI and data engineering, making it accessible to
                organizations of all sizes. We're not just building tools—we're fostering a
                community of innovators who are reshaping how the world works with data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Data's Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Data's Vision</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We envision a world where data engineering is intuitive, AI is accessible, and every
              organization has the power to transform raw data into actionable intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation First",
                description: "We push the boundaries of what's possible with AI and data engineering, constantly innovating to deliver cutting-edge solutions."
              },
              {
                title: "Built for Engineers",
                description: "Every feature is designed with engineers in mind, ensuring powerful capabilities with intuitive interfaces."
              },
              {
                title: "AI-Powered",
                description: "Leverage the full potential of artificial intelligence to automate, optimize, and scale your data operations."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Together Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Team Together</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet the talented individuals who are building the future of AI and data engineering.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Turning Data Into Innovation Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop"
                alt="Innovation"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Turning Data Into Innovation Together
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe that the best innovations come from collaboration. That's why we've
                built a platform that brings together data engineers, AI specialists, and business
                leaders to work seamlessly toward common goals.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our tools enable teams to collaborate in real-time, share insights effortlessly,
                and turn complex data challenges into opportunities for breakthrough innovations.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Unlock AI Data CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold mb-6">Unlock AI Data</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of engineers and data scientists who are already building the future
              with our platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-900 rounded-full font-medium hover:bg-gray-100 transition-all">
                Get started free
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all">
                Contact sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
