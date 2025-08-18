import mongoose from "mongoose";

const mockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [
      {
        questionText: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        difficulty: String,
        options: [String],
        explaination: String

      },
    ],
    role: String,
     difficulty: String,
    score: Number,
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
export const mockModel = mongoose.model.Mock || mongoose.model('Mock', mockSchema)