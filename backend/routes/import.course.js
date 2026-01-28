import { Router } from "express";
import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lecture from "../models/lecture.model.js";

const router = Router();

/**
 * BULK IMPORT COURSES
 * POST /course/import
 * Body: array of course objects
 * Educator only
 */
router.post(
  "/courses",
  async (req, res) => {
    try {
      const courses = req.body;

      // Validation
      if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({
          error: "Request body must be a non-empty array of courses",
        });
      }

      // Avoid duplicate courses by title
      const titles = courses.map((c) => c.title);
      const existingCourses = await Course.find({
        title: { $in: titles },
      }).select("title");

      const existingTitles = new Set(
        existingCourses.map((c) => c.title)
      );

      const newCourses = courses.filter(
        (course) => !existingTitles.has(course.title)
      );

      if (newCourses.length === 0) {
        return res.status(400).json({
          error: "All courses already exist in database",
        });
      }

      // Insert courses
      const insertedCourses = await Course.insertMany(newCourses);

      res.status(201).json({
        message: "Courses imported successfully",
        insertedCount: insertedCourses.length,
        courses: insertedCourses,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);






/**
 * BULK IMPORT SECTIONS
 * POST /section/sections
 * Body: array of section objects
 */
router.post(
  "/sections",
  async (req, res) => {
    try {
      const sections = req.body;

      // Validation
      if (!Array.isArray(sections) || sections.length === 0) {
        return res.status(400).json({
          error: "Request body must be a non-empty array of sections",
        });
      }

      // Avoid duplicate sections (same title in same course)
      const existingSections = await Section.find({
        $or: sections.map((s) => ({
          title: s.title,
          course: s.course,
        })),
      }).select("title course");

      const existingSet = new Set(
        existingSections.map(
          (s) => `${s.title}-${s.course.toString()}`
        )
      );

      const newSections = sections.filter(
        (s) => !existingSet.has(`${s.title}-${s.course}`)
      );

      if (newSections.length === 0) {
        return res.status(400).json({
          error: "All sections already exist in database",
        });
      }

      // Insert sections
      const insertedSections = await Section.insertMany(newSections);

      res.status(201).json({
        message: "Sections imported successfully",
        insertedCount: insertedSections.length,
        sections: insertedSections,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);


/**
 * BULK IMPORT LECTURES
 * POST /lecture/lectures
 * Body: array of lecture objects
 */
router.post(
  "/lectures",
  async (req, res) => {
    try {
      const lectures = req.body;

      // Validation
      if (!Array.isArray(lectures) || lectures.length === 0) {
        return res.status(400).json({
          error: "Request body must be a non-empty array of lectures",
        });
      }

      // Avoid duplicate lectures (same title in same section)
      const existingLectures = await Lecture.find({
        $or: lectures.map((l) => ({
          title: l.title,
          section: l.section,
        })),
      }).select("title section");

      const existingSet = new Set(
        existingLectures.map(
          (l) => `${l.title}-${l.section.toString()}`
        )
      );

      const newLectures = lectures.filter(
        (l) => !existingSet.has(`${l.title}-${l.section}`)
      );

      if (newLectures.length === 0) {
        return res.status(400).json({
          error: "All lectures already exist in database",
        });
      }

      // Insert lectures
      const insertedLectures = await Lecture.insertMany(newLectures);

      res.status(201).json({
        message: "Lectures imported successfully",
        insertedCount: insertedLectures.length,
        lectures: insertedLectures,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);


export default router;
