# ResumeVerse

> Turn your resume into an interactive 3D room.

ResumeVerse reads a resume PDF in the browser, extracts a structured profile, then generates a personalised, explorable 3D room. Skills become a hologram, projects sit on workstations, achievements glow on a trophy shelf — and zones only appear when the matching data exists.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for the futuristic dark UI
- **Three.js** + **React Three Fiber** + **Drei** for the 3D scene
- **Framer Motion** for page and panel animations
- **pdf.js** for in-browser resume parsing (no server upload)
- **Zustand** for app state

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Try without uploading

Click **Try demo room** on the landing page or visit `/demo` — it preloads a sample resume so you can see every zone.

## Routes

| Route | Description |
| ----- | ----------- |
| `/` | Landing page with hero, preview cards and "how it works" |
| `/upload` | Drag-and-drop resume upload + parsing flow |
| `/demo` | Loads a sample resume and routes to the generated room |
| `/room` | The generated 3D experience |
| `/about` | Product info |

## Architecture

```
src/
├─ app/                 # Next.js App Router pages
│  ├─ page.tsx          # Landing page
│  ├─ upload/page.tsx   # Resume upload flow
│  ├─ room/page.tsx     # Generated 3D room
│  ├─ demo/page.tsx     # Demo bootstrapper
│  └─ about/page.tsx    # About copy
├─ components/          # UI + 3D components
│  ├─ three/            # All 3D meshes (low-poly, performance friendly)
│  ├─ panels/           # Panel content per section
│  └─ …
└─ lib/
   ├─ parseResume.ts        # pdf.js text extraction + heuristics
   ├─ resumeSchema.ts       # Canonical data shape
   ├─ constants.ts          # Skill keyword catalogues
   ├─ detectResumeType.ts   # Theme detection (frontend, ai-ml, …)
   ├─ roomRules.ts          # When-to-show rules per zone
   ├─ generateRoomConfig.ts # Resume → room layout config
   ├─ store.ts              # Zustand app store
   └─ demoResume.ts         # Sample resume for /demo
```

## How room generation works

`generateRoomConfig(resumeData)` returns a structure like:

```ts
{
  theme: "ai-ml" | "frontend" | "backend" | …,
  accentColor: "#a78bfa",
  secondaryColor: "#22d3ee",
  particles: 220,
  sections: [
    { id: "profile", enabled: true, position: [...], cameraStop: { … } },
    { id: "skills", enabled: true, … },
    { id: "ai-lab", enabled: true, … },
    …
  ]
}
```

Each section can render or be skipped depending on whether the resume contains relevant data. Specialised zones (AI lab, frontend studio, backend, database, devops, cybersecurity, mobile, dataviz) light up only when matching keywords are detected.

## Performance & accessibility

- WebGL is feature-detected; if unsupported the app falls back to a beautiful 2D card layout.
- Performance mode auto-enables on devices with ≤4 cores or small viewports — disables shadows, postprocessing, particles.
- All buttons have visible focus states; the side panel is keyboard accessible (Escape to close); reduced-motion preference is respected.

## License

MIT
