const express = require('express');
const glvController = require('../controllers/glv.controller');
const router = express.Router();

router.get('/',glvController.getAll)
router.put('/:id',glvController.update)
router.post('/',glvController.create)
router.delete('/:id',glvController.delete)

module.exports = router