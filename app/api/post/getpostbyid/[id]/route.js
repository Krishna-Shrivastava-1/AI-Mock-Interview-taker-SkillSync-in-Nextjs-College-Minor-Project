import { broadcastUpdate } from "@/app/api/events/route"
import database from "@/Database/Database"
import { postModel } from "@/Models/Post"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
export async function GET(req, { params }) {
    try {
        const { id } = await params
        await database()

const authHeader = req.headers.get('authorization')
const idHeaderofUser = authHeader?.split(' ')[1]
if(!idHeaderofUser ){
    return NextResponse.json({
        messaage:'Unauthorized User',
        success:false,
    })
}
// console.log(authHeader)
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


        const post = await postModel.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('user');
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