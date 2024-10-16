const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

const { protect } = require("../controllers/authController");

const router = express.Router();

router.post("/createProduct", protect, createProduct);

router.get("/getproducts", protect, getAllProducts);

router.patch("/updateproducts/:id", protect, updateProduct);

router.delete("/deleteProducts/:id", protect, deleteProduct);

module.exports = router;
