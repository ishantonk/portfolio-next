import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { FeatureDTO, ProjectWithRelationsDTO, TechDTO } from "@/types/common";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* ── GET /api/projects/:id ──────────────────────────────────────── */
export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tech: true,
        features: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET /api/projects/:id]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── PATCH /api/projects/:id ────────────────────────────────────── */
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      description,
      thumbnail,
      year,
      accent,
      liveUrl,
      sourceCodeUrl,
      tech,
      features,
    }: Partial<ProjectWithRelationsDTO> = body;

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    /*
     * Validate normal fields when they are provided.
     */
    const fields = {
      title,
      description,
      thumbnail,
      year,
      accent,
      liveUrl,
      sourceCodeUrl,
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

    /*
     * Validate tech if supplied.
     *
     * undefined = don't modify existing tech
     * []        = invalid
     */
    let validTech: TechDTO[] | undefined;

    if (tech !== undefined) {
      if (!Array.isArray(tech)) {
        return NextResponse.json(
          { error: "Tech must be an array" },
          { status: 400 },
        );
      }

      validTech = tech.filter(
        (item) =>
          item && typeof item.name === "string" && item.name.trim().length > 0,
      );

      if (validTech.length === 0) {
        return NextResponse.json(
          { error: "At least one valid technology is required" },
          { status: 400 },
        );
      }
    }

    /*
     * Validate features if supplied.
     *
     * undefined = don't modify existing features
     * []        = invalid
     */
    let validFeatures: FeatureDTO[] | undefined;

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return NextResponse.json(
          { error: "Features must be an array" },
          { status: 400 },
        );
      }

      validFeatures = features.filter(
        (item) =>
          item &&
          typeof item.content === "string" &&
          item.content.trim().length > 0,
      );

      if (validFeatures.length === 0) {
        return NextResponse.json(
          { error: "At least one valid feature is required" },
          { status: 400 },
        );
      }
    }

    /*
     * Update project and relations atomically.
     */
    const project = await prisma.$transaction(async (tx) => {
      // Replace technologies only when supplied
      if (validTech !== undefined) {
        await tx.projectTech.deleteMany({
          where: {
            projectId: id,
          },
        });
      }

      // Replace features only when supplied
      if (validFeatures !== undefined) {
        await tx.projectFeature.deleteMany({
          where: {
            projectId: id,
          },
        });
      }

      return tx.project.update({
        where: {
          id,
        },

        data: {
          ...(title !== undefined && {
            title: title.trim(),
          }),

          ...(description !== undefined && {
            description: description.trim(),
          }),

          ...(thumbnail !== undefined && {
            thumbnail: thumbnail.trim(),
          }),

          ...(year !== undefined && {
            year: year.trim(),
          }),

          ...(accent !== undefined && {
            accent: accent.trim(),
          }),

          ...(liveUrl !== undefined && {
            liveUrl: liveUrl.trim(),
          }),

          ...(sourceCodeUrl !== undefined && {
            sourceCodeUrl: sourceCodeUrl.trim(),
          }),

          ...(validTech !== undefined && {
            tech: {
              createMany: {
                data: validTech,
              },
            },
          }),

          ...(validFeatures !== undefined && {
            features: {
              createMany: {
                data: validFeatures,
              },
            },
          }),
        },

        include: {
          tech: true,
          features: true,
        },
      });
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error("[PATCH /api/projects/:id]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── DELETE /api/projects/:id ───────────────────────────────────── */
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // ProjectTech and ProjectFeature are automatically deleted
    // because your Prisma schema uses onDelete: Cascade.
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/projects/:id]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
