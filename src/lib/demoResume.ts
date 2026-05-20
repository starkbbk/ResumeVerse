import type { ResumeData } from "./resumeSchema";

/**
 * Sample resume used for the demo route. Showcases most zones so designers
 * can verify the room layout without uploading a real file.
 */
export const demoResume: ResumeData = {
  profile: {
    name: "Aria Chen",
    headline: "Full-Stack Engineer · AI Tinkerer",
    summary:
      "Engineer who loves shipping delightful products that blend thoughtful UX with serious systems work. Based out of Bengaluru.",
    email: "aria.chen@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    links: {
      github: "https://github.com/ariachen",
      linkedin: "https://linkedin.com/in/ariachen",
      portfolio: "https://aria.dev",
      leetcode: "https://leetcode.com/ariachen",
      other: [],
    },
  },
  skills: {
    languages: ["TypeScript", "Python", "Go", "SQL"],
    frontend: ["React", "Next.js", "Tailwind", "Framer Motion", "Three.js"],
    backend: ["Node.js", "FastAPI", "GraphQL", "REST"],
    aiMl: ["PyTorch", "LangChain", "OpenAI", "Computer Vision"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    devops: ["Docker", "Kubernetes", "GitHub Actions"],
    cloud: ["AWS", "Vercel"],
    cybersecurity: [],
    mobile: ["React Native"],
    dataScience: ["Pandas", "Plotly"],
    tools: ["Git", "Figma", "Postman"],
    other: [],
  },
  projects: [
    {
      name: "ResumeVerse",
      description:
        "Turns a flat resume into a personalised, explorable 3D room with theme-aware zones.",
      techStack: ["Next.js", "React Three Fiber", "TypeScript", "Tailwind"],
      githubUrl: "https://github.com/ariachen/resumeverse",
      demoUrl: "https://resumeverse.dev",
      highlights: [
        "Built a fault-tolerant PDF parser that bins skills into 11 categories.",
        "Designed a config-driven 3D scene with theme-aware zones.",
      ],
    },
    {
      name: "Atlas Vision",
      description:
        "Real-time computer vision dashboard for warehouse safety using YOLO and edge inference.",
      techStack: ["PyTorch", "YOLO", "FastAPI", "Redis"],
      githubUrl: "https://github.com/ariachen/atlas-vision",
      highlights: [
        "Reduced incident detection latency from 8s to 1.2s.",
        "Deployed across 4 facilities in 3 months.",
      ],
    },
    {
      name: "Lumen UI",
      description:
        "Accessible component library with motion-first defaults and tokenised theming.",
      techStack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
      githubUrl: "https://github.com/ariachen/lumen-ui",
      demoUrl: "https://lumen-ui.dev",
      highlights: ["WCAG AA out-of-the-box.", "Tree-shakeable with subpath imports."],
    },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Northwind Labs",
      duration: "Aug 2023 — Present",
      description:
        "Lead engineer for the developer platform team building internal tools used by 600+ engineers.",
      highlights: [
        "Cut p95 build times by 38% with a remote cache layer.",
        "Mentored 4 junior engineers; ran weekly code-review clinics.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Beacon Studio",
      duration: "Jul 2021 — Jul 2023",
      description: "Shipped customer-facing analytics dashboards for fintech clients.",
      highlights: [
        "Owned migration from Redux to Zustand.",
        "Authored the design system that 9 product teams now build on.",
      ],
    },
  ],
  education: [
    {
      degree: "B.E. Computer Science",
      institute: "PES University, Bengaluru",
      duration: "2017 — 2021",
      score: "CGPA: 9.1 / 10",
    },
  ],
  achievements: [
    "Winner — Smart India Hackathon 2020 (Edu-tech track).",
    "Top 1% on LeetCode India contests.",
    "Speaker at React India 2024.",
  ],
  certifications: [
    "AWS Certified Solutions Architect — Associate",
    "Google Cloud Professional Cloud Architect",
    "Coursera Deep Learning Specialization",
  ],
  awards: ["Best Engineer of the Quarter — Beacon Studio (Q4 2022)"],
  publications: [],
  rawText: "demo",
};
