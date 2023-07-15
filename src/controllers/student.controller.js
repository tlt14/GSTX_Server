const Attendance = require("../models/attendance.model")
const classModel = require("../models/class.model")
const sacramentModel = require("../models/sacrament.model")
const studentModel = require("../models/student.model")
const Student = require("../models/student.model")
const studentController ={
    getAll:async function(req,res){
        try{
            const glv = await Student.find({}).populate('classId')
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    getAllbyClassId:async function(req,res){
        try{
            const glv = await Student.find({classId:req.params.id}).populate('classId')
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    create:async function(req,res){
        try {
        
            // Tạo đối tượng grade mới
            const newStudent = new studentModel(req.body);
        
            // Lưu grade mới vào cơ sở dữ liệu
            const savedStudent = await newStudent.save();
        
        
            res.json(savedStudent);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Đã xảy ra lỗi server' });
          }
    },
    update:async function(req,res){
        const {id} = req.params
        try{
            const glv = await Student.findByIdAndUpdate(id,req.body)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
        
    },
    delete:async function(req,res){
        try{
            const glv = await Student.findByIdAndDelete(req.params.id)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    addScore:async function(req,res){
        try{
            const glv = await Student.findByIdAndUpdate(req.params.id,req.body)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    getStudentById:async function(req,res){
        try{
            const student = await Student.findOne({studentId:req.params.id}).populate('classId')
            const sacrament = await sacramentModel.findOne({ student: student._id });
            const attendance = await Attendance.find({ students: student._id });
            res.status(200).json({student,sacrament,attendance});
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports = studentController