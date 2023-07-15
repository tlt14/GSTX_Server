const express = require('express');
const classController = require('../controllers/class.controller');
const verifyRoles = require('../middlewares/verifyRole');
const { requireAuthentication } = require('../middlewares/auth');
const ROLES_LIST = require('../config/roles_list');
const router = express.Router();

router.get('/',classController.getAll)
router.get('/grade/:gradeId',classController.getClassesByGradeId)
router.put('/:id',requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),classController.update)
router.post('/',requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),classController.create)
router.delete('/',requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),classController.delete)

module.exports = router