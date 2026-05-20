"use client";

import InteractiveGroup from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedDiplomaFrame from "../objects/DetailedDiplomaFrame";
import DetailedBookStack from "../objects/DetailedBookStack";
import DetailedGraduationCap from "../objects/DetailedGraduationCap";
import Model from "@/components/3d/Model";
import { Html } from "@react-three/drei";
import type { ResumeEducation } from "@/lib/resumeSchema";

interface Props {
  position: [number, number, number];
  education: ResumeEducation[];
  accent: string;
}

/**
 * Academic museum display: thick desk with framed diploma standing tall in
 * the center, leather book stack with mortarboard on top to one side, and
 * a brass plaque listing additional degrees on the other.
 */
export default function EducationWall({ position, education, accent }: Props) {
  const primary = education[0];
  const secondary = education.slice(1);

  return (
    <InteractiveGroup id="education" position={position} bobble={false}>
      {/* Display desk */}
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.8} depth={1.2} accent={accent} />} />

      {/* Framed diploma standing on the desk */}
      {primary && (
        <group position={[0, 1.7, 0.0]} rotation={[-Math.PI / 26, 0, 0]}>
          <Model
            src="/models/diploma-frame.glb"
            fallback={
              <DetailedDiplomaFrame
                title={primary.degree}
                institute={primary.institute}
                duration={primary.duration}
                score={primary.score}
                width={1.05}
                accent={accent}
              />
            }
          />
        </group>
      )}

      {/* Book stack with graduation cap on top, left of diploma */}
      <group position={[-1.0, 0.89, 0.18]}>
        <Model src="/models/books.glb" fallback={<DetailedBookStack />} />
        <group position={[0.02, 0.18, 0]}>
          <Model src="/models/graduation-cap.glb" fallback={<DetailedGraduationCap />} />
        </group>
      </group>

      {/* Brass plaque with secondary education on the right */}
      {secondary.length > 0 && (
        <group position={[1.0, 0.89, 0.15]} rotation={[0, -Math.PI / 14, 0]}>
          <mesh castShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[0.7, 0.44, 0.05]} />
            <meshStandardMaterial color="#1f2937" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.22, 0.027]}>
            <boxGeometry args={[0.62, 0.36, 0.005]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.18} />
          </mesh>
          <Html
            transform
            position={[0, 0.22, 0.032]}
            distanceFactor={1.55}
            style={{ pointerEvents: "none" }}
          >
            <div
              className="font-serif text-[6.5px] text-amber-900 select-none px-2 py-1.5"
              style={{ width: "120px", height: "70px" }}
            >
              <div className="text-center text-[6px] uppercase tracking-[0.3em] font-bold border-b border-amber-900/30 pb-1 mb-1.5">
                Additional Studies
              </div>
              {secondary.slice(0, 3).map((ed, idx) => (
                <div
                  key={idx}
                  className="leading-snug border-b border-amber-900/10 pb-0.5 mb-0.5 last:border-0 last:mb-0"
                >
                  <div className="font-black truncate">{ed.degree || "Education"}</div>
                  <div className="italic opacity-80 truncate">{ed.institute}</div>
                </div>
              ))}
            </div>
          </Html>
        </group>
      )}

      <SectionLabel title="ACADEMIC STUDY" accent={accent} position={[0, 3.2, 0]} />
    </InteractiveGroup>
  );
}
