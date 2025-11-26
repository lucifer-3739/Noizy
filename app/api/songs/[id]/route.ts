import { db } from "@/db/drizzle";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [song] = await db
    .select()
    .from(songs)
    .where(eq(songs.id, Number(id)));

  return Response.json(song || {});
}
