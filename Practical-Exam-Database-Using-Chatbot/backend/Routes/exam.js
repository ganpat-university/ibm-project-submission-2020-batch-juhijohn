const express = require('express');
const { uploadExam, storage, getStudentExams, getInstructorExam, getUpcomingExams, getOngoingExam, getStudentOngoing, deleteExam} = require('../Controllers/exam');
const {authUser} = require('../Middlewares/authUser');
const {authRole} = require('../Middlewares/authRole');
const multer = require('multer');
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", upload.single("file"), authUser , authRole('instructor'), uploadExam);
router.get("/getforstudents", authUser, authRole('student'), getStudentExams);
router.get("/getupcoming", authUser, authRole('student'), getUpcomingExams);
router.get("/getforinstructors", authUser, authRole('instructor'), getInstructorExam);
router.get("/getOngoing", authUser, authRole('instructor'), getOngoingExam);
router.delete("/delete/:examId", authUser, authRole('instructor'), deleteExam);
router.get("/getStudentOngoing", authUser, authRole('student'), getStudentOngoing);

module.exports = router;