"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/55">
        <p>
          © {new Date().getFullYear()} ResumeVerse. Built with Next.js, React Three Fiber & Framer Motion.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/upload" className="hover:text-white transition">Upload</Link>
          <Link href="/demo" className="hover:text-white transition">Demo</Link>
        </div>
      </div>
    </footer>
  );
}
