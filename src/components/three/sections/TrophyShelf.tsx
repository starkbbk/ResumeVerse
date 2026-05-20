"use client";

import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedTrophy from "../objects/DetailedTrophy";
import DetailedMedal from "../objects/DetailedMedal";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  count: number;
  accent: string;
}

/**
 * Trophy display: showcase desk with a hero gold trophy in the center,
 * silver trophy + medal flanking, and decorative spotlight halos on the
 * desk surface.
 */
export default function TrophyShelf({ position, count, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const heroRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (heroRef.current) {
      heroRef.current.rotation.y += delta * 0.35;
      heroRef.current.position.y =
        0.89 + Math.sin(state.clock.elapsedTime * 1.6) * 0.02;
    }
  });

  return (
    <InteractiveGroup id="achievements" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.6} depth={1.1} accent="#facc15" />} />

      {/* Spotlight halos on the desk top */}
      <mesh position={[0, 0.897, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.36, 32]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.18} />
      </mesh>
      <mesh position={[-0.85, 0.897, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.22, 32]} />
        <meshBasicMaterial color="#cbd5f5" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0.85, 0.897, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.22, 32]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.18} />
      </mesh>

      {/* Center hero trophy */}
      <group ref={heroRef} position={[0, 0.89, 0]}>
        <Model
          src="/models/trophy.glb"
          fallback={
            <DetailedTrophy
              metal="gold"
              accent="#facc15"
              plaque="HONOR"
              subtitle={`${count} achievements`}
              scale={isActive ? 1.05 : 1}
            />
          }
        />
      </group>

      {/* Silver trophy left */}
      <group position={[-0.85, 0.89, 0.05]} rotation={[0, Math.PI / 12, 0]}>
        <Model
          src="/models/trophy.glb"
          fallback={
            <DetailedTrophy
              metal="silver"
              accent="#cbd5f5"
              plaque="MERIT"
              scale={0.7}
            />
          }
        />
      </group>

      {/* Hanging medal right */}
      <group position={[0.85, 1.4, 0.1]} rotation={[0, -Math.PI / 12, 0]}>
        <Model
          src="/models/medal.glb"
          fallback={<DetailedMedal metal="gold" label="AWARD" />}
        />
      </group>

      <SectionLabel
        title="RECOGNITION"
        subtitle={`${count}`}
        accent={accent}
        position={[0, 3.0, 0]}
      />
    </InteractiveGroup>
  );
}
