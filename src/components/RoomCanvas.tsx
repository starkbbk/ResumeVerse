"use client";

import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
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
import { useAppStore } from "@/lib/store";
import { ScrollControls } from "@react-three/drei";

export default function RoomCanvas() {
  const performanceMode = useAppStore((s) => s.performanceMode);
  const mode = useAppStore((s) => s.mode);
  const room = useAppStore((s) => s.room);

  // pages = sections + 1 (intro)
  const pages = room ? room.sections.length + 1 : 1;

  return (
    <Canvas
      shadows={!performanceMode}
      dpr={performanceMode ? [1, 1.25] : [1, 1.75]}
      gl={{
        antialias: !performanceMode,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(new THREE.Color("#06070d"));
      }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 1.7, 7]} fov={55} />
        <fog attach="fog" args={["#06070d", 14, 30]} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#a78bfa", "#0b0d18", 0.45]} />

        {!performanceMode && (
          <Stars
            radius={70}
            depth={40}
            count={1500}
            factor={3}
            saturation={0.4}
            fade
            speed={0.6}
          />
        )}

        <Environment preset="night" />

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
              minDistance={3}
              maxDistance={16}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.05}
              enabled={mode === "explore"}
              target={[0, 1.4, 0]}
            />
          </>
        )}

        <Preload all />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Suspense>
    </Canvas>
  );
}
