import database from "@/Database/Database"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"

export async function PUT(req,res) {
    try {
        const{userId,skills,description } = await req.json()
        await database()
        const userupdate = await userModel.findByIdAndUpdate(userId,{
            descriptionAbout:description,
            isFilledaboutandskill:true,
            skills:skills
        },{new:true})
        return NextResponse.json({
            messaage:'User Profile Completed Successfully',
            status:201
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            messaage:"Server Error",
            status:500
        })
    }
}