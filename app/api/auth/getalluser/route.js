import database from "@/Database/Database"
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server"

export async function GET(req,res) {
    try {
        await database();
        const allUser = await userModel.find().select('-password')
        return NextResponse.json({
            message:'All Users are',
            user:allUser,
            status:201
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message:'Server error',
            status:500
        })
    }
}