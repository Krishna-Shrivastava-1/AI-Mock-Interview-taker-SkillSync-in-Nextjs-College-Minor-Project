import database from "@/Database/Database"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"

export async function PUT(req, res) {
    try {
        const { userId, skills, description, name } = await req.json()

        await database()
    const isNameExist = await userModel.findOne({
            _id: { $ne: userId }, // Exclude the current user's document
            name: name.trim()
        });
        if (isNameExist) {
            return NextResponse.json({
                message: 'This Name Already Exist.',
                success: false
            })
        }
        const userupdate = await userModel.findByIdAndUpdate(userId, {
            descriptionAbout: description,
            isFilledaboutandskill: true,
            skills: skills,
            name:name
        }, { new: true })

        return NextResponse.json({
            message: 'User Profile Updated Successfully',
            success: true,
            status: 201
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            messaage: "Server Error",
            status: 500
        })
    }
}