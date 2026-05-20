"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Briefcase,
  Code,
  Database,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Trophy,
  Globe,
  Download,
  FileJson,
  FileText,
} from "lucide-react";
import Link from "next/link";
import type { SectionId } from "@/lib/generateRoomConfig";
import { useAppStore } from "@/lib/store";

interface Props {
  id: SectionId;
}

export default function PanelContent({ id }: Props) {
  const resume = useAppStore((s) => s.resume);
  if (!resume) return null;

  switch (id) {
    case "profile":
      return <ProfilePanel />;
    case "skills":
      return <SkillsPanel />;
    case "projects":
      return <ProjectsPanel />;
    case "experience":
      return <ExperiencePanel />;
    case "education":
      return <EducationPanel />;
    case "achievements":
      return <AchievementsPanel />;
    case "certifications":
      return <CertificationsPanel />;
    case "ai-lab":
      return <SkillCategoryPanel category="aiMl" title="AI / ML stack" emoji="🧠" />;
    case "frontend-studio":
      return <SkillCategoryPanel category="frontend" title="Frontend stack" emoji="🎨" />;
    case "backend-server":
      return <SkillCategoryPanel category="backend" title="Backend stack" emoji="⚙️" />;
    case "database":
      return <SkillCategoryPanel category="databases" title="Databases" emoji="🗄" />;
    case "devops-cloud":
      return <DevOpsPanel />;
    case "cybersecurity":
      return <SkillCategoryPanel category="cybersecurity" title="Security stack" emoji="🛡" />;
    case "mobile":
      return <SkillCategoryPanel category="mobile" title="Mobile stack" emoji="📱" />;
    case "dataviz":
      return <SkillCategoryPanel category="dataScience" title="Data & analytics" emoji="📊" />;
    case "contact":
      return <ContactPanel />;
    default:
      return null;
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

function PanelHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-sm font-medium text-white mb-2">
      <Icon className="size-4 text-cyan-300" />
      {children}
    </h4>
  );
}

function ExternalLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 chip-neon hover:bg-cyan-300/20 transition"
    >
      {children}
      <ExternalLink className="size-3" />
    </a>
  );
}

// ---------- Sub panels ----------

function ProfilePanel() {
  const resume = useAppStore((s) => s.resume)!;
  const p = resume.profile;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl heading-gradient">{p.name || "Anonymous"}</h2>
        {p.headline && <p className="text-white/75 mt-1">{p.headline}</p>}
        {p.location && (
          <p className="mt-2 text-sm text-white/60 flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {p.location}
          </p>
        )}
      </div>
      {p.summary && (
        <div className="text-sm text-white/85 leading-relaxed">{p.summary}</div>
      )}
      <div className="flex flex-wrap gap-2">
        {p.email && (
          <ExternalLinkButton href={`mailto:${p.email}`}>
            <Mail className="size-3.5" /> {p.email}
          </ExternalLinkButton>
        )}
        {p.phone && <Chip><Phone className="size-3" /> {p.phone}</Chip>}
        {p.links.github && (
          <ExternalLinkButton href={p.links.github}>
            <Github className="size-3.5" /> GitHub
          </ExternalLinkButton>
        )}
        {p.links.linkedin && (
          <ExternalLinkButton href={p.links.linkedin}>
            <Linkedin className="size-3.5" /> LinkedIn
          </ExternalLinkButton>
        )}
        {p.links.portfolio && (
          <ExternalLinkButton href={p.links.portfolio}>
            <Globe className="size-3.5" /> Portfolio
          </ExternalLinkButton>
        )}
      </div>
    </div>
  );
}

