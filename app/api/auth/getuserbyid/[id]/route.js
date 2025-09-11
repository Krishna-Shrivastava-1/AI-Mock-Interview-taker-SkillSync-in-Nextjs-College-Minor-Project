import database from "@/Database/Database"
import { mockModel } from "@/Models/Mock";
import { postModel } from "@/Models/Post";
import { resumeModel } from "@/Models/Resume";
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
const secretKey = process.env.Secretkey
export async function GET(req, { params }) {
  try {
    const { id } = await params; // Getting user id
    await database();
const authHeader = req.headers.get('authorization')
const idHeaderofUser = authHeader?.split(' ')[1]
if(!idHeaderofUser ){
    return NextResponse.json({
        messaage:'Unauthorized User',
        success:false,
    })
}
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

    // Prevent users from fetching others' data
    // if (decoded?.id !== id) {
    //   return NextResponse.json({ message: "Unauthorized user" }, { status: 403 });
    // }

    const userById = await userModel
      .findById(id)
      .select("-password")
      .populate("mockAttempts posts analyzedResume following");

    if (!userById) {
      return NextResponse.json({
        message: "No user Found please Login",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "User found",
      user: userById,
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}