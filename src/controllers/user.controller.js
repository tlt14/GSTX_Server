const User = require("../models/auth.model");

/* 
  1. FETCH USER PROFILE BY ID
*/
module.exports.fetchUserProfile = async (req, res, next) => {
    try {

        const userId = req.params.id;
        const retrievedUser = await User.findById(userId);
        
        res.json({
            success: true,
            user: retrievedUser,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/* 
  2. FETCH PROFILE OF AUTHENTICATED USER
*/
module.exports.fetchAuthUserProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};