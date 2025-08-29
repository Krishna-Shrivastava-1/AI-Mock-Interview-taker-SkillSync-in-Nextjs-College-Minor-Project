import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
const secretKey = process.env.Secretkey;
export async function GET(res) {
    try {
        const token = (await cookies()).get('authtoken').value
         if (!token) {
            return NextResponse.json({
                mesage: 'Unauthorized User',
                status: 401
            })
        }
        try {
            const decode = jwt.verify(token, secretKey)
            return NextResponse.json({
                message: 'Authorized',
                user: decode,
                status: 200,
                // token:token
            })
        } catch (error) {
            return NextResponse.json({ error: 'Forbidden: Invalid or expired token', status: 403 });
        }
    } catch (error) {
         return NextResponse.json({ error: 'Server error', status: 403 });
    }
}