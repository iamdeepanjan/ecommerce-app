const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;