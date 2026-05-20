import type { ResumeData } from "./resumeSchema";

/**
 * Tiny rule helpers: each returns true when a section/zone should be shown.
 * Centralizing the logic here means the generator stays declarative and the
 * rules can be unit tested or tweaked without touching the 3D layer.
 */

export const ruleHasContact = (d: ResumeData) =>
  Boolean(
    d.profile.email ||
      d.profile.phone ||
      d.profile.links.github ||
      d.profile.links.linkedin ||
      d.profile.links.portfolio ||
      d.profile.links.leetcode ||
      d.profile.links.other.length,
  );

export const ruleHasSkills = (d: ResumeData) =>
  Object.values(d.skills).some((arr) => arr.length > 0);

export const ruleHasProjects = (d: ResumeData) => d.projects.length > 0;
export const ruleHasExperience = (d: ResumeData) => d.experience.length > 0;
export const ruleHasEducation = (d: ResumeData) => d.education.length > 0;
export const ruleHasAchievements = (d: ResumeData) =>
  d.achievements.length > 0 || d.awards.length > 0;
export const ruleHasCertifications = (d: ResumeData) => d.certifications.length > 0;

export const ruleHasAiMl = (d: ResumeData) => d.skills.aiMl.length > 0;
export const ruleHasFrontend = (d: ResumeData) => d.skills.frontend.length > 0;
export const ruleHasBackend = (d: ResumeData) => d.skills.backend.length > 0;
export const ruleHasDatabase = (d: ResumeData) => d.skills.databases.length > 0;
export const ruleHasDevOps = (d: ResumeData) =>
  d.skills.devops.length > 0 || d.skills.cloud.length > 0;
export const ruleHasCyber = (d: ResumeData) => d.skills.cybersecurity.length > 0;
export const ruleHasMobile = (d: ResumeData) => d.skills.mobile.length > 0;
export const ruleHasDataViz = (d: ResumeData) => d.skills.dataScience.length > 0;
