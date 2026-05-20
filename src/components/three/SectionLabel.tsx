import { useContext } from "react";
import { Html } from "@react-three/drei";
import { SectionContext } from "./InteractiveGroup";

interface Props {
  title: string;
  subtitle?: string;
  accent: string;
  position?: [number, number, number];
}

/**
 * Floating glassy label that sits above each section. Uses HTML overlay so
 * text stays crisp on every device. Fades in only when active.
 */
export default function SectionLabel({ title, subtitle, accent, position = [0, 2.4, 0] }: Props) {
  const context = useContext(SectionContext);
  const isActive = context ? context.isActive : true; // default to true if outside context

  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div
        className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap backdrop-blur-md border transition-all duration-500 ease-out"
        style={{
          background: "rgba(15, 18, 34, 0.55)",
          borderColor: `${accent}66`,
          color: "white",
          boxShadow: `0 0 18px ${accent}55`,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scale(1)" : "scale(0.8)",
        }}
      >
        <span className="opacity-90">{title}</span>
        {subtitle && <span className="opacity-50 ml-1.5">· {subtitle}</span>}
      </div>
    </Html>
  );
}
