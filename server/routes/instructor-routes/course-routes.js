const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  deleteCourseByID, // ✅ Import delete function
} = require("../../controllers/instructor-controller/course-controller");
const Course = require("../../models/Course");
const { authenticate, isInstructor } = require("../../middleware/auth-middleware");

const router = express.Router();

// ✅ Only instructors (admins) can add new courses
router.post("/add", authenticate, isInstructor, addNewCourse);

// ✅ Only instructors (admins) can view all courses
router.get("/get", authenticate, isInstructor, getAllCourses);

// ✅ Only instructors (admins) can view course details
router.get("/get/details/:id", authenticate, isInstructor, getCourseDetailsByID);

// ✅ Only instructors (admins) can update a course
router.put("/update/:id", authenticate, isInstructor, updateCourseByID);

// ✅ Only instructors (admins) can delete a course (🔹 Added route)
router.delete("/delete/:id", authenticate, isInstructor, deleteCourseByID);

// Fetch total number of course videos
router.get("/total-videos", authenticate, isInstructor, async (req, res) => {
  try {
    const courses = await Course.find({}, { curriculum: 1 }); // Fetch only the curriculum array
    const totalVideos = courses.reduce((acc, course) => acc + course.curriculum.length, 0);
    res.status(200).json({ data: totalVideos });
  } catch (error) {
    console.error("Error fetching total videos:", error.message); // Log the exact error
    res.status(500).json({ message: "Failed to fetch total videos" });
  }
});

module.exports = router;
