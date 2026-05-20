import { detectResumeType, type ResumeTheme } from "./detectResumeType";
import {
  ruleHasAchievements,
  ruleHasAiMl,
  ruleHasBackend,
  ruleHasCertifications,
  ruleHasContact,
  ruleHasCyber,
  ruleHasDatabase,
  ruleHasDataViz,
  ruleHasDevOps,
  ruleHasEducation,
  ruleHasExperience,
  ruleHasFrontend,
  ruleHasMobile,
  ruleHasProjects,
  ruleHasSkills,
} from "./roomRules";
import type { ResumeData } from "./resumeSchema";

export type SectionId =
  | "profile"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "achievements"
  | "certifications"
  | "ai-lab"
  | "frontend-studio"
  | "backend-server"
  | "database"
  | "devops-cloud"
  | "cybersecurity"
  | "mobile"
  | "dataviz"
  | "contact";

export interface RoomSection {
  id: SectionId;
  title: string;
  enabled: boolean;
  priority: number;
  /** Position in 3D world: [x, y, z]. */
  position: [number, number, number];
  /** Camera target when guided tour visits this section. */
  cameraStop: { position: [number, number, number]; lookAt: [number, number, number] };
  data?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
}

export interface RoomConfig {
  theme: ResumeTheme;
  accentColor: string;
  secondaryColor: string;
  sections: RoomSection[];
  particles: number;
  resume: ResumeData;
}

/** Theme palette — picked to feel distinctive while staying premium-dark. */
const THEMES: Record<
  ResumeTheme,
  { accent: string; secondary: string; particles: number }
> = {
  "ai-ml": { accent: "#a78bfa", secondary: "#22d3ee", particles: 220 },
  frontend: { accent: "#22d3ee", secondary: "#ec4899", particles: 180 },
  backend: { accent: "#34d399", secondary: "#3b82f6", particles: 140 },
  fullstack: { accent: "#8b5cf6", secondary: "#22d3ee", particles: 200 },
  devops: { accent: "#60a5fa", secondary: "#a3e635", particles: 160 },
  cybersecurity: { accent: "#ef4444", secondary: "#f59e0b", particles: 140 },
  "data-science": { accent: "#f472b6", secondary: "#22d3ee", particles: 180 },
  mobile: { accent: "#a3e635", secondary: "#22d3ee", particles: 140 },
  designer: { accent: "#ec4899", secondary: "#a78bfa", particles: 200 },
  general: { accent: "#8b5cf6", secondary: "#22d3ee", particles: 160 },
};

/**
 * Lay sections around the user in a circular floor plan. We prioritize the
 * most-likely-to-be-viewed sections in front of the spawn camera.
 */
