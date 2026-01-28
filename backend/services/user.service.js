import userModel from '../models/user.model.js';

export const createUser = async ({ email, password, role }) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password: hashedPassword,
        role: role || 'student' // fallback safety
    });

    return user;
};

