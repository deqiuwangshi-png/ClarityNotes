"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrashPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/workspace");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-mint-primary border-t-transparent animate-spin" />
    </div>
  );
}
