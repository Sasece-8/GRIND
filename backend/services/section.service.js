import Section from '../models/section.model.js';
import Course from '../models/course.model.js';

export const createSection = async ({ title, courseId }) => {
    if (!title || !courseId) {
        throw new Error('Title and courseId are required');
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    const section = await Section.create({
        title,
        course: courseId
    });

    return section;
};

export const getSectionsByCourse = async (courseId) => {
    return Section.find({ course: courseId })
        .sort({ order: 1, createdAt: 1 });
};

export const updateSection = async ({ sectionId, updateData }) => {
    const section = await Section.findById(sectionId);

    if (!section) {
        throw new Error('Section not found');
    }

    Object.assign(section, updateData);
    await section.save();

    return section;
};

export const deleteSection = async (sectionId) => {
    const section = await Section.findById(sectionId);

    if (!section) {
        throw new Error('Section not found');
    }

    await section.deleteOne();
};
