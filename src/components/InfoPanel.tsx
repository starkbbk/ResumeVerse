"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionId } from "@/lib/generateRoomConfig";
import PanelContent from "./panels/PanelContent";

export default function InfoPanel() {
  const activeSection = useAppStore((s) => s.activeSection);
  const setActive = useAppStore((s) => s.setActiveSection);
  const room = useAppStore((s) => s.room);
  const mode = useAppStore((s) => s.mode);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Keyboard accessibility: Escape closes the panel.
  useEffect(() => {
    if (!activeSection || mode === "scroll") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeSection, setActive, mode]);

  const section = room?.sections.find((s) => s.id === activeSection) || null;

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          key={section.id}
          initial={isMobile ? { y: "100%" } : { x: "110%" }}
          animate={isMobile ? { y: 0 } : { x: 0 }}
          exit={isMobile ? { y: "100%" } : { x: "110%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${section.title} details`}
          className={`fixed z-40 ${
            isMobile
              ? "left-2 right-2 bottom-2 max-h-[45vh] sm:max-h-[78vh]"
              : "right-3 top-20 bottom-3 w-[380px]"
          } glass-strong overflow-hidden flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-cyan-300/80">{section.id.replace("-", " · ")}</p>
              <h3 className="font-display text-lg leading-tight">{section.title}</h3>
            </div>
            {mode === "explore" && (
              <button
                type="button"
                onClick={() => setActive(null)}
                className="size-9 grid place-items-center rounded-lg hover:bg-white/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                aria-label="Close panel"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 scroll-hide">
            <PanelContent id={section.id as SectionId} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
