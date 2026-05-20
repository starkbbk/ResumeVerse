"use client";

import Link from "next/link";
import { Boxes } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-40"
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 mt-3 sm:mt-4">
        <div className="glass-strong px-3 sm:px-5 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative grid place-items-center size-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow">
              <Boxes className="size-4.5 text-white" strokeWidth={2.5} aria-hidden />
            </span>
            <span className="font-display text-lg tracking-tight">
              Resume<span className="text-cyan-300">Verse</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/upload" className="px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition">
              Upload
            </Link>
            <Link href="/demo" className="px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition">
              Demo Room
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition">
              About
            </Link>
          </div>

          <Link href="/upload" className="btn-primary !px-4 !py-2 !text-xs sm:!text-sm">
            Build my room
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
