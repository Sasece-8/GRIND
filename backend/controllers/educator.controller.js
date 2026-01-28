import EducatorRequest from "../models/educatorRequest.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { sendEmail, educatorRequestTemplate } from "../services/email.service.js";

export const getAllEducatorRequests = async (req, res) => {
  try {
    const requests = await EducatorRequest.find().populate("user", "email").sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching educator requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const requestEducatorAccess = async (req, res) => {
  try {
    const { motivation, experience, expertise, portfolio } = req.body;

    // Basic validation
    if (!motivation || !experience || !expertise) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newRequest = new EducatorRequest({
      motivation,
      experience,
      expertise,
      portfolio,
      user: req.user.id,
    });

    await newRequest.save();

    // Send email to admin
    const emailHtml = educatorRequestTemplate({
      userId: req.user.id,
      motivation,
      experience,
      expertise,
      portfolio,
    });
    
    // Non-blocking email send
    sendEmail(process.env.ADMIN_EMAIL || "admin@example.com", "New Educator Request - GRIND", emailHtml);

    res.status(201).json({ message: "Educator request submitted successfully", request: newRequest });
  } catch (error) {
    console.error("Error submitting educator request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEducatorRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await EducatorRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const user = await User.findById(request.user);
      if (user) {
        user.role = "educator";
        await user.save();
      }
    }

    res.status(200).json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEducatorStats = async (req, res) => {
  try {
    const { educatorId } = req.params;

    // 1. Find all courses by this educator
    const courses = await Course.find({ educator: educatorId });
    const courseIds = courses.map(course => course._id);

    // 2. Count enrollments for these courses
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds }
    });

    res.status(200).json({ totalStudents });
  } catch (error) {
    console.error("Error fetching educator stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
