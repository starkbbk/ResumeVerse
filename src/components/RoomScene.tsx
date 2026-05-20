"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/lib/store";
import Floor from "./three/Floor";
import Particles from "./three/Particles";
import ProfileWall from "./three/sections/ProfileWall";
import SkillHologram from "./three/sections/SkillHologram";
import ProjectZone from "./three/sections/ProjectZone";
import ExperienceWorkstation from "./three/sections/ExperienceWorkstation";
import EducationWall from "./three/sections/EducationWall";
import TrophyShelf from "./three/sections/TrophyShelf";
import CertificationGallery from "./three/sections/CertificationGallery";
import AiLabZone from "./three/sections/AiLabZone";
import FrontendStudioZone from "./three/sections/FrontendStudioZone";
import BackendServerZone from "./three/sections/BackendServerZone";
import DatabaseZone from "./three/sections/DatabaseZone";
import DevOpsCloudZone from "./three/sections/DevOpsCloudZone";
import CyberSecurityZone from "./three/sections/CyberSecurityZone";
import MobileDevZone from "./three/sections/MobileDevZone";
import DataVizZone from "./three/sections/DataVizZone";
import ContactPortal from "./three/sections/ContactPortal";
import type { ResumeProject, ResumeExperience, ResumeEducation, ResumeSkills } from "@/lib/resumeSchema";

/**
 * Wires the room config to actual section meshes.
 * Also drives camera animations for the guided tour.
 */
export default function RoomScene() {
  const room = useAppStore((s) => s.room);
  const performanceMode = useAppStore((s) => s.performanceMode);
  const tour = useAppStore((s) => s.tour);
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 1.4, 0));
  const desiredCamRef = useRef(new THREE.Vector3(0, 1.7, 7));

  const mode = useAppStore((s) => s.mode);
  const sections = useMemo(() => room?.sections || [], [room]);

  const trailCurve = useMemo(() => {
    if (sections.length < 2) return null;
    const points = sections.map(
      (s) => new THREE.Vector3(s.position[0], 0.02, s.position[2])
    );
    return new THREE.CatmullRomCurve3(points);
  }, [sections]);

  useEffect(() => {
    if (mode === "scroll" || !tour.active || !room) return;
    const stop = room.sections[tour.index]?.cameraStop;
    if (!stop) return;
    desiredCamRef.current.set(...stop.position);
    targetRef.current.set(...stop.lookAt);
  }, [tour, room, mode]);

  useFrame((_, delta) => {
    if (mode === "scroll" || !tour.active) return;
    // Smooth camera lerp.
    camera.position.lerp(desiredCamRef.current, Math.min(1, delta * 1.6));
    const lookAt = targetRef.current;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const desiredDir = new THREE.Vector3().subVectors(lookAt, camera.position).normalize();
    const blended = dir.lerp(desiredDir, Math.min(1, delta * 2)).add(camera.position);
    camera.lookAt(blended);
  });

  if (!room) return null;
  const accent = room.accentColor;
  const secondary = room.secondaryColor;

  return (
    <>
      {/* Lights */}
      <pointLight position={[0, 6, 0]} intensity={0.7} color={accent} />
      <pointLight position={[6, 4, 6]} intensity={0.4} color={secondary} />
      <pointLight position={[-6, 4, -6]} intensity={0.4} color={accent} />
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={accent} />
      <directionalLight
        castShadow={!performanceMode}
        position={[4, 8, 4]}
        intensity={0.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Floor accent={accent} performanceMode={performanceMode} />
      
      <Particles count={performanceMode ? 40 : Math.min(room.particles, 220)} color={accent} />

      {trailCurve && (
        <mesh>
          <tubeGeometry args={[trailCurve, 120, 0.015, 8, false]} />
          <meshBasicMaterial color={accent} transparent opacity={0.3} />
        </mesh>
      )}

      {sections.map((section) => {
        switch (section.id) {
          case "profile":
            return (
              <ProfileWall
                key={section.id}
                position={section.position}
                profile={(room.resume.profile)}
                accent={accent}
              />
            );
          case "skills":
            return (
              <SkillHologram
                key={section.id}
                position={section.position}
                skills={section.data as ResumeSkills}
                accent={accent}
                secondary={secondary}
              />
            );
          case "projects":
            return (
              <ProjectZone
                key={section.id}
                position={section.position}
                projects={section.data as ResumeProject[]}
                accent={accent}
              />
            );
          case "experience":
            return (
              <ExperienceWorkstation
                key={section.id}
                position={section.position}
                experience={section.data as ResumeExperience[]}
                accent={accent}
              />
            );
          case "education":
            return (
              <EducationWall
                key={section.id}
                position={section.position}
                education={section.data as ResumeEducation[]}
                accent={accent}
              />
            );
          case "achievements": {
            const data = section.data as { achievements: string[]; awards: string[] };
            return (
              <TrophyShelf
                key={section.id}
                position={section.position}
                count={data.achievements.length + data.awards.length}
                accent={accent}
              />
            );
          }
          case "certifications":
            return (
              <CertificationGallery
                key={section.id}
                position={section.position}
                certifications={section.data as string[]}
                accent={accent}
              />
            );
          case "ai-lab":
            return <AiLabZone key={section.id} position={section.position} accent={accent} />;
          case "frontend-studio":
            return (
              <FrontendStudioZone key={section.id} position={section.position} accent={accent} />
            );
          case "backend-server":
            return (
              <BackendServerZone key={section.id} position={section.position} accent={accent} />
            );
          case "database":
            return <DatabaseZone key={section.id} position={section.position} accent={accent} />;
          case "devops-cloud":
            return (
              <DevOpsCloudZone key={section.id} position={section.position} accent={accent} />
            );
          case "cybersecurity":
            return (
              <CyberSecurityZone key={section.id} position={section.position} accent={accent} />
            );
          case "mobile":
            return <MobileDevZone key={section.id} position={section.position} accent={accent} />;
          case "dataviz":
            return <DataVizZone key={section.id} position={section.position} accent={accent} />;
          case "contact":
            return <ContactPortal key={section.id} position={section.position} accent={accent} />;
          default:
            return null;
        }
      })}
    </>
  );
}
