const express = require("express");
const { uploadImage } = require("../utils/upload");

const {
  getSubCategory,
  createSubCategory,
  updateSubCategory
} = require("../controller/subCategoryController");

const router = express.Router();

router.get("/", getSubCategory);
router.post("/add", uploadImage, createSubCategory);
router.put("/update/:id", uploadImage, updateSubCategory);

module.exports = router;
