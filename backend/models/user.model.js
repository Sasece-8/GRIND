import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, 'Email must be at least 5 characters long'],
        maxlength: [50, 'Email must be at most 50 characters long'],
    },
    password: {
        type: String,
        select : false,
    },
    role: {
        type: String,
        enum: ['student', 'educator', 'admin'],   // add more roles if needed
        default: 'student',
    },
},{timestamps: true});

userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};



const User = mongoose.model("User", userSchema);

export default User;