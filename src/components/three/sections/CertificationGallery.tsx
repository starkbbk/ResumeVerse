"use client";

import { useContext } from "react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedDiplomaFrame from "../objects/DetailedDiplomaFrame";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  certifications: string[];
  accent: string;
}

/**
 * Three certification stands: each holds a smaller diploma frame at an angle
 * so the camera can read all three at once. Built on a single display desk.
 */
export default function CertificationGallery({ position, certifications, accent }: Props) {
  const display = certifications.slice(0, 3);
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  const stands = [
    { x: -0.85, z: 0.15, rotY: Math.PI / 14 },
    { x: 0, z: -0.05, rotY: 0 },
    { x: 0.85, z: 0.15, rotY: -Math.PI / 14 },
  ];

  return (
    <InteractiveGroup id="certifications" position={position} bobble={false}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={3.0} depth={1.2} accent={accent} />} />

      {display.map((c, i) => {
        const stand = stands[i] || stands[0];
        return (
          <group key={i} position={[stand.x, 0.89, stand.z]} rotation={[0, stand.rotY, 0]}>
            {/* Stand pillar */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.14, 0.18, 0.08, 24]} />
              <meshStandardMaterial color="#1a1f33" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.04, 0.7, 0.04]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.25} />
            </mesh>

            {/* Diploma frame leaning slightly back */}
            <group position={[0, 0.95, 0]} rotation={[-Math.PI / 12, 0, 0]}>
              <Model
                src="/models/diploma-frame.glb"
                fallback={
                  <DetailedDiplomaFrame
                    title={c}
                    width={0.74}
                    accent={accent}
                    body={
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="text-[6px] uppercase tracking-[0.3em] font-bold text-amber-700">
                            Certificate of Achievement
                          </div>
                          <div className="w-10 h-px bg-amber-700/30 mx-auto mt-1.5" />
                          <div className="text-[8.5px] font-bold mt-2 leading-tight line-clamp-3">
                            {c}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[6px] border-t border-amber-700/30 pt-1">
                          <span className="font-bold">VERIFIED</span>
                          <span className="opacity-70">ID #{(i + 1) * 421}</span>
                        </div>
                      </div>
                    }
                  />
                }
              />
            </group>
          </group>
        );
      })}

      <SectionLabel
        title="CREDENTIALS"
        subtitle={`${certifications.length}`}
        accent={accent}
        position={[0, 2.5, 0]}
      />
    </InteractiveGroup>
  );
}
