const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();

router.get('/',studentController.getAll)
router.get('/:id',studentController.getAllbyClassId)

router.get('/info/:id',studentController.getStudentById)


router.post('/',studentController.create)
router.put('/:id',studentController.update)
router.delete('/:id',studentController.delete)


router.put('addScore/:id',studentController.addScore)

module.exports = router