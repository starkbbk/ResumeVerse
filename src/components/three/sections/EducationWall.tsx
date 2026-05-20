"use client";

import { useContext } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import type { ResumeEducation } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  education: ResumeEducation[];
  accent: string;
}

export default function EducationWall({ position, education, accent }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true;

  // Primary education item (usually degree) and secondary items
  const primaryEd = education[0];
  const secondaryEd = education.slice(1);

  return (
    <InteractiveGroup id="education" position={position} bobble={false}>
      {/* 1. Wood Museum Podium Base */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[2.2, 0.4, 1.1]} />
        <meshStandardMaterial color="#0c0f24" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Golden metallic rim */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[2.16, 0.02, 1.06]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 2. Spotlit Framed Diploma / Certificate */}
      {primaryEd && (
        <group position={[0, 0.95, -0.15]} rotation={[-Math.PI / 18, 0, 0]}>
          {/* Spotlight volumetric cone */}
          <mesh position={[0, 0.6, 0.2]} rotation={[Math.PI / 18, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.7, 1.3, 16, 1, true]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={isActive ? 0.08 : 0.01} side={THREE.DoubleSide} />
          </mesh>

          {/* Wooden Frame */}
          <mesh castShadow>
            <boxGeometry args={[1.05, 0.75, 0.04]} />
            <meshStandardMaterial color="#3c220f" roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Inner Golden border */}
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.97, 0.67, 0.02]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glass Face */}
          <mesh position={[0, 0, 0.022]}>
            <boxGeometry args={[0.93, 0.63, 0.01]} />
            <meshStandardMaterial color="#fff" transparent opacity={0.3} roughness={0.05} />
          </mesh>

          {/* Transformed HTML Certificate */}
          <Html
            transform
            position={[0, 0, 0.03]}
            distanceFactor={2.15}
            style={{ pointerEvents: "none" }}
          >
            <div
              className="w-[190px] h-[120px] p-3 text-center flex flex-col justify-between select-none"
              style={{
                background: "#fcfaf2",
                border: "4px double #d4af37",
                color: "#1e293b",
                opacity: isActive ? 1 : 0.35,
              }}
            >
              <div className="border border-[#d4af37]/20 p-1.5 h-full flex flex-col justify-between">
                <div>
                  <span className="text-[6.5px] uppercase tracking-[0.25em] font-serif text-[#b45309] font-bold block">
                    Diploma of Higher Education
                  </span>
                  <h4 className="text-[10px] font-serif font-bold text-slate-800 mt-1.5 leading-tight line-clamp-1">
                    {primaryEd.degree || "Bachelor of Science"}
                  </h4>
                  <p className="text-[7.5px] font-serif text-slate-500 italic mt-0.5 line-clamp-1">
                    awarded by {primaryEd.institute}
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-[#d4af37]/20 pt-1.5 mt-1 font-serif text-[6.5px] text-slate-600">
                  <span>Score: {primaryEd.score || "Passed"}</span>
                  <span>{primaryEd.duration || "GRADUATE"}</span>
                </div>
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* 3. Stack of Leather-Bound Books */}
      <group position={[-0.65, 0.42, 0.2]}>
        {/* Book 1 (Bottom) - Blue */}
        <mesh castShadow position={[0, 0.03, 0]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.42, 0.06, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0.01, 0.03, 0]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>

        {/* Book 2 (Middle) - Dark Red */}
        <mesh castShadow position={[0.02, 0.085, 0.01]} rotation={[0, -0.06, 0]}>
          <boxGeometry args={[0.38, 0.055, 0.28]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.7} />
        </mesh>
        <mesh position={[0.03, 0.085, 0.01]} rotation={[0, -0.06, 0]}>
          <boxGeometry args={[0.36, 0.045, 0.26]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>

        {/* Book 3 (Top) - Gold/Yellow cover with Graduation Cap on top */}
        <mesh castShadow position={[0.01, 0.13, -0.01]} rotation={[0, 0.04, 0]}>
          <boxGeometry args={[0.34, 0.045, 0.26]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.13, -0.01]} rotation={[0, 0.04, 0]}>
          <boxGeometry args={[0.32, 0.035, 0.24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>

        {/* 4. Graduation Cap resting on top book */}
        <group position={[0.01, 0.15, -0.01]}>
          {/* Cap Skull Base */}
          <mesh castShadow position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          {/* Cap Square Board */}
          <mesh castShadow position={[0, 0.065, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.26, 0.015, 0.26]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          {/* Cap Tassel Line */}
          <mesh position={[0.08, 0.04, 0.08]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.005, 0.005, 0.08, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
      </group>

      {/* 5. Brass Plaque (Secondary Education List) */}
      {secondaryEd.length > 0 && (
        <group position={[0.65, 0.42, 0.2]} rotation={[0, -Math.PI / 12, 0]}>
          {/* Plaque backboard stand */}
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.5, 0.16, 0.22]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Golden Brass Plate */}
          <mesh position={[0, 0.09, 0.11]} rotation={[-Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.46, 0.14, 0.015]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Plaque text */}
          <Html
            transform
            position={[0, 0.15, 0.14]}
            rotation={[-Math.PI / 6, 0, 0]}
            distanceFactor={2.0}
            style={{ pointerEvents: "none" }}
          >
            <div className="w-[86px] text-left font-serif text-[5.5px] text-[#451a03] font-bold select-none leading-normal">
              {secondaryEd.map((ed, idx) => (
                <div key={idx} className="border-b border-[#451a03]/20 pb-1 mb-1 last:border-b-0 last:mb-0 last:pb-0">
                  <p className="truncate font-black">{ed.degree || "Education"}</p>
                  <p className="truncate font-medium italic">{ed.institute}</p>
                </div>
              ))}
            </div>
          </Html>
        </group>
      )}

      <SectionLabel title="ACADEMIC STUDY" accent={accent} position={[0, 2.4, 0]} />
    </InteractiveGroup>
  );
}
