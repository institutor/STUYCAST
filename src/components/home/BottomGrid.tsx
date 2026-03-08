"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Video, Users, Mic } from "lucide-react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const features = [
  {
    icon: Video,
    title: "Video Production",
    description: "We film interviews, events, documentaries, and anything worth watching at Stuyvesant.",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Mic,
    title: "Podcasts & Audio",
    description: "Long-form conversations with students, faculty, and alumni about life at Stuy.",
    color: "from-purple-500 to-pink-500",
    glow: "shadow-purple-500/20",
  },
  {
    icon: Users,
    title: "Community",
    description: "A team of 20+ students collaborating on media that matters to our school.",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
];

export function BottomGrid() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="space-y-10"
    >
      {/* What we do cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.glow}`}>
              <f.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA Banner */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-white/10 p-8 md:p-12">
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="max-w-lg text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                Join the Team
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
                No experience required. We'll teach you everything — cameras, editing, audio, storytelling.
                All we need is people who want to make great content.
              </p>
            </div>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-blue-400 hover:text-white transition-all duration-300 group/btn flex-shrink-0"
            >
              Apply Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
