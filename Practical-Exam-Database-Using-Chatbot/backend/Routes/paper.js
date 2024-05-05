const express = require('express');
const Paper = require('../Models/paper');
const { uploadPaper, storage , viewPapers, filterPapers, getPapers} = require('../Controllers/paper');
const multer = require('multer');
const { authUser } = require('../Middlewares/authUser');
const { authRole } = require('../Middlewares/authRole');
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", upload.single("file"),uploadPaper);
router.get("/all", viewPapers);
router.get("/filter", filterPapers);
router.get("/papers", authUser, authRole('student'), getPapers);

module.exports = router;