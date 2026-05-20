import type { ResumeData } from "./resumeSchema";

export type ResumeTheme =
  | "ai-ml"
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "cybersecurity"
  | "data-science"
  | "mobile"
  | "designer"
  | "general";

interface ThemeScore {
  theme: ResumeTheme;
  score: number;
}

/**
 * Decide the dominant theme by scoring categories. Resumes can have multiple
 * specializations — we pick the highest-weighted one and tag the rest as
 * supplementary zones (handled inside the room generator).
 */
export function detectResumeType(data: ResumeData): ResumeTheme {
  const s = data.skills;
  const projectText = data.projects
    .map((p) => `${p.name} ${p.description} ${p.techStack.join(" ")}`)
    .join(" ")
    .toLowerCase();

  const scores: ThemeScore[] = [
    { theme: "ai-ml", score: weight(s.aiMl) + mentions(projectText, ["ai", "ml", "model"]) },
    {
      theme: "frontend",
      score: weight(s.frontend) + mentions(projectText, ["ui", "react", "css", "design"]),
    },
    {
      theme: "backend",
      score: weight(s.backend) + mentions(projectText, ["api", "server", "microservice"]),
    },
    {
      theme: "devops",
      score: weight(s.devops) + weight(s.cloud) + mentions(projectText, ["docker", "ci", "deploy"]),
    },
    { theme: "cybersecurity", score: weight(s.cybersecurity) + mentions(projectText, ["security", "vulnerability"]) },
    {
      theme: "data-science",
      score: weight(s.dataScience) + mentions(projectText, ["data", "dashboard", "analytics"]),
    },
    { theme: "mobile", score: weight(s.mobile) + mentions(projectText, ["app", "android", "ios"]) },
    {
      theme: "designer",
      score:
        (s.frontend.filter((f) => /figma|ui|ux/i.test(f)).length || 0) * 2 +
        mentions(projectText, ["figma", "design system", "wireframe"]),
    },
  ];

  // Fullstack bonus when both frontend and backend score reasonably.
  const fe = scores.find((x) => x.theme === "frontend")!.score;
  const be = scores.find((x) => x.theme === "backend")!.score;
  if (fe >= 3 && be >= 3) {
    scores.push({ theme: "fullstack", score: fe + be });
  }

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  if (!top || top.score < 2) return "general";
  return top.theme;
}

function weight(arr: string[]): number {
  return arr.length;
}

function mentions(haystack: string, needles: string[]): number {
  let n = 0;
  for (const needle of needles) {
    if (haystack.includes(needle)) n += 1;
  }
  return n;
}
