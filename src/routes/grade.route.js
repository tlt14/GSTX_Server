const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const Grade = require('../models/grade.model');
const Class = require('../models/class.model');
const courseModel = require('../models/course.model');
const ROLES_LIST = require('../config/roles_list');
const { requireAuthentication } = require('../middlewares/auth');
const verifyRoles = require('../middlewares/verifyRole');
router.get('/',async(req, res) => {
    await Grade.find().then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err)
    })
})
router.get('/:id',async(req, res) => {
    try{
        const response = 
                await 
                Grade.find({_id:req.params.id}).populate('classes')
        res.status(200).json(response[0].classes)
    }catch(err){
        res.status(500).json(err)
    }
})
router.put('/:id',requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async(req, res) => {
    await Grade.findByIdAndUpdate(req.params.id, req.body).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

router.post('/', requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async (req, res) => {
    try {
      const { name, description, course } = req.body;
  
      // Kiểm tra thông tin bắt buộc
      if (!name) {
        return res.status(400).json({ error: 'Tên là trường bắt buộc' });
      }
  
      // Tạo đối tượng grade mới
      const newGrade = new Grade({
        name,
        description,
        course
      });
  
      // Lưu grade mới vào cơ sở dữ liệu
      const savedGrade = await newGrade.save();
  
  
      res.json(savedGrade);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Đã xảy ra lỗi server' });
    }
  });
router.get('/course/:courseId',async(req,res)=>{
  try{
      const glv = await Grade.find({course:req.params.courseId}).populate('course')
      res.status(200).json(glv)
  }catch(err){
      res.status(500).json(err)
  }
})
router.delete('/:id',requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async(req, res) => {
    await Grade.findByIdAndDelete(req.params.id).then((data) => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

module.exports = router