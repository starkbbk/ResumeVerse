"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { matChassis, matEmissive } from "./materials";

interface Props {
  accent?: string;
  active?: boolean;
  /** Animation cycle duration for the deploy container. */
  cycle?: number;
}

/**
 * Wireframe cloud cluster, container cube traveling along a deployment rail,
 * and a small node graph illustrating regions. Used for the DevOps zone.
 */
export default function DetailedCloudConsole({
  accent = "#60a5fa",
  active = true,
  cycle = 3,
}: Props) {
  const chassis = useMemo(matChassis, []);
  const energy = useMemo(() => matEmissive(accent, 1.6), [accent]);
  const cloudRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    if (cloudRef.current) {
      cloudRef.current.position.y = 0.65 + Math.sin(t * 0.8) * 0.04;
      cloudRef.current.rotation.y += delta * 0.12;
    }
    if (cubeRef.current) {
      const p = ((t % cycle) / cycle) * 2 - 1;
      cubeRef.current.position.x = p * 0.7;
      cubeRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group>
      {/* Cloud cluster (3 spheres with wireframe) */}
      <group ref={cloudRef} position={[0, 0.65, 0]}>
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh position={[0.22, -0.04, 0]}>
          <sphereGeometry args={[0.2, 14, 14]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh position={[-0.22, -0.04, 0]}>
          <sphereGeometry args={[0.2, 14, 14]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Solid inner glow */}
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Deployment rail */}
      <group position={[0, 0.18, 0.18]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 12]} />
          <primitive object={chassis} attach="material" />
        </mesh>
        {/* Rail end caps */}
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.04, 0.05, 0.04]} />
            <primitive object={chassis} attach="material" />
          </mesh>
        ))}
        {/* Container cube */}
        <mesh ref={cubeRef} position={[-0.7, 0.06, 0]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <primitive object={energy} attach="material" />
        </mesh>
        {/* Region badges */}
        <Html
          transform
          position={[-0.85, -0.08, 0]}
          distanceFactor={3.4}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-[6px] font-mono uppercase tracking-widest text-cyan-300/80 whitespace-nowrap">
            us-east-1
          </div>
        </Html>
        <Html
          transform
          position={[0.85, -0.08, 0]}
          distanceFactor={3.4}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-[6px] font-mono uppercase tracking-widest text-cyan-300/80 whitespace-nowrap">
            eu-central
          </div>
        </Html>
      </group>
    </group>
  );
}
