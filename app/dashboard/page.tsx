"use client";

import HomePage from "@/components/dashboard/Homepage";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1">
      {/* <div className="absolute top-4 left-4">
        <UploadDialog
          onUploaded={() => {
            toast.success("Song list updated!");
            router.refresh();
          }}
        />
      </div> */}
      <HomePage />
    </div>
  );
}
