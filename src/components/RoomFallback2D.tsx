"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import PanelContent from "./panels/PanelContent";
import type { SectionId } from "@/lib/generateRoomConfig";

/**
 * Mobile-first vertical story layout used when WebGL is unsupported or
 * the user toggles performance mode.
 */
export default function RoomFallback2D() {
  const room = useAppStore((s) => s.room);
  if (!room) return null;
  return (
    <div className="max-w-3xl mx-auto pb-24">
      <header className="mb-6 text-center">
        <span className="chip-neon mb-3">Lite mode</span>
        <h1 className="font-display text-2xl sm:text-3xl heading-gradient">Your resume room</h1>
        <p className="text-white/60 text-sm mt-1">
          A lightweight version optimised for low-end devices.
        </p>
      </header>
      <div className="space-y-4">
        {room.sections.map((s, i) => (
          <motion.section
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: i * 0.04 }}
            className="glass-strong p-4 sm:p-5"
            aria-labelledby={`section-${s.id}`}
          >
            <header className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-cyan-300/80">Section {i + 1}</p>
                <h2 id={`section-${s.id}`} className="font-display text-lg">{s.title}</h2>
              </div>
              <span
                className="size-2.5 rounded-full"
                style={{ background: room.accentColor, boxShadow: `0 0 12px ${room.accentColor}` }}
              />
            </header>
            <PanelContent id={s.id as SectionId} />
          </motion.section>
        ))}
      </div>
    </div>
  );
}
