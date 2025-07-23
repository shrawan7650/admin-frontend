import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;
  const folder = data.get("folder") as string;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder || "uploads",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(uploadRes);
  } catch (error) {
    return NextResponse.json({ error: "Upload failed", details: error }, { status: 500 });
  }
}
