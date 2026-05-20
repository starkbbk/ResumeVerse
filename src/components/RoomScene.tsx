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
  const centerEmblemRef = useRef<THREE.Group>(null);

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

  useFrame((state, delta) => {
    // Spin center emblem
    if (centerEmblemRef.current) {
      centerEmblemRef.current.rotation.y += delta * 0.45;
      centerEmblemRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.12;
    }

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

      {/* Central Glowing Navigation Hub / Core Emblem */}
      <group ref={centerEmblemRef} position={[0, 1.3, 0]}>
        {/* Core glow */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} />
        </mesh>
        {/* Outer wireframe shell */}
        <mesh>
          <octahedronGeometry args={[0.38]} />
          <meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={0.8} wireframe />
        </mesh>
        {/* Horizontal orbital ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.015, 8, 32]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Ceiling structure */}
      {!performanceMode && (
        <group position={[0, 4.2, 0]}>
          {/* Central ceiling ring hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.08, 8, 64]} />
            <meshStandardMaterial color="#0c0e25" metalness={0.9} roughness={0.2} />
          </mesh>
          
          {/* Radial ceiling beams */}
          {[0, 45, 90, 135, 180, 225, 245, 270, 315].map((angle) => {
            const angleRad = (angle * Math.PI) / 180;
            return (
              <group key={angle} rotation={[0, angleRad, 0]}>
                <mesh position={[0, 0, -4.5]} castShadow>
                  <boxGeometry args={[0.12, 0.06, 7.0]} />
                  <meshStandardMaterial color="#0f1330" metalness={0.8} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {trailCurve && (
        <mesh>
          <tubeGeometry args={[trailCurve, 120, 0.015, 8, false]} />
          <meshBasicMaterial color={accent} transparent opacity={0.3} />
        </mesh>
      )}

      {sections.map((section) => {
        const rotationY = section.rotationY || 0;
        const renderContent = () => {
          switch (section.id) {
            case "profile":
              return (
                <ProfileWall
                  position={[0, 0, 0]}
                  profile={(room.resume.profile)}
                  accent={accent}
                />
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
        else if (section.id === "contact") spotColor = "#22d3ee";

        return (
          <group key={section.id} position={section.position} rotation={[0, rotationY, 0]}>
            {/* Workstation Spotlight */}
            <pointLight
              position={[0, 2.4, 0.4]}
              intensity={2.5}
              distance={6}
              color={spotColor}
              castShadow={!performanceMode}
            />

            {/* Structural vertical column & support ribs behind section */}
            <group position={[0, 0.7, -1.45]}>
              {/* Heavy metallic structural pillar */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.24, 4.2, 0.24]} />
                <meshStandardMaterial color="#0c0f24" metalness={0.9} roughness={0.25} />
              </mesh>
              {/* Pillar trim rings */}
              <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
              </mesh>
              <mesh position={[0, -1.4, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
              </mesh>
              {/* Left support rib */}
              <mesh position={[-0.8, 0, 0.05]} rotation={[0, 0, -Math.PI / 6]}>
                <boxGeometry args={[0.06, 0.8, 0.12]} />
                <meshStandardMaterial color="#1a1e3a" metalness={0.7} roughness={0.4} />
              </mesh>
              {/* Right support rib */}
              <mesh position={[0.8, 0, 0.05]} rotation={[0, 0, Math.PI / 6]}>
                <boxGeometry args={[0.06, 0.8, 0.12]} />
                <meshStandardMaterial color="#1a1e3a" metalness={0.7} roughness={0.4} />
              </mesh>
            </group>

            {/* Backboard/wall panel behind section */}
            <group position={[0, 0.9, -1.3]}>
              {/* Backboard panel */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[3.2, 2.4, 0.08]} />
                <meshStandardMaterial
                  color="#060918"
                  metalness={0.85}
                  roughness={0.45}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Beveled edge trim */}
              <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[3.24, 2.44, 0.02]} />
                <meshStandardMaterial color={accent} wireframe />
              </mesh>
              {/* Left neon light column */}
              <mesh position={[-1.5, 0, 0.06]}>
                <boxGeometry args={[0.06, 2.2, 0.04]} />
                <meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={1.5} />
              </mesh>
              {/* Right neon light column */}
              <mesh position={[1.5, 0, 0.06]}>
                <boxGeometry args={[0.06, 2.2, 0.04]} />
                <meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={1.5} />
              </mesh>
            </group>

            {content}
          </group>
        );
      })}
    </>
  );
}
