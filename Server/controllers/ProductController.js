const Product = require("../models/ProductModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Create a new product (transaction)
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

// Get all products (transactions)
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  if (!products.length === 0) {
    return next(new AppError("There is no Product Available", 404));
  }

  res.status(200).json({
    result: products.length,
    status: "success",
    message: `${products.length} product(s) found`,
    data: products,
  });
});

// Update an existing product by ID
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run validation on update
  });

  if (!product) {
    return next(new AppError("Product not found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

// Delete a product by ID
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Product not found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});