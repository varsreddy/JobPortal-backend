import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './utils/db.js';

// import routes
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';

dotenv.config();
const app = express();

// helpers to support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// allow cross-origin requests
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // fallback for dev
  credentials: true,
};
app.use(cors(corsOptions));

// connect to MongoDB
mongoose.set('strictQuery', true);

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// health check
app.get("/home", (req, res) => {
  return res.status(200).json({ message: "Backend running", success: true });
});

// Serve static frontend in production
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
const clientBuildPath = path.join(__dirname, 'client', 'dist');
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server is running at port ${PORT}`);
});
