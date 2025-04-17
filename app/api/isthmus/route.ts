// app/api/isthmus/route.ts
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rssUrl = "https://isthmus.com/api/contentlist/local-events/atom/?no-cache=1";
    const res = await fetch(rssUrl);
    if (!res.ok) {
      return new Response("Failed to fetch RSS feed", { status: 500 });
    }

    const xml = await res.text();
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
