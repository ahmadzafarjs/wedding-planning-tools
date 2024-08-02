import Router from "express";
import { addNewCategory } from "../controllers/budgetController.js";
import { restrictToLoggedInUsers } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/category", restrictToLoggedInUsers, addNewCategory);

export default router;
