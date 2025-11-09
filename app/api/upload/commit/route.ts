import { NextResponse } from "next/server";
import { z } from "zod";
import { songs } from "@/db/schema";
import { db } from "@/db/drizzle";

const Body = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  durationSec: z.number().int().positive(),
  audioKey: z.string().min(3),
  coverKey: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const data = Body.parse(await req.json());
    const [row] = await db
      .insert(songs)
      .values({
        ...data,
        fileUrl: data.audioKey, // or set fileUrl appropriately based on your logic
      })
      .returning();
    return NextResponse.json({ song: row });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
