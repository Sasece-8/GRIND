import { validationResult } from 'express-validator';
import * as courseService from '../services/course.service.js';

export const createCourseController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const course = await courseService.createCourse({
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
            price: req.body.price,
            educatorId: req.user.id
        });

        res.status(201).json({ course });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCourseController = async (req, res) => {
    try {
        const course = await courseService.updateCourse({
            courseId: req.params.courseId,
            educatorId: req.user.id,
            updateData: req.body
        });

        res.status(200).json({ course });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export const getAllCoursesController = async (req, res) => {
    try {
        const courses = await courseService.getAllPublishedCourses();
        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourseByIdController = async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.courseId);
        res.status(200).json({ course });
    } catch (error) {
        res.status(404).json({ error: 'Course not found' });
    }
};

export const getCoursesByEducatorController = async (req, res) => {
    const { educatorId } = req.params;
    const { isPublished } = req.query;

    try {
        const courses = await courseService.getCoursesByEducator({
            educatorId,
            isPublished
        });

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

