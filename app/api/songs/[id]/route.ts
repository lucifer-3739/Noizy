import { db } from "@/db/drizzle";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return Response.json({ error: "Invalid song ID" }, { status: 400 });
    }
    const [song] = await db.select().from(songs).where(eq(songs.id, numericId));

    if (!song) {
      return Response.json({ error: "Song not found" }, { status: 404 });
    }

    return Response.json(song);
  } catch (error) {
    console.error("Error fetching song:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
