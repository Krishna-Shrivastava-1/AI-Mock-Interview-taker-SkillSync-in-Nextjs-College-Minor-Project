import database from "@/Database/Database"
import { postModel } from "@/Models/Post"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
export async function GET(req, res) {
    try {
        await database()
        // const posts = await postModel.find()

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
        const token = (await cookies()).get("authtoken")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.Secretkey);
        } catch (err) {
            return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        // Calculate the number of documents to skip based on the page number.
        const skip = (page - 1) * limit;

        // Fetch the posts from the database using skip() and limit().
        // We also sort them by creation date in descending order to get the newest posts first.
        const posts = await postModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit).populate({ path: "user", select: '-password -mockAttempts -isFilledaboutandskill -descriptionAbout -skills -uploadedResume -email' });

        return NextResponse.json({
            message: 'Posts fetched successfully',
            posts: posts,
            success: true
        });
        return NextResponse.json({
            message: 'post Created Successfully',
            post: posts,
            success: true
        })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: 'Server Error',
            success: false
        })
    }
}