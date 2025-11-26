"use client";
import { Player } from "@/components/dashboard/MiniPlayer";
import UploadDialog from "@/components/dashboard/upload/UploadDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MiniPlayer from "../../test/mini-player";

const DashboardPage = () => {
  const router = useRouter();
  return (
    <div className="flex">
      <Player />
      <UploadDialog
        onUploaded={() => {
          toast.success("Song list updated!");
          router.refresh();
        }}
      />
      <MiniPlayer />
    </div>
  );
};

export default DashboardPage;
