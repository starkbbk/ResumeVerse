"use client";

import { useContext } from "react";
import InteractiveGroup, { SectionContext } from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedDesk from "../objects/DetailedDesk";
import DetailedPhoneMockup from "../objects/DetailedPhoneMockup";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

export default function MobileDevZone({ position, accent }: Props) {
  const ctx = useContext(SectionContext);
  const isActive = ctx ? ctx.isActive : true;

  const phoneScreen = (
    <div className="w-full h-full p-2 flex flex-col gap-1 text-white">
      <div className="size-1.5 rounded-full bg-slate-700 mx-auto" />
      <div className="h-2 rounded bg-cyan-400/40" />
      <div className="rounded bg-cyan-500/15 border border-cyan-400/30 flex-1 flex flex-col items-center justify-center">
        <span className="text-[6px] font-bold text-cyan-200">MOBILE LAB</span>
        <span className="text-[5px] text-emerald-300 font-mono mt-1">BUILD #94 OK</span>
      </div>
      <div className="grid grid-cols-3 gap-0.5">
        <div className="h-3 rounded bg-emerald-500/20" />
        <div className="h-3 rounded bg-amber-500/20" />
        <div className="h-3 rounded bg-purple-500/20" />
      </div>
    </div>
  );

  const tabletScreen = (
    <div className="w-full h-full p-2 grid grid-cols-3 gap-1 text-white">
      {[
        { t: "Charts", c: "cyan" },
        { t: "API", c: "purple" },
        { t: "Build", c: "emerald" },
      ].map((tile) => (
        <div
          key={tile.t}
          className={`rounded border bg-${tile.c}-500/15 border-${tile.c}-400/30 flex items-center justify-center`}
        >
          <span className={`text-[6px] font-bold text-${tile.c}-200`}>{tile.t}</span>
        </div>
      ))}
      <div className="col-span-3 rounded bg-pink-500/15 border border-pink-400/25 p-1">
        <div className="text-[6px] font-bold text-pink-200">DEVICE PREVIEW</div>
        <div className="mt-1 grid grid-cols-6 gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-2 rounded bg-pink-400/30" />
          ))}
        </div>
      </div>
    </div>
  );

  const codeScreen = (
    <div className="w-full h-full p-1.5 text-emerald-300 font-mono text-[5px] leading-tight bg-slate-950/80">
      <div className="text-white border-b border-emerald-400/30 pb-0.5 mb-1">
        ContentView.swift
      </div>
      <div>struct ContentView: View &#123;</div>
      <div className="pl-1.5">var body: some View &#123;</div>
      <div className="pl-3 text-cyan-300">VStack &#123;</div>
      <div className="pl-4 text-amber-200">Text(&quot;Mobile Lab&quot;)</div>
      <div className="pl-4 text-amber-200">Image(&quot;icon&quot;)</div>
      <div className="pl-3 text-cyan-300">&#125;</div>
      <div className="pl-1.5">&#125;</div>
      <div>&#125;</div>
      <div className="text-white/40 mt-1">⏵ COMPILE OK</div>
    </div>
  );

  return (
    <InteractiveGroup id="mobile" position={position}>
      <Model src="/models/desk.glb" fallback={<DetailedDesk width={2.6} depth={1.2} accent={accent} />} />

      {/* Tablet (left) */}
      <group position={[-0.85, 0.89, 0.18]} rotation={[0, Math.PI / 9, 0]}>
        <mesh position={[0, 0.06, -0.06]}>
          <boxGeometry args={[0.1, 0.12, 0.12]} />
          <meshStandardMaterial color="#1a1f33" metalness={0.85} />
        </mesh>
        <group position={[0, 0.22, 0]} rotation={[-Math.PI / 14, 0, 0]}>
          <Model
            src="/models/tablet.glb"
            fallback={
              <DetailedPhoneMockup
                width={0.5}
                tablet
                accent={accent}
                highlighted={isActive}
                screen={tabletScreen}
              />
            }
          />
        </group>
      </group>

      {/* Phone (center) */}
      <group position={[0, 0.89, 0.1]}>
        <mesh position={[0, 0.06, -0.05]}>
          <boxGeometry args={[0.06, 0.16, 0.12]} />
          <meshStandardMaterial color="#1a1f33" metalness={0.85} />
        </mesh>
        <group position={[0, 0.32, 0]} rotation={[-Math.PI / 18, 0, 0]}>
          <Model
            src="/models/phone.glb"
            fallback={
              <DetailedPhoneMockup
                width={0.36}
                accent={accent}
                highlighted={isActive}
                screen={phoneScreen}
              />
            }
          />
        </group>
      </group>

      {/* Code phone (right) */}
      <group position={[0.85, 0.89, 0.18]} rotation={[0, -Math.PI / 9, 0]}>
        <mesh position={[0, 0.06, -0.05]}>
          <boxGeometry args={[0.06, 0.14, 0.12]} />
          <meshStandardMaterial color="#1a1f33" metalness={0.85} />
        </mesh>
        <group position={[0, 0.3, 0]} rotation={[-Math.PI / 16, 0, 0]}>
          <Model
            src="/models/phone.glb"
            fallback={
              <DetailedPhoneMockup
                width={0.34}
                accent="#10b981"
                highlighted={isActive}
                screen={codeScreen}
              />
            }
          />
        </group>
      </group>

      <SectionLabel title="MOBILE APPLICATION LAB" accent={accent} position={[0, 3.1, 0]} />
    </InteractiveGroup>
  );
}
