'use client'
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useEffect } from 'react'
const genAI = new GoogleGenerativeAI('AIzaSyAzZRBu_05fGWtVnE3pJ7yXMt3mynIj5w4');
const page = () => {
const generateAImockQuest = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert interview panel AI.  
Your task is to generate exactly 10 multiple-choice interview questions based on the provided role, skills, and difficulty.

User role: Data Analyst  
Skills/Topics: Python,java 
Difficulty: medium  

Rules:
- Each question must have exactly 4 unique answer choices in an "options" array.
- Only one option is correct, labeled in the "correct_answer" field.
- The "explanation" must explain why that correct answer is right.
- Do not ask ambiguous or opinion-based questions.
- Keep answers concise but correct.
- Avoid repetition.

Return the output strictly in this JSON format:
[
  {
    "id": 1,
    "question": "Which of the following is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    "correct_answer": "O(log n)",
    "explanation": "Binary search halves the search space in each step, resulting in logarithmic time complexity."
  }
]
Only return valid JSON without any extra text or formatting.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // ✅ Remove Markdown code block wrappers if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // ✅ Parse safely
    const data = JSON.parse(text);
    console.log("Generated MCQs:", data);

    return data;
  } catch (err) {
    console.error("Error generating questions:", err);
    return [];
  }
};

useEffect(() => {
//   generateAImockQuest();
}, []);


  return (
    <div>
     <Navbar />
  <Button >generate Quiz</Button>
    </div>
  )
}

export default page


//  User role: ${role}  
//  Skills/Topics: ${skills}  
//  Difficulty: ${difficulty}