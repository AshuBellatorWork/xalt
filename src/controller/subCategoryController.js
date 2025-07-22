const prisma = require("../model/prismaClient");
const Joi = require("joi");

const getSubCategory = async (req, res) => {
  try {
    const sub_categories = await prisma.sub_categories.findMany();
    return res.status(200).json({
      success: true,
      message: "Sub Categories fetched successfully",
      staus: 200,
      data: sub_categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching sub categories",
      status: 400,
      error: error.message,
    });
  }
};

const createSubCategory = async (req, res) => {
  const schema = Joi.object({
    category_id: Joi.required(),
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
    const subCategory = await prisma.sub_categories.create({
      data: {
        category_id: parseInt(req.body.category_id),
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive === "true",
        images: imagePaths,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Sub Category created successfully",
      status: 201,
      data: subCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating sub category",
      status: 500,
      error: error.message,
    });
  }
};

const updateSubCategory = async (req, res) => {
  const schema = Joi.object({
    category_id: Joi.required(),
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

  const subCategoryId = parseInt(req.params.id, 10);
  if (!subCategoryId || isNaN(subCategoryId)) {
    return res.status(400).json({
      success: false,
      message: "Sub Category ID is required",
      status: 400,
    });
  }
  try {
    const existingSubCategory = await prisma.sub_categories.findUnique({
      where: { id: subCategoryId },
    });
    if (!existingSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
        status: 404,
      });
    }
    let updatedImages = existingSubCategory.images || [];

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files
        .map((file) => file?.location)
        .filter(Boolean);
      updatedImages = [...updatedImages, ...newImagePaths]; 
    }

    const updatedSubCategory = await prisma.sub_categories.update({
      where: { id: subCategoryId },
      data: {
        category_id: parseInt(req.body.category_id),
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive === "true",
        images: updatedImages,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sub Category updated successfully",
      status: 200,
      data: updatedSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating sub category",
      status: 500,
      error: error.message,
    });
  }
};


const deleteSubCategoryByIdController = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const subCategory = await prisma.sub_categories.findUnique({
      where: { id }
    });

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found"
      });
    }
    await prisma.sub_categories.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: "Sub-category deleted successfully!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting sub-category",
      error: error.message
    });
  }
};

module.exports = { getSubCategory, createSubCategory, updateSubCategory,  };


