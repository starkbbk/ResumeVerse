"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface Props {
  message?: string;
}

export default function LoadingScene({ message = "Building your resume room…" }: Props) {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong p-8 sm:p-10 max-w-md w-full text-center"
      >
        <div className="size-14 grid place-items-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 border border-white/10 mx-auto mb-4">
          <Loader2 className="size-7 text-cyan-200 animate-spin" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl heading-gradient">{message}</h2>
        <p className="mt-2 text-white/65 text-sm flex items-center justify-center gap-1.5">
          <Sparkles className="size-3.5 text-cyan-300" /> rendering geometry, lights, and labels
        </p>
      </motion.div>
    </div>
  );
}
