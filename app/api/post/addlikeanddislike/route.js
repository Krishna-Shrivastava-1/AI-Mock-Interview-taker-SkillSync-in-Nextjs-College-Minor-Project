import database from "@/Database/Database"
import { postModel } from "@/Models/Post"
import { NextResponse } from "next/server"

export async function PUT(req, res) {
    try {
        const { userId, postId } = await req.json()
        await database()
        const postfind = await postModel.findById(postId)
        if (!postfind) {
            return NextResponse.json({
                message: 'No post Found',
                success: false
            })
        }
        let updatedPost
        if (postfind?.likes?.includes(userId)) {
            updatedPost = await postModel.findByIdAndUpdate(postId, {
                $pull: { likes: userId }
            }, { new: true }).populate('user')
            return NextResponse.json({
                message: 'user disliked this post',
                success: true,
                updatedPost
            })
        } else {
            updatedPost = await postModel.findByIdAndUpdate(postId, {
                $addToSet: { likes: userId }
            }, { new: true }).populate('user')
            return NextResponse.json({
                message: 'user liked this post',
                success: true,
                 updatedPost
            })
        }


    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: 'Server error',
            succes: false,
            status: 500
        })
    }
}