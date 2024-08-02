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
      default: "",
    },
    paymentDueBy: {
      type: Date,
      default: "",
    },
    paidBy: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      default: "",
    },
  },
});

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
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
  expenses: [expenseSchema],
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
  categories: [categorySchema],
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
