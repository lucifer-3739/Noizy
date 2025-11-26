// NO "use server"

type Playlist = {
  id: number;
  name: string;
};

type FetchPlaylistsResult =
  | { success: true; data: Playlist[] }
  | { success: false; message: string };

export const fetchPlaylists = async (): Promise<FetchPlaylistsResult> => {
  try {
    const res = await fetch("/api/playlists", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      const errorMessage =
        errorBody?.error || `Failed to fetch playlists. Status: ${res.status}`;

      return { success: false, message: errorMessage };
    }

    const data: Playlist[] = await res.json();
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "Network error occurred.",
    };
  }
};
