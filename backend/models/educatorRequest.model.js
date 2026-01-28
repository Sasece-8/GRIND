import mongoose from "mongoose";

const educatorRequestSchema = new mongoose.Schema({
  motivation: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  experience: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  expertise: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EducatorRequest = mongoose.model(
  "EducatorRequest",
  educatorRequestSchema
);

export default EducatorRequest;
