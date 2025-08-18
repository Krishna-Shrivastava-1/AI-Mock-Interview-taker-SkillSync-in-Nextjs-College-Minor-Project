import database from "@/Database/Database";
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const secretKey = process.env.Secretkey;
export async function POST(req, res) {
  try {
    const { email, password } = await req.json();
    await database();
    if (!email || !password) {
      return NextResponse.json({
        message: "Please Fill All Fields",
        error: 401,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "User Not Found",
        success: false,
      });
    }

    const ispasswordcorrect = await bcrypt.compare(password, user.password);
    if (!ispasswordcorrect) {
      return NextResponse.json({
        message: "Invalid Credential",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1d" });
    const oneday = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + oneday);
    cookies().set("authtoken", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: expirationDate,
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({
      token: token,
      message: `Logged in Successfully`,
      // message: `Logged in Successfully User - ${user.name}`,
      success: true,
      owner: false,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({
      message: "Server error",
      success: false,
    });
  }
}
