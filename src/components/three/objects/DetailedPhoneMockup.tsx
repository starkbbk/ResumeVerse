"use client";

import { ReactNode, useMemo } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { matAluminum, matEmissive } from "./materials";

interface Props {
  /** HTML rendered inside the phone screen (treat as 9:19.5). */
  screen?: ReactNode;
  accent?: string;
  /** Width of the chassis. */
  width?: number;
  /** Tablet variant (16:10). */
  tablet?: boolean;
  highlighted?: boolean;
}

/**
 * Procedural phone (or tablet) with rounded chassis, notch, side button,
 * camera dot, and a glowing screen surface.
 */
export default function DetailedPhoneMockup({
  screen,
  accent = "#22d3ee",
  width = 0.34,
  tablet = false,
  highlighted = false,
}: Props) {
  const chassis = useMemo(matAluminum, []);
  const led = useMemo(() => matEmissive(accent, 1.4), [accent]);

  const ratio = tablet ? 10 / 16 : 19.5 / 9;
  const height = tablet ? width * (10 / 16) : width * ratio;
  const thickness = 0.022;

  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#040614",
        emissive: new THREE.Color(accent),
        emissiveIntensity: highlighted ? 0.55 : 0.3,
        metalness: 0.55,
        roughness: 0.08,
        transparent: true,
        opacity: 0.97,
      }),
    [accent, highlighted],
  );

  return (
    <group>
      {/* Chassis */}
      <RoundedBox
        args={[width, height, thickness]}
        radius={tablet ? 0.018 : 0.024}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={chassis} attach="material" />
      </RoundedBox>

      {/* Side power button */}
      <mesh position={[width / 2 + 0.005, height * 0.18, 0]}>
        <boxGeometry args={[0.006, 0.05, 0.014]} />
        <primitive object={chassis} attach="material" />
      </mesh>
      {/* Volume buttons */}
      <mesh position={[-width / 2 - 0.005, height * 0.22, 0]}>
        <boxGeometry args={[0.006, 0.06, 0.014]} />
        <primitive object={chassis} attach="material" />
      </mesh>
      <mesh position={[-width / 2 - 0.005, height * 0.13, 0]}>
        <boxGeometry args={[0.006, 0.06, 0.014]} />
        <primitive object={chassis} attach="material" />
      </mesh>

      {/* Screen plate */}
      <mesh position={[0, 0, thickness / 2 + 0.001]}>
        <boxGeometry args={[width * 0.92, height * 0.92, 0.001]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

      {/* Notch / camera */}
      {!tablet && (
        <mesh position={[0, height * 0.42, thickness / 2 + 0.0021]}>
          <boxGeometry args={[width * 0.28, 0.018, 0.0008]} />
          <meshStandardMaterial color="#04060f" roughness={0.4} metalness={0.5} />
        </mesh>
      )}
      {/* Front camera dot */}
      <mesh position={[width * 0.18, height * 0.42, thickness / 2 + 0.003]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshStandardMaterial color="#0a0c1a" metalness={0.5} />
      </mesh>

      {/* Underglow */}
      <mesh position={[0, -height / 2 - 0.012, 0]}>
        <boxGeometry args={[width * 0.6, 0.004, 0.018]} />
        <primitive object={led} attach="material" />
      </mesh>

      {/* HTML content */}
      {screen && (
        <Html
          transform
          position={[0, 0, thickness / 2 + 0.0035]}
          distanceFactor={width * 4.5}
          occlude={false}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="overflow-hidden select-none"
            style={{
              width: `${Math.round(width * 600)}px`,
              height: `${Math.round(height * 600)}px`,
              background: "linear-gradient(180deg, #05070f 0%, #0c1228 100%)",
            }}
          >
            {screen}
          </div>
        </Html>
      )}
    </group>
  );
}
