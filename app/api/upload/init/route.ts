import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  audioExt: z.string().regex(/^\.[a-z0-9]+$/i),
  coverExt: z.string().regex(/^\.[a-z0-9]+$/i),
});

export async function POST(req: Request) {
  try {
    const body = Body.parse(await req.json());
    const audioKey = getObjectKey("audio", `${uuid()}${body.audioExt}`);
    const coverKey = getObjectKey("covers", `${uuid()}${body.coverExt}`);

    const [audioUrl, coverUrl] = await Promise.all([
      putObject(audioKey),
      putObject(coverKey),
    ]);

    return NextResponse.json({ audioKey, coverKey, audioUrl, coverUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
