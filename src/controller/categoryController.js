const prisma = require("../model/prismaClient");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();
    return res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      staus: 200,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching categories',
      status: 400,
      error: error.message,
    });
  }
};


module.exports = { getCategories };
