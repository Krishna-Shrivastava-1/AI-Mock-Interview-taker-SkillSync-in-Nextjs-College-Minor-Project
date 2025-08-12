import database from "@/Database/Database"
import { mockModel } from "@/Models/Mock"
import { NextResponse } from "next/server"

export async function PUT(req) {
    try {
        const { mockTestId, userresp } = await req.json();
        if (!mockTestId || !userresp) {
            return NextResponse.json({
                message: 'Data is lost of this quiz',
                status: 401
            });
        }

        await database();

        // 1. Find the mock test document by its ID
        const mocktest = await mockModel.findById(mockTestId);
        if (!mocktest) {
            return NextResponse.json({ message: 'Mock test not found', status: 404 });
        }

        let correctAnswersCount = 0;

        // 2. Iterate through the user's responses and update the mocktest's questions
        Object.entries(userresp).forEach(([questionId, userAnswer]) => {
            // Find the specific question in the mocktest's questions array
            const questionToUpdate = mocktest.questions.find(
                (q) => q._id.toString() === questionId
            );

            // If the question is found, update it
            if (questionToUpdate) {
                questionToUpdate.userAnswer = userAnswer;
                
                // Check if the user's answer is correct
                if (questionToUpdate.correctAnswer === userAnswer) {
                    questionToUpdate.isCorrect = true;
                    correctAnswersCount++;
                } else {
                    questionToUpdate.isCorrect = false;
                }
            }
        });
        
        // 3. Update the total score
        mocktest.score = correctAnswersCount;

        // 4. Save the updated document to the database
        await mocktest.save();

        return NextResponse.json({
            message: 'User mock updated successfully',
            score: mocktest.score,
            status: 200,
            success: true
        });

    } catch (error) {
        console.error("Server error:", error.message);
        return NextResponse.json({
            message: 'Server error',
            status: 500
        });
    }
}