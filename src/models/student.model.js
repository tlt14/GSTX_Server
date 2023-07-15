const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  name: String,
  birthDay: Date,
  gender: String,
  address: String,
  phone: String,
  holyName: String,
  fatherName: String,
  motherName: String,

  baptismDay: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  scores: {
    middle: Number,
    final: Number,
  },
  studentId: {
    type: String,
    unique: true,
    // required: true,
  },
});

// Tạo mã tự động
studentSchema.pre("save", async function (next) {
  const latestStudent = await Student.findOne({}, { studentId: 1 }, { sort: { studentId: -1 } });
  
  const nextNumber = latestStudent && latestStudent.studentId ? parseInt(latestStudent?.studentId?.substr(2)) + 1 : 1;
  const nextId = `TN${nextNumber.toString().padStart(6, "0")}`;
  this.studentId = nextId;
  next();
});

const Student = mongoose.model("students", studentSchema);

module.exports = Student;
