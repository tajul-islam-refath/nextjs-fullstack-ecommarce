import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

// Image compression settings
const COMPRESSION_SETTINGS = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 80,
  format: "webp" as const,
};

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Generate unique filename
function generateUniqueFilename(
  originalName: string,
  newExtension?: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = newExtension || originalName.split(".").pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

// Check if file is an image
function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

// Compress image using sharp
async function compressImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(COMPRESSION_SETTINGS.maxWidth, COMPRESSION_SETTINGS.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: COMPRESSION_SETTINGS.quality })
    .toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    await ensureUploadDir();

    const uploadedFiles: Array<{
      originalName: string;
      filename: string;
      path: string;
      url: string;
      size: number;
      type: string;
      compressed: boolean;
    }> = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      let buffer = Buffer.from(bytes);
      let finalType = file.type;
      let compressed = false;

      // Compress if it's an image
      if (isImage(file.type)) {
        try {
          const compressedBuffer = await compressImage(buffer);
          buffer = Buffer.from(compressedBuffer);
          finalType = `image/${COMPRESSION_SETTINGS.format}`;
          compressed = true;
        } catch (error) {
          console.warn(`Failed to compress image ${file.name}:`, error);
          // Continue with original buffer if compression fails
        }
      }

      // Generate filename with appropriate extension
      const uniqueFilename = compressed
        ? generateUniqueFilename(file.name, COMPRESSION_SETTINGS.format)
        : generateUniqueFilename(file.name);

      const filepath = join(UPLOAD_DIR, uniqueFilename);

      await writeFile(filepath, buffer);

      uploadedFiles.push({
        originalName: file.name,
        filename: uniqueFilename,
        path: filepath,
        url: `/uploads/${uniqueFilename}`,
        size: buffer.length,
        type: finalType,
        compressed,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
