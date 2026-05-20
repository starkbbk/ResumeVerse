"use client";

import { create } from "zustand";
import type { ResumeData } from "./resumeSchema";
import type { RoomConfig, SectionId } from "./generateRoomConfig";

interface AppState {
  resume: ResumeData | null;
  room: RoomConfig | null;
  activeSection: SectionId | "intro" | null;
  mode: "scroll" | "explore";
  performanceMode: boolean;
  tour: { active: boolean; index: number };
  webglSupported: boolean;
  setResumeAndRoom: (resume: ResumeData, room: RoomConfig) => void;
  clearResume: () => void;
  setActiveSection: (id: SectionId | "intro" | null) => void;
  setMode: (m: "scroll" | "explore") => void;
  togglePerformanceMode: () => void;
  setPerformanceMode: (v: boolean) => void;
  startTour: () => void;
  stopTour: () => void;
  nextTour: () => void;
  prevTour: () => void;
  setTourIndex: (i: number) => void;
  setWebglSupported: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  resume: null,
  room: null,
  activeSection: null,
  mode: "scroll",
  performanceMode: false,
  tour: { active: false, index: 0 },
  webglSupported: true,
  setResumeAndRoom: (resume, room) => set({ resume, room, activeSection: null }),
  clearResume: () =>
    set({ resume: null, room: null, activeSection: null, mode: "scroll", tour: { active: false, index: 0 } }),
  setActiveSection: (id) => set({ activeSection: id }),
  setMode: (m) => set({ mode: m }),
  togglePerformanceMode: () => set((s) => ({ performanceMode: !s.performanceMode })),
  setPerformanceMode: (v) => set({ performanceMode: v }),
  startTour: () => set({ tour: { active: true, index: 0 } }),
  stopTour: () => set({ tour: { active: false, index: 0 } }),
  nextTour: () => {
    const { room, tour } = get();
    if (!room) return;
    const max = room.sections.length - 1;
    set({ tour: { active: true, index: Math.min(tour.index + 1, max) } });
  },
  prevTour: () => {
    const { tour } = get();
    set({ tour: { active: true, index: Math.max(tour.index - 1, 0) } });
  },
  setTourIndex: (i) => set((s) => ({ tour: { ...s.tour, index: i } })),
  setWebglSupported: (v) => set({ webglSupported: v }),
}));
