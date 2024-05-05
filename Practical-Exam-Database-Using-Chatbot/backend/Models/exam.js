const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    sem: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    scheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String
    },
    path: {
        type: String
    },
    date:{
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
