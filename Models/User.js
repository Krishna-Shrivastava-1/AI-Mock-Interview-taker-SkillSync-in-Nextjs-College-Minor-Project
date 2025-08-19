import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },
    isFilledaboutandskill: {
      type: Boolean,
      default: false
    },
    descriptionAbout: {
      type: String,
    },
    uploadedResume: {
      type: String,
      default: "",
    },
    mockAttempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mock"
      }
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const userModel =
  mongoose.model.User || mongoose.model("User", userSchema);
