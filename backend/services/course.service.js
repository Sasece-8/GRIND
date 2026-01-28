import Course from '../models/course.model.js';

export const createCourse = async ({
    title,
    subtitle,
    description,
    price,
    educatorId
}) => {
    if (!title) {
        throw new Error('Course title is required');
    }

    const course = await Course.create({
        title,
        subtitle,
        description,
        price,
        educator: educatorId
    });

    return course;
};

export const updateCourse = async ({
    courseId,
    educatorId,
    updateData
}) => {
    const course = await Course.findOne({
        _id: courseId,
        educator: educatorId
    });

    if (!course) {
        throw new Error('Unauthorized or course not found');
    }

    Object.assign(course, updateData);
    await course.save();

    return course;
};

export const getAllPublishedCourses = async () => {
    return Course.find({ isPublished: true })
        .populate('educator', 'name email')
        .sort({ createdAt: -1 });
};

export const getCourseById = async (courseId) => {
    const course = await Course.findById(courseId)
        .populate('educator', 'name email');

    if (!course) {
        throw new Error('Course not found');
    }

    return course;
};



export const getCoursesByEducator = async ({ educatorId, isPublished }) => {
    const filter = {
        educator: educatorId
    };

    // Apply isPublished filter only if provided
    if (isPublished !== undefined) {
        filter.isPublished = isPublished === 'true';
    }

    const courses = await Course.find(filter)
        .sort({ createdAt: -1 });

    return courses;
};