function SkillsPanel() {
  const skills = useAppStore((s) => s.resume!.skills);
  const groups: Array<[string, string[]]> = [
    ["Languages", skills.languages],
    ["Frontend", skills.frontend],
    ["Backend", skills.backend],
    ["AI / ML", skills.aiMl],
    ["Databases", skills.databases],
    ["DevOps", skills.devops],
    ["Cloud", skills.cloud],
    ["Cybersecurity", skills.cybersecurity],
    ["Mobile", skills.mobile],
    ["Data Science", skills.dataScience],
    ["Tools", skills.tools],
    ["Other", skills.other],
  ];
  return (
    <div className="space-y-4">
      {groups
        .filter(([, arr]) => arr.length > 0)
        .map(([label, arr]) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-widest text-white/55 mb-2">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {arr.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

function ProjectsPanel() {
  const projects = useAppStore((s) => s.resume!.projects);
  return (
    <div className="space-y-4">
      {projects.map((p, i) => (
        <div key={i} className="glass p-3.5">
          <div className="flex items-start justify-between gap-3">
            <h5 className="font-medium text-white leading-tight">{p.name}</h5>
            <div className="flex items-center gap-1.5 shrink-0">
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="size-7 grid place-items-center rounded-md hover:bg-white/5"
                  aria-label="GitHub"
                >
                  <Github className="size-3.5" />
                </a>
              )}
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="size-7 grid place-items-center rounded-md hover:bg-white/5"
                  aria-label="Live demo"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </div>
          {p.description && (
            <p className="mt-1.5 text-sm text-white/75 leading-relaxed line-clamp-3">{p.description}</p>
          )}
          {p.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {p.techStack.slice(0, 8).map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          )}
          {p.highlights.length > 0 && (
            <ul className="mt-2.5 space-y-1 text-sm text-white/75">
              {p.highlights.slice(0, 3).map((h, hi) => (
                <li key={hi} className="flex gap-2">
                  <span className="text-cyan-300 mt-1.5 size-1 rounded-full bg-cyan-300 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function ExperiencePanel() {
  const experience = useAppStore((s) => s.resume!.experience);
  return (
    <div className="space-y-4">
      <PanelHeading icon={Briefcase}>{experience.length} role{experience.length === 1 ? "" : "s"}</PanelHeading>
      {experience.map((e, i) => (
        <div key={i} className="glass p-3.5">
          <p className="text-sm font-medium">{e.role || "Role"}</p>
          <p className="text-sm text-white/70">{e.company}</p>
          {e.duration && <p className="text-xs text-cyan-300/85 mt-1">{e.duration}</p>}
          {e.description && (
            <p className="mt-2 text-sm text-white/75 leading-relaxed line-clamp-4">{e.description}</p>
          )}
          {e.highlights.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-white/75">
              {e.highlights.slice(0, 4).map((h, hi) => (
                <li key={hi} className="flex gap-2">
                  <span className="text-cyan-300 mt-1.5 size-1 rounded-full bg-cyan-300 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationPanel() {
  const education = useAppStore((s) => s.resume!.education);
  return (
    <div className="space-y-3">
      <PanelHeading icon={GraduationCap}>{education.length} entry{education.length === 1 ? "" : "ies"}</PanelHeading>
      {education.map((e, i) => (
        <div key={i} className="glass p-3.5">
          <p className="text-sm font-medium">{e.degree || "Degree"}</p>
          <p className="text-sm text-white/70">{e.institute}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-cyan-300/80">
            {e.duration && <span>{e.duration}</span>}
            {e.score && <span>{e.score}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function AchievementsPanel() {
  const achievements = useAppStore((s) => s.resume!.achievements);
  const awards = useAppStore((s) => s.resume!.awards);
  return (
    <div className="space-y-4">
      {achievements.length > 0 && (
        <div>
          <PanelHeading icon={Trophy}>Achievements</PanelHeading>
          <ul className="space-y-2 text-sm text-white/85">
            {achievements.map((a, i) => (
              <li key={i} className="glass p-3 leading-relaxed">{a}</li>
            ))}
          </ul>
        </div>
      )}
      {awards.length > 0 && (
        <div>
          <PanelHeading icon={Award}>Awards</PanelHeading>
          <ul className="space-y-2 text-sm text-white/85">
            {awards.map((a, i) => (
              <li key={i} className="glass p-3 leading-relaxed">{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CertificationsPanel() {
  const certs = useAppStore((s) => s.resume!.certifications);
  return (
    <div className="space-y-2">
      {certs.map((c, i) => (
        <div key={i} className="glass p-3 text-sm text-white/85">{c}</div>
      ))}
    </div>
  );
}

interface CategoryProps {
  category: keyof import("@/lib/resumeSchema").ResumeSkills;
  title: string;
  emoji: string;
}
function SkillCategoryPanel({ category, title, emoji }: CategoryProps) {
  const items = useAppStore((s) => s.resume!.skills[category]);
  return (
    <div className="space-y-3">
      <p className="text-sm text-white/75">{emoji} {title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => <span key={s} className="chip">{s}</span>)}
      </div>
    </div>
  );
}

function DevOpsPanel() {
  const devops = useAppStore((s) => s.resume!.skills.devops);
  const cloud = useAppStore((s) => s.resume!.skills.cloud);
  return (
    <div className="space-y-4">
      {devops.length > 0 && (
        <div>
          <PanelHeading icon={Code}>DevOps tooling</PanelHeading>
          <div className="flex flex-wrap gap-1.5">
            {devops.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      )}
      {cloud.length > 0 && (
        <div>
          <PanelHeading icon={Database}>Cloud platforms</PanelHeading>
          <div className="flex flex-wrap gap-1.5">
            {cloud.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactPanel() {
  const resume = useAppStore((s) => s.resume)!;
  const profile = resume.profile;
  const [hasPdf, setHasPdf] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasPdf(Boolean(window.sessionStorage.getItem("resumeverse:pdf")));
    }
  }, []);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const pdfBase64 = window.sessionStorage.getItem("resumeverse:pdf");
    if (!pdfBase64) return;
    const bin = atob(pdfBase64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name || "resume"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-2">
        <h4 className="font-display text-xl text-white font-bold tracking-wide">Ready to connect?</h4>
        <p className="text-xs text-white/50 mt-1">Get in touch directly or download my credentials below.</p>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Socials & Contact</p>
        <div className="grid grid-cols-2 gap-2">
          {profile.email && (
            <Link href={`mailto:${profile.email}`} className="glass p-3 hover:border-cyan-300/40 transition flex items-center gap-2 text-xs text-white/80 hover:text-white">
              <Mail className="size-4 text-cyan-300" /> Email
            </Link>
          )}
          {profile.phone && (
            <Link href={`tel:${profile.phone}`} className="glass p-3 hover:border-cyan-300/40 transition flex items-center gap-2 text-xs text-white/80 hover:text-white">
              <Phone className="size-4 text-cyan-300" /> Phone
            </Link>
          )}
          {profile.links.github && (
            <a href={profile.links.github} target="_blank" rel="noreferrer noopener" className="glass p-3 hover:border-cyan-300/40 transition flex items-center gap-2 text-xs text-white/80 hover:text-white">
              <Github className="size-4 text-cyan-300" /> GitHub
            </a>
          )}
          {profile.links.linkedin && (
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer noopener" className="glass p-3 hover:border-cyan-300/40 transition flex items-center gap-2 text-xs text-white/80 hover:text-white">
              <Linkedin className="size-4 text-cyan-300" /> LinkedIn
            </a>
          )}
          {profile.links.portfolio && (
            <a href={profile.links.portfolio} target="_blank" rel="noreferrer noopener" className="glass p-3 hover:border-cyan-300/40 transition flex items-center gap-2 text-xs text-white/80 hover:text-white">
              <Globe className="size-4 text-cyan-300" /> Portfolio
            </a>
          )}
          {profile.links.leetcode && (
            <a href={profile.links.leetcode} target="_blank" rel="noreferrer noopener" className="glass p-3 hover:border-cyan-300/40 transition flex items-center gap-2 text-xs text-white/80 hover:text-white">
              <Code className="size-4 text-cyan-300" /> LeetCode
            </a>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Resume Assets</p>
        <div className="flex flex-col gap-2">
          {hasPdf && (
            <button
              onClick={downloadPdf}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 transition text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <FileText className="size-4 text-cyan-300" /> Download PDF Resume
              </span>
              <Download className="size-3.5" />
            </button>
          )}
          <button
            onClick={downloadJson}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/90 transition text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <FileJson className="size-4 text-white/70" /> Export JSON Resume
            </span>
            <Download className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
