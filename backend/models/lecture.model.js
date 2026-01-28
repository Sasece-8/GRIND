import mongoose from "mongoose";
const lectureSchema = new mongoose.Schema({
    title: String,
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    },
    videoUrl: String,
    duration: Number,
    isPreviewFree: {
        type: Boolean,
        default: false
    },
    order: Number
});

export default mongoose.model("Lecture", lectureSchema);
