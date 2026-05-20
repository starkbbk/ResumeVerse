"use client";

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAppStore } from "@/lib/store";

export default function ScrollTimeline() {
  const scroll = useScroll();
  const { camera } = useThree();
  const room = useAppStore((s) => s.room);
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  // Memoize the camera stops for the scroll timeline.
  const scenes = useMemo(() => {
    if (!room) return [];

    // Start with a majestic intro wide shot.
    const list: Array<{
      id: import("@/lib/generateRoomConfig").SectionId | "intro";
      title: string;
      cameraPosition: THREE.Vector3;
      cameraTarget: THREE.Vector3;
    }> = [
      {
        id: "intro",
        title: "Overview",
        cameraPosition: new THREE.Vector3(0, 6.2, 13.5),
        cameraTarget: new THREE.Vector3(0, 1.4, 0),
      },
    ];

    // Add each active/enabled section's camera coordinates.
    room.sections.forEach((sec) => {
      list.push({
        id: sec.id,
        title: sec.title,
        cameraPosition: new THREE.Vector3(...sec.cameraStop.position),
        cameraTarget: new THREE.Vector3(...sec.cameraStop.lookAt),
      });
    });

    return list;
  }, [room]);

  const lastActiveRef = useRef<string | null>(null);

  useFrame((state, delta) => {
    if (scenes.length < 2) return;

    // scroll.offset is updated by Drei ScrollControls (from 0 to 1)
    const offset = scroll.offset;

    // Segment size for each transition
    const N = scenes.length;
    const rawIdx = Math.max(0, Math.min(offset * (N - 1), N - 1));
    const activeIdx = Math.min(Math.round(rawIdx), N - 1);

    // Sync current section state
    const activeScene = scenes[activeIdx];
    if (activeScene && activeScene.id !== lastActiveRef.current) {
      lastActiveRef.current = activeScene.id;
      setActiveSection(activeScene.id);
    }

    // Interpolation between lower and upper scenes
    const lowerIdx = Math.floor(rawIdx);
    const upperIdx = Math.min(lowerIdx + 1, N - 1);

    const lowerScene = scenes[lowerIdx];
    const upperScene = scenes[upperIdx];

    const t = lowerIdx === upperIdx ? 0 : rawIdx - lowerIdx;

    // easeInOutCubic easing
    const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Camera position interpolation
    const targetPos = new THREE.Vector3().lerpVectors(
      lowerScene.cameraPosition,
      upperScene.cameraPosition,
      easedT
    );

    // Camera target (look-at) interpolation
    const targetLookAt = new THREE.Vector3().lerpVectors(
      lowerScene.cameraTarget,
      upperScene.cameraTarget,
      easedT
    );

    // Subtle floating parallax movement based on time + interactive mouse pointer sway
    const time = state.clock.getElapsedTime();
    const driftX = Math.sin(time * 0.35) * 0.12;
    const driftY = Math.cos(time * 0.3) * 0.08;
    const driftZ = Math.sin(time * 0.2) * 0.05;

    // Pointer-based parallax sway (normalized between -1 and 1)
    const swayX = state.pointer.x * 0.25;
    const swayY = state.pointer.y * 0.18;

    targetPos.x += driftX + swayX;
    targetPos.y += driftY + swayY;
    targetPos.z += driftZ;

    // Smoothly interpolate the camera's actual position
    camera.position.lerp(targetPos, Math.min(1, delta * 7.5));

    // Smoothly interpolate the look-at target direction
    const currentDir = new THREE.Vector3();
    camera.getWorldDirection(currentDir);

    const targetDir = new THREE.Vector3().subVectors(targetLookAt, camera.position).normalize();
    const blendedDir = currentDir.lerp(targetDir, Math.min(1, delta * 7.5)).normalize();
    const lookAtPos = new THREE.Vector3().addVectors(camera.position, blendedDir);

    camera.lookAt(lookAtPos);

    // Subtle cinematic camera roll (up-vector drift)
    const upVector = new THREE.Vector3(driftX * 0.03, 1, 0).normalize();
    camera.up.copy(upVector);
  });

  // Bind a helper window method for vertical navigation dots to trigger smooth scroll
  useEffect(() => {
    (window as any).__scrollToSection = (index: number) => {
      if (scroll && scroll.el) {
        const N = scenes.length;
        const targetScroll =
          (index / (N - 1)) * (scroll.el.scrollHeight - scroll.el.clientHeight);
        scroll.el.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    };

    return () => {
      delete (window as any).__scrollToSection;
    };
  }, [scroll, scenes]);

  return null;
}
