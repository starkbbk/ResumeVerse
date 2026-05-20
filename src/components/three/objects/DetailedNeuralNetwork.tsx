"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  accent?: string;
  secondary?: string;
  /** Layer node counts, e.g. [3, 5, 5, 2]. */
  layers?: number[];
  /** Side length of the network volume. */
  size?: number;
  /** Animate flowing pulses through synapses. */
  active?: boolean;
}

/**
 * Multi-layer perceptron visualization:
 *   - input/hidden/output layers as columns of glowing spheres
 *   - emissive synapse cylinders connecting every node between layers
 *   - flowing pulse spheres traveling along random connections
 *
 * Visually different from a simple wireframe dodecahedron — this looks
 * like an actual neural network diagram in 3D.
 */
export default function DetailedNeuralNetwork({
  accent = "#a78bfa",
  secondary = "#22d3ee",
  layers = [3, 5, 5, 2],
  size = 1.4,
  active = true,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  // Compute layer x positions and node y positions.
  const nodes = useMemo(() => {
    const out: { x: number; y: number; z: number; layer: number }[] = [];
    layers.forEach((count, li) => {
      const x = layers.length === 1 ? 0 : -size / 2 + (li / (layers.length - 1)) * size;
      for (let i = 0; i < count; i++) {
        const y = count === 1 ? 0 : -size * 0.4 + (i / (count - 1)) * (size * 0.8);
        out.push({ x, y, z: 0, layer: li });
      }
    });
    return out;
  }, [layers, size]);

  // Build connections (every node in layer i to every node in layer i+1).
  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    let layerStarts = [0];
    layers.forEach((c, idx) => layerStarts.push(layerStarts[idx] + c));
    for (let li = 0; li < layers.length - 1; li++) {
      const aStart = layerStarts[li];
      const bStart = layerStarts[li + 1];
      for (let a = 0; a < layers[li]; a++) {
        for (let b = 0; b < layers[li + 1]; b++) {
          conns.push({ from: aStart + a, to: bStart + b });
        }
      }
    }
    return conns;
  }, [layers]);

  // Pre-build pulse data: each pulse picks a random connection and travels along it.
  const pulses = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        connIdx: Math.floor(Math.random() * connections.length),
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.4,
      })),
    [connections.length],
  );

  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.6;
      ringRef.current.rotation.y -= delta * 0.4;
    }
    if (!active) return;
    pulses.forEach((p, i) => {
      p.progress += delta * p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
        p.connIdx = Math.floor(Math.random() * connections.length);
      }
      const m = pulseRefs.current[i];
      if (!m) return;
      const conn = connections[p.connIdx];
      const a = nodes[conn.from];
      const b = nodes[conn.to];
      m.position.set(
        a.x + (b.x - a.x) * p.progress,
        a.y + (b.y - a.y) * p.progress,
        0,
      );
    });
  });

  const synapseMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.32,
      }),
    [accent],
  );
  const nodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: secondary,
        emissive: secondary,
        emissiveIntensity: 1.4,
        metalness: 0.4,
        roughness: 0.3,
      }),
    [secondary],
  );
  const outputNodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 1.6,
        metalness: 0.4,
        roughness: 0.3,
      }),
    [accent],
  );

  return (
    <group ref={groupRef}>
      {/* Outer guard ring (gives the network a "core" feeling) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[size * 0.55, 0.008, 8, 64]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.5}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Synapses */}
      {connections.map((c, i) => {
        const a = nodes[c.from];
        const b = nodes[c.to];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        const mid = new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, 0);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh
            key={i}
            position={mid.toArray() as [number, number, number]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            <cylinderGeometry args={[0.0045, 0.0045, dist, 6]} />
            <primitive object={synapseMat} attach="material" />
          </mesh>
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const isOutput = n.layer === layers.length - 1;
        return (
          <group key={i} position={[n.x, n.y, 0]}>
            <mesh>
              <sphereGeometry args={[0.052, 16, 16]} />
              <primitive object={isOutput ? outputNodeMat : nodeMat} attach="material" />
            </mesh>
            {/* Halo */}
            <mesh>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial
                color={isOutput ? accent : secondary}
                transparent
                opacity={0.16}
              />
            </mesh>
          </group>
        );
      })}

      {/* Flowing pulses */}
      {pulses.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) pulseRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
}
