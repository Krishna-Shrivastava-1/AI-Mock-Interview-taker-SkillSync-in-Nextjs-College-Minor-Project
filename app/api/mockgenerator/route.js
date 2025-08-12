import database from "@/Database/Database";
import { mockModel } from "@/Models/Mock";
import { userModel } from "@/Models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


const genAI = new GoogleGenerativeAI('AIzaSyCOlI2oRIS9Evk_RSsr2HUWGOQDBUfKhI0');
export async function POST(req, res) {
    try {
        const { skill, role, difficulty, userid } = await req.json()

        await database()
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an expert interview panel AI.
Your task is to generate exactly 10 multiple-choice interview questions based on the provided role, skills, and difficulty.

Role: ${role}
Skills: ${skill}
Difficulty: ${difficulty}

Rules:
- Each question must have EXACTLY 4 unique answer choices in an "options" array.
- Only one option is correct, labeled in the "correct_answer" field.
- The "explanation" must explain why that correct answer is right.
- All fields ("question", "options", "correct_answer", "explanation") MUST be present for every question. Never omit any field.
- Do not ask ambiguous or opinion-based questions.
- Keep answers concise but correct.
- Avoid repetition.

Return ONLY valid JSON in this format with no extra text:
[
  {
    "question": "Which of the following is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    "correct_answer": "O(log n)",
    "explanation": "Binary search halves the search space in each step, resulting in logarithmic time complexity."
  }
]
`;


        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const aiQuestions = JSON.parse(text);
        // console.log(aiQuestions)
        const mockTest = await mockModel.create({
            user: userid,

            questions: aiQuestions.map(q => ({
                questionText: q.question,        // Gemini uses "question"
                options: q.options,
                correctAnswer: q.correct_answer, // Gemini uses "correct_answer"
                explanation: q.explanation,
                difficulty: difficulty,
                explaination: q.explanation
            }))

        })
        // console.log(mockTest)
        const safeQuestions = mockTest.questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            difficulty: q.difficulty,


        }));
        const usermock = await userModel.findByIdAndUpdate(userid, {
            $addToSet: { mockAttempts: mockTest?._id }
        }, { new: true })
        console.log("MockTest ID:", mockTest._id.toString());
        console.log("User mockAttempts after update:", usermock.mockAttempts.map(id => id.toString()));

        return NextResponse.json({
            mockTestId: mockTest?._id,
            // questions: safeQuestions,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            message: "Server error",
            success: false,
        });
    }
}
