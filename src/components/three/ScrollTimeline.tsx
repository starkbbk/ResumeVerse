"use client";

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAppStore } from "@/lib/store";
import {
  CAMERA_MIN_Y,
  CAMERA_PREFERRED_MAX_Y,
  TARGET_MIN_Y,
  TARGET_MAX_Y,
  OVERVIEW_STOP,
} from "@/lib/cameraStops";

export default function ScrollTimeline() {
  const scroll = useScroll();
  const { camera } = useThree();
  const room = useAppStore((s) => s.room);
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  // Memoize the camera stops for the scroll timeline.
  const scenes = useMemo(() => {
    if (!room) return [];

    const list: Array<{
      id: import("@/lib/generateRoomConfig").SectionId | "intro";
      title: string;
      cameraPosition: THREE.Vector3;
      cameraTarget: THREE.Vector3;
    }> = [
      {
        id: "intro",
        title: "Overview",
        cameraPosition: new THREE.Vector3(...OVERVIEW_STOP.position),
        cameraTarget: new THREE.Vector3(...OVERVIEW_STOP.lookAt),
      },
    ];

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
  const isMobileRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => {
      isMobileRef.current = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useFrame((state, delta) => {
    if (scenes.length < 2) return;

    const offset = scroll.offset;
    const N = scenes.length;
    const rawIdx = Math.max(0, Math.min(offset * (N - 1), N - 1));
    const activeIdx = Math.min(Math.round(rawIdx), N - 1);

    const activeScene = scenes[activeIdx];
    if (activeScene && activeScene.id !== lastActiveRef.current) {
      lastActiveRef.current = activeScene.id;
      setActiveSection(activeScene.id);
    }

    const lowerIdx = Math.floor(rawIdx);
    const upperIdx = Math.min(lowerIdx + 1, N - 1);

    const lowerScene = scenes[lowerIdx];
    const upperScene = scenes[upperIdx];

    const t = lowerIdx === upperIdx ? 0 : rawIdx - lowerIdx;
    // easeInOutCubic
    const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const targetPos = new THREE.Vector3().lerpVectors(
      lowerScene.cameraPosition,
      upperScene.cameraPosition,
      easedT,
    );
    const targetLookAt = new THREE.Vector3().lerpVectors(
      lowerScene.cameraTarget,
      upperScene.cameraTarget,
      easedT,
    );

    // Subtle floating parallax + pointer sway. Keep these small so they never
    // push the camera below the safe minimum height.
    const time = state.clock.getElapsedTime();
    const driftX = Math.sin(time * 0.35) * 0.08;
    const driftY = Math.cos(time * 0.3) * 0.05;
    const driftZ = Math.sin(time * 0.2) * 0.04;
    const swayX = state.pointer.x * 0.18;
    const swayY = state.pointer.y * 0.1;

    targetPos.x += driftX + swayX;
    targetPos.y += driftY + swayY;
    targetPos.z += driftZ;

    // Hard safety clamp — camera should never sneak below human eye level
    // or shoot up above the ceiling lights, no matter what drift is applied.
    targetPos.y = Math.max(CAMERA_MIN_Y, Math.min(targetPos.y, CAMERA_PREFERRED_MAX_Y + 0.4));
    targetLookAt.y = Math.max(TARGET_MIN_Y, Math.min(targetLookAt.y, TARGET_MAX_Y));

    // Mobile: bottom sheet covers ~42vh, so raise the look-at and lift the
    // camera a touch to keep the active object in the visible area.
    if (isMobileRef.current && activeIdx > 0) {
      targetPos.y = Math.min(targetPos.y + 0.4, CAMERA_PREFERRED_MAX_Y + 0.4);
      targetLookAt.y = Math.min(targetLookAt.y + 0.35, TARGET_MAX_Y);
    }

    camera.position.lerp(targetPos, Math.min(1, delta * 7.5));

    const currentDir = new THREE.Vector3();
    camera.getWorldDirection(currentDir);

    const targetDir = new THREE.Vector3()
      .subVectors(targetLookAt, camera.position)
      .normalize();
    const blendedDir = currentDir.lerp(targetDir, Math.min(1, delta * 7.5)).normalize();
    const lookAtPos = new THREE.Vector3().addVectors(camera.position, blendedDir);

    camera.lookAt(lookAtPos);

    // Subtle cinematic camera roll — kept tiny so the horizon never tilts oddly.
    const upVector = new THREE.Vector3(driftX * 0.02, 1, 0).normalize();
    camera.up.copy(upVector);
  });

  // Bind a helper for vertical navigation dots / programmatic jumps.
  useEffect(() => {
    (window as unknown as { __scrollToSection?: (i: number) => void }).__scrollToSection = (
      index: number,
    ) => {
      if (scroll && scroll.el) {
        const N = scenes.length;
        const targetScroll =
          (index / (N - 1)) * (scroll.el.scrollHeight - scroll.el.clientHeight);
        scroll.el.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    };

    return () => {
      delete (window as unknown as { __scrollToSection?: (i: number) => void }).__scrollToSection;
    };
  }, [scroll, scenes]);

  return null;
}
