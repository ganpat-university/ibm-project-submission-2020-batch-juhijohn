const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    uploadedBy: {
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
    grade:{
        type: String,
        default: '0'
    },
    scheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    }
});

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
