const express = require('express');
const Attendance = require('../models/attendance.model');
const router =express.Router();

router.post('/:classId/:date', async (req, res) => {
    try {
      const classId = req.params.classId;
      const date = req.params.date;
      const studentId = req.body.studentId;
      // Kiểm tra xem sinh viên đã tồn tại trong mảng students hay chưa
      const attendance = await Attendance.find({class: classId, date});
      if (attendance.length === 0) {
        const newAttendance = new Attendance({
          class: classId,
          date: date
        })
        newAttendance.students.push(studentId);
        await newAttendance.save();
        return res.status(200).json({ message: 'Thêm sinh viên thành công.' });
      }else{
        const existingStudentId = await Attendance.findOne({ students: { $in: studentId }, class: classId, date });
        if (existingStudentId) {
            console.log('tồn tại')
            await Attendance.findOneAndUpdate({ students: studentId, class: classId, date }, { $pull: { students: studentId } });
        }else{
            // add the new student id
             
            await Attendance.findOneAndUpdate({ class: classId, date }, { $push: { students: studentId } });
        }
        return res.status(200).json({ message: 'ok.' });
      }
  
      
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm sinh viên.' });
    }
  });
router.get('/:classId', async (req, res) => {
  try {
    const classId = req.params.classId;
    const attendance = await Attendance.find({ class: classId });
    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Lỗi khi thêm sinh viên:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm sinh viên.' });
  }
})

module.exports = router