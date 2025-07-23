import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { public_id } = await req.json();

  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Delete failed", details: error }, { status: 500 });
  }
}
