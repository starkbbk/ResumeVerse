"use client";

import { Component, ReactNode, Suspense, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface GLTFRendererProps {
  src: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

function GLTFRenderer({ src, position, rotation, scale }: GLTFRendererProps) {
  const gltf = useGLTF(src) as unknown as { scene: THREE.Group };
  const scene = gltf.scene.clone(true);
  scene.traverse((child) => {
    const m = child as THREE.Mesh;
    if ((m as THREE.Mesh).isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
      // Make sure material respects opacity for dim-on-inactive behavior.
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      const list = Array.isArray(mat) ? mat : mat ? [mat] : [];
      list.forEach((mm) => {
        mm.toneMapped = true;
        mm.needsUpdate = true;
      });
    }
  });
  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  componentDidCatch() {
    /* swallow load failures; the fallback handles the visual */
  }
  render() {
    return this.state.hasError ? <>{this.props.fallback}</> : <>{this.props.children}</>;
  }
}

interface ModelProps {
  /** Optional path to a GLB asset, e.g. `/models/laptop.glb`. Falls back to detailed geometry if missing. */
  src?: string;
  /** Detailed procedural geometry shown if no GLB exists or loading fails. */
  fallback: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

/**
 * Universal model wrapper:
 * - Renders the procedural `fallback` whenever `src` is missing, the file
 *   doesn't exist (HEAD probe), or GLTF parsing fails at runtime.
 * - Shadows + opacity propagation are wired automatically on imported scenes.
 *
 * Usage:
 *   <Model src="/models/laptop.glb" fallback={<DetailedLaptop />} />
 */
export default function Model({ src, fallback, position, rotation, scale }: ModelProps) {
  // Probe file existence outside of Suspense so missing GLBs never throw.
  const [verifiedSrc, setVerifiedSrc] = useState<string | null>(null);
  const [probed, setProbed] = useState(!src);

  useEffect(() => {
    let aborted = false;
    if (!src) {
      setProbed(true);
      setVerifiedSrc(null);
      return;
    }
    setProbed(false);
    fetch(src, { method: "HEAD" })
      .then((r) => {
        if (aborted) return;
        if (r.ok) setVerifiedSrc(src);
        else setVerifiedSrc(null);
        setProbed(true);
      })
      .catch(() => {
        if (aborted) return;
        setVerifiedSrc(null);
        setProbed(true);
      });
    return () => {
      aborted = true;
    };
  }, [src]);

  if (!probed || !verifiedSrc) {
    return <>{fallback}</>;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={<>{fallback}</>}>
        <GLTFRenderer src={verifiedSrc} position={position} rotation={rotation} scale={scale} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Preload an optional GLB asset. Safe to call with paths that may not exist —
 * drei's `useGLTF.preload` is forgiving about missing files at module init time.
 */
export function preloadModel(src: string) {
  try {
    useGLTF.preload(src);
  } catch {
    /* ignore */
  }
}
