/**
 * Resume parser that takes a raw PDF (browser File / ArrayBuffer) and returns
 * a normalized ResumeData object.
 *
 * Strategy:
 *  1. Render the PDF to text using pdfjs-dist (legacy build, ESM compatible).
 *  2. Run a series of pure-text extractors that look for headings, bullets,
 *     URLs, emails, phone numbers and skill keywords.
 *
 * The parser is intentionally fault-tolerant: every section may be missing
 * and we still return a valid ResumeData. The room generator will gracefully
 * skip empty sections.
 */

import { SECTION_HEADINGS, SKILL_KEYWORDS } from "./constants";
import { emptyResume, type ResumeData } from "./resumeSchema";
import { safeUrl, titleCase, unique } from "./utils";

// ---------- PDF text extraction ----------

export async function extractPdfText(file: File): Promise<string> {
  // Dynamic import keeps pdfjs out of the SSR bundle.
  // pdfjs-dist 3.x legacy build ships a CJS entry — types are exported from
  // the package's main d.ts so we just import the CJS file directly.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - legacy build has no module declaration of its own
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  // Worker via CDN keeps Next.js/Webpack happy without custom worker config.
  // pdfjs is pinned in package.json so the version match is deterministic.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfjs as any).GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ");
    pages.push(text);
  }
  return pages.join("\n\n");
}

// ---------- Field extractors (pure functions) ----------

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?){2,4}\d{2,4}/g;
const URL_RE =
  /(https?:\/\/[^\s,;)]+|www\.[^\s,;)]+|[a-z0-9-]+\.(?:com|io|dev|app|me|co|ai|tech|net|org|in)\/?[^\s,;)]*)/gi;

export function extractContact(text: string) {
  const email = (text.match(EMAIL_RE) || [])[0] || "";
  // Phone — pick the first match that has at least 8 digits.
  const phoneCandidates = (text.match(PHONE_RE) || []).filter(
    (m) => (m.replace(/\D/g, "") || "").length >= 8 && (m.replace(/\D/g, "") || "").length <= 14,
  );
  const phone = phoneCandidates[0]?.trim() || "";

  const urls = unique(
    (text.match(URL_RE) || [])
      .map((u) => u.replace(/[).,;]+$/g, ""))
      .map((u) => safeUrl(u) || "")
      .filter(Boolean),
  );

  const links = {
    github: urls.find((u) => /github\.com/i.test(u)),
    linkedin: urls.find((u) => /linkedin\.com/i.test(u)),
    leetcode: urls.find((u) => /leetcode\.com/i.test(u)),
    twitter: urls.find((u) => /(twitter\.com|x\.com)/i.test(u)),
    portfolio: urls.find(
      (u) =>
        !/(github\.com|linkedin\.com|leetcode\.com|twitter\.com|x\.com|mailto:)/i.test(u),
    ),
    other: urls.filter(
      (u) =>
        !/(github\.com|linkedin\.com|leetcode\.com|twitter\.com|x\.com)/i.test(u),
    ),
  };

  return { email, phone, links };
}

/** Heuristic: name is usually the first non-empty short line on page 1. */
export function extractName(text: string): string {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    // Strip emails/urls so we don't accidentally pick them up.
    const cleaned = line
      .replace(EMAIL_RE, "")
      .replace(URL_RE, "")
      .replace(/[|•·,]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    const words = cleaned.split(" ").filter((w) => /^[A-Za-z.'-]{2,}$/.test(w));
    if (words.length >= 2 && words.length <= 5 && cleaned.length < 60) {
      // Reject obvious headers.
      if (/resume|curriculum|cv/i.test(cleaned)) continue;
      return titleCase(cleaned);
    }
  }
  return "";
}

/** First short line under 80 chars that follows the name and isn't contact info. */
export function extractHeadline(text: string, name: string): string {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const idx = name ? lines.findIndex((l) => l.toLowerCase().includes(name.split(" ")[0].toLowerCase())) : -1;
  const window = idx >= 0 ? lines.slice(idx + 1, idx + 6) : lines.slice(1, 6);
  for (const line of window) {
    if (EMAIL_RE.test(line) || URL_RE.test(line)) continue;
    if (line.length > 6 && line.length < 90 && /[a-z]/.test(line)) {
      return line;
    }
  }
  return "";
}

/** Split full resume text into normalized sections keyed by canonical name. */
export function splitSections(text: string): Record<string, string> {
  // Build a regex that captures each known heading on its own.
  const allHeadings = Object.entries(SECTION_HEADINGS).flatMap(([canonical, syns]) =>
    syns.map((s) => ({ canonical, syn: s })),
  );

  // Find heading positions in original text (case-insensitive).
  const lower = text.toLowerCase();
  const matches: { canonical: string; index: number; length: number }[] = [];
  for (const { canonical, syn } of allHeadings) {
    const re = new RegExp(`(^|[\\n\\s•|])${syn}\\s*[:\\-]?`, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(lower)) !== null) {
      matches.push({
        canonical,
        index: m.index + m[1].length,
        length: syn.length,
      });
    }
  }
  matches.sort((a, b) => a.index - b.index);

  const out: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const start = cur.index + cur.length;
    const end = next ? next.index : text.length;
    const chunk = text.slice(start, end).trim();
    // Keep the longest chunk per canonical key.
    if (!out[cur.canonical] || chunk.length > out[cur.canonical].length) {
      out[cur.canonical] = chunk;
    }
  }
  return out;
}

