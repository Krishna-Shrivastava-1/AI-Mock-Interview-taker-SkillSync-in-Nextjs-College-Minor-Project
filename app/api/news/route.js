import { NextResponse } from "next/server";
const newApiKey = process.env.NewsAPI;

export async function GET(req, res) {
  try {
    const newsData = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${newApiKey}&q=AI%20OR%20%22big%20tech%22%20OR%20ChatGPT%20OR%20tech&category=technology&language=en&size=6`,
      {
        method: "GET",
        cache: "no-store", // Use 'no-store' for fresh data
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