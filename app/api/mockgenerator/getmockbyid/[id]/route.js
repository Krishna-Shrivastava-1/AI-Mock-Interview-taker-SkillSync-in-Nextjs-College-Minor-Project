import database from "@/Database/Database"
import { mockModel } from "@/Models/Mock";
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    try {
        const { id } = await params;  // Mock test ID
        console.log(id)

        await database()

        const mockTest = await mockModel.findById(id).select('-questions.correctAnswer -questions.explaination');
        if (!mockTest) {
            return NextResponse.json({
                mesage: 'Mock test not found',

                status: 401
            })
        }
        return NextResponse.json({
            mock: mockTest,
            success: true
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message: 'Server error',
            status: 500
        })
    }
}