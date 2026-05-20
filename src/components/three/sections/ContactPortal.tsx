"use client";

import { Html } from "@react-three/drei";
import InteractiveGroup from "../InteractiveGroup";
import SectionLabel from "../SectionLabel";
import DetailedPortalGate from "../objects/DetailedPortalGate";
import Model from "@/components/3d/Model";

interface Props {
  position: [number, number, number];
  accent: string;
}

/**
 * Contact portal: thick metallic gate with energy field, particle stream,
 * floating "GATEWAY ALPHA / BETA" satellite buttons.
 */
export default function ContactPortal({ position, accent }: Props) {
  return (
    <InteractiveGroup id="contact" position={position} bobble={false}>
      <Model
        src="/models/portal.glb"
        fallback={<DetailedPortalGate accent={accent} secondary="#a78bfa" />}
      />

      {/* Floating gateway labels */}
      <Html transform position={[-1.4, 1.1, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "none" }}>
        <span className="text-[8px] uppercase tracking-[0.25em] text-cyan-200 font-bold bg-cyan-950/50 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur whitespace-nowrap">
          ⟸ Gateway Alpha
        </span>
      </Html>
      <Html transform position={[1.4, 1.1, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "none" }}>
        <span className="text-[8px] uppercase tracking-[0.25em] text-cyan-200 font-bold bg-cyan-950/50 px-2 py-1 rounded border border-cyan-400/30 backdrop-blur whitespace-nowrap">
          Gateway Beta ⟹
        </span>
      </Html>
      <Html transform position={[0, 1.85, 0.4]} distanceFactor={4.5} style={{ pointerEvents: "none" }}>
        <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/85 bg-black/55 px-3 py-1 rounded-full border border-white/15 backdrop-blur whitespace-nowrap">
          Initiate Transmission
        </span>
      </Html>

      <SectionLabel title="CONTACT PORTAL" accent={accent} position={[0, 3.4, 0]} />
    </InteractiveGroup>
  );
}
