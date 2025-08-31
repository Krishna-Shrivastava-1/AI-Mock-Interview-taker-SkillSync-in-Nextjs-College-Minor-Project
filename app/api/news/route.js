import { NextResponse } from "next/server";
const newApiKey = process.env.NewsAPI;
const allowedClientKey = process.env.NEXT_PUBLIC_CLIENT_KEY // check match
const serverSecret = process.env.CLIENT_SECRET // only used if you want HMAC signatures
export async function GET(req, res) {
  try {
     const { searchParams } = new URL(req.url)
  const ts = parseInt(searchParams.get("ts"))
    const clientKey = req.headers.get("x-client-key")

if (clientKey !== process.env.NEXT_PUBLIC_CLIENT_KEY) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}
 const now = Math.floor(Date.now() / 1000)
  if (!ts || Math.abs(now - ts) > 300) {
    return NextResponse.json({ message: "Invalid timestamp" }, { status: 401 })
  }
    const newsData = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${newApiKey}&q=AI%20OR%20%22big%20tech%22%20OR%20ChatGPT%20OR%20tech&category=technology&language=en&size=8`,
      {
        method: "GET",
        next: {revalidate:60*10},
      }
    );

    // Check if the response was successful
    if (!newsData.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch news",
        },
        { status: newsData.status } // Use the status from the API response
      );
    }

    const data = await newsData.json(); // Use await to get the JSON data
    return NextResponse.json(
      {
        message: "News found",
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "Server error",
      },
      { status: 500 }
    );
  }
}