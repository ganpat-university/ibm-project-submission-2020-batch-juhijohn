const express = require('express');
const { uploadSolution, storage, getSolutions, gradeSolution, getStudentsSubmission, getSolutionbyExam, getGradedSolutions } = require('../Controllers/solution');
const {authUser} = require('../Middlewares/authUser');
const {authRole} = require('../Middlewares/authRole');
const multer = require('multer');
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload/:examId", upload.single("file"), authUser , authRole('student'), uploadSolution);
router.get("/getall", authUser, authRole('instructor'), getSolutions);
router.get("/getbyexam/:examId", authUser, authRole('instructor'), getSolutionbyExam);
router.put("/grade/:solutionId", authUser, authRole('instructor'), gradeSolution);
router.get("/grades", authUser, authRole('student'), getStudentsSubmission);

module.exports = router;