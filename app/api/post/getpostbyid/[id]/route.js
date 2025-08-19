import database from "@/Database/Database"
import { postModel } from "@/Models/Post"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    try {
        const { id } = await params
        await database()
        const post = await postModel.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!post) {
            return NextResponse.json({
                message: 'This Post is not Exist',
                success: false
            })
        }

        return NextResponse.json({
            message: 'post founded',
            post: post,
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