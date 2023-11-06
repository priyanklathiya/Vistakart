const express = require( "express");
const router = express.Router();

const { addCategory, getAllCategory, deleteCategory, updateCategory, getCategoryById } = require("../controllers/category");

// router.route("/").get(getAllProducts);

router.route("/addCategory").post(addCategory);
router.route("/getAllCategory").get(getAllCategory);
router.route("/getCategoryById").get(getCategoryById);
router.route("/deleteCategory").post(deleteCategory);
router.route("/updateCategory").post(updateCategory);

module.exports = router;