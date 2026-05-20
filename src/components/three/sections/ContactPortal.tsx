"use client";

import { useRef, useMemo, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Mail, Github, Linkedin, Globe } from "lucide-react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function ContactPortal({ position, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // Generate 25 local particle positions and speeds
  const particleData = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3 + 1.25,
        Math.random() * 3 + 1.0 // Start in front of portal
      ),
      speed: 0.6 + Math.random() * 1.0,
      randomOffset: Math.random() * 100,
    }));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Rotate portal arches in opposite directions
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.45;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.7;

    // Animate local particle vortex flowing into the center [0, 1.25, 0]
    if (particlesRef.current && isActive) {
      particlesRef.current.children.forEach((child, idx) => {
        const data = particleData[idx];
        const target = new THREE.Vector3(0, 1.25, 0);

        // Calculate direction to center
        const dir = new THREE.Vector3().subVectors(target, child.position).normalize();
        child.position.addScaledVector(dir, data.speed * delta);

        // Add helical/spiraling motion
        const angle = time * 2.0 + data.randomOffset;
        child.position.x += Math.sin(angle) * 0.006;
        child.position.y += Math.cos(angle) * 0.006;

        // Reset particle if it gets too close to the portal center
        if (child.position.distanceTo(target) < 0.2) {
          child.position.set(
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 2.5 + 1.25,
            Math.random() * 2.0 + 1.8
          );
        }
      });
    }
  });

  return (
    <InteractiveGroup id="contact" position={position} bobble={false}>
      {/* 1. Portal Pedestal Base */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.3, 1.4, 0.1, 32]} />
        <meshStandardMaterial color="#0b0e21" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.015, 8, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>

      {/* 2. Concentric Neon Portal Rings */}
      <group position={[0, 1.25, 0]}>
        {/* Outer Ring */}
        <mesh ref={ring1Ref} castShadow>
          <torusGeometry args={[0.95, 0.06, 12, 64]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={isActive ? 1.6 : 0.4} />
        </mesh>
        {/* Inner Ring */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.78, 0.03, 12, 64]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={isActive ? 1.2 : 0.3} />
        </mesh>
        {/* Portal Core Event Horizon (semi-transparent glowing disk) */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.75, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={isActive ? 0.28 : 0.05} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. Volumetric Flow Particles (Vortex) */}
      <group ref={particlesRef}>
        {particleData.map((data, idx) => (
          <mesh key={idx} position={data.pos.toArray() as [number, number, number]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? "#22d3ee" : accent} transparent opacity={isActive ? 0.8 : 0.1} />
          </mesh>
        ))}
      </group>

      {/* 4. Satellite Contact Buttons (Interactive HTML chips) */}
      <group position={[0, 1.25, 0.15]}>
        <Html transform position={[-1.4, 0.4, 0]} distanceFactor={4.5} style={{ pointerEvents: "auto" }}>
          <div className="flex flex-col items-end gap-3">
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-cyan-300 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              Gateway Alpha
            </span>
          </div>
        </Html>
        <Html transform position={[1.4, 0.4, 0]} distanceFactor={4.5} style={{ pointerEvents: "none" }}>
          <div className="flex flex-col items-start gap-3">
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-cyan-300 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              Gateway Beta
            </span>
          </div>
        </Html>
      </group>

      <SectionLabel title="CONTACT PORTAL" accent={accent} position={[0, 2.45, 0]} />
    </InteractiveGroup>
  );
}
