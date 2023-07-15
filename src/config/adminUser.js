const AuthModel = require("../models/auth.model");
const ROLES_LIST = require("./roles_list");
const bcrypt = require("bcryptjs");

const hasAdminUser = async () => {
    const adminUser = await AuthModel.findOne({ "roles.ADMIN": { $exists: true } });
    return !!adminUser;
};
const createAdminUser = async () => {
    try {
      const adminExists = await hasAdminUser();
      if (adminExists) {
        console.log('Admin user already exists');
        return;
      }
  
      
      const newUser = new AuthModel({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        roles: { ADMIN: ROLES_LIST.ADMIN }
      });
  
      await newUser.save();
      console.log('Admin user created');
    } catch (error) {
      console.error(error);
    }
  };

module.exports = createAdminUser