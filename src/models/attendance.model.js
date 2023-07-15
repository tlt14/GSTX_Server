const { default: mongoose } = require("mongoose");

const attendanceSchema = mongoose.Schema({
    date: Date,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
  });
  
  const Attendance = mongoose.model('Attendance', attendanceSchema);
  module.exports = Attendance;