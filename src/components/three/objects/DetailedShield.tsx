"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { matChassis, matEmissive, matGold, matSilver } from "./materials";

interface Props {
  accent?: string;
  /** Animate dome rotation + scan line. */
  active?: boolean;
}

/**
 * Cybersecurity shield emblem:
 *   - hex-pattern dome behind a heraldic shield body
 *   - 3D padlock at the center (body + shackle + keyhole)
 *   - rotating outer ring + bottom scan plate
 */
export default function DetailedShield({
  accent = "#ef4444",
  active = true,
}: Props) {
  const chassis = useMemo(matChassis, []);
  const lockBody = useMemo(matGold, []);
  const shackle = useMemo(matSilver, []);
  const energyMat = useMemo(() => matEmissive(accent, 1.2), [accent]);

  const domeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lockRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    if (domeRef.current) domeRef.current.rotation.y += delta * 0.25;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.5;
    if (lockRef.current) {
      lockRef.current.position.y = 0.05 + Math.sin(t * 1.6) * 0.02;
      lockRef.current.rotation.y = Math.sin(t * 0.6) * 0.15;
    }
    if (scanRef.current) {
      scanRef.current.position.y = -0.18 + Math.abs(Math.sin(t * 1.8)) * 0.36;
    }
  });

  return (
    <group>
      {/* Energy hex dome (wireframe) */}
      <mesh ref={domeRef} position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Solid heraldic shield body (extruded shape) */}
      <group>
        <mesh castShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.05, 16]} />
          <primitive object={chassis} attach="material" />
        </mesh>
        <mesh castShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[0.32, 0.22, 0.05]} />
          <primitive object={chassis} attach="material" />
        </mesh>
        {/* Trim glow border */}
        <mesh position={[0, 0.18, 0.027]}>
          <boxGeometry args={[0.34, 0.24, 0.005]} />
          <primitive object={energyMat} attach="material" />
        </mesh>
      </group>

      {/* Padlock */}
      <group ref={lockRef} position={[0, 0.18, 0.04]}>
        {/* Body */}
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.1, 0.04]} />
          <primitive object={lockBody} attach="material" />
        </mesh>
        {/* Shackle */}
        <mesh position={[0, 0.075, 0]}>
          <torusGeometry args={[0.045, 0.012, 12, 16, Math.PI]} />
          <primitive object={shackle} attach="material" />
        </mesh>
        {/* Keyhole circle */}
        <mesh position={[0, 0, 0.022]}>
          <cylinderGeometry args={[0.012, 0.012, 0.005, 16]} />
          <meshStandardMaterial color="#04060f" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Keyhole slot */}
        <mesh position={[0, -0.022, 0.022]}>
          <boxGeometry args={[0.008, 0.034, 0.005]} />
          <meshStandardMaterial color="#04060f" />
        </mesh>
      </group>

      {/* Rotating perimeter ring */}
      <mesh ref={ringRef} position={[0, 0.18, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.008, 8, 64]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Bottom scan plate (animates up & down) */}
      <mesh ref={scanRef} position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.34, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
