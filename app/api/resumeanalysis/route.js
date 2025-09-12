import database from "@/Database/Database";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { resumeModel } from "@/Models/Resume";
import { userModel } from "@/Models/User";
import { uploadCloudinary } from "@/cloudinary/upload";
import nodemailer from "nodemailer";
const genAI = new GoogleGenerativeAI(process.env.GeminiAPI2);
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

    await database()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const formData = await req.formData();
    const jd = formData.get("jd");
    const userId = formData.get("userID")
    const file = formData.get("resume");


    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const getUploadedResumeUrl = await uploadCloudinary(buffer)
    const uploadedResumeURL = getUploadedResumeUrl?.secure_url
    // https://ai-mock-test-minor-project-text.onrender.com
    // http://localhost:5000/extract-text
    const res = await fetch(process.env.PythonTexExtractorAPI, {
      method: "POST",
      body: formData,
    });
    const data = await res.json()
    const resumeText = data?.resume_text
    if (!uploadedResumeURL) {
      return NextResponse.json({
        messgae: 'Error in Resume Upload',
        status: 401
      })
    }
    if (!resumeText) {
      return NextResponse.json({ error: "Text not extracted" }, { status: 400 });
    }
    let prompt = `
You are an expert career coach and recruiter. Your task is to analyze a resume and provide a professional assessment as a single JSON object.

The JSON object must contain the following fields:

"overall_assessment": string - A single paragraph summarizing if the resume is good, where its overall value lies, and how it compares to industry standards.
"skill_relevance_and_match": object - This object contains two fields:
    "skill_relevance": string - A professional assessment of whether the candidate's skills and roles are relevant to current industry requirements.
    "jd_match_percentage": number - A match score (0-100%) for the job description. Provide 0% if no JD is given.
"improvement_tips": array of strings - Overall tips for improving the resume's content, formatting, and impact.
"interview_questions": array of strings - 5 sample interview questions based on the resume's content.
"future_guidance": object - This object provides forward-looking advice:
    "strength_guide": array of strings - A list of the candidate's core strengths and what opportunities they are best suited for.
    "skill_acquisition": array of strings - A list of key skills the candidate should acquire to improve their career trajectory.

---
Here is the candidate's resume:
---
${resumeText}
---
`;

    // If JD exists, ask for JD-based analysis
    if (jd && jd.trim().length > 0) {
      prompt += `
Here is the job description:
---
${jd}
---
Compare the resume with the job description and fill out the JSON object. Specifically, provide the jd_match_percentage and use the JD as the context for your analysis.
`;
    } else {
      // No JD -> general analysis
      prompt += `
No job description is provided.
Analyze the resume and fill out the JSON object. For "jd_match_percentage", provide 0%.
`;
    }

    const result = await model.generateContent(prompt);
    let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    // const aiAnalysisofResume = JSON.parse(text);
    let aiAnalysisofResume;
    try {
      aiAnalysisofResume = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON.parse failed:", err.message);
      console.log("Raw AI output:", text);

      // attempt to auto-fix common issues
      const cleaned = text
        .replace(/,\s*([}\]])/g, "$1")  // remove trailing commas
        .replace(/(\r\n|\n|\r)/gm, ""); // remove newlines that break JSON

      try {
        aiAnalysisofResume = JSON.parse(cleaned);
      } catch (err2) {
        throw new Error("Still invalid JSON from Gemini. Check AI response.");
      }
    }
    if (!aiAnalysisofResume) {
      return NextResponse.json({
        message: 'Error in Analyzing Resume',
        status: 401,
        success: false
      })
    }

    // console.log(uploadedResumeURL)
   const fetchUser = await userModel.findById(userId)
   const strengthsList = Array.isArray(aiAnalysisofResume?.future_guidance?.strength_guide)
  ? aiAnalysisofResume.future_guidance.strength_guide.map(item => `<li>${item}</li>`).join("")
  : `<li>${aiAnalysisofResume?.future_guidance?.strength_guide || "N/A"}</li>`;

const improvementsList = Array.isArray(aiAnalysisofResume?.improvement_tips)
  ? aiAnalysisofResume.improvement_tips.map(item => `<li>${item}</li>`).join("")
  : `<li>${aiAnalysisofResume?.improvement_tips || "N/A"}</li>`;

