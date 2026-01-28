import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as courseMiddleware from '../middlewares/course.middleware.js';
import { body } from 'express-validator';


const router = Router();

/**
 * Educator creates a course
 */



router.post(
    '/create',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    body('title').notEmpty().withMessage('Title is required'),
    courseController.createCourseController
);


/**
 * Educator updates a course
 */
router.put(
     '/:courseId',
     authMiddleware.authUser,
     courseMiddleware.isEducator,
     courseController.updateCourseController
);

/**
 * Get all published courses (public)
 */
router.get('/', courseController.getAllCoursesController);

/**
 * Get single course details
 */
router.get('/:courseId', courseController.getCourseByIdController);

/**
 * Get courses by educator (filtered by isPublished)
 * Example: /educator/64fa...?isPublished=true
 */
router.get(
    '/educator/:educatorId',
    authMiddleware.authUser,
    courseController.getCoursesByEducatorController
);

export default router;
