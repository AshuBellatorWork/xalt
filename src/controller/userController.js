const prisma = require("../model/prismaClient");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { sendWelcomeEmail } = require("../utils/mailer");
const { apiSuccessRes, apiErrorRes } = require("../utils/globalFunction");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching users',
      error: error.message,
    });
  }
};


const createUser = async (req, res) => {
  const schema = Joi.object({
    user_name: Joi.string().min(2).required(),
    user_email: Joi.string().email().required(),
    user_age: Joi.number().integer().min(0).required(),
    user_password: Joi.string()
      .min(6)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      }),
    user_status: Joi.number().required(),
    user_type: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const {
    user_name,
    user_email,
    user_age,
    user_password,
    user_status,
    user_type,
  } = req.body;

  try {
    const existingUser = await prisma.users.findUnique({
      where: { user_email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });                        
    }
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const user = await prisma.users.create({
      data: {
        user_name,
        user_email,
        user_age,
        user_password: hashedPassword,
        user_status,
        user_type,
      },
    });
    try {
      await sendWelcomeEmail(user_email, user_name);
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr.message);
    }
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    console.error("Create user error:", err.message);
    res.status(400).json({
      success: false,
      error: "User not created!",
    });
  }
};


const loginUser = async (req, res) => {
  const { user_email, user_password, user_type } = req.body;

  const schema = Joi.object({
    user_email: Joi.string().required(),
    user_password: Joi.string().required(),
    user_type: Joi.number().valid(1, 2).optional(), 
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return apiErrorRes(res, error.details[0].message, null, 1, 400);
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_email }
    });

    if (!user) {
      return apiErrorRes(res, 'Invalid username or password', null, 1, 400);
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return apiErrorRes(res, 'Invalid username or password', null, 1, 400);
    }

    if (user.user_type !== user_type) {
      return apiErrorRes(res, 'Your account is locked !! Please Contact Admin', null, 1, 400);
    }

    if (user.user_type === 1 && user.user_account_lock === true) {
      return apiErrorRes(res, 'Please contact Admin to unlock your account', null, 1, 400);
    }

    if (user.user_type === 2 && user.user_account_lock === true) {
      return apiErrorRes(res, 'Your account is locked', null, 1, 400);
    }

    const token = 'someauthtoken'; 

    return apiSuccessRes(
      res,
      'User logged in successfully',
      user,
      0,
      token
    );
  } catch (error) {
    console.error(error);
    return apiErrorRes(res, 'Internal Server Error', error.message, 500);
  }
};

module.exports = { createUser, getUsers, loginUser };
