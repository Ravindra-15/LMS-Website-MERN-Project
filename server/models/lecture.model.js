import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: null,  // Prevents undefined
    },
    publicId: {
      type: String,
      default: null,  // Prevents undefined
    },
    isPreviewFree: {
      type: Boolean,
      default: false,  // Keeps lecture hidden by default
    },
  },
  { timestamps: true }
);


export const Lecture = mongoose.model("Lecture", lectureSchema);
