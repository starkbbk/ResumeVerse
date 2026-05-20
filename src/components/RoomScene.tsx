"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/lib/store";
import MuseumHall from "./three/MuseumHall";
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
import type {
  ResumeProject,
  ResumeExperience,
  ResumeEducation,
  ResumeSkills,
} from "@/lib/resumeSchema";

/**
 * Wires the room config to actual section meshes.
 * Sections live around a circular museum hall; per-section spotlights face
 * inward toward the camera so the active object always reads clearly.
 */
export default function RoomScene() {
  const room = useAppStore((s) => s.room);
  const performanceMode = useAppStore((s) => s.performanceMode);
  const tour = useAppStore((s) => s.tour);
  const activeSection = useAppStore((s) => s.activeSection);
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 1.4, 0));
  const desiredCamRef = useRef(new THREE.Vector3(0, 1.7, 7));

  const mode = useAppStore((s) => s.mode);
  const sections = useMemo(() => room?.sections || [], [room]);
  const centerEmblemRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (mode === "scroll" || !tour.active || !room) return;
    const stop = room.sections[tour.index]?.cameraStop;
    if (!stop) return;
    desiredCamRef.current.set(...stop.position);
    targetRef.current.set(...stop.lookAt);
  }, [tour, room, mode]);

  useFrame((state, delta) => {
    if (centerEmblemRef.current) {
      centerEmblemRef.current.rotation.y += delta * 0.45;
      centerEmblemRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.8) * 0.12;
    }

    if (mode === "scroll" || !tour.active) return;
    camera.position.lerp(desiredCamRef.current, Math.min(1, delta * 1.6));
    const lookAt = targetRef.current;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const desiredDir = new THREE.Vector3()
      .subVectors(lookAt, camera.position)
      .normalize();
    const blended = dir.lerp(desiredDir, Math.min(1, delta * 2)).add(camera.position);
    camera.lookAt(blended);
  });

  if (!room) return null;
  const accent = room.accentColor;
  const secondary = room.secondaryColor;

  return (
    <>
      {/* Global lighting: bright enough to read every object, still atmospheric. */}
      <ambientLight intensity={0.85} color="#cdd2dc" />
      <hemisphereLight args={[accent, "#11142a", 0.85]} />
      <pointLight position={[0, 5.6, 0]} intensity={1.6} color={accent} distance={26} />
      <pointLight position={[7, 5, 7]} intensity={1.0} color={secondary} distance={24} />
      <pointLight position={[-7, 5, -7]} intensity={0.9} color={accent} distance={24} />
      <pointLight position={[0, 1.0, 0]} intensity={0.7} color={accent} distance={10} />
      <directionalLight
        castShadow={!performanceMode}
        position={[5, 10, 5]}
        intensity={1.0}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={32}
      />

      {/* Museum hall: floor, curved walls, ceiling ring, per-section panels. */}
      <MuseumHall
        accent={accent}
        secondary={secondary}
        sections={sections.map((s) => ({
          id: s.id,
          position: s.position,
          rotationY: s.rotationY,
        }))}
        performanceMode={performanceMode}
      />

      <Particles count={performanceMode ? 60 : Math.min(room.particles, 240)} color={accent} />

      {/* Central core emblem — anchored at chest level for the overview shot */}
      <group ref={centerEmblemRef} position={[0, 2.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.45} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={1.1}
            wireframe
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.018, 8, 32]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.95}
          />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[0.85, 0.012, 8, 32]} />
          <meshStandardMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {sections.map((section) => {
        const rotationY = section.rotationY || 0;
        const isActive = activeSection === section.id;

        const renderContent = () => {
          switch (section.id) {
            case "profile":
              return (
                <ProfileWall position={[0, 0, 0]} profile={room.resume.profile} accent={accent} />
              );
            case "skills":
              return (
                <SkillHologram
                  position={[0, 0, 0]}
                  skills={section.data as ResumeSkills}
                  accent={accent}
                  secondary={secondary}
                />
              );
            case "projects":
              return (
                <ProjectZone
                  position={[0, 0, 0]}
                  projects={section.data as ResumeProject[]}
                  accent={accent}
                />
              );
            case "experience":
              return (
                <ExperienceWorkstation
                  position={[0, 0, 0]}
                  experience={section.data as ResumeExperience[]}
                  accent={accent}
                />
              );
            case "education":
              return (
                <EducationWall
                  position={[0, 0, 0]}
                  education={section.data as ResumeEducation[]}
                  accent={accent}
                />
              );
            case "achievements": {
              const data = section.data as { achievements: string[]; awards: string[] };
              return (
                <TrophyShelf
                  position={[0, 0, 0]}
                  count={data.achievements.length + data.awards.length}
                  accent={accent}
                />
              );
            }
            case "certifications":
              return (
                <CertificationGallery
                  position={[0, 0, 0]}
                  certifications={section.data as string[]}
                  accent={accent}
                />
              );
            case "ai-lab":
              return <AiLabZone position={[0, 0, 0]} accent={accent} />;
            case "frontend-studio":
              return <FrontendStudioZone position={[0, 0, 0]} accent={accent} />;
            case "backend-server":
              return <BackendServerZone position={[0, 0, 0]} accent={accent} />;
            case "database":
              return <DatabaseZone position={[0, 0, 0]} accent={accent} />;
            case "devops-cloud":
              return <DevOpsCloudZone position={[0, 0, 0]} accent={accent} />;
            case "cybersecurity":
              return <CyberSecurityZone position={[0, 0, 0]} accent={accent} />;
            case "mobile":
              return <MobileDevZone position={[0, 0, 0]} accent={accent} />;
            case "dataviz":
              return <DataVizZone position={[0, 0, 0]} accent={accent} />;
            case "contact":
              return <ContactPortal position={[0, 0, 0]} accent={accent} />;
            default:
              return null;
          }
        };

        const content = renderContent();
        if (!content) return null;

        let spotColor = accent;
        if (section.id === "profile") spotColor = "#c084fc";
        else if (section.id === "skills") spotColor = "#22d3ee";
        else if (section.id === "projects") spotColor = "#818cf8";
        else if (section.id === "experience") spotColor = "#38bdf8";
        else if (section.id === "education") spotColor = "#fef08a";
        else if (section.id === "achievements") spotColor = "#fbbf24";
        else if (section.id === "certifications") spotColor = "#a78bfa";
        else if (section.id === "cybersecurity") spotColor = "#ef4444";
        else if (section.id === "contact") spotColor = "#22d3ee";

        return (
          <group key={section.id} position={section.position} rotation={[0, rotationY, 0]}>
            {/* Top-down rim spotlight (always on, brighter when active). */}
            <pointLight
              position={[0, 4.4, 0.4]}
              intensity={isActive ? 5.0 : 2.4}
              distance={9}
              decay={1.6}
              color={spotColor}
              castShadow={!performanceMode}
            />
            {/* Front-facing fill so screens / monitors stay readable from camera. */}
            <pointLight
              position={[0, 2.0, 2.4]}
              intensity={isActive ? 2.6 : 1.2}
              distance={6}
              decay={2}
              color={spotColor}
            />
            {/* Rim light behind the active section to silhouette it. */}
            <pointLight
              position={[0, 1.8, -1.4]}
              intensity={isActive ? 1.8 : 0.7}
              distance={5}
              decay={2}
              color={spotColor}
            />
            {/* Floor accent disc anchored on the floor, NOT under section base. */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0.2]}>
              <ringGeometry args={[1.4, 1.95, 48]} />
              <meshBasicMaterial color={spotColor} transparent opacity={isActive ? 0.4 : 0.16} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0.2]}>
              <circleGeometry args={[1.4, 48]} />
              <meshStandardMaterial
                color="#04060f"
                metalness={0.85}
                roughness={0.32}
                transparent
                opacity={0.92}
              />
            </mesh>

            {content}
          </group>
        );
      })}
    </>
  );
}
