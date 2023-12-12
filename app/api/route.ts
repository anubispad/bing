// app/api/img/route.ts
export async function GET(request: Request) {
    return new Response(JSON.stringify({
      name: "TokenN",
      symbol: "FUD",
      description: "Just a test for how to name your token ;)",
      image: "https://dataapi-f8d3b.web.app/usdc.jpg"
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  