import database from "@/Database/Database"
import { resumeModel } from "@/Models/Resume"
import { NextResponse } from "next/server"

export async function GET(req,{params}) {
    try {
        const {id} = await params
        if(!id){
            return NextResponse.json({
                message:'Id not Found'
            })
        }
        await database()
        const resumeData = await resumeModel.findById(id)
        if(!resumeData){
            return NextResponse.json({
                message:'No Analysis Found',
                status:401
            })
        }
        return NextResponse.json({
           getanalysisbyid : resumeData
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            message:'Server Error',
            status:500
        })
    }
}