import { validationResult } from 'express-validator';
import * as sectionService from '../services/section.service.js';

export const createSectionController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;
    const { courseId } = req.params;

    try {
        const section = await sectionService.createSection({
            title,
            courseId
        });

        res.status(201).json({ section });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSectionsByCourseController = async (req, res) => {
    const { courseId } = req.params;

    try {
        const sections = await sectionService.getSectionsByCourse(courseId);
        res.status(200).json({ sections });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSectionController = async (req, res) => {
    const { sectionId } = req.params;

    try {
        const section = await sectionService.updateSection({
            sectionId,
            updateData: req.body
        });

        res.status(200).json({ section });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const deleteSectionController = async (req, res) => {
    const { sectionId } = req.params;

    try {
        await sectionService.deleteSection(sectionId);
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
