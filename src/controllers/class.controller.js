const classModel = require("../models/class.model")
const Class = require("../models/class.model")
const gradeModel = require("../models/grade.model")
const studentController ={
    getAll:async function(req,res){
        try{
            const glv = await Class.find({}).sort('name')
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    create:async function(req,res){
        try {
            const { name, description,grade } = req.body;
        
            // Kiểm tra thông tin bắt buộc
            if (!name) {
              return res.status(400).json({ error: 'Tên là trường bắt buộc' });
            }
        
            // Tạo đối tượng grade mới
            const newClass = new classModel({
              name,
              description,
              grade
            });
        
            // Lưu grade mới vào cơ sở dữ liệu
            const savedClass = await newClass.save();
        
            res.json(savedClass);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Đã xảy ra lỗi server' });
          }
    },
    update:async function(req,res){
        try{
            const glv = await Class.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    delete:async function(req,res){
        try{
            const glv = await Class.findByIdAndDelete(req.params.id)
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    },
    getClassesByGradeId:async function(req,res){
        try{
            const glv = await Class.find({grade:req.params.gradeId}).populate('grade');
            res.status(200).json(glv)
        }catch(err){
            res.status(500).json(err)
        }
    }

}

module.exports = studentController