import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploadedResumeUrl:String,
    jobDescription:String,
    future_guidance: {
        skill_acquisition: [String],
        strength_guide: [String]
    },
    improvement_tips: [String],
    interview_questions: [String],
    overall_assessment: String,
    skill_relevance_and_match: {
        jd_match_percentage: Number,
        skill_relevance: String
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export const resumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema)