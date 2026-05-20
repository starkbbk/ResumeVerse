"use client";

import { useState, useRef, useEffect, createContext } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";
import type { SectionId } from "@/lib/generateRoomConfig";
import { useAppStore } from "@/lib/store";

export const SectionContext = createContext<{
  id: SectionId;
  isActive: boolean;
  isAnyActive: boolean;
} | null>(null);

interface Props {
  id: SectionId;
  position: [number, number, number];
  bobble?: boolean;
  children: ReactNode;
}

/**
 * Wraps every clickable section. Handles hover, click → side panel, and
 * a subtle floating bobble animation. Provides SectionContext to children
 * and dims/scales materials based on whether this section is active.
 */
export default function InteractiveGroup({ id, position, bobble = true, children }: Props) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const activeSection = useAppStore((s) => s.activeSection);
  const baseY = position[1];

  const isActive = activeSection === id;
  const isAnyActive = activeSection !== null;

  useFrame((state) => {
    if (!ref.current) return;
    if (bobble && !isActive) {
      ref.current.position.y =
        baseY + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.05;
    } else if (isActive) {
      // Bring active section slightly up and static.
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, baseY + 0.1, 0.1);
    } else {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, baseY, 0.1);
    }

    const targetScale = isActive ? 1.15 : hovered ? 1.05 : isAnyActive ? 0.82 : 1.0;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
  });

  // Traverse materials of child meshes to dim them when inactive.
  useEffect(() => {
    if (!ref.current) return;

    const targetOpacity = isActive ? 1.0 : isAnyActive ? 0.28 : 1.0;

    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat.userData.originalOpacity === undefined) {
            mat.userData.originalOpacity = mat.opacity ?? 1.0;
            mat.userData.originalTransparent = mat.transparent ?? false;
          }
          mat.transparent = targetOpacity < 1.0 || mat.userData.originalTransparent;
          mat.opacity = mat.userData.originalOpacity * targetOpacity;
        });
      }
    });
  }, [activeSection, id, isActive, isAnyActive]);

  return (
    <SectionContext.Provider value={{ id, isActive, isAnyActive }}>
      <group
        ref={ref}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setActiveSection(id);
        }}
      >
        {children}
      </group>
    </SectionContext.Provider>
  );
}
