"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Skills become a rotating hologram with category rings",
  "Projects sit on workstation desks with live demo links",
  "Achievements glow on a trophy shelf",
  "AI/ML, Backend, Cloud and Cyber zones light up only when relevant",
  "Guided tour glides the camera through every section",
  "Mobile gets a story-style version with bottom sheets",
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="chip-neon mb-3">How it works</span>
          <h2 className="font-display text-2xl sm:text-4xl heading-gradient leading-tight">
            Your resume drives every prop in the room.
          </h2>
          <p className="mt-3 text-white/70 max-w-md">
            ResumeVerse parses your PDF in your browser, classifies your skills
            and projects, then generates a layout that highlights what makes you
            you. No two rooms look the same.
          </p>
          <ul className="mt-5 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-white/85">
                <CheckCircle2 className="size-4 text-cyan-300 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-strong p-6 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-10 size-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative">
            <pre className="font-mono text-xs sm:text-sm text-cyan-100 whitespace-pre-wrap leading-relaxed">{`{
  "theme": "ai-ml",
  "sections": [
    { "id": "profile",         "enabled": true  },
    { "id": "skills",          "enabled": true  },
    { "id": "projects",        "enabled": true  },
    { "id": "experience",      "enabled": true  },
    { "id": "ai-lab",          "enabled": true  },
    { "id": "frontend-studio", "enabled": false },
    { "id": "backend-server",  "enabled": true  },
    { "id": "cybersecurity",   "enabled": false }
  ]
}`}</pre>
            <p className="mt-4 text-xs text-white/55">
              Sections without data are skipped — your room is never padded with filler.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
