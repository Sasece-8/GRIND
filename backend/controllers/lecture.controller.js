import { validationResult } from 'express-validator';
import * as lectureService from '../services/lecture.service.js';

export const createLectureController = async (req, res) => {
    console.log('--- createLectureController ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('Params:', req.params);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation Errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    let { title, duration, isPreviewFree } = req.body;
    let videoUrl = req.body.videoUrl;
    const { sectionId } = req.params;

    if (req.file) {
        videoUrl = req.file.path;
        // Cloudinary returns duration in seconds for video files
        if (req.file.duration) {
            duration = req.file.duration;
            console.log('Detected actual video duration:', duration);
        }
    }

    try {
        const lecture = await lectureService.createLecture({
            title,
            videoUrl,
            duration,
            isPreviewFree,
            sectionId
        });

        res.status(201).json({ lecture });
    } catch (error) {
        console.error('Error in createLectureController:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getLecturesBySectionController = async (req, res) => {
    const { sectionId } = req.params;

    try {
        const lectures = await lectureService.getLecturesBySection(sectionId);
        res.status(200).json({ lectures });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLectureController = async (req, res) => {
    const { lectureId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
        updateData.videoUrl = req.file.path;
        if (req.file.duration) {
            updateData.duration = req.file.duration;
            console.log('Detected actual video duration (update):', updateData.duration);
        }
    }

    try {
        const lecture = await lectureService.updateLecture({
            lectureId,
            updateData
        });

        res.status(200).json({ lecture });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


export const getLectureContentController = async(req, res) => {
    const {lectureId} = req.params;
    const userId = req.user.id;

    try {
        const lecture = await lectureService.getLectureContent({
            lectureId,
            userId
        });
        res.status(200).json({ lecture });
    } catch (error) {
        res.status(403).json({error : error.message})
    }
}

export const deleteLectureController = async (req, res) => {
    const { lectureId } = req.params;

    try {
        await lectureService.deleteLecture(lectureId);
        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
