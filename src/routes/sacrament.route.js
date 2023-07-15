const express = require('express');
const router = express.Router();
const SacramentController = require('../controllers/sacrament.controller'); 
router.post('/', SacramentController.createSacrament);
router.put('/:studentId', SacramentController.updateSacrament);
router.get('/student/:studentId',SacramentController.getSacramentByStudentId);

module.exports = router