import Lecture from '../models/lecture.model.js';
import Section from '../models/section.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';

export const createLecture = async ({
    title,
    videoUrl,
    duration,
    isPreviewFree,
    sectionId
}) => {
    if (!title || !sectionId) {
        throw new Error('Lecture title and sectionId are required');
    }

    const section = await Section.findById(sectionId);
    if (!section) {
        throw new Error('Section not found');
    }

    const lecture = await Lecture.create({
        title,
        videoUrl,
        duration,
        isPreviewFree,
        section: sectionId
    });

    return lecture;
};

export const getLecturesBySection = async (sectionId) => {
    return Lecture.find({ section: sectionId })
        .sort({ order: 1, createdAt: 1 });
};

export const updateLecture = async ({ lectureId, updateData }) => {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        throw new Error('Lecture not found');
    }

    Object.assign(lecture, updateData);
    await lecture.save();

    return lecture;
};

export const getLectureContent = async ({lectureId, userId}) => {
        // 1. Get lecture
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        throw new Error('Lecture not found');
    }

    // 2. Get section → course
    const section = await Section.findById(lecture.section);
    if (!section) {
        throw new Error('Section not found');
    }

    const course = await Course.findById(section.course);
    if (!course) {
        throw new Error('Course not found');
    }

    // 3. Allow preview lectures
    if (lecture.isPreviewFree) {
        return lecture;
    }

    // 4. Allow course educator
    if (course.educator.toString() === userId) {
        return lecture;
    }

    // 5. Check enrollment
    const enrollment = await Enrollment.findOne({
        student: userId,
        course: course._id
    });

    if (!enrollment) {
        throw new Error('You are not enrolled in this course');
    }

    if (enrollment.paymentStatus === 'pending') {
        throw new Error('Complete payment to access this lecture');
    }

    // 6. Access granted
    return lecture;
};

export const deleteLecture = async (lectureId) => {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        throw new Error('Lecture not found');
    }

    await lecture.deleteOne();
};
