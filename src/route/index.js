const express = require("express");
const router = express.Router();
const multer = require('multer')
const app = express();
const userRoutes = require("./userRoute");
const categoryRoutes = require("./categoryRoute");
const subCategoryRoutes = require("./subCategoryRoute");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/sub-category", subCategoryRoutes);

module.exports = router;
