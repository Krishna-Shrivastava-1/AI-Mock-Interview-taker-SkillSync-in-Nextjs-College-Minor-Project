import database from "@/Database/Database";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { resumeModel } from "@/Models/Resume";
import { userModel } from "@/Models/User";
import { uploadCloudinary } from "@/cloudinary/upload";

const genAI = new GoogleGenerativeAI(process.env.GeminiAPI2);
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
    if(!aiAnalysisofResume){
      return NextResponse.json({
        message:'Error in Analyzing Resume',
        status:401,
        success:false
      })
    }

    console.log(uploadedResumeURL)

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
      jobDescription:jd.trim(),
      
    });
    const user = await userModel.findByIdAndUpdate(userId, {
      $addToSet: { analyzedResume: resumeAnalyze?._id }
    }, { new: true })


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
