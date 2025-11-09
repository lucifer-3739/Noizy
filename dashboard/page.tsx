import { uploadSongAction } from "@/actions/uploadSong";
import UploadSongForm from "@/components/uploadsong";

export default function Page() {
  async function handle(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const artistId = Number(formData.get("artistId") || 1);
    const audioFile = formData.get("audioFile") as File;
    const artworkFile = formData.get("artworkFile") as File | null;

    await uploadSongAction({
      title,
      artistId,
      audioFile,
      artworkFile: artworkFile ?? undefined,
    });
  }

  return <UploadSongForm action={handle} />;
}
