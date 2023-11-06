const express = require( "express");
const router = express.Router();

const { addBrand, getAllBrand, deleteBrand, updateBrand } = require("../controllers/Brand");

// router.route("/").get(getAllProducts);

router.route("/addBrand").post(addBrand);
router.route("/getAllBrand").get(getAllBrand);
router.route("/deleteBrand").post(deleteBrand);
router.route("/updateBrand").post(updateBrand);

module.exports = router;