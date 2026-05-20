"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { demoResume } from "@/lib/demoResume";
import { generateRoomConfig } from "@/lib/generateRoomConfig";
import LoadingScene from "@/components/LoadingScene";

export default function DemoPage() {
  const router = useRouter();
  const setResumeAndRoom = useAppStore((s) => s.setResumeAndRoom);

  useEffect(() => {
    const room = generateRoomConfig(demoResume);
    setResumeAndRoom(demoResume, room);
    router.replace("/room");
  }, [router, setResumeAndRoom]);

  return <LoadingScene message="Spinning up the demo room…" />;
}
