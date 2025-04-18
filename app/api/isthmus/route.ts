// app/api/isthmus/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://isthmus.com/api/rss/events", {
    headers: {
      "Content-Type": "application/xml"
    }
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
