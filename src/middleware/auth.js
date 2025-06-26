const User = require('../model/userModel');
const { apiTokenErrorRes } = require('../utils/globalFunction');
const jwt = require('jsonwebtoken');

exports.userAuthCheck = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return apiTokenErrorRes(res, 'No Token Found!');
    }

    const token = authHeader.split('Bearer ')[1];

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedUser || !decodedUser.user_name) {
      return apiTokenErrorRes(res, 'Invalid Token!');
    }

    const user = await User.findOne({
      user_name: decodedUser.user_name,
    }).lean();
    if (!user) {
      return apiTokenErrorRes(res, 'No User Found!');
    }

    req.user = user;
    next();
  } catch (error) {
    return apiTokenErrorRes(res, 'Authentication Failed!', {
      error: error.message,
    });
  }
};
