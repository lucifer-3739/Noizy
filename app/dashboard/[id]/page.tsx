import GlassMusicPlayer from "@/components/dashboard/GlassMusicPlayer";

export default async function DashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const apiUrl = process.env.NEXT_PUBLIC_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_URL is missing");
  }

  if (!params?.id) {
    return <div className="text-red-500 p-6">Invalid Song ID</div>;
  }

  const res = await fetch(`${apiUrl}/api/songs/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="text-red-500 p-6">Song not found</div>;
  }

  const song = await res.json();

  return (
    <div className="flex flex-1 min-h-screen bg-linear-to-br from-purple-900 to-black">
      <GlassMusicPlayer song={song} />
    </div>
  );
}
