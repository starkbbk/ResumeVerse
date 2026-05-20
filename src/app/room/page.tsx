"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import LoadingScene from "@/components/LoadingScene";

// Heavy 3D bundle — load on the client only.
const RoomExperience = dynamic(() => import("@/components/RoomExperience"), {
  ssr: false,
  loading: () => <LoadingScene />,
});

export default function RoomPage() {
  const router = useRouter();
  const room = useAppStore((s) => s.room);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (!room) {
      // No room generated — bounce to upload.
      const t = setTimeout(() => router.replace("/upload"), 50);
      return () => clearTimeout(t);
    }
  }, [room, router]);

  if (!ready || !room) {
    return <LoadingScene />;
  }
  return <RoomExperience />;
}
