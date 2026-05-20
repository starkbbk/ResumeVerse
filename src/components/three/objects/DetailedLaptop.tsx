"use client";

import { ReactNode, useMemo } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import {
  matAluminum,
  matBlackPlastic,
  matEmissive,
  matKeycap,
} from "./materials";

interface Props {
  /** HTML content to render on the screen. Use a 16:10 element. */
  screen?: ReactNode;
  /** Optional brand label below the hinge. */
  label?: string;
  /** Accent color for the underglow + status LED. */
  accent?: string;
  /** Slight visual emphasis when this laptop is the active focus. */
  highlighted?: boolean;
  /** Dimensions: width (chassis) × thickness × depth, both halves combined. */
  width?: number;
  /** Tilt of the lid in radians (0 = closed, ~0.5 = ~28°). */
  lidTilt?: number;
}

/**
 * Multi-part procedural laptop:
 *   - rounded chassis (base) with thickness
 *   - keyboard grid (12×4 keycaps) and trackpad
 *   - hinge cylinder
 *   - lid with bezeled screen + glowing display
 *   - underglow strip
 *
 * All meshes use `meshStandardMaterial` so they respect scene lighting,
 * shadows, and the parent `InteractiveGroup` opacity dimming.
 */
export default function DetailedLaptop({
  screen,
  label,
  accent = "#22d3ee",
  highlighted = false,
  width = 1.05,
  lidTilt = 0.46,
}: Props) {
  const chassis = useMemo(matAluminum, []);
  const black = useMemo(matBlackPlastic, []);
  const keycap = useMemo(matKeycap, []);
  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#040614",
        emissive: new THREE.Color(accent),
        emissiveIntensity: highlighted ? 0.55 : 0.32,
        metalness: 0.6,
        roughness: 0.08,
        transparent: true,
        opacity: 0.97,
      }),
    [accent, highlighted],
  );
  const ledMat = useMemo(() => matEmissive(accent, 1.6), [accent]);

  const depth = width * 0.7;
  const baseH = 0.06;
  const lidH = 0.05;
  const screenW = width * 0.92;
  const screenD = depth * 0.86;

  // 12×4 keycap grid metrics
  const cols = 12;
  const rows = 4;
  const keyAreaW = width * 0.82;
  const keyAreaD = depth * 0.46;
  const keyW = keyAreaW / cols - 0.012;
  const keyD = keyAreaD / rows - 0.012;
  const keys = [] as JSX.Element[];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -keyAreaW / 2 + (c + 0.5) * (keyAreaW / cols);
      const z = -keyAreaD / 2 + (r + 0.5) * (keyAreaD / rows) + depth * 0.06;
      keys.push(
        <mesh key={`${r}-${c}`} position={[x, baseH / 2 + 0.011, z]}>
          <boxGeometry args={[keyW, 0.012, keyD]} />
          <primitive object={keycap} attach="material" />
        </mesh>,
      );
    }
  }

  return (
    <group>
      {/* Underglow strip — projected just below the chassis */}
      <mesh position={[0, -baseH / 2 + 0.005, 0]}>
        <boxGeometry args={[width * 0.96, 0.004, depth * 0.92]} />
        <primitive object={ledMat} attach="material" />
      </mesh>

      {/* Chassis: rounded base */}
      <RoundedBox
        args={[width, baseH, depth]}
        radius={0.018}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={chassis} attach="material" />
      </RoundedBox>

      {/* Recessed deck (inset on top of chassis) */}
      <mesh position={[0, baseH / 2 + 0.001, depth * 0.04]} receiveShadow>
        <boxGeometry args={[width * 0.92, 0.004, depth * 0.84]} />
        <primitive object={black} attach="material" />
      </mesh>

      {/* Keyboard grid */}
      {keys}

      {/* Trackpad */}
      <mesh position={[0, baseH / 2 + 0.012, -depth * 0.22]}>
        <boxGeometry args={[width * 0.32, 0.005, depth * 0.22]} />
        <meshStandardMaterial color="#1f2540" metalness={0.55} roughness={0.35} />
      </mesh>
      {/* Trackpad inner border highlight */}
      <mesh position={[0, baseH / 2 + 0.0145, -depth * 0.22]}>
        <boxGeometry args={[width * 0.32, 0.001, depth * 0.22]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>

      {/* Brand label — small etched dot below the hinge if provided */}
      {label && (
        <Html
          transform
          position={[0, baseH / 2 + 0.0021, depth * 0.36]}
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <span className="font-mono text-[8px] tracking-widest uppercase text-white/35 select-none">
            {label}
          </span>
        </Html>
      )}

      {/* Hinge — small cylinder along the back */}
      <mesh
        position={[0, baseH / 2, -depth / 2 + 0.015]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.014, 0.014, width * 0.96, 16]} />
        <meshStandardMaterial color="#23283f" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Lid — pivot from the hinge */}
      <group position={[0, baseH / 2 + 0.014, -depth / 2 + 0.015]} rotation={[-lidTilt, 0, 0]}>
        {/* Lid back panel */}
        <RoundedBox
          args={[width, lidH, depth]}
          radius={0.018}
          smoothness={4}
          position={[0, lidH / 2, depth / 2]}
          castShadow
          receiveShadow
        >
          <primitive object={chassis} attach="material" />
        </RoundedBox>

        {/* Bezel */}
        <mesh position={[0, lidH / 2, depth / 2 + lidH / 2 + 0.002]}>
          <boxGeometry args={[width * 0.96, 0.002, depth * 0.92]} />
          <primitive object={black} attach="material" />
        </mesh>

        {/* Glowing screen */}
        <mesh position={[0, lidH / 2, depth / 2 + lidH / 2 + 0.0035]}>
          <boxGeometry args={[screenW, 0.001, screenD]} />
          <primitive object={screenMat} attach="material" />
        </mesh>

        {/* Webcam dot */}
        <mesh position={[0, lidH / 2 + screenD / 2 + 0.012, depth / 2 + lidH / 2 + 0.0042]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshStandardMaterial color="#0a0c1a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Status LED */}
        <mesh position={[width * 0.42, lidH / 2 - screenD / 2 - 0.02, depth / 2 + lidH / 2 + 0.0042]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <primitive object={ledMat} attach="material" />
        </mesh>

        {/* Screen content (rendered at 1:1 inside the screen rectangle) */}
        {screen && (
          <Html
            transform
            position={[0, lidH / 2, depth / 2 + lidH / 2 + 0.005]}
            rotation={[0, 0, 0]}
            distanceFactor={width * 1.55}
            occlude={false}
            style={{ pointerEvents: "auto" }}
          >
            <div
              className="rounded-sm overflow-hidden select-none"
              style={{
                width: `${Math.round(screenW * 220)}px`,
                height: `${Math.round(screenD * 220)}px`,
                background: "linear-gradient(135deg, #05070f 0%, #0c1228 60%, #050714 100%)",
              }}
            >
              {screen}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
