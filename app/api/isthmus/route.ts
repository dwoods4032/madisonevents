// app/api/isthmus/route.ts

export async function GET() {
  try {
    const response = await fetch("https://isthmus.com/search/event/calendar/?d=range&format=rss", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MadisonEventsBot/1.0)"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return new Response("Failed to fetch external RSS feed.", { status: 502 });
    }

    const xml = await response.text();

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml"
      }
    });
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