/** Bucket an array of free-form skill strings into our SkillCategory groups. */
export function categorizeSkills(rawSkills: string[]) {
  const buckets: Record<string, string[]> = {
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
  };
  const lookup = (Object.keys(SKILL_KEYWORDS) as Array<keyof typeof SKILL_KEYWORDS>).map(
    (cat) => ({
      cat,
      list: SKILL_KEYWORDS[cat] as readonly string[],
    }),
  );

  for (const skill of rawSkills) {
    const normalized = skill.trim();
    if (!normalized) continue;
    const lc = normalized.toLowerCase();
    let placed = false;
    for (const { cat, list } of lookup) {
      if (list.some((kw) => lc === kw || lc.includes(kw))) {
        buckets[cat].push(normalized);
        placed = true;
        break;
      }
    }
    if (!placed) buckets.other.push(normalized);
  }

  // Dedup, preserve readable casing.
  for (const k of Object.keys(buckets)) {
    buckets[k] = unique(buckets[k]);
  }
  return buckets as unknown as ResumeData["skills"];
}

/** Pull skills from a "Skills" block. Splits on commas, slashes, pipes, bullets. */
export function extractSkills(skillsBlock: string, fullText: string) {
  const tokens = (skillsBlock || "")
    .split(/[•\n,|/]/g)
    .map((s) => s.replace(/^[-:\s]+|[-:\s]+$/g, "").trim())
    .filter((s) => s.length >= 2 && s.length < 40);

  // Also do a keyword sweep across the full text to catch unlabeled mentions.
  const allKeywords = Object.values(SKILL_KEYWORDS).flat();
  const sweep = allKeywords.filter((kw) =>
    new RegExp(`(^|[\\s,(/|])${kw.replace(/[.+*]/g, "\\$&")}([\\s,)/|]|$)`, "i").test(fullText),
  );

  const merged = unique([...tokens, ...sweep.map(titleCase)]);
  return categorizeSkills(merged);
}

/** Split a section body into entry blocks (each entry separated by big gaps). */
function splitEntries(block: string): string[] {
  if (!block) return [];
  // Heuristic: split on year ranges that almost always start a new entry.
  const yearSplit = block
    .replace(/(\b\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)\b)/gi, "\n$1")
    .split(/\n{2,}|(?<=\.)\s(?=[A-Z][a-z]+\s+\d{4})/);
  return yearSplit
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

const DURATION_RE =
  /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|(?:\d{1,2}\/\d{4})|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|(?:\d{1,2}\/\d{4})|\d{4}|present|current|now)\b/i;

