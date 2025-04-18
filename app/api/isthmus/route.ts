// app/api/isthmus/route.ts

export async function GET() {
  const response = await fetch("https://isthmus.com/api/rss/all-events/");
  const xml = await response.text();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
