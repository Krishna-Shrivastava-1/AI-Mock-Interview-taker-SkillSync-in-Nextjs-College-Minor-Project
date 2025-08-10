import database from "@/Database/Database"
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server"

export async function GET(req, {params}) {
    try {
        const { id } = await params  // Getting user id
        await database();
        const userById = await userModel.findById( id ).select('-password')
        if (!userById) {
            return NextResponse.json({
                message: 'No user Found please Login',
                status: 401,
                success: false
            })
        }
        return NextResponse.json({
            message: 'User found',
            user: userById,
            status: 201,
            success: true
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: 'Server Error'
        })
    }
}