import {Router} from 'express';
import * as userController from '../controllers/user.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';


const router = Router();

router.post(
    '/register',
    body('email')
        .isEmail()
        .withMessage('Email must be a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .optional()
        .isIn(['student', 'educator'])
        .withMessage('Role must be either student or educator'),

    userController.createUserController
);


router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    userController.loginUserController
);

router.get('/profile', authMiddleware.authUser, userController.getUserProfileController);

router.get('/logout', authMiddleware.authUser, userController.logoutUserController);

    

export default router;