import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssUrl = "https://isthmus.com/search/event/calendar/rss/?sort=start_time%20asc&location=madison";
    const res = await fetch(rssUrl);

    if (!res.ok) {
      return new NextResponse("Failed to fetch RSS feed", { status: 502 });
    }

    const xml = await res.text();
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml"
      }
    });
  } catch (err) {
    return new NextResponse("Error fetching RSS feed", { status: 500 });
  }
}
