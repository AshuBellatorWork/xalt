const express = require("express");
const { uploadImage } = require("../utils/upload");

const {
  getCategories,
  createCategory,
  updateCategory,
} = require("../controller/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/add", uploadImage, createCategory);
router.put("/update/:id", uploadImage, updateCategory);

module.exports = router;
