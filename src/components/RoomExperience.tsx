"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import RoomCanvas from "./RoomCanvas";
import InfoPanel from "./InfoPanel";
import RoomHeader from "./RoomHeader";
import TourControls from "./TourControls";
import RoomFallback2D from "./RoomFallback2D";
import { isWebglSupported } from "@/lib/webgl";

export default function RoomExperience() {
  const room = useAppStore((s) => s.room);
  const performanceMode = useAppStore((s) => s.performanceMode);
  const setPerformanceMode = useAppStore((s) => s.setPerformanceMode);
  const setWebglSupported = useAppStore((s) => s.setWebglSupported);
  const [forceFallback, setForceFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const supported = isWebglSupported();
    setWebglSupported(supported);
    if (!supported) setForceFallback(true);

    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);

    // Auto-enable performance mode on weaker devices.
    const cpu = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
    if (cpu <= 4 || mq.matches) setPerformanceMode(true);

    return () => mq.removeEventListener("change", update);
  }, [setPerformanceMode, setWebglSupported]);

  if (!room) return null;

  const useFallback = forceFallback || (performanceMode && isMobile);

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      <RoomHeader />
      <AnimatePresence mode="wait">
        {useFallback ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pt-24 pb-24 sm:pb-6 px-3 sm:px-6 overflow-y-auto scroll-hide"
          >
            <RoomFallback2D />
          </motion.div>
        ) : (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <RoomCanvas />
          </motion.div>
        )}
      </AnimatePresence>

      <TourControls />
      <InfoPanel />
    </div>
  );
}
