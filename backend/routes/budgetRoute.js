import Router from "express";
import {
  addNewCategory,
  addNewExpense,
  deleteCategory,
  getAllBudget,
} from "../controllers/budgetController.js";
import { restrictToLoggedInUsers } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/all", restrictToLoggedInUsers, getAllBudget);
router.post("/category", restrictToLoggedInUsers, addNewCategory);
router.post("/category/:id", restrictToLoggedInUsers, deleteCategory);
// Expense
router.post("/category/:id/expense", restrictToLoggedInUsers, addNewExpense);

export default router;
