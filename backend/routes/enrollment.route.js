import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as courseMiddleware from '../middlewares/course.middleware.js';

const router = Router();

/**
 * Enroll student into a course
 */
router.post(
    '/:courseId',
    authMiddleware.authUser,
    enrollmentController.enrollCourseController
);

/**
 * Get courses enrolled by logged-in student
 */
router.get(
    '/my-courses',
    authMiddleware.authUser,
    enrollmentController.getMyCoursesController
);

/**
 * Get students enrolled in a course (Educator only)
 */
router.get(
    '/course/:courseId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    enrollmentController.getStudentsByCourseController
);

/**
 * Check if logged-in user is enrolled in a course
 */
router.get(
    '/check/:courseId',
    authMiddleware.authUser,
    enrollmentController.checkEnrollmentController
);


export default router;
