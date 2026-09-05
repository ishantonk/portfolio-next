import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db"; // adjust to your prisma client path
import { ProfileDTO, ProfileWithRelationsDTO } from "@/types/common";

/* ── GET /api/profile ───────────────────────────────────────────── */
export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: { skills: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── PATCH /api/profile ─────────────────────────────────────────── */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      role,
      location,
      email,
      phone,
      bio,
      availability,
      image,
      resume,
      skills,
    }: Partial<ProfileWithRelationsDTO> = body;

    if (!id) {
      return NextResponse.json(
        { error: "Profile id is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    /*
     * Validate normal fields when supplied.
     */
    const fields: Partial<ProfileDTO> = {
      name,
      role,
      location,
      email,
      phone,
      bio,
      availability,
      image,
      resume,
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
     * Validate skills only when supplied.
     *
     * undefined = keep existing skills
     * []        = invalid
     */
    let validSkills: { name: string }[] | undefined;

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return NextResponse.json(
          {
            error: "Skills must be an array",
          },
          { status: 400 },
        );
      }

      validSkills = skills
        .filter(
          (skill) =>
            skill &&
            typeof skill.name === "string" &&
            skill.name.trim().length > 0,
        )
        .map((skill) => ({
          name: skill.name.trim(),
        }));

      if (validSkills.length === 0) {
        return NextResponse.json(
          {
            error: "At least one valid skill is required",
          },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      /*
       * Only replace skills when skills were supplied.
       */
      if (validSkills !== undefined) {
        await tx.skill.deleteMany({
          where: {
            profileId: id,
          },
        });
      }

      return tx.profile.update({
        where: {
          id,
        },

        data: {
          ...(name !== undefined && {
            name: name.trim(),
          }),

          ...(role !== undefined && {
            role: role.trim(),
          }),

          ...(location !== undefined && {
            location: location.trim(),
          }),

          ...(email !== undefined && {
            email: email.trim(),
          }),

          ...(phone !== undefined && {
            phone: phone.trim(),
          }),

          ...(bio !== undefined && {
            bio: bio.trim(),
          }),

          ...(availability !== undefined && {
            availability: availability.trim(),
          }),

          ...(image !== undefined && {
            image: image.trim(),
          }),

          ...(resume !== undefined && {
            resume: resume.trim(),
          }),

          ...(validSkills !== undefined && {
            skills: {
              createMany: {
                data: validSkills,
              },
            },
          }),
        },

        include: {
          skills: true,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/profile]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
