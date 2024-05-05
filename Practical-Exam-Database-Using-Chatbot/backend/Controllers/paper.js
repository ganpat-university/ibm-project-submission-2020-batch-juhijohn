const multer = require('multer');
const Paper = require('../Models/paper');
const User = require('../Models/user');


const uploadPaper = async (req, res) => {
    try {
        console.log(req);
        const { filename, path } = req.file;
        const { year, branch, subject } = req.body;
        const paper = new Paper({ filename, path, year, branch, subject });
        await paper.save();
        res.status(201).json({ paper, success: true, message: 'File uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error!', error: error });
        console.error(error);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/papers');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const viewPapers = async (req, res) => {
    try {
        const papers = await Paper.find();
        res.status(200).json({ papers, success: true, message: 'files Got!' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error!', error: error });
    }
}

const filterPapers = async (req, res) => {
    try {
        const filters = req.query;
        const query = {};

        if (filters.year) {
            query.year = filters.year;
        }
        if (filters.filename) {
            query.filename = { $regex: new RegExp(filters.filename, 'i') };
        }
        if (filters.subject) {
            query.subject = filters.subject;
        }

        if (filters.branch) {
            query.branch = filters.branch;
        }

        if(filters.sem){
            query.sem = filters.sem;

        }

        const papers = await Paper.find(query);
        res.status(200).json({papers, success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getPapers = async (req, res) => {
    try {
        const user = await User.findOne({email: req.user.email});
        const { branch} = user;
        console.log(user)
        const papers = await Paper.find({branch, sem});
        res.status(200).json({papers, success: true});

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
}

module.exports = { uploadPaper, storage, viewPapers,filterPapers, getPapers }
