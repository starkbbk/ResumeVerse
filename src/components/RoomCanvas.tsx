"use client";

import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  Stars,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import RoomScene from "./RoomScene";
import ScrollTimeline from "./three/ScrollTimeline";
import CameraDebugHUD from "./three/CameraDebugHUD";
import { useAppStore } from "@/lib/store";
import { ScrollControls } from "@react-three/drei";

export default function RoomCanvas() {
  const performanceMode = useAppStore((s) => s.performanceMode);
  const mode = useAppStore((s) => s.mode);
  const room = useAppStore((s) => s.room);

  const pages = room ? room.sections.length + 1 : 1;

  return (
    <Canvas
      shadows={!performanceMode}
      dpr={performanceMode ? [1, 1.25] : [1, 1.85]}
      gl={{
        antialias: !performanceMode,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.32;
        gl.setClearColor(new THREE.Color("#08091a"));
      }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={[0, 3.2, 12]}
          fov={45}
          near={0.5}
          far={120}
        />
        <fog attach="fog" args={["#08091a", 18, 42]} />

        {!performanceMode && (
          <Stars
            radius={75}
            depth={45}
            count={1800}
            factor={3.2}
            saturation={0.4}
            fade
            speed={0.6}
          />
        )}

        <Environment preset="warehouse" />

        {/* Soft contact shadow under the central emblem area */}
        {!performanceMode && (
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.45}
            scale={20}
            blur={2.5}
            far={4}
            color="#000000"
          />
        )}

        {mode === "scroll" ? (
          <ScrollControls pages={pages} damping={0.2} infinite={false}>
            <ScrollTimeline />
            <RoomScene />
          </ScrollControls>
        ) : (
          <>
            <RoomScene />
            <OrbitControls
              enablePan={false}
              enableZoom
              enableDamping
              dampingFactor={0.08}
              minDistance={4}
              maxDistance={18}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.2}
              enabled={mode === "explore"}
              target={[0, 1.8, 0]}
            />
          </>
        )}

        <Preload all />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <CameraDebugHUD />
      </Suspense>
    </Canvas>
  );
}
