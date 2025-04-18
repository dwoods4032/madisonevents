// app/api/isthmus/route.ts

export async function GET() {
  try {
    const proxyFeedURL = encodeURIComponent("https://isthmus.com/search/event/calendar/?d=range&format=rss");
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${proxyFeedURL}`;

    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (!data || !data.items) {
      return new Response("No events found in parsed feed.", { status: 502 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Proxy RSS fetch failed:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
