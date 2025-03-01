const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  try {
    console.log("Received request for student ID:", req.params.studentId);

    const studentCourses = await StudentCourses.findOne({ userId: req.params.studentId });

    if (!studentCourses) {
      console.log("No courses found for student ID:", req.params.studentId);
      return res.json({ success: true, data: [] }); // ✅ Prevents error
    }

    console.log("Fetched courses for student:", studentCourses.courses);
    res.json({ success: true, data: studentCourses.courses });

  } catch (error) {
    console.error("❌ Error fetching student courses:", error);
    res.status(500).json({ success: false, message: "Error fetching courses", error: error.message });
  }
};

module.exports = { getCoursesByStudentId };


