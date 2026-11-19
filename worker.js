// Chicago HQ automatic deployment
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response("Chicago HQ data worker is running!");
    }

    const allowed = [
      "site.api.espn.com",
      "api-web.nhle.com",
      "query1.finance.yahoo.com"
    ];

    let source;
    try {
      source = new URL(target);
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    if (
      source.protocol !== "https:" ||
      !allowed.includes(source.hostname)
    ) {
      return new Response("Source not allowed", { status: 403 });
    }

    try {
      const response = await fetch(source.toString());

      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60"
        }
      });
    } catch {
      return new Response("Source unavailable", { status: 502 });
    }
  }
};
