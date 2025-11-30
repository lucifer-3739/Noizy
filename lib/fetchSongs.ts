export async function fetchSongs() {
  try {
    const res = await fetch("/api/song", { cache: "no-store" });
    const data = await res.json();

    console.log("🔥 /api/songs RAW RESPONSE:", data);

    return Array.isArray(data.songs) ? data.songs : [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}
