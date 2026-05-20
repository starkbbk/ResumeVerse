"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Tiny dev-only HUD that prints camera position + look-at every frame.
 * Hidden in production and behind a query string toggle (?cam=1) so it
 * doesn't add visual noise unless explicitly requested.
 */
export default function CameraDebugHUD() {
  const { camera } = useThree();
  const [visible, setVisible] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const dir = useRef(new THREE.Vector3());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "development") return;
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get("cam") === "1");
  }, []);

  useFrame(() => {
    if (!visible || !labelRef.current) return;
    camera.getWorldDirection(dir.current);
    const lookAt = camera.position.clone().add(dir.current.multiplyScalar(5));
    const p = camera.position;
    labelRef.current.textContent =
      `cam  [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]  ` +
      `look [${lookAt.x.toFixed(2)}, ${lookAt.y.toFixed(2)}, ${lookAt.z.toFixed(2)}]`;
  });

  if (!visible) return null;

  return (
    <Html
      fullscreen
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
      }}
    >
      <div
        ref={labelRef}
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          padding: "6px 10px",
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
          color: "#7dd3fc",
          background: "rgba(2,4,18,0.78)",
          border: "1px solid rgba(125,211,252,0.3)",
          borderRadius: 6,
          letterSpacing: "0.04em",
        }}
      />
    </Html>
  );
}
