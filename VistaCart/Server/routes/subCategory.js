const express = require( "express");
const router = express.Router();

const { addSubCategory, getAllSubCategory, deleteSubCategory, updateSubCategory } = require("../controllers/subcategory");

// router.route("/").get(getAllProducts);

router.route("/addSubCategory").post(addSubCategory);
router.route("/getAllSubCategory").get(getAllSubCategory);
router.route("/deleteSubCategory").post(deleteSubCategory);
router.route("/updateSubCategory").post(updateSubCategory);

module.exports = router;