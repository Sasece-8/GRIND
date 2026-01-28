import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    paymentStatus: {
        type: String,
        enum: ['free', 'paid', 'pending'],
        default: 'free'
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    paymentIntentId: {
        type: String,
        required: false
    }
});

export default mongoose.model("Enrollment", enrollmentSchema);
