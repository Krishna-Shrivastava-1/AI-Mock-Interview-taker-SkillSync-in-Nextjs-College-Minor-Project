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

// const authHeader = req.headers.get('authorization')
// const idHeaderofUser = authHeader?.split(' ')[1]
// if(!idHeaderofUser ){
//     return NextResponse.json({
//         messaage:'Unauthorized User',
//         success:false,
//     })
// }
  const { searchParams } = new URL(req.url)
  const ts = parseInt(searchParams.get("ts"))
    const clientKey = req.headers.get("x-client-key")

if (clientKey !== process.env.NEXT_PUBLIC_CLIENT_KEY) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}
 const now = Math.floor(Date.now() / 1000)
  if (!ts || Math.abs(now - ts) > 300) {
    return NextResponse.json({ message: "Invalid timestamp" }, { status: 401 })
  }
// console.log(authHeader)
    // const token = (await cookies()).get("authtoken")?.value;
    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let decoded;
    // try {
    //   decoded = jwt.verify(token, process.env.Secretkey);
    // } catch (err) {
    //   return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    // }



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