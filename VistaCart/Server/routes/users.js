const express = require( "express");
const router = express.Router();

// Products API

const { getAllProducts, addProduct } = require("../controllers/products");

router.route("/").get(getAllProducts);
router.route("/addProduct").post(addProduct);

// Users API

const { getAllUsers, addUser, login } = require("../controllers/users");

router.route("/").get(getAllUsers);
router.route("/addUser").post(addUser);
router.route("/login").post(login);
module.exports = router;