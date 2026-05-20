"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { matAluminum, matEmissive } from "./materials";

interface Props {
  accent?: string;
  secondary?: string;
  active?: boolean;
}

/**
 * Thick metallic portal gate:
 *   - chunky outer rim with inset bolts
 *   - inner energy field disc + animated swirl
 *   - particle stream flowing toward the camera
 *   - platform/stairs at the base
 */
export default function DetailedPortalGate({
  accent = "#22d3ee",
  secondary = "#a78bfa",
  active = true,
}: Props) {
  const aluminum = useMemo(matAluminum, []);
  const dark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0c1126",
        metalness: 0.85,
        roughness: 0.3,
      }),
    [],
  );
  const energyA = useMemo(() => matEmissive(accent, 1.6), [accent]);
  const energyB = useMemo(() => matEmissive(secondary, 1.4), [secondary]);

  const swirlRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Build particle stream attribute buffer once.
  const particles = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.05 + Math.random() * 0.6;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 1.1 + Math.sin(a) * r;
      arr[i * 3 + 2] = -Math.random() * 1.6;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (active && swirlRef.current) {
      swirlRef.current.rotation.z += delta * 1.5;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.4;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= delta * 0.7;
    if (active && particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 2] += delta * 0.6;
        if (arr[i + 2] > 1.5) {
          arr[i + 2] = -1.6;
          const r = 0.05 + Math.random() * 0.6;
          const a = Math.random() * Math.PI * 2;
          arr[i] = Math.cos(a) * r;
          arr[i + 1] = 1.1 + Math.sin(a) * r;
        }
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Stair platform */}
      <mesh position={[0, 0.04, 0.45]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 0.55]} />
        <primitive object={dark} attach="material" />
      </mesh>
      <mesh position={[0, 0.13, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.08, 0.45]} />
        <primitive object={dark} attach="material" />
      </mesh>
      {/* Stair edge glow */}
      <mesh position={[0, 0.085, 0.7]}>
        <boxGeometry args={[1.6, 0.005, 0.005]} />
        <primitive object={energyA} attach="material" />
      </mesh>
      <mesh position={[0, 0.175, 0.6]}>
        <boxGeometry args={[1.4, 0.005, 0.005]} />
        <primitive object={energyA} attach="material" />
      </mesh>

      {/* Outer rim (thick chunky torus) */}
      <mesh ref={ringRef} position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[0.85, 0.09, 24, 64]} />
        <primitive object={aluminum} attach="material" />
      </mesh>
      {/* Inset dark groove on rim */}
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[0.85, 0.04, 16, 64]} />
        <primitive object={dark} attach="material" />
      </mesh>
      {/* Bolts around rim */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.85, 1.1 + Math.sin(a) * 0.85, 0.085]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.006, 12]} />
            <meshStandardMaterial color="#cdd2dc" metalness={0.95} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Inner accent ring */}
      <mesh ref={innerRingRef} position={[0, 1.1, 0.005]}>
        <torusGeometry args={[0.7, 0.025, 16, 64]} />
        <primitive object={energyB} attach="material" />
      </mesh>

      {/* Energy field disc */}
      <mesh position={[0, 1.1, -0.04]}>
        <circleGeometry args={[0.78, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>

      {/* Energy swirl plate (animated) */}
      <mesh ref={swirlRef} position={[0, 1.1, -0.02]}>
        <ringGeometry args={[0.32, 0.66, 64, 1, 0, Math.PI * 1.4]} />
        <meshBasicMaterial color={secondary} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright core */}
      <mesh position={[0, 1.1, 0.02]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>

      {/* Particle stream (incoming toward camera) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={accent}
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
