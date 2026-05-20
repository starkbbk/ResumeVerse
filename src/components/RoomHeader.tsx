"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  Check,
  Copy,
  Download,
  Gauge,
  Link2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { detectResumeType } from "@/lib/detectResumeType";

export default function RoomHeader() {
  const room = useAppStore((s) => s.room);
  const resume = useAppStore((s) => s.resume);
  const performanceMode = useAppStore((s) => s.performanceMode);
  const togglePerformance = useAppStore((s) => s.togglePerformanceMode);
  const startTour = useAppStore((s) => s.startTour);
  const [copied, setCopied] = useState(false);

  if (!room || !resume) return null;
  const themeName = detectResumeType(resume).replace("-", " / ");

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(resume.profile.name || "resume").replace(/\s+/g, "_").toLowerCase()}_resumeverse.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    if (typeof window === "undefined") return;
    const b64 = window.sessionStorage.getItem("resumeverse:pdf");
    const name = window.sessionStorage.getItem("resumeverse:pdfName") || "resume.pdf";
    if (!b64) return;
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSummary = () => {
    const lines: string[] = [];
    lines.push(`# ${resume.profile.name || "Resume"}`);
    if (resume.profile.headline) lines.push(resume.profile.headline);
    if (resume.profile.email) lines.push(`Email: ${resume.profile.email}`);
    if (resume.profile.location) lines.push(`Location: ${resume.profile.location}`);
    lines.push(`\nTheme: ${themeName}`);
    lines.push(`Sections: ${room.sections.map((s) => s.title).join(", ")}`);
    if (resume.projects.length) {
      lines.push("\n## Projects");
      resume.projects.forEach((p) => lines.push(`- ${p.name} — ${p.techStack.slice(0, 4).join(", ")}`));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumeverse_summary.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const hasPdf = typeof window !== "undefined" && Boolean(window.sessionStorage.getItem("resumeverse:pdf"));

  return (
    <header className="absolute top-0 inset-x-0 z-30 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="glass-strong px-3 py-2 flex items-center gap-2.5 pointer-events-auto">
          <Link
            href="/"
            aria-label="Back to home"
            className="size-8 grid place-items-center rounded-lg hover:bg-white/5 transition"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-white/10">
            <span className="size-7 grid place-items-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400">
              <Boxes className="size-3.5 text-white" />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-white/55">Theme</p>
              <p className="text-sm font-medium capitalize">{themeName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
          <button
            type="button"
            onClick={startTour}
            className="btn-primary !py-2 !px-3 text-xs sm:text-sm"
          >
            Start Tour
          </button>
          <button
            type="button"
            onClick={togglePerformance}
            className="btn-ghost !py-2 !px-3 text-xs sm:text-sm"
            title="Toggle performance mode"
            aria-pressed={performanceMode}
          >
            <Gauge className="size-4" />
            <span className="hidden sm:inline">{performanceMode ? "Performance" : "Quality"}</span>
          </button>
          <div className="hidden sm:flex glass-strong p-1 rounded-xl">
            <button
              type="button"
              onClick={copyShareLink}
              className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 flex items-center gap-1.5"
              title="Copy room link"
            >
              {copied ? <Check className="size-3.5 text-emerald-300" /> : <Link2 className="size-3.5" />} Link
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 flex items-center gap-1.5"
              title="Download resume JSON"
            >
              <Download className="size-3.5" /> JSON
            </button>
            <button
              type="button"
              onClick={exportSummary}
              className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 flex items-center gap-1.5"
              title="Export summary"
            >
              <Copy className="size-3.5" /> Summary
            </button>
            {hasPdf && (
              <button
                type="button"
                onClick={downloadPdf}
                className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 flex items-center gap-1.5"
                title="Download original PDF"
              >
                <Download className="size-3.5" /> PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
