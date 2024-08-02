import Budget from "../models/Budget.js";
import { response, errorResponse } from "../utils/apiResponse.js";

export async function getAllBudget(req, res) {
  try {
    const { id, email } = req.user;
    const budget = await Budget.findOne({ userId: id });
    response(res, 200, "success", budget);
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
}

// Categories

export async function addNewCategory(req, res) {
  try {
    const { category } = req.body;

    const newCategory = await Budget.updateOne(
      { userId: req.user.id },
      {
        $push: { categories: { category } },
      },
      { new: true }
    );

    if (newCategory.modifiedCount === 0) {
      throw new Error("Failed to add! Try again");
    }

    response(res, 200, "Successfully added", newCategory);
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const deleteCategory = await Budget.updateOne(
      { userId: req.user.id },
      {
        $pull: { categories: { _id: id } },
      },
      { new: true }
    );

    if (deleteCategory.matchedCount === 0) {
      throw new Error("Category not found");
    }

    if (deleteCategory.modifiedCount === 0) {
      throw new Error("Failed to delete! Try again");
    }

    response(res, 200, "Successfully deleted", deleteCategory);
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
}

// Expenses

export async function addNewExpense(req, res) {
  try {
    const { id, email } = req.user;
    const { id: categoryId } = req.params;
    const { expense, estimatedBudget, finalCost, paid } = req.body;
    const {
      amount,
      isPaid,
      dateOfPayment,
      paymentDueBy,
      paidBy,
      paymentMethod,
    } = paid;

    const newExpense = await Budget.updateOne(
      {
        userId: id,
        "categories._id": categoryId,
      },
      {
        $push: {
          "categories.$.expenses": {
            expense,
            estimatedBudget,
            finalCost,
            paid: {
              amount,
              isPaid,
              dateOfPayment,
              paymentDueBy,
              paidBy,
              paymentMethod,
            },
          },
        },
      },
      { new: true }
    );

    if (newExpense.matchedCount === 0) {
      throw new Error("Expense not found!");
    }

    if (newExpense.modifiedCount === 0) {
      throw new Error("Failed to add! Try again");
    }

    response(res, 200, "Expense successfully added", newExpense);
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
}

export async function updateExpense(req, res) {
  try {
    const { id, email } = req.user;
    const { id: categoryId, expId } = req.params;
    const { expense, estimatedBudget, finalCost, paid } = req.body;
    const {
      amount,
      isPaid,
      dateOfPayment,
      paymentDueBy,
      paidBy,
      paymentMethod,
    } = paid;

    const upateExpense = await Budget.updateOne(
      {
        userId: id,
        "categories._id": categoryId,
        "categories.expenses._id": expId,
      },
      {}
    );

    response(res, 200, "Successfully Updated");
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
}
