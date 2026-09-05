import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/* ── POST /api/projects/thumbnail ──────────────────────────────── */
// Form fields: file (File))
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Only JPEG, PNG, WebP and GIF are allowed",
        },
        { status: 415 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 4 MB limit" },
        { status: 413 },
      );
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Get extension from MIME type instead of trusting the filename
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const ext = extensions[file.type] ?? "jpg";

    // Collision-safe filename
    const filename = `project-thumbnail-${Date.now()}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: publicUrl,
    });
  } catch (err) {
    console.error("[POST /api/projects/thumbnail]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
