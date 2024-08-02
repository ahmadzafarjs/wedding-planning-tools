import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  expense: {
    type: String,
    required: true,
  },
  estimatedBudget: {
    type: Number,
    default: 0,
  },
  finalCost: {
    type: Number,
    default: 0,
  },
  paid: {
    amount: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    dateOfPayment: {
      type: Date,
    },
    paymentDueBy: {
      type: Date,
    },
    paidBy: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
  },
});

const categorySchema = new mongoose.Schema({
  estimatedBudget: {
    type: Number,
    default: 0,
  },
  finalCost: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    default: 0,
  },
  expenses: [expenseSchema],
});

categorySchema.pre("save", function (next) {
  function calculateBudgets(expenses) {
    const estimatedBudget = expenses.reduce(
      (acc, exp) => acc + exp?.estimatedBudget,
      0
    );
    const finalCost = expenses.reduce((acc, exp) => acc + exp?.finalCost, 0);
    const paid = expenses.reduce((acc, exp) => acc + exp?.paid, 0);
    return { estimatedBudget, finalCost, paid };
  }

  if (this.isModified("expenses")) {
    const { estimatedBudget, finalCost, paid } = calculateBudgets(
      this.expenses
    );
    this.estimatedBudget = estimatedBudget;
    this.finalCost = finalCost;
    this.paid = paid;
  }

  next();
});

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  estimatedBudget: {
    type: Number,
    default: 0,
  },
  finalCost: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    default: 0,
  },
  categories: {
    type: Map,
    of: categorySchema,
  },
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
