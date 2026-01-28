import * as enrollmentService from '../services/enrollment.service.js';

export const enrollCourseController = async (req, res) => {
    const { courseId } = req.params;
    const { paymentIntentId } = req.body;
    const studentId = req.user.id;

    try {
        const enrollment = await enrollmentService.enrollCourse({
            studentId,
            courseId,
            paymentIntentId
        });

        res.status(201).json({
            message: 'Enrolled successfully',
            enrollment
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getMyCoursesController = async (req, res) => {
    const studentId = req.user.id;

    try {
        const courses = await enrollmentService.getMyCourses(studentId);
        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStudentsByCourseController = async (req, res) => {
    const { courseId } = req.params;

    try {
        const students = await enrollmentService.getStudentsByCourse(courseId);
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const checkEnrollmentController = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { courseId } = req.params;

        const isEnrolled = await enrollmentService.checkEnrollment(
            userId,
            courseId
        );

        res.status(200).json({ isEnrolled });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

