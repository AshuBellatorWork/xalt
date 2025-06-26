const userModal = require("../model/userModel");

const getUsers = async () => {
  try {
    const users = await userModal.find();
    return { success: true, users };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


module.exports = {
  getUsers,
};
