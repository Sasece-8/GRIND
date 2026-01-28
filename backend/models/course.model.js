import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    description: String,
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    thumbnail: String,
    category: String,
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
