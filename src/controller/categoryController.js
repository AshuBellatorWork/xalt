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
    description: Joi.string().min(2).required(),
    isActive: Joi.boolean().required(),
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
    const imagePaths = req.files.map((file) => file?.location).filter(Boolean);
    const category = await prisma.categories.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive === "true",
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

const updateCategory = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(2).required(),
    isActive: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      status: 400,
    });
  }

  const categoryId = parseInt(req.params.id, 10);
  if (!categoryId || isNaN(categoryId)) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
      status: 400,
    });
  }
  try {
    const existingCategory = await prisma.categories.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        status: 404,
      });
    }
    let updatedImages = existingCategory.images || [];

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files
        .map((file) => file?.location)
        .filter(Boolean);
      updatedImages = [...updatedImages, ...newImagePaths];
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive === "true",
        images: updatedImages,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      status: 200,
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating category",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { getCategories, createCategory, updateCategory };
