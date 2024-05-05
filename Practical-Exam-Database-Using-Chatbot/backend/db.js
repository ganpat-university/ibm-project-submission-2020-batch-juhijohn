const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Increase to 10 seconds
          });
        console.log('Connected to Database!');
    } catch (error) {
        console.log("Failed to connect!", error.message);
    }

}

module.exports = connectDB;