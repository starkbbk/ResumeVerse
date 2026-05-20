"use client";

import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedHologramPedestal from "../objects/DetailedHologramPedestal";
import DetailedDatabaseStack from "../objects/DetailedDatabaseStack";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function DatabaseZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  const silos = [
    { x: -0.45, z: -0.25, color: "#fb923c", label: "PRIMARY" },
    { x: 0.45, z: -0.25, color: "#22d3ee", label: "REPLICA" },
    { x: 0, z: 0.4, color: "#a78bfa", label: "ARCHIVE" },
  ];

  return (
    <InteractiveGroup id="database" position={position}>
      <DetailedHologramPedestal accent={accent} scale={1.05} />

      {/* Cluster of database silos */}
      <group ref={groupRef} position={[0, 0.13, 0]}>
        {silos.map((s, i) => (
          <group key={i} position={[s.x, 0, s.z]}>
            <Model
              src="/models/database.glb"
              fallback={
                <DetailedDatabaseStack
                  accent={s.color}
                  label={s.label}
                  segments={3}
                  active={isActive}
                />
              }
            />
          </group>
        ))}

        {/* Connecting energy lines between silos */}
        {silos.map((a, i) => {
          const b = silos[(i + 1) % silos.length];
          const ax = a.x;
          const az = a.z;
          const bx = b.x;
          const bz = b.z;
          const mx = (ax + bx) / 2;
          const mz = (az + bz) / 2;
          const dx = bx - ax;
          const dz = bz - az;
          const dist = Math.hypot(dx, dz);
          const angle = Math.atan2(dz, dx);
          return (
            <mesh
              key={`link-${i}`}
              position={[mx, 0.02, mz]}
              rotation={[0, -angle, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.006, 0.006, dist, 6]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={1.0}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>

      <SectionLabel title="DATABASE STORAGE" accent={accent} position={[0, 2.9, 0]} />
    </InteractiveGroup>
  );
}