export function generateRoomConfig(resume: ResumeData): RoomConfig {
  const theme = detectResumeType(resume);
  const palette = THEMES[theme];

  // Order sections by priority. Profile is always first, contact always last.
  const candidates: Array<Omit<RoomSection, "position" | "cameraStop">> = [
    {
      id: "profile",
      title: "Profile",
      enabled: true,
      priority: 0,
      data: resume.profile,
    },
    {
      id: "skills",
      title: "Skill Hologram",
      enabled: ruleHasSkills(resume),
      priority: 1,
      data: resume.skills,
    },
    {
      id: "projects",
      title: "Projects",
      enabled: ruleHasProjects(resume),
      priority: 2,
      data: resume.projects,
    },
    {
      id: "experience",
      title: "Experience",
      enabled: ruleHasExperience(resume),
      priority: 3,
      data: resume.experience,
    },
    {
      id: "education",
      title: "Education",
      enabled: ruleHasEducation(resume),
      priority: 4,
      data: resume.education,
    },
    {
      id: "achievements",
      title: "Achievements",
      enabled: ruleHasAchievements(resume),
      priority: 5,
      data: { achievements: resume.achievements, awards: resume.awards },
    },
    {
      id: "certifications",
      title: "Certifications",
      enabled: ruleHasCertifications(resume),
      priority: 6,
      data: resume.certifications,
    },
    // Specialized zones — only show when theme/skills justify it.
    {
      id: "ai-lab",
      title: "AI / ML Lab",
      enabled: ruleHasAiMl(resume),
      priority: 7,
      data: resume.skills.aiMl,
    },
    {
      id: "frontend-studio",
      title: "Frontend Studio",
      enabled: ruleHasFrontend(resume),
      priority: 7,
      data: resume.skills.frontend,
    },
    {
      id: "backend-server",
      title: "Backend Server Zone",
      enabled: ruleHasBackend(resume),
      priority: 7,
      data: resume.skills.backend,
    },
    {
      id: "database",
      title: "Database Zone",
      enabled: ruleHasDatabase(resume),
      priority: 7,
      data: resume.skills.databases,
    },
    {
      id: "devops-cloud",
      title: "DevOps Control Room",
      enabled: ruleHasDevOps(resume),
      priority: 7,
      data: { devops: resume.skills.devops, cloud: resume.skills.cloud },
    },
    {
      id: "cybersecurity",
      title: "Security Command Center",
      enabled: ruleHasCyber(resume),
      priority: 7,
      data: resume.skills.cybersecurity,
    },
    {
      id: "mobile",
      title: "Mobile Lab",
      enabled: ruleHasMobile(resume),
      priority: 7,
      data: resume.skills.mobile,
    },
    {
      id: "dataviz",
      title: "Data Visualization",
      enabled: ruleHasDataViz(resume),
      priority: 7,
      data: resume.skills.dataScience,
    },
    {
      id: "contact",
      title: "Contact Portal",
      enabled: ruleHasContact(resume),
      priority: 8,
      data: resume.profile,
    },
  ];

  // Theme-driven priority bumps so the most relevant zone sits front-and-center.
  const themeFavorites: Record<ResumeTheme, SectionId[]> = {
    "ai-ml": ["ai-lab", "projects", "skills"],
    frontend: ["frontend-studio", "projects", "skills"],
    backend: ["backend-server", "database", "projects"],
    fullstack: ["projects", "frontend-studio", "backend-server"],
    devops: ["devops-cloud", "backend-server", "projects"],
    cybersecurity: ["cybersecurity", "projects", "skills"],
    "data-science": ["dataviz", "ai-lab", "projects"],
    mobile: ["mobile", "projects", "skills"],
    designer: ["frontend-studio", "projects", "skills"],
    general: ["projects", "skills", "education"],
  };
  themeFavorites[theme].forEach((id, idx) => {
    const s = candidates.find((c) => c.id === id);
    if (s) s.priority = -10 + idx; // Pull these to the front.
  });

  const enabled = candidates
    .filter((c) => c.enabled)
    .sort((a, b) => a.priority - b.priority);

  // Place sections on a ring around origin. Profile sits behind the camera.
  const radius = 9;
  const sections: RoomSection[] = enabled.map((sec, idx) => {
    if (sec.id === "profile") {
      return {
        ...sec,
        position: [0, 1.5, -6.5],
        cameraStop: { position: [0, 1.6, 0], lookAt: [0, 1.5, -6.5] },
      };
    }
    // Distribute remaining sections across roughly 270° in front of the user.
    const others = enabled.filter((e) => e.id !== "profile");
    const ringIdx = others.findIndex((e) => e.id === sec.id);
    const total = others.length;
    const startAngle = -Math.PI * 0.85;
    const endAngle = Math.PI * 0.85;
    const t = total <= 1 ? 0.5 : ringIdx / (total - 1);
    const angle = startAngle + (endAngle - startAngle) * t;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius * -1; // negative so they sit in front
    const position: [number, number, number] = [x, 1.4, z];
    const cam: [number, number, number] = [x * 0.4, 1.6, z * 0.4 + 1.5];
    return {
      ...sec,
      position,
      cameraStop: { position: cam, lookAt: position },
    };
  });

  return {
    theme,
    accentColor: palette.accent,
    secondaryColor: palette.secondary,
    sections,
    particles: palette.particles,
    resume,
  };
}
