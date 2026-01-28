import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }]
});

export default mongoose.model("Progress", progressSchema);
