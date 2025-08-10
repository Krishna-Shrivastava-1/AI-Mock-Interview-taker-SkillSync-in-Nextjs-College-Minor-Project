import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        // console.log('cookie', cookies().get('authtoken'))
        cookies().set('authtoken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),

        })
        // console.log('cookie', cookies().get('authtoken'))
        return NextResponse.json({ message: 'Logged out successfully', success: true });
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: 'Logout Error',
            success: false
        })
    }
}