import database from "@/Database/Database"
import { postModel } from "@/Models/Post"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"

export async function POST(req, res) {
    try {
        const { post, userId } = await req.json()
        await database()
  const posts =    await postModel.create({
            message: post,
            user: userId

        })
        await userModel.findByIdAndUpdate(userId,{
            $addToSet:{posts:posts?._id}
        },{new:true})
        return NextResponse.json({
            message:'post Created Successfully',
            success:true
        })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: 'Server Error',
            success: false
        })
    }
}