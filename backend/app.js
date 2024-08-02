import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Essential Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
import budgetRoute from "./routes/budgetRoute.js";
import userRoute from "./routes/userRoute.js";

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/budget", budgetRoute);

export default app;
