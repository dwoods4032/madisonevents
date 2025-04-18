// app/api/isthmus/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssUrl = "https://isthmus.com/api/rss/all-events/";
    const res = await fetch(rssUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch RSS feed from Isthmus");
    }

    const xml = await res.text();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml"
      }
    });
  } catch (error) {
    console.error("API route error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
