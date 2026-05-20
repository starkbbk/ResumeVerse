# ResumeVerse: Cinematic 3D Museum Room Requirements

This document outlines the visual, architectural, and component-specific guidelines for upgrading the ResumeVerse 3D room into a realistic, premium, futuristic Career Museum.

---

## 1. Global Scene & Architectural Layout

The room is styled as a large futuristic circular museum hall.

### Center Hub
*   **Circular Floor Hub**: A glowing circular central navigation deck.
*   **Resume Emblem**: A rotating holographic core emblem floating above the center.
*   **Floor Markings**: Concentric floor rings, path lines, and radial grid markers.

### Section Placement (Circular Layout)
All major sections are placed in a circle around the center hub and **must face inward** toward the center of the room.
*   **0°**: **Profile Station** (faces camera path and center hub).
*   **45°**: **Skills Reactor** (faces inward).
*   **90°**: **Project Gallery** (faces inward).
*   **135°**: **Experience Workstation** (faces inward, only if work history exists).
*   **180°**: **Education Wall** (faces inward).
*   **225°**: **Achievement Gallery** (faces inward, only if honors/awards exist).
*   **270°**: **Specialized Tech Pods** (AI/ML, Frontend, Backend, DevOps, Cybersecurity, Database, Mobile, Data Viz - placed as small connected peripheral nodes).
*   **315°**: **Contact Portal** (final destination; faces inward and slightly toward camera).

### Background Elements
*   **Wall Panels**: Structural vertical ribs, glass partitions, and metallic pillars behind each section to avoid empty spaces.
*   **Light Strips**: Vertical neon light strips embedded into back walls.
*   **Ceiling Structure**: Exposed metallic ceiling beams and support arches.

---

## 2. Camera & Scroll Direction

The experience is scroll-driven by default, guiding the viewer through a cinematic story.

*   **Establishing Frame**: Wide shot showing the entire circular museum.
*   **Scroll Path**: The camera moves along an inner circular path, rotating outward to frame each active section at a close, readable angle.
*   **Orientation Check**: Screens, panels, diplomas, and labels must face the camera directly when active. Backsides of panels must never be visible.
*   **Easing & Parallax**: Camera movements must use smooth cubic interpolation (easing) with subtle physical camera sway/parallax on hover.

---

## 3. Lighting & Shadows

*   **Global Ambient Light**: Subtle soft global ambient light to keep secondary details visible without ruining the high-contrast sci-fi dark theme.
*   **Area Lights**: Diffuse rectangular area lights mounted above each workstation.
*   **Directional Spotlights**: Spotlights casting soft shadows under active objects:
    *   *Profile*: Dual-tone cyan/purple hologram light.
    *   *Skills*: Concentrated cyan/magenta core glow.
    *   *Projects*: Warm screen glow complemented by blue backlight.
    *   *Education*: Warm gold museum spotlight focusing on the diploma.
    *   *Achievements*: Sparkling golden trophy accent light.
    *   *Backend*: Green/blue blinking rack indicator reflections.
    *   *Frontend*: Neon swatches and clean white studio panel lights.
    *   *AI/ML*: Concentrated cyan neural core lighting.
    *   *Contact*: Intense high-intensity portal rim backlight.

---

## 4. Materials & Realism Quality

*   **Glass**: Semi-transparent dark glass (`opacity: 0.35`, `roughness: 0.05`, `metalness: 0.9`).
*   **Metal**: Matte dark brushed steel with beveled edges.
*   **Screens**: Self-illuminated emissive displays.
*   **Diploma**: Parchment texture mounted inside a thick gold/walnut frame.
*   **Trophies**: Polished brass/gold metal.
*   **Sizing**: Realistic proportions (e.g., laptop keys, desk height, books, and racks must match standard human scales).
*   **Bevels**: Avoid raw, sharp-edged cubes. Use rounded boxes, cylinders, and layered geometry.

---

## 5. Section-Specific Realistic Design Requirements

### 1. Profile Station (`ProfileWall.tsx`)
*   **Base**: Beveled metallic pedestal base.
*   **Hologram Screen**: Large curved transparent screen.
*   **Initials Orb**: A floating glass sphere with initials inside, rotating within concentric scan rings.
*   **Satellite Links**: Semicircular array of interactive floating chips for social profiles (GitHub, LinkedIn, Portfolio).

