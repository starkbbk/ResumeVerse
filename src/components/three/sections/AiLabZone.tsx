"use client";

import { useContext } from "react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedMonitor from "../objects/DetailedMonitor";
import DetailedNeuralNetwork from "../objects/DetailedNeuralNetwork";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function AiLabZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const screen = (
    <div className="w-full h-full p-2 font-mono text-[6px] text-emerald-300 leading-snug">
      <div className="flex items-center justify-between border-b border-emerald-400/30 pb-1 mb-1">
        <span className="text-white font-bold tracking-widest">NEURAL TRAIN //</span>
        <span className="text-emerald-400">RUNNING</span>
      </div>
      <div className="space-y-0.5">
        <div>EPOCH: 45 / 100</div>
        <div>LOSS: 0.0234</div>
        <div className="text-emerald-300">ACCURACY: 98.42%</div>
        <div className="opacity-70">OPTIMIZER: AdamW</div>
        <div className="opacity-70">BATCH: 256</div>
      </div>
      <div className="mt-2 h-1.5 w-full bg-emerald-900/40 rounded">
        <div className="h-full w-[45%] rounded bg-gradient-to-r from-emerald-400 to-cyan-400" />
      </div>
    </div>
  );

  return (
    <InteractiveGroup id="ai-lab" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.6} depth={1.2} accent={accent} />} />

      {/* Neural network floating above the desk */}
      <group position={[0, 1.45, 0.05]}>
        <Model
          src="/models/neural-network.glb"
          fallback={
            <DetailedNeuralNetwork
              accent={accent}
              secondary="#22d3ee"
              layers={[3, 5, 5, 2]}
              size={1.4}
              active={isActive}
            />
          }
        />
      </group>

      {/* Training console monitor */}
      <group position={[-0.8, 0.89, 0.1]} rotation={[0, Math.PI / 12, 0]}>
        <Model
          src="/models/monitor.glb"
          fallback={
            <DetailedMonitor
              width={0.85}
              accent={accent}
              highlighted={isActive}
              screen={screen}
            />
          }
        />
      </group>

      {/* Dataset cubes on the right */}
      <group position={[0.7, 0.92, 0.18]} rotation={[0, -Math.PI / 10, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[i * 0.18 - 0.18, 0.08, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial color="#0c1126" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.082]}>
              <boxGeometry args={[0.13, 0.13, 0.005]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={isActive ? 0.8 : 0.3}
              />
            </mesh>
            <mesh position={[0, 0.085, 0]}>
              <boxGeometry args={[0.18, 0.005, 0.18]} />
              <meshStandardMaterial color="#cdd2dc" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      <SectionLabel title="AI / ML LABORATORY" accent={accent} position={[0, 3.1, 0]} />
    </InteractiveGroup>
  );
}
