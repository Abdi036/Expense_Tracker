const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Import the auth routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/ProductRoutes");
const globalErrorHandler = require("./controllers/errorController");

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || 8000);

// Middlewares
app.use(cors());
app.use(express.json());

// Use the auth routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);

// Global Error Handling Middleware
app.use(globalErrorHandler);
app.use("/userImage", express.static(path.join(__dirname, "userImage")));

// Connect to MongoDB using mongoose
mongoose
  .connect(process.env.REMOTE_MONGO_URI)
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(5000, "0.0.0.0", () => {
      console.log(`Server is running on port 5000`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
