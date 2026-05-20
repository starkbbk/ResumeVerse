"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { SectionId } from "@/lib/generateRoomConfig";
import PanelContent from "./panels/PanelContent";

/**
 * Side / bottom info panel.
 *
 * Desktop: 320px max width, collapses to a slim 36px tab so the 3D scene
 * keeps the dominant share of the viewport. Mobile: bottom sheet.
 */
export default function InfoPanel() {
  const activeSection = useAppStore((s) => s.activeSection);
  const setActive = useAppStore((s) => s.setActiveSection);
  const room = useAppStore((s) => s.room);
  const mode = useAppStore((s) => s.mode);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  // Auto-uncollapse when a new section is selected.
  useEffect(() => {
    setCollapsed(false);
  }, [activeSection]);

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
              ? "left-2 right-2 bottom-2 max-h-[42vh]"
              : `right-3 top-20 bottom-3 ${collapsed ? "w-[36px]" : "w-[320px]"}`
          } glass-strong overflow-hidden flex flex-col transition-[width] duration-300 ease-out`}
        >
          {/* Desktop collapse toggle (hidden on mobile) */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 size-7 grid place-items-center rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              aria-label={collapsed ? "Expand panel" : "Collapse panel"}
              aria-expanded={!collapsed}
            >
              <ChevronRight
                className={`size-3.5 transition-transform ${
                  collapsed ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}

          {!collapsed && (
            <>
              <div
                className={`flex items-center justify-between border-b border-white/10 ${
                  isMobile ? "px-4 py-3.5" : "pl-10 pr-4 py-3.5"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-cyan-300/80 truncate">
                    {section.id.replace("-", " · ")}
                  </p>
                  <h3 className="font-display text-base sm:text-lg leading-tight truncate">
                    {section.title}
                  </h3>
                </div>
                {mode === "explore" && (
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="size-8 grid place-items-center rounded-lg hover:bg-white/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 shrink-0"
                    aria-label="Close panel"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 scroll-hide text-[13px]">
                <PanelContent id={section.id as SectionId} />
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
