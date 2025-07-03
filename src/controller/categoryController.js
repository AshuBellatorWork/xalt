const prisma = require("../model/prismaClient");
const Joi = require("joi");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      staus: 200,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching categories",
      status: 400,
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      status: 400,
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
      status: 400,
    });
  }

  try {
    const imagePaths = req.files.map(file => file.path);

    const category = await prisma.categories.create({
      data: {
        name: req.body.name,
        images: imagePaths, 
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      status: 201,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating category",
      status: 500,
      error: error.message,
    });
  }
};


module.exports = { getCategories, createCategory };
