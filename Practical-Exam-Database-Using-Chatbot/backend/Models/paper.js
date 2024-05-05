const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  year: {
    type: Number
  },
  filename:{
    type: String
  },
  path: {
    type: String
  },
  subject: {
    type: String
  },
  branch: {
    type: String
  },
  sem: {
    type: Number
  }
});

const Paper = mongoose.model("Paper", paperSchema);

module.exports = Paper;