### 2. Skills Reactor (`SkillHologram.tsx`)
*   **Base**: Mechanical core reactor platform.
*   **Center**: Pulsing glowing energy sphere inside a glass dome.
*   **Orbit Rings**: Multiple stacked horizontal orbital rings representing categories (Languages, Frontend, Backend, Database, AI/ML, DevOps, Tools).
*   **3D Icons**:
    *   *Languages*: Code bracket.
    *   *Frontend*: Browser window.
    *   *Backend*: Stacked server rack.
    *   *Database*: Cylinder stack.
    *   *AI/ML*: Neural node graph.
    *   *DevOps*: Cloud emblem.
*   **Badges**: Floating normalized tech chips distributed along categories (maximum 6 per category in 3D).

### 3. Project Gallery (`ProjectZone.tsx`)
*   **Layout**: A curved table desk holding multiple laptop mockups arranged in an arc.
*   **Laptops**: Detailed laptop bases, keyboards, hinges, and screen mockups displaying screenshot frames and tech badge labels.
*   **Interactivity**: Laptops scale and glow on active focus.

### 4. Experience Workstation (`ExperienceWorkstation.tsx`)
*   **Workspace**: Workstation desk holding dual monitors, keyboard, and control deck.
*   **Timeline**: A linear track board mounted behind the desk with nodes marking roles and companies.
*   **Detail Cards**: Sticky hologram panels summarizing responsibilities.

### 5. Education Wall (`EducationWall.tsx`)
*   **Layout**: Wall-mounted display panel with a museum showcase shelf.
*   **Diploma**: Detailed diploma frame (gold/wood) holding a parchment certificate with seal.
*   **Props**: Graduation cap on shelf and 3 stacked books.

### 6. Achievement Gallery (`TrophyShelf.tsx`)
*   **Structure**: Marble podium stand and glass wall shelf.
*   **Trophies**: 3D Trophy cups with handles, star medals with red/blue ribbons, and wood badge plaques.
*   **Plaques**: Readable label plaque below each trophy.

### 7. Contact Portal (`ContactPortal.tsx`)
*   **Structure**: Circular gate with a thick metal rim, steps leading up, and a glowing event horizon.
*   **Vortex**: Concentric rings spinning in opposite directions and particle flow streaming into the portal core.
*   **Buttons**: Floating contact chips (Email, GitHub, LinkedIn) arranged in a semicircle.

### 8. Backend Pod (`BackendServerZone.tsx`)
*   **Racks**: Multiple server towers with front vents, trays, and blinking status LEDs.
*   **Pipes**: Cabling/pipes linking server modules to the database zone.
*   **Terminal**: Monitor displaying mock API server routes.

### 9. Frontend Studio (`FrontendStudioZone.tsx`)
*   **Hardware**: Ultra-wide designer screen, tablet, and smartphone preview mockups.
*   **Details**: Color palette swatch cards and grid board mockups.

### 10. AI/ML Lab (`AiLabZone.tsx`)
*   **Network**: Dodecahedron wireframe neural node graph with vertices spheres and central brain hologram.
*   **Props**: Dataset cubes on desk and metrics terminal.

### 11. Database Pod (`DatabaseZone.tsx`)
*   **Structure**: Segmented database cylinders with glowing spacer rings.
*   **Lines**: Vertical data cable runs and ascending glowing query pulse spheres.

### 12. DevOps Pod (`DevOpsCloudZone.tsx`)
*   **Cloud**: Floating wireframe cloud structure.
*   **Pipeline**: Rail track with an animated build container and build telemetry screens.

### 13. Cybersecurity Pod (`CyberSecurityZone.tsx`)
*   **Security**: Glowing hemisphere shield dome and detailed 3D padlock shackle.
*   **Scan**: Laser scan ring moving vertically, and threat alert warning board.

### 14. Data Viz Pod (`DataVizZone.tsx`)
*   **Charts**: 3D glass bar charts with glowing cores, and a zigzagging neon line graph.

### 15. Mobile Pod (`MobileDevZone.tsx`)
*   **Hardware**: Angled smartphone preview docks running mobile UI mockups.

---

## 6. HUD, Nav, & Content Normalization

*   **Left Dot Nav**: Glassy dot indicators showing section names on hover. Clicking triggers smooth scroll.
*   **Right Details Panel**: Compact transparent sidebar. Supports bottom sheet panel on mobile viewports.
*   **Data Validation Screen**: A pre-generation dashboard where users can review and edit parsed names, headlines, skills, and dates to prevent placeholder data like "Anonymous" from loading into the 3D room.
*   **Skill Parsing**: Automatically normalize, de-duplicate, and filter skill arrays into structured categories (e.g. merge "Node" and "Node.js").
