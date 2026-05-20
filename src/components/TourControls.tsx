"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Mouse, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function TourControls() {
  const room = useAppStore((s) => s.room);
  const activeSection = useAppStore((s) => s.activeSection);
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);

  const scenes = useMemo(() => {
    if (!room) return [];
    return [
      { id: "intro" as const, title: "Overview" },
      ...room.sections.map((s) => ({ id: s.id, title: s.title })),
    ];
  }, [room]);

  if (!room) return null;
  const accentColor = room.accentColor;

  const activeIndex = scenes.findIndex((s) => s.id === activeSection);
  const isIntro = activeSection === "intro" || activeSection === null;

  const handleScrollTo = (index: number) => {
    if (mode === "explore") {
      setMode("scroll");
    }
    setTimeout(() => {
      if ((window as any).__scrollToSection) {
        (window as any).__scrollToSection(index);
      }
    }, 50);
  };

  const handleToggleMode = () => {
    if (mode === "scroll") {
      setMode("explore");
    } else {
      setMode("scroll");
      // Scroll to current section's index to avoid camera snapping jumps
      const idx = scenes.findIndex((s) => s.id === activeSection);
      if (idx !== -1) {
        setTimeout(() => {
          if ((window as any).__scrollToSection) {
            (window as any).__scrollToSection(idx);
          }
        }, 50);
      }
    }
  };

  return (
    <>
      {/* Top horizontal progress bar for mobile */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-50 md:hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
            width: `${
              scenes.length > 1
                ? (Math.max(0, activeIndex) / (scenes.length - 1)) * 100
                : 0
            }%`,
          }}
        />
      </div>

      {/* Left side dot navigation for desktop */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-start gap-4">
        {scenes.map((scene, idx) => {
          const isActive = activeSection === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => handleScrollTo(idx)}
              className="group flex items-center gap-3.5 focus:outline-none"
            >
              <div className="relative flex items-center justify-center">
                {/* Active glow ring */}
                <div
                  className={`absolute size-5 rounded-full border transition-all duration-300 ${
                    isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                  style={{ borderColor: accentColor }}
                />
                {/* Inner dot */}
                <div
                  className={`size-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "scale-110"
                      : "bg-white/30 group-hover:bg-white/70 group-hover:scale-110"
                  }`}
                  style={{
                    backgroundColor: isActive ? accentColor : undefined,
                    boxShadow: isActive ? `0 0 10px ${accentColor}` : undefined,
                  }}
                />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-all duration-300 origin-left ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
                }`}
                style={{
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                  textShadow: isActive ? `0 0 8px ${accentColor}88` : undefined,
                }}
              >
                {scene.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scroll reminder hint on the first viewport */}
      <AnimatePresence>
        {mode === "scroll" && isIntro && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-semibold">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className="size-4 text-white/60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom mode selector toggle */}
      <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          type="button"
          onClick={handleToggleMode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-95 group focus:outline-none"
          style={{
            boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {mode === "scroll" ? (
            <>
              <Compass className="size-4 text-white/80 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-white/90">Explore Freely</span>
            </>
          ) : (
            <>
              <Mouse className="size-4 text-white/80 animate-bounce" />
              <span className="text-white/90">Back to Journey</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
