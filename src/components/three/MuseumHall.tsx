"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  accent: string;
  secondary: string;
  /** Sections to draw spotlights / wall panels for. */
  sections: Array<{ id: string; position: [number, number, number]; rotationY?: number }>;
  performanceMode: boolean;
}

/**
 * Realistic-feeling circular museum hall:
 *   - large reflective floor + radial inlay lines
 *   - curved outer wall with vertical neon strips
 *   - per-section wall panels and spotlight pylons
 *   - ceiling ring with light strips
 *
 * Replaces the previous "empty void" look so every section reads as part of
 * a dedicated installation in a portfolio museum.
 */
export default function MuseumHall({
  accent,
  secondary,
  sections,
  performanceMode,
}: Props) {
  const wallSegments = performanceMode ? 28 : 56;
  const radius = 11;
  const height = 5.4;

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#06091a",
        metalness: 0.85,
        roughness: 0.32,
        envMapIntensity: 1.1,
      }),
    [],
  );
  const wallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#080b1c",
        metalness: 0.4,
        roughness: 0.65,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 1.4,
      }),
    [accent],
  );
  const secondaryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: secondary,
        emissive: secondary,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.85,
      }),
    [secondary],
  );

  // Inlay path: curved trail running through every section position.
  const inlayCurve = useMemo(() => {
    if (sections.length < 2) return null;
    const pts = sections.map(
      (s) => new THREE.Vector3(s.position[0] * 0.65, 0.012, s.position[2] * 0.65),
    );
    pts.push(pts[0]);
    return new THREE.CatmullRomCurve3(pts, true);
  }, [sections]);

  return (
    <group>
      {/* Floor: large dark mirror */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[radius, performanceMode ? 32 : 96]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Concentric inlay rings */}
      {[3.5, 6.5, 9.5].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <ringGeometry args={[r, r + 0.04, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.32} />
        </mesh>
      ))}

      {/* Center plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[0, 1.1, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>

      {/* Inlay trail through all sections */}
      {!performanceMode && inlayCurve && (
        <mesh>
          <tubeGeometry args={[inlayCurve, 220, 0.022, 8, true]} />
          <meshBasicMaterial color={accent} transparent opacity={0.45} />
        </mesh>
      )}

      {/* Outer wall (cylinder, inside-facing) */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <cylinderGeometry
          args={[radius + 0.3, radius + 0.3, height, wallSegments, 1, true]}
        />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Vertical wall light strips (every 22.5°) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x = Math.cos(a) * (radius + 0.28);
        const z = Math.sin(a) * (radius + 0.28);
        return (
          <mesh
            key={i}
            position={[x, height / 2, z]}
            rotation={[0, -a + Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.05, height * 0.86, 0.012]} />
            <primitive object={secondaryMat} attach="material" />
          </mesh>
        );
      })}

      {/* Per-section wall panel + spotlight pylon */}
      {sections.map((s) => {
        const ang = Math.atan2(s.position[0], -s.position[2]);
        const x = Math.sin(ang) * (radius - 0.25);
        const z = -Math.cos(ang) * (radius - 0.25);
        return (
          <group key={s.id} position={[x, 0, z]} rotation={[0, ang, 0]}>
            {/* Mounted plaque/panel */}
            <mesh position={[0, 1.7, 0.06]} castShadow>
              <boxGeometry args={[2.0, 2.6, 0.12]} />
              <meshStandardMaterial
                color="#0c1126"
                metalness={0.7}
                roughness={0.45}
              />
            </mesh>
            {/* Inset emissive border */}
            <mesh position={[0, 1.7, 0.13]}>
              <boxGeometry args={[1.8, 2.4, 0.005]} />
              <meshBasicMaterial color={accent} transparent opacity={0.18} />
            </mesh>
            {/* Top accent strip */}
            <mesh position={[0, 2.95, 0.13]}>
              <boxGeometry args={[1.8, 0.04, 0.008]} />
              <primitive object={accentMat} attach="material" />
            </mesh>
            {/* Floor pylon supporting the section */}
            <mesh position={[0, 0.12, 0.6]} castShadow receiveShadow>
              <cylinderGeometry args={[0.05, 0.07, 0.24, 12]} />
              <meshStandardMaterial color="#1a1f33" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Spotlight rim above the panel */}
            <mesh position={[0, 3.25, 0.4]} rotation={[Math.PI / 2.4, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.1, 0.12, 16]} />
              <meshStandardMaterial color="#1a1f33" metalness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* Ceiling ring */}
      {!performanceMode && (
        <group position={[0, height - 0.4, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 0.78, 0.08, 12, 96]} />
            <meshStandardMaterial color="#0c1126" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Inner glowing ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
            <torusGeometry args={[radius * 0.78, 0.024, 8, 96]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
          {/* Radial spokes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh
                key={i}
                rotation={[0, a, 0]}
                position={[Math.cos(a) * radius * 0.4, 0, Math.sin(a) * radius * 0.4]}
              >
                <boxGeometry args={[radius * 0.78, 0.06, 0.06]} />
                <meshStandardMaterial color="#0c1126" metalness={0.9} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
