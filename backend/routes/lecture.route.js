import { Router } from 'express';
import { body } from 'express-validator';
import * as lectureController from '../controllers/lecture.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as courseMiddleware from '../middlewares/course.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * Create a lecture inside a section (Educator only)
 */
router.post(
    '/:sectionId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    upload.single('video'),
    body('title')
        .notEmpty()
        .withMessage('Lecture title is required'),
    lectureController.createLectureController
);

/**
 * Get all lectures of a section (Public)
 */
router.get(
    '/:sectionId',
    lectureController.getLecturesBySectionController
); 

/**
 * Get lecture content (Protected)
 */
router.get(
    '/content/:lectureId',
    authMiddleware.authUser,
    lectureController.getLectureContentController
);


/**
 * Update a lecture (Educator only)
 */
router.put(
    '/edit/:lectureId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    upload.single('video'),
    lectureController.updateLectureController
);

/**
 * Delete a lecture (Educator only)
 */
router.delete(
    '/delete/:lectureId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    lectureController.deleteLectureController
);

export default router;
