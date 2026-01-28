import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const enrollCourse = async ({ studentId, courseId, paymentIntentId }) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    if (!course.isPublished) {
         throw new Error('Course is not available for enrollment');
    }

    // Prevent educator enrolling in own course
    if (course.educator.toString() === studentId) {
        throw new Error('Educator cannot enroll in own course');
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
        student: studentId,
        course: courseId
    });

    if (existing) {
        throw new Error('Already enrolled in this course');
    }

    let paymentStatus = 'free';
    if (course.price > 0) {
        if (!paymentIntentId) {
            throw new Error('Payment required for this course');
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            throw new Error('Payment verification failed');
        }
        
        // Verify amount
        if (paymentIntent.amount !== Math.round(course.price * 100)) {
             throw new Error('Payment amount mismatch');
        }
        
        paymentStatus = 'paid';
    }

    const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        paymentStatus: paymentStatus,
        paymentIntentId: paymentIntentId || null
    });

    return enrollment;
};

export const getMyCourses = async (studentId) => {
    const enrollments = await Enrollment.find({ student: studentId })
        .populate('course');

    return enrollments;
};

export const getStudentsByCourse = async (courseId) => {
    return Enrollment.find({ course: courseId })
        .populate('student', 'email role')
        .select('student paymentStatus enrolledAt');
};



export const checkEnrollment = async (studentId, courseId) => {
    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    return !!enrollment; // converts to true / false
};

