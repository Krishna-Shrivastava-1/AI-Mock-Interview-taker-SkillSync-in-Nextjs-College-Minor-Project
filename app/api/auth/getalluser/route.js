import database from "@/Database/Database"
import { mockModel } from "@/Models/Mock";
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server"

export async function GET(req,res) {
    try {
        await database();
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
                // const token = (await cookies()).get("authtoken")?.value;
                // if (!token) {
                //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                // }
        
                // let decoded;
                // try {
                //     decoded = jwt.verify(token, process.env.Secretkey);
                // } catch (err) {
                //     return NextResponse.json({ message: "Invalid token" }, { status: 403 });
                // }
        const allUser = await userModel.find().select('-password').populate('mockAttempts')
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