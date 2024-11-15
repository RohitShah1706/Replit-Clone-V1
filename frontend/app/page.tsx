"use client";

import { ThemeModeToggle } from "@/components/custom/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const projectId = "proj-aaaa0eef0b1a40188a4299b506a08dc4";
  // const projectId = "proj-75074a23ef3144bdb2b51c428be8c9b9";
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-[100vh]">
      <h1>HomePage</h1>
      <Button
        onClick={() => {
          router.push(`/coding/${projectId}`);
        }}
      >
        Go to CodingPage
      </Button>
      <ThemeModeToggle />
    </div>
  );
}