export function extractExperience(block: string) {
  const entries = splitEntries(block);
  return entries
    .map((entry) => {
      const dur = entry.match(DURATION_RE)?.[0] ?? "";
      // Top line — usually "Role | Company" or "Role at Company".
      const firstLine = entry.split(/[\n.]/)[0].trim();
      const parts = firstLine.split(/\s*(?:\||–|—|@|at|,)\s*/i).filter(Boolean);
      const role = parts[0]?.trim() || "";
      const company = parts.slice(1).join(" ").trim();
      const description = entry.replace(firstLine, "").replace(dur, "").trim();
      const highlights = description
        .split(/[•\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 8);
      return { role, company, duration: dur, description, highlights };
    })
    .filter((e) => e.role || e.company);
}

export function extractEducation(block: string) {
  const entries = splitEntries(block);
  return entries
    .map((entry) => {
      const dur = entry.match(DURATION_RE)?.[0] ?? "";
      const scoreMatch =
        entry.match(/\b(?:CGPA|GPA|Percentage)[\s:]*([\d.]+\s*\/?\s*\d*\s*%?)/i) ??
        entry.match(/\b([\d.]+)\s*(?:CGPA|GPA)\b/i);
      const score = scoreMatch ? scoreMatch[0] : "";
      const firstLine = entry.split(/[\n.]/)[0].trim();
      // Try splitting "Degree, Institute" or "Degree | Institute".
      const split = firstLine.split(/\s*[,|–—@]\s*/);
      let degree = split[0]?.trim() ?? "";
      let institute = split.slice(1).join(", ").trim();
      if (!institute) {
        // Look at next line.
        const next = entry.split(/[\n.]/)[1]?.trim() ?? "";
        institute = next;
      }
      // Clean degree from common stop-words.
      degree = degree.replace(/Education[:]?/i, "").trim();
      return { degree, institute, duration: dur, score };
    })
    .filter((e) => e.degree || e.institute);
}

export function extractProjects(block: string) {
  if (!block) return [];
  const entries = block
    // Treat lines that look like "Name — description" or "Name | description" as new projects.
    .split(/(?:\n{2,}|(?<=\.)\s(?=[A-Z][A-Za-z0-9 .-]{2,40}(?:\s*[-–—|:]\s)))/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  return entries.map((entry) => {
    const firstLine = entry.split(/[\n.]/)[0].trim();
    const split = firstLine.split(/\s*[-–—|:]\s*/);
    const name = (split[0] || "").slice(0, 80).trim();
    const tail = entry.replace(firstLine, "").trim();
    const description = (split.slice(1).join(" - ") + " " + tail).trim().slice(0, 600);

    // Pull URLs and tech.
    const urls = (entry.match(URL_RE) || [])
      .map((u) => safeUrl(u) || "")
      .filter(Boolean);
    const githubUrl = urls.find((u) => /github\.com/i.test(u));
    const demoUrl = urls.find((u) => !/github\.com/i.test(u));

    // Tech stack — sweep against keywords in description.
    const allKeywords = Object.values(SKILL_KEYWORDS).flat();
    const techStack = unique(
      allKeywords.filter((kw) =>
        new RegExp(`(^|[\\s,(/|])${kw.replace(/[.+*]/g, "\\$&")}([\\s,)/|]|$)`, "i").test(entry),
      ).map(titleCase),
    );

    const highlights = entry
      .split(/[•\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12 && s.length < 240)
      .slice(0, 5);

    return {
      name: name || "Project",
      description,
      techStack,
      githubUrl,
      demoUrl,
      highlights,
    };
  });
}

function bulletList(block: string): string[] {
  if (!block) return [];
  return block
    .split(/[•\n]+/)
    .map((s) => s.replace(/^[-*\s]+|\s+$/g, "").trim())
    .filter((s) => s.length > 4 && s.length < 300);
}

// ---------- Public API ----------

export async function parseResumeFile(file: File): Promise<ResumeData> {
  const text = await extractPdfText(file);
  return parseResumeText(text);
}

export function parseResumeText(rawText: string): ResumeData {
  const data = emptyResume();
  data.rawText = rawText;
  if (!rawText || rawText.trim().length < 30) {
    return data;
  }

  // Normalize line breaks — pdfjs returns one giant line per page.
  const text = rawText.replace(/\s{2,}/g, "  ").replace(/  /g, "\n");
  const sections = splitSections(text);

  data.profile.name = extractName(text);
  data.profile.headline = extractHeadline(text, data.profile.name);
  data.profile.summary = (sections.summary || "").slice(0, 600);
  const contact = extractContact(text);
  data.profile.email = contact.email;
  data.profile.phone = contact.phone;
  data.profile.links = {
    github: contact.links.github,
    linkedin: contact.links.linkedin,
    leetcode: contact.links.leetcode,
    twitter: contact.links.twitter,
    portfolio: contact.links.portfolio,
    other: contact.links.other,
  };

  // Try to guess a location from the top of the resume.
  const top = text.split(/\n+/).slice(0, 8).join(" ");
  const locMatch = top.match(
    /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?,\s*(?:India|USA|UK|Canada|Germany|UAE|Singapore|Australia|[A-Z]{2}))\b/,
  );
  data.profile.location = locMatch?.[1] || "";

  data.skills = extractSkills(sections.skills || "", text);
  data.projects = extractProjects(sections.projects || "");
  data.experience = extractExperience(sections.experience || "");
  data.education = extractEducation(sections.education || "");
  data.achievements = bulletList(sections.achievements || "");
  data.certifications = bulletList(sections.certifications || "");
  data.publications = bulletList(sections.publications || "");

  return data;
}
