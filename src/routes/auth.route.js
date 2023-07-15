const express = require('express');
const { login, signup, refreshAccessToken, logout } = require('../controllers/auth.controller');
const { requireAuthentication } = require('../middlewares/auth');
const { fetchAuthUserProfile, fetchUserProfile } = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');
const verifyRoles = require('../middlewares/verifyRole');
const ROLES_LIST = require('../config/roles_list');
const AuthModel = require('../models/auth.model');
const router = express.Router();
router.post("/login",  login);
router.post("/signup",  requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),signup);

router.get(
    "/me",
    requireAuthentication,
    fetchAuthUserProfile
);
router.get('/glv/:glvId',requireAuthentication,verifyRoles(ROLES_LIST.ADMIN),async(req, res) => {
  try{
    const glvId = req.params.glvId;
    const glv = await AuthModel.findOne({glv: glvId});
    res.status(200).json(glv);
  }catch(err){
    res.status(500).json(err);
  }
})
router.get(
    "/:id",
    requireAuthentication,
    fetchUserProfile
);
router.post('/verify-token', (req, res) => {
    const { token } = req.body;
  
    try {
      // Verify the token using your preferred JWT library
      const decoded = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET);
      // Token is valid, respond with success status
      res.status(200).json({ isValid: true });
    } catch (error) {
      console.error('Failed to verify token:', error);
  
      // Token is invalid or expired, respond with failure status
      res.status(200).json({ isValid: false });
    }
  });
  router.post("/reauth", refreshAccessToken);
// log out
router.put("/logout",requireAuthentication,logout);
module.exports = router;
