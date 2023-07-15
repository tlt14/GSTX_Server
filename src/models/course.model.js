const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status:{
    type: String,
    default:"started"
  }
});

module.exports = mongoose.model('Course', courseSchema);
