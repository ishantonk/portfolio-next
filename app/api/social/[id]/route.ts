import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { SocialDTO } from "@/types/common";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* ── GET /api/social/:id ────────────────────────────────────────── */
export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const social = await prisma.social.findUnique({
      where: { id },
    });

    if (!social) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(social);
  } catch (err) {
    console.error("[GET /api/social/:id]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── PATCH /api/social/:id ──────────────────────────────────────── */
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { label, url, handle }: Partial<SocialDTO> = body;

    const existing = await prisma.social.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 },
      );
    }

    // Validate fields only when supplied
    const fields = {
      label,
      url,
      handle,
    };

    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined) {
        if (typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            {
              error: `${field} cannot be empty`,
            },
            { status: 400 },
          );
        }
      }
    }

    const social = await prisma.social.update({
      where: { id },

      data: {
        ...(label !== undefined && {
          label: label.trim(),
        }),

        ...(url !== undefined && {
          url: url.trim(),
        }),

        ...(handle !== undefined && {
          handle: handle.trim(),
        }),
      },
    });

    return NextResponse.json(social);
  } catch (err) {
    console.error("[PATCH /api/social/:id]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── DELETE /api/social/:id ─────────────────────────────────────── */
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const existing = await prisma.social.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 },
      );
    }

    await prisma.social.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Social link deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/social/:id]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
