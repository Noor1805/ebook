require("dotenv").config(); // Load .env variables

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoute = require("./routes/authRoute"); 
const aiRoute = require("./routes/aiRoute");
const bookRoute = require("./routes/bookRoute");
const exportRoute = require("./routes/exportRoute");

const app = express();

// ✅ Allow frontend to communicate with backend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Connect to MongoDB
connectDB();

// ✅ Handle JSON data
app.use(express.json());

// ✅ Serve uploaded images/files
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ All backend API routes
app.use("/api/auth", authRoute); // login/signup
app.use("/api/ai", aiRoute); // user related
app.use("/api/book", bookRoute);
app.use("/api/export", exportRoute); 

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