const relevantSkillsList = Array.isArray(aiAnalysisofResume?.skill_relevance_and_match?.skill_relevance)
  ? aiAnalysisofResume.skill_relevance_and_match.skill_relevance.map(skill => `<li>${skill}</li>`).join("")
  : `<li>${aiAnalysisofResume?.skill_relevance_and_match?.skill_relevance || "N/A"}</li>`;

const skillAcquisitionList = Array.isArray(aiAnalysisofResume?.future_guidance?.skill_acquisition)
  ? aiAnalysisofResume.future_guidance.skill_acquisition.map(item => `<li>${item}</li>`).join("")
  : `<li>${aiAnalysisofResume?.future_guidance?.skill_acquisition || "N/A"}</li>`;

// console.log(aiAnalysisofResume)
 




    const resumeAnalyze = await resumeModel.create({
      user: userId,
      future_guidance: {
        skill_acquisition: aiAnalysisofResume?.future_guidance?.skill_acquisition,
        strength_guide: aiAnalysisofResume?.future_guidance?.strength_guide,
      },
      improvement_tips: aiAnalysisofResume?.improvement_tips,
      interview_questions: aiAnalysisofResume?.interview_questions,
      overall_assessment: aiAnalysisofResume?.overall_assessment,
      skill_relevance_and_match: {
        jd_match_percentage: aiAnalysisofResume?.skill_relevance_and_match?.jd_match_percentage,
        skill_relevance: aiAnalysisofResume?.skill_relevance_and_match?.skill_relevance,

      },
      uploadedResumeUrl: uploadedResumeURL,
      jobDescription: jd.trim(),

    });

 const user = await userModel.findByIdAndUpdate(userId, {
      $addToSet: { analyzedResume: resumeAnalyze?._id }
    }, { new: true })


   const mailOptions = {
      from: 'per550017@gmail.com',
      to: fetchUser?.email,
      subject: "Welcome to Mokai – Let’s Begin Your Growth Journey 🚀",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your Resume Analysis Report</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        color: #111827;
        margin: 0;
        padding: 20px;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
        max-width: 700px;
        margin: auto;
        border: 1px solid #e5e7eb;
      }
      h1 {
        color: #2563eb;
        font-size: 22px;
      }
      h2 {
        color: #374151;
        font-size: 18px;
        margin-top: 20px;
      }
      p {
        font-size: 14px;
        line-height: 1.6;
      }
      ul {
        margin: 10px 0 20px 20px;
        font-size: 14px;
      }
      .highlight {
        background-color: #f3f4f6;
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;
      }
      .btn {
        display: inline-block;
        background-color: #2563eb;
        color: #ffffff;
        padding: 12px 24px;
        margin: 20px 0;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your Resume Analysis Report 📊</h1>
      <p>Hi ${fetchUser?.name},</p>
      <p>
        Our AI has carefully analyzed your resume and generated personalized insights to help you
        improve your career prospects. Here’s a summary of your analysis:
      </p>

      <h2>📌 Overall Assessment</h2>
      <p class="highlight">${aiAnalysisofResume?.overall_assessment}</p>

      <h2>✅ Key Strengths</h2>
      <ul>
       
         ${strengthsList}
       
      </ul>

      <h2>⚡ Areas of Improvement</h2>
      <ul>
      
         ${improvementsList}
        
      </ul>

      <h2>🎯 Skill Relevance</h2>
      <p><strong>Job Description Match:</strong> ${aiAnalysisofResume?.skill_relevance_and_match?.jd_match_percentage}%</p>
      <p><strong>Relevant Skills:</strong></p>
      <ul>
        
         ${relevantSkillsList}
        
      </ul>

      <h2>📖 Guidance for Your Future</h2>
      <ul>
      
         ${skillAcquisitionList}
        
      </ul>

      <a href="https://mokai.vercel.app/analyzed-resume/${resumeAnalyze?._id }" class="btn">View Full Report</a>

      <p>
        Keep improving and refining your profile — every step takes you closer to your dream career!
      </p>

      <p><strong>– The Mokai AI Team</strong></p>

      <div class="footer">
        You are receiving this email because you analyzed your resume on Mokai.<br />
        © 2025 Mokai – All rights reserved.
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
      // console.log('Email sent:', info.response);
      return res.status(201).json({
        message: 'Account created successfully and welcome email sent.',
        success: true,
      });
    })


    return NextResponse.json({
      analyzedResume: resumeAnalyze,
      success: true
    });
  } catch (err) {
    console.error("PDF parse error:", err);
    return NextResponse.json(
      { error: "Failed to parse PDF", details: err.message },
      { status: 500 }
    );
  }
}
