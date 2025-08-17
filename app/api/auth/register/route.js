import database from "@/Database/Database";
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import nodemailer from "nodemailer";
const resend = new Resend(process.env.RESEND_API_KEY || 're_iXEpkLkP_NJM51fXbr6pfLyUve53wZrTW');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: '834513002@smtp-brevo.com',
    pass: 'GaJd5XcMxCkpn3WR',
  }
})
export async function POST(req, res) {
  try {
    const { name, email, password } = await req.json();
    await database();
    if (!name || !email || !password) {
      return NextResponse.json({
        message: "Please Fill All Fields",
        error: 401,
        success: false,
      });
    }

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return NextResponse.json({
        message: "User Already Exist",
        success: false,
      });
    }
    const isUserNameExist = await userModel.findOne({ name });
    if (isUserNameExist) {
      return NextResponse.json({
        message: "Username Already Exist",
        success: false,
      });
    }
    const hashpassword = await bcrypt.hash(password, 12);
    await userModel.create({
      name,
      email,
      password: hashpassword,
    });

    const mailOptions ={
      from: 'per550017@gmail.com',
      to: email,
      subject: "Welcome to SkillSync – Let’s Begin Your Growth Journey 🚀",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to SkillSync</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333333;
        padding: 20px;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
        max-width: 600px;
        margin: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #e11d48;
      }
      .btn {
        display: inline-block;
        background-color: #e11d48;
        color: #ffffff;
        padding: 12px 24px;
        margin-top: 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #999999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to SkillSync! 👋</h1>
      <p>
        Hi ${name},
      </p>
      <p>
        Thanks for joining <strong>SkillSync</strong> – your AI-powered career coaching and learning companion!
      </p>
      <p>
        You're now part of a growing community of learners who are sharpening their skills, refining their resumes, and preparing for interviews like pros.
      </p>
      <p>
        Here’s what you can start doing:
      </p>
      <ul>
        <li>✨ Add your skills & upload your resume</li>
        <li>🧠 Take AI-powered mock interviews</li>
        <li>📈 Get performance feedback & analytics</li>
        <li>🤝 Connect with peers via the community panel</li>
      </ul>
      <a href="https://skillsync-ebon.vercel.app/login" class="btn">Go to Dashboard</a>
      <p style="margin-top: 30px;">
        We’re here to support you every step of the way. If you have any questions, just hit reply!
      </p>
      <p>Welcome aboard, and let’s skill up! 🚀</p>
      <p><strong>– The SkillSync Team</strong></p>

      <div class="footer">
        You are receiving this email because you signed up on SkillSync.<br />
        © 2025 SkillSync – All rights reserved.
      </div>
    </div>
  </body>
</html>
`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error in Sending email ', error)
        return res.status(500).json({
          message: 'Account created, but failed to send welcome email.',
          success: true,
        });
      }
      console.log('Email sent:', info.response);
      return res.status(201).json({
        message: 'Account created successfully and welcome email sent.',
        success: true,
      });
    })

    return NextResponse.json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({
      message: "Server Error",
      success: false,
    });
  }
}
