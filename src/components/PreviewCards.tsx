"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "AI / ML Engineer",
    accent: "from-violet-500/30 to-cyan-400/20",
    bullets: ["Neural net hologram", "Model metrics displays", "Dataset cubes"],
  },
  {
    title: "Frontend Developer",
    accent: "from-cyan-400/30 to-pink-500/20",
    bullets: ["Browser mockups", "Component cards", "Color palette panels"],
  },
  {
    title: "Backend / Cloud",
    accent: "from-emerald-400/30 to-blue-500/20",
    bullets: ["Server racks", "Pipeline animations", "Cloud terminals"],
  },
  {
    title: "Cybersecurity",
    accent: "from-rose-500/30 to-amber-400/20",
    bullets: ["Threat dashboard", "Shield holograms", "Alert panels"],
  },
];

export default function PreviewCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      <div className="flex items-end justify-between mb-6 sm:mb-10 flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl heading-gradient">Rooms adapt to who you are</h2>
          <p className="text-white/65 mt-2 max-w-xl">
            The layout, lighting and props change based on your resume. Here's a
            taste of how a few specialties light up.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="glass p-5 group relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} opacity-30 group-hover:opacity-60 transition-opacity`} />
            <div className="relative">
              <h3 className="font-display text-lg">{c.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-white/80">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-cyan-300" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
