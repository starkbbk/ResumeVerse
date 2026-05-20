"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, FileUp, Sparkles, Wand2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[60rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute top-40 right-0 size-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid-fade opacity-50" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <span className="chip-neon mx-auto mb-6">
            <Sparkles className="size-3.5" /> Now in public preview
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            <span className="heading-gradient">Turn your resume into</span>
            <br />
            <span className="heading-gradient">an interactive 3D room.</span>
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            ResumeVerse reads your resume PDF and builds a personalised, explorable
            room — your skills become orbs, your projects become workstations, your
            achievements glow on a trophy shelf.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/upload" className="btn-primary">
              <FileUp className="size-4" /> Upload resume
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/demo" className="btn-ghost">
              <Wand2 className="size-4" /> Try demo room
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {steps.map((s, i) => (
            <div key={s.title} className="glass p-5 sm:p-6 hover:border-cyan-300/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 grid place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 border border-white/10 text-cyan-200">
                  <s.icon className="size-5" />
                </div>
                <span className="text-xs uppercase tracking-widest text-white/50">Step {i + 1}</span>
              </div>
              <h3 className="font-display text-lg">{s.title}</h3>
              <p className="mt-1.5 text-sm text-white/65 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Upload PDF",
    icon: FileUp,
    desc: "Drop in your resume. We extract text in your browser, nothing is uploaded.",
  },
  {
    title: "AI structuring",
    icon: Cpu,
    desc: "We bucket skills, detect your specialty and design a layout around it.",
  },
  {
    title: "Step into the room",
    icon: Wand2,
    desc: "Walk through your personalised 3D space and share it with anyone.",
  },
];
