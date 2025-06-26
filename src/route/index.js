const express = require("express");
const router = express.Router();
const app = express();
const userRoutes = require("./userRoute");
const categoryRoutes = require("./categoryRoute");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
