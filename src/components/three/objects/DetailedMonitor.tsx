"use client";

import { ReactNode, useMemo } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { matAluminum, matBlackPlastic, matEmissive } from "./materials";

interface Props {
  /** HTML rendered inside the screen plane. Treat the area as 16:9. */
  screen?: ReactNode;
  /** Glow + status LED color. */
  accent?: string;
  /** Width of the screen in world units. Stand and base scale with it. */
  width?: number;
  /** Optional flag to bias emissive intensity when section is active. */
  highlighted?: boolean;
  /** If true, renders an ultrawide 21:9 screen. */
  ultrawide?: boolean;
  /** Pull the monitor slightly forward so the screen faces the camera. */
  pivot?: number;
}

/**
 * Multi-part desk monitor:
 *   - thin bezel screen frame
 *   - vertical neck stand
 *   - flat oval base
 *   - glowing display with HTML content
 *
 * 21:9 mode rebuilds the geometry as a wider ultrawide panel for the
 * Frontend Studio.
 */
export default function DetailedMonitor({
  screen,
  accent = "#22d3ee",
  width = 1.0,
  highlighted = false,
  ultrawide = false,
  pivot = 0,
}: Props) {
  const chassis = useMemo(matAluminum, []);
  const black = useMemo(matBlackPlastic, []);
  const led = useMemo(() => matEmissive(accent, 1.6), [accent]);

  const aspect = ultrawide ? 9 / 21 : 9 / 16;
  const screenW = width;
  const screenH = width * aspect;
  const frameDepth = 0.04;

  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#04060f",
        emissive: new THREE.Color(accent),
        emissiveIntensity: highlighted ? 0.55 : 0.3,
        metalness: 0.6,
        roughness: 0.08,
        transparent: true,
        opacity: 0.97,
      }),
    [accent, highlighted],
  );

  // Base sits on the table at y=0; screen center is up by stand + half-screen.
  const standH = screenH * 0.45;
  const baseH = 0.024;
  const baseY = baseH / 2;
  const standY = baseH + standH / 2;
  const screenY = baseH + standH + screenH / 2;

  return (
    <group rotation={[pivot, 0, 0]}>
      {/* Base */}
      <mesh position={[0, baseY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[width * 0.22, width * 0.26, baseH, 32]} />
        <primitive object={chassis} attach="material" />
      </mesh>
      <mesh position={[0, baseY + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[width * 0.18, width * 0.21, 32]} />
        <primitive object={led} attach="material" />
      </mesh>

      {/* Neck stand */}
      <mesh position={[0, standY, 0]} castShadow>
        <boxGeometry args={[width * 0.07, standH, width * 0.04]} />
        <primitive object={chassis} attach="material" />
      </mesh>

      {/* Frame */}
      <RoundedBox
        args={[screenW, screenH, frameDepth]}
        radius={0.015}
        smoothness={4}
        position={[0, screenY, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={chassis} attach="material" />
      </RoundedBox>

      {/* Bezel — slightly inset darker face */}
      <mesh position={[0, screenY, frameDepth / 2 + 0.002]}>
        <boxGeometry args={[screenW * 0.97, screenH * 0.93, 0.001]} />
        <primitive object={black} attach="material" />
      </mesh>

      {/* Glowing screen */}
      <mesh position={[0, screenY, frameDepth / 2 + 0.0035]}>
        <boxGeometry args={[screenW * 0.94, screenH * 0.88, 0.001]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

      {/* Status LED bottom-right */}
      <mesh position={[screenW * 0.4, screenY - screenH * 0.43, frameDepth / 2 + 0.0048]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <primitive object={led} attach="material" />
      </mesh>

      {/* Screen HTML content */}
      {screen && (
        <Html
          transform
          position={[0, screenY, frameDepth / 2 + 0.0055]}
          distanceFactor={width * 1.6}
          occlude={false}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="rounded-sm overflow-hidden select-none"
            style={{
              width: `${Math.round(screenW * 240)}px`,
              height: `${Math.round(screenH * 240)}px`,
              background: "linear-gradient(135deg, #05070f 0%, #0c1228 60%, #050714 100%)",
            }}
          >
            {screen}
          </div>
        </Html>
      )}
    </group>
  );
}
