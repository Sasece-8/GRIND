import { Router } from 'express';
import * as sectionController from '../controllers/section.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as courseMiddleware from '../middlewares/course.middleware.js';
import { body } from 'express-validator';

const router = Router();

/**
 * Create a section inside a course (Educator only)
 */
router.post(
    '/:courseId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    body('title').notEmpty().withMessage('Section title is required'),
    sectionController.createSectionController
);

/**
 * Get all sections of a course (Public)
 */
router.get(
    '/:courseId',
    sectionController.getSectionsByCourseController
);

/**
 * Update a section (Educator only)
 */
router.put(
    '/:sectionId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    sectionController.updateSectionController
);

/**
 * Delete a section (Educator only)
 */
router.delete(
    '/:sectionId',
    authMiddleware.authUser,
    courseMiddleware.isEducator,
    sectionController.deleteSectionController
);

export default router;
