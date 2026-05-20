/**
 * Canonical normalized resume schema used across the app.
 * The parser populates this; the room generator reads from it.
 */

export interface ResumeLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  leetcode?: string;
  twitter?: string;
  other: string[];
}

export interface ResumeProfile {
  name: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  links: ResumeLinks;
}

export interface ResumeSkills {
  languages: string[];
  frontend: string[];
  backend: string[];
  aiMl: string[];
  databases: string[];
  devops: string[];
  cloud: string[];
  cybersecurity: string[];
  mobile: string[];
  dataScience: string[];
  tools: string[];
  other: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  highlights: string[];
}

export interface ResumeExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
  highlights: string[];
}

export interface ResumeEducation {
  degree: string;
  institute: string;
  duration: string;
  score: string;
}

export interface ResumeData {
  profile: ResumeProfile;
  skills: ResumeSkills;
  projects: ResumeProject[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  achievements: string[];
  certifications: string[];
  awards: string[];
  publications: string[];
  rawText: string;
}

export const emptyResume = (): ResumeData => ({
  profile: {
    name: "",
    headline: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
    links: { other: [] },
  },
  skills: {
    languages: [],
    frontend: [],
    backend: [],
    aiMl: [],
    databases: [],
    devops: [],
    cloud: [],
    cybersecurity: [],
    mobile: [],
    dataScience: [],
    tools: [],
    other: [],
  },
  projects: [],
  experience: [],
  education: [],
  achievements: [],
  certifications: [],
  awards: [],
  publications: [],
  rawText: "",
});
