"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

interface Book {
  color: string;
  title?: string;
  height?: number;
}

interface Props {
  /** Stack books bottom→top. Defaults to a 3-book scholarly set. */
  books?: Book[];
}

const DEFAULT_BOOKS: Book[] = [
  { color: "#1e3a8a", title: "Algorithms", height: 0.06 },
  { color: "#7f1d1d", title: "Systems", height: 0.055 },
  { color: "#854d0e", title: "Analysis", height: 0.05 },
];

/**
 * Stack of leather-bound textbooks with offset spines, paper edges, and
 * gold spine bands.
 */
export default function DetailedBookStack({ books = DEFAULT_BOOKS }: Props) {
  const goldSpine = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        emissive: "#7a4a00",
        emissiveIntensity: 0.18,
        metalness: 0.9,
        roughness: 0.25,
      }),
    [],
  );

  let y = 0;
  return (
    <group>
      {books.map((book, idx) => {
        const w = 0.42 - idx * 0.025;
        const d = 0.3 - idx * 0.018;
        const h = book.height ?? 0.055;
        const rotY = (idx % 2 === 0 ? 1 : -1) * 0.07 * (idx + 1);
        const offsetX = (idx % 2 === 0 ? 1 : -1) * 0.012;

        const yCenter = y + h / 2;
        y += h;

        return (
          <group key={idx} position={[offsetX, yCenter, 0]} rotation={[0, rotY, 0]}>
            {/* Leather cover */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color={book.color} roughness={0.75} metalness={0.1} />
            </mesh>
            {/* Cream pages (slightly inset) */}
            <mesh>
              <boxGeometry args={[w * 0.985, h * 0.7, d * 0.985]} />
              <meshStandardMaterial color="#f3ecd0" roughness={0.95} />
            </mesh>
            {/* Gold spine band */}
            <mesh position={[0, 0, d / 2 + 0.001]}>
              <boxGeometry args={[w * 0.95, h * 0.18, 0.002]} />
              <primitive object={goldSpine} attach="material" />
            </mesh>
            {/* Title text (faint engraved gold) */}
            {book.title && (
              <Html
                transform
                position={[0, 0, d / 2 + 0.003]}
                distanceFactor={2.6}
                style={{ pointerEvents: "none" }}
              >
                <div className="text-[5.5px] uppercase tracking-[0.25em] font-serif text-amber-200/90 select-none whitespace-nowrap">
                  {book.title}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
