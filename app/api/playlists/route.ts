import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { playlists } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // get current user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // fetch ONLY the user's playlists
    const data = await db
      .select({
        id: playlists.id,
        name: playlists.name,
        coverUrl: playlists.coverUrl,
      })
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(asc(playlists.createdAt));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}
