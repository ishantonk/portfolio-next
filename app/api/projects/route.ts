import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { ProjectWithRelationsDTO } from "@/types/common";

/* ── GET /api/projects ─────────────────────────────────────────── */
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tech: true,
        features: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error("[GET /api/projects]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── POST /api/projects ────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      thumbnail,
      year,
      accent,
      liveUrl,
      sourceCodeUrl,
      tech = [],
      features = [],
    }: ProjectWithRelationsDTO = body;

    // Required project fields
    if (
      !title?.trim() ||
      !description?.trim() ||
      !thumbnail?.trim() ||
      !year?.trim() ||
      !accent?.trim() ||
      !liveUrl?.trim() ||
      !sourceCodeUrl?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "title, description, thumbnail, year, accent, liveUrl and sourceCodeUrl are required",
        },
        { status: 400 },
      );
    }

    // At least one tech is required
    if (!Array.isArray(tech) || tech.length === 0) {
      return NextResponse.json(
        {
          error: "At least one technology is required",
        },
        { status: 400 },
      );
    }

    // At least one feature is required
    if (!Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        {
          error: "At least one feature is required",
        },
        { status: 400 },
      );
    }

    // Remove empty technologies
    const validTech = tech.filter((item) => item?.name?.trim());

    if (validTech.length === 0) {
      return NextResponse.json(
        {
          error: "At least one valid technology is required",
        },
        { status: 400 },
      );
    }

    // Remove empty features
    const validFeatures = features.filter((item) => item?.content?.trim());

    if (validFeatures.length === 0) {
      return NextResponse.json(
        {
          error: "At least one valid feature is required",
        },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        year: year.trim(),
        accent: accent.trim(),
        liveUrl: liveUrl.trim(),
        sourceCodeUrl: sourceCodeUrl.trim(),

        tech: {
          createMany: {
            data: validTech,
          },
        },

        features: {
          createMany: {
            data: validFeatures,
          },
        },
      },

      include: {
        tech: true,
        features: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("[POST /api/projects]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
