import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { SocialDTO } from "@/types/common";

/* ── GET /api/social ────────────────────────────────────────────── */
export async function GET() {
  try {
    const socials = await prisma.social.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(socials);
  } catch (err) {
    console.error("[GET /api/social]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── POST /api/social ───────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { label, url, handle }: SocialDTO = body;

    if (!label || !url || !handle) {
      return NextResponse.json(
        { error: "label, url and handle are required" },
        { status: 400 },
      );
    }

    const social = await prisma.social.create({
      data: {
        label,
        url,
        handle,
      },
    });

    return NextResponse.json(social, { status: 201 });
  } catch (err) {
    console.error("[POST /api/social]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
