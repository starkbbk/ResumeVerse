/**
 * Helpers for generating safe, cinematic camera stops in the circular room.
 *
 * Rules enforced everywhere:
 *   - Camera Y clamped to [2.6, 4.5]; never below 2.0 to avoid under-platform shots.
 *   - Target Y clamped to [1.5, 2.4]; never targets the floor.
 *   - Camera always sits between origin and section, looking outward at it,
 *     so screens / hero objects always face the camera.
 */

export const CAMERA_MIN_Y = 2.0;
export const CAMERA_PREFERRED_MIN_Y = 2.6;
export const CAMERA_PREFERRED_MAX_Y = 4.5;
export const TARGET_MIN_Y = 1.5;
export const TARGET_MAX_Y = 2.4;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

interface CameraStop {
  position: [number, number, number];
  lookAt: [number, number, number];
}

/**
 * Build a cinematic camera stop for a section sitting on a circle around the origin.
 *
 * The camera is placed `distance` world units toward the origin from the section,
 * so the section's front face (which is rotated to point at the origin) is
 * directly facing the camera. The camera height (`height`) and target height
 * (`targetHeight`) are clamped to safe ranges automatically.
 *
 * `lateralBias` shifts both the camera and target perpendicular to the
 * camera→section axis so the active object lands a bit left of the screen
 * center (because a 320px overlay is pinned to the right edge in desktop UI).
 */
export function createCameraStop(
  sectionPosition: [number, number, number],
  distance = 5,
  height = 3.2,
  targetHeight = 1.9,
  lateralBias = 0.6,
): CameraStop {
  const [sx, , sz] = sectionPosition;
  const radial = Math.hypot(sx, sz) || 1;
  const dirX = sx / radial; // unit vector from origin → section
  const dirZ = sz / radial;

  // Perpendicular (camera-right) vector in the XZ plane.
  const perpX = -dirZ;
  const perpZ = dirX;

  return {
    position: [
      sx - dirX * distance + perpX * lateralBias,
      clamp(height, CAMERA_PREFERRED_MIN_Y, CAMERA_PREFERRED_MAX_Y),
      sz - dirZ * distance + perpZ * lateralBias,
    ],
    lookAt: [
      sx + perpX * lateralBias,
      clamp(targetHeight, TARGET_MIN_Y, TARGET_MAX_Y),
      sz + perpZ * lateralBias,
    ],
  };
}

/** Suggested per-section camera presets — keeps active hero objects centered. */
export interface SectionStopPreset {
  /** World-unit distance camera sits in front of the section. */
  distance: number;
  /** Camera Y. */
  height: number;
  /** Look-at Y (object center, NOT base). */
  targetHeight: number;
}

export const STOP_PRESETS: Record<string, SectionStopPreset> = {
  // Hero portrait shot — monitor screen center sits ~y=1.5; orb at y=1.95
  profile: { distance: 5.2, height: 3.2, targetHeight: 1.85 },
  // Skill reactor floats at y=2.2 with rings extending to y=4 — pull back & lift
  skills: { distance: 6.0, height: 3.8, targetHeight: 2.2 },
  // Project laptops sit on a desk at y=0.85 — center on the screens (~y=1.2)
  projects: { distance: 5.0, height: 3.0, targetHeight: 1.4 },
  experience: { distance: 5.0, height: 3.0, targetHeight: 1.5 },
  // Diploma frame center at y≈1.7
  education: { distance: 5.2, height: 3.1, targetHeight: 1.8 },
  // Hero trophy ~y=1.2; section label at y=3
  achievements: { distance: 4.8, height: 2.95, targetHeight: 1.4 },
  certifications: { distance: 5.0, height: 3.1, targetHeight: 1.7 },
  // AI lab: neural net at y=1.45, monitor at y≈1.2
  "ai-lab": { distance: 5.4, height: 3.2, targetHeight: 1.7 },
  "frontend-studio": { distance: 5.2, height: 3.0, targetHeight: 1.5 },
  // Server racks span y=0..3 — eye level on the units
  "backend-server": { distance: 5.6, height: 3.5, targetHeight: 1.9 },
  database: { distance: 5.2, height: 3.2, targetHeight: 1.6 },
  "devops-cloud": { distance: 5.2, height: 3.1, targetHeight: 1.6 },
  cybersecurity: { distance: 5.0, height: 3.1, targetHeight: 1.7 },
  mobile: { distance: 4.8, height: 2.9, targetHeight: 1.4 },
  dataviz: { distance: 5.0, height: 3.0, targetHeight: 1.4 },
  // Portal rim at y=1.1, top at y≈2.1 — slight upward look-at
  contact: { distance: 6.2, height: 3.4, targetHeight: 1.5 },
};

/** Overview "hero" shot used for the intro frame. */
export const OVERVIEW_STOP: CameraStop = {
  position: [0, 7.2, 14.0],
  lookAt: [0, 2.5, 0],
};
