"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { AlertTriangle, FileText, Loader2, UploadCloud, Wand2 } from "lucide-react";
import { parseResumeFile } from "@/lib/parseResume";
import { generateRoomConfig } from "@/lib/generateRoomConfig";
import { useAppStore } from "@/lib/store";

const STAGES = [
  "Reading resume",
  "Extracting skills",
  "Designing your room",
  "Placing projects",
  "Finalizing experience",
];

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export default function UploadBox() {
  const router = useRouter();
  const setResumeAndRoom = useAppStore((s) => s.setResumeAndRoom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setError(null);
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("That's not a PDF — please upload a .pdf resume.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("File is larger than 8 MB. Try a smaller export.");
        return;
      }

      setBusy(true);
      setStage(0);

      // Animate the stage messages while parsing runs.
      const ticker = setInterval(() => {
        setStage((prev) => Math.min(prev + 1, STAGES.length - 1));
      }, 700);

      try {
        const parsed = await parseResumeFile(file);
        clearInterval(ticker);

        const wordCount = (parsed.rawText || "").split(/\s+/).filter(Boolean).length;
        if (wordCount < 40) {
          setBusy(false);
          setError(
            "We couldn't read enough text from this PDF. It may be scanned. Try a text-based PDF export.",
          );
          return;
        }

        // Cache the original file as base64 so the room can offer a download.
        try {
          const buf = await file.arrayBuffer();
          const b64 = bufferToBase64(buf);
          window.sessionStorage.setItem("resumeverse:pdf", b64);
          window.sessionStorage.setItem("resumeverse:pdfName", file.name);
        } catch {
          // Non-fatal.
        }

        const room = generateRoomConfig(parsed);
        setResumeAndRoom(parsed, room);
        setStage(STAGES.length - 1);
        // Tiny pause so the final stage label renders.
        setTimeout(() => router.push("/room"), 380);
      } catch (err) {
        clearInterval(ticker);
        console.error(err);
        setBusy(false);
        setError(
          "Something went wrong while reading the PDF. Try re-exporting it from your editor.",
        );
      }
    },
    [router, setResumeAndRoom],
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong p-1.5"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (busy) return;
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => !busy && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload your resume PDF"
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !busy) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all
            ${dragOver ? "border-cyan-300 bg-cyan-300/5" : "border-white/15 bg-white/[0.02] hover:bg-white/[0.04]"}
            ${busy ? "pointer-events-none opacity-95" : ""}
            px-6 py-10 sm:py-14 flex flex-col items-center text-center`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <AnimatePresence mode="wait">
            {!busy ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col items-center"
              >
                <div className="size-14 grid place-items-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 border border-white/10 mb-4">
                  <UploadCloud className="size-7 text-cyan-200" />
                </div>
                <h3 className="font-display text-xl">Drop your resume PDF here</h3>
                <p className="text-white/65 text-sm mt-1">
                  Or click to choose a file. Max 8 MB. Parsed locally in your browser.
                </p>
                <button type="button" className="btn-primary mt-5">
                  <FileText className="size-4" /> Choose PDF
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="busy"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col items-center w-full"
              >
                <div className="size-14 grid place-items-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 border border-white/10 mb-4">
                  <Loader2 className="size-7 text-cyan-200 animate-spin" />
                </div>
                <h3 className="font-display text-xl">Building your resume room…</h3>
                <ul className="mt-5 w-full max-w-sm space-y-1.5 text-left">
                  {STAGES.map((s, i) => (
                    <li
                      key={s}
                      className={`flex items-center gap-2.5 text-sm ${i <= stage ? "text-white" : "text-white/40"}`}
                    >
                      <span
                        className={`size-2.5 rounded-full ${i < stage ? "bg-cyan-300" : i === stage ? "bg-cyan-300 animate-pulse" : "bg-white/20"}`}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
            role="alert"
          >
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => router.push("/demo")}
          className="btn-ghost"
        >
          <Wand2 className="size-4" /> Skip — try the demo room
        </button>
      </div>
    </div>
  );
}

function bufferToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
