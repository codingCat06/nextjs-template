import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/auth/server";
import { db } from "@/server/db";
import { file } from "@/server/db/schema/index";
import { eq, and } from "drizzle-orm";
import { getFileStream } from "@/server/storage/r2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "true";

    const [result] = await db
      .select()
      .from(file)
      .where(and(eq(file.id, id), eq(file.ownerUserId, session.user.id)));

    if (!result) {
      return new NextResponse("File not found", { status: 404 });
    }

    const stream = await getFileStream(result.storageKey);
    const disposition = isDownload ? "attachment" : "inline";

    return new NextResponse(stream, {
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(result.originalName)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
