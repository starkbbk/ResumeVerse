"use client";

import { ReactNode, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { matChassis, matAluminum, matEmissive } from "./materials";

interface Props {
  /** Number of 1U server units stacked inside the rack. */
  units?: number;
  /** LED + status accent color. */
  accent?: string;
  /** Optional title text on a top panel. */
  label?: string;
  /** Render a small terminal screen on the side door. */
  terminalScreen?: ReactNode;
  /** Activate blinking animation. */
  active?: boolean;
}

/**
 * Server rack:
 *   - tall rounded chassis with side vents
 *   - title panel on top
 *   - N 1U server units with grills, handles, drive bays, blinking LEDs
 *   - cable bundle exiting the back
 *   - optional side terminal screen
 */
export default function DetailedServerRack({
  units = 6,
  accent = "#34d399",
  label = "RESUME-DC-01",
  terminalScreen,
  active = true,
}: Props) {
  const chassis = useMemo(matChassis, []);
  const aluminum = useMemo(matAluminum, []);
  const ledMat = useMemo(() => matEmissive(accent, 1.6), [accent]);

  const rackW = 0.7;
  const rackH = 1.85;
  const rackD = 0.5;
  const unitH = 0.18;
  const unitGap = 0.02;
  const totalUnitsH = units * unitH + (units - 1) * unitGap;
  const startY = rackH * 0.5 - 0.18 - totalUnitsH / 2 + unitH / 2;

  const ledRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    ledRefs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.abs(Math.sin(t * 4 + i * 0.7)) * 1.4;
    });
  });

  return (
    <group>
      {/* Floor pad */}
      <mesh position={[0, -rackH / 2 - 0.012, 0]} receiveShadow>
        <boxGeometry args={[rackW * 1.2, 0.024, rackD * 1.2]} />
        <primitive object={aluminum} attach="material" />
      </mesh>

      {/* Outer chassis */}
      <RoundedBox args={[rackW, rackH, rackD]} radius={0.018} smoothness={4} castShadow receiveShadow>
        <primitive object={chassis} attach="material" />
      </RoundedBox>

      {/* Side vent slats */}
      {[-1, 1].map((sx) =>
        Array.from({ length: 22 }).map((_, i) => (
          <mesh
            key={`vent-${sx}-${i}`}
            position={[sx * (rackW / 2 + 0.001), -rackH / 2 + 0.16 + i * 0.07, 0]}
          >
            <boxGeometry args={[0.002, 0.012, rackD * 0.7]} />
            <meshStandardMaterial color="#04060f" />
          </mesh>
        )),
      )}

      {/* Top panel with title */}
      <mesh position={[0, rackH / 2 - 0.07, rackD / 2 + 0.002]}>
        <boxGeometry args={[rackW * 0.86, 0.08, 0.005]} />
        <primitive object={aluminum} attach="material" />
      </mesh>
      <Html
        transform
        position={[0, rackH / 2 - 0.07, rackD / 2 + 0.006]}
        distanceFactor={3}
        style={{ pointerEvents: "none" }}
      >
        <div className="text-[7px] font-mono uppercase tracking-[0.3em] text-cyan-300 font-bold whitespace-nowrap">
          {label}
        </div>
      </Html>

      {/* Server units */}
      {Array.from({ length: units }).map((_, i) => {
        const y = startY + i * (unitH + unitGap);
        return (
          <group key={i} position={[0, y, rackD / 2 + 0.001]}>
            {/* Front face */}
            <mesh>
              <boxGeometry args={[rackW * 0.94, unitH, 0.01]} />
              <meshStandardMaterial color="#161a2c" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Drive bays */}
            {Array.from({ length: 4 }).map((_, j) => (
              <mesh
                key={j}
                position={[-rackW * 0.32 + j * 0.085, 0, 0.006]}
              >
                <boxGeometry args={[0.07, unitH * 0.62, 0.002]} />
                <meshStandardMaterial color="#0a0d18" metalness={0.5} roughness={0.6} />
              </mesh>
            ))}
            {/* Grille slats */}
            <mesh position={[rackW * 0.18, 0, 0.006]}>
              <boxGeometry args={[0.18, unitH * 0.62, 0.001]} />
              <meshStandardMaterial color="#04060f" />
            </mesh>
            {Array.from({ length: 7 }).map((_, k) => (
              <mesh
                key={k}
                position={[rackW * 0.18, -unitH * 0.26 + k * (unitH * 0.09), 0.0072]}
              >
                <boxGeometry args={[0.16, 0.004, 0.0005]} />
                <meshStandardMaterial color="#0c1228" />
              </mesh>
            ))}
            {/* Side handles */}
            {[-1, 1].map((sx) => (
              <mesh
                key={sx}
                position={[sx * (rackW * 0.42), 0, 0.008]}
              >
                <boxGeometry args={[0.014, unitH * 0.5, 0.018]} />
                <primitive object={aluminum} attach="material" />
              </mesh>
            ))}
            {/* Power/network LEDs */}
            <mesh
              ref={(el) => {
                if (el) ledRefs.current[i * 2] = el;
              }}
              position={[rackW * 0.34, unitH * 0.28, 0.008]}
            >
              <sphereGeometry args={[0.006, 8, 8]} />
              <primitive object={ledMat} attach="material" />
            </mesh>
            <mesh
              ref={(el) => {
                if (el) ledRefs.current[i * 2 + 1] = el;
              }}
              position={[rackW * 0.34, unitH * 0.08, 0.008]}
            >
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Cable bundle out the back */}
      <group position={[rackW / 2 - 0.05, -rackH / 2 + 0.15, -rackD / 2 - 0.02]}>
        {[
          ["#1f2937", -0.02, 0],
          ["#0ea5e9", 0, 0.02],
          ["#a78bfa", 0.02, -0.02],
          ["#ef4444", -0.04, -0.04],
        ].map(([c, ox, oz], i) => (
          <mesh
            key={i}
            position={[ox as number, 0, oz as number]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
            <meshStandardMaterial color={c as string} metalness={0.4} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Side terminal screen */}
      {terminalScreen && (
        <group position={[rackW / 2 + 0.001, 0.1, rackD * 0.18]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.36, 0.22, 0.005]} />
            <meshStandardMaterial
              color="#04060f"
              emissive={accent}
              emissiveIntensity={0.25}
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>
          <Html
            transform
            position={[0, 0, 0.004]}
            distanceFactor={1.2}
            style={{ pointerEvents: "none" }}
          >
            <div
              className="font-mono text-[5.5px] text-emerald-300 leading-snug select-none"
              style={{ width: "92px", height: "60px", padding: "5px" }}
            >
              {terminalScreen}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
