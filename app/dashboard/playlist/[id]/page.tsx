export const dynamic = "force-dynamic";

import PlaylistClient from "./PlaylistClient";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  return <PlaylistClient id={params.id} />;
}
