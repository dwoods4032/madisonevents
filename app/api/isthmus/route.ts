export async function GET() {
  const rssURL = 'https://isthmus.com/search/event/calendar-of-events/rss/';
  try {
    const res = await fetch(rssURL);
    const xml = await res.text();
    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (err) {
    return new Response('Error fetching RSS feed', { status: 500 });
  }
}
