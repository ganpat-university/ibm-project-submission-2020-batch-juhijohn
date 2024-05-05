const Solution = require("../Models/solution");
const multer = require("multer");
const User = require("../Models/user");
const Exam = require("../Models/exam");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/solutions");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadSolution = async (req, res) => {
  try {
    const student = await User.findOne({ email: req.user.email });
    const uploadedBy = student._id;
    const { examId } = req.params;

    const exam = await Exam.findOne({ _id: examId });
    const instructorId = exam.scheduledBy;

    const { filename, path } = req.file;

    if (student.sem !== exam.sem || student.branch !== exam.branch) {
      return res
        .status(403)
        .json({ success: false, message: "Permission Denied!" });
    }
    const newSolution = new Solution({
      uploadedBy,
      filename,
      path,
      scheduledBy: instructorId,
      exam: examId,
    });

    await newSolution.save();

    return res
      .status(201)
      .json({
        newSolution,
        success: true,
        message: "Solution uploaded successfully!",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "Internal Server Error" });
  }
};

const getSolutions = async (req, res) => {
  try {
    const instructor = await User.findOne({ email: req.user.email });
    const solutions = await Solution.find({ scheduledBy: instructor._id })
      .populate("uploadedBy", "enrollment sem")
      .populate("exam");
    res.status(200).json({ solutions, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

const getSolutionbyExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const solutions = await Solution.find({ exam: examId })
      .populate({
        path: "exam",
        select: "name subject sem", // Select the fields you want to populate
        populate: {
          path: "subject", // Populate the subject field within the exam
          select: "name", // Select the name field of the subject
        },
      })
      .populate("uploadedBy", "enrollment");
    res.status(200).json({ solutions, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

const getStudentsSubmission = async (req, res) => {
  try {
    const student = await User.findOne({ email: req.user.email });
    const studentId = student._id;

    const solutions = await Solution.find({ uploadedBy: studentId }).populate("exam");
    res.status(200).json({ solutions, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

const gradeSolution = async (req, res) => {
  try {
    const { grade } = req.body;
    const { solutionId } = req.params;
    const instructor = await User.findOne({ email: req.user.email });
    console.log(instructor._id);
    const solution = await Solution.findOne({ _id: solutionId });
    console.log(solution.scheduledBy);

    const updateSolution = await Solution.findByIdAndUpdate(
      solutionId,
      { grade },
      { new: true }
    );
    return res
      .status(200)
      .json({ updateSolution, success: true, message: "Graded Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "Internal Server Error!" });
  }
};


module.exports = {
  uploadSolution,
  storage,
  getSolutions,
  getStudentsSubmission,
  gradeSolution,
  getSolutionbyExam,
};
