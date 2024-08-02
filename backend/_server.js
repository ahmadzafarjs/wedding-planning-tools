import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./dbConnect.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import Budget from "./models/Budget.js";
import Checklist from "./models/Checklist.js";
import Guest from "./models/Guest.js";

dotenv.config();

connectDB();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// VerifyToken
function verifyToken(token) {
  if (!token) {
    return undefined;
  }
  const decode = jwt.verify(token, "my_secret_key");
  if (!decode) {
    return "Session expire! Login again";
  }
  return decode;
}

// Signup
app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const {
      surname,
      email,
      password,
      eventLocation,
      country,
      eventDate,
      phone,
      userStatus,
    } = data;

    const checkUser = await User.findOne({ email: email });

    if (checkUser) {
      return res.status(400).json({
        message: "User already exists! Login Please",
      });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...data,
      password: hashedPassword,
    });

    const saveUser = await newUser.save();

    return res.status(200).json({
      message: "success",
      user: saveUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;
    const checkUser = await User.findOne({ email: email });
    if (!checkUser) {
      return res.status(400).json({
        message: "User not found! Register please",
      });
    }

    const verifyPassword = bcrypt.compare(password, checkUser.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "Password not match",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
      },
      "my_secret_key"
    );

    return res.status(200).json({
      message: "success",
      user: checkUser,
      token: token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// add category
app.post("/budget/category", async (req, res) => {
  try {
    const data = req.body;
    const { name, token } = data;

    // verify Token

    const verifyT = verifyToken(token);
    // console.log(verifyT);

    const newCat = new Budget({
      userId: verifyT.id,
      name: name,
    });

    const saveCat = await newCat.save();

    res.status(200).json({
      message: "success",
      category: saveCat,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// delete category
app.delete("/budget/category/:name", async (req, res) => {
  try {
    const name = req.params.name;

    // verify Token

    const delCat = await Budget.deleteOne({ name: name });

    res.status(200).json({
      message: "success",
      category: delCat,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// add expense
app.post("/budget/:name/expense", async (req, res) => {
  try {
    const cat = req.params.name;
    const data = req.body;
    const { name, estimatedBudget, finalCost, paid } = data;

    // verify category

    const getCat = await Budget.findOne({ name: cat });

    getCat.expenses.push(data);

    const saveExpense = await getCat.save();

    res.status(200).json({
      message: "success",
      expense: saveExpense,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// update expense

app.put("/budget/:name/expense/:expenseId", async (req, res) => {
  try {
    const cat = req.params.name; // The category name from the request parameters
    const expenseId = req.params.expenseId; // The expense ID from the request parameters
    const { name, estimatedBudget, finalCost, paid } = req.body; // Destructuring the data from request body

    // Step 1: Find the specific category
    const getCat = await Budget.findOne({ name: cat });

    if (!getCat) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 2: Find the specific expense within the expenses array
    const expense = getCat.expenses.id(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Step 3: Update the properties of the specific expense
    if (name !== undefined) expense.name = name;
    if (estimatedBudget !== undefined)
      expense.estimatedBudget = estimatedBudget;
    if (finalCost !== undefined) expense.finalCost = finalCost;
    if (paid !== undefined) expense.paid = paid;

    // Step 4: Save the updated document
    const saveExpense = await getCat.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense: saveExpense,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// delete expense
app.delete("/budget/:name/expense/:expenseId", async (req, res) => {
  try {
    const cat = req.params.name; // The category name from the request parameters
    const expenseId = req.params.expenseId; // The expense ID from the request parameters

    // Step 1: Find the specific category
    const getCat = await Budget.findOne({ name: cat });

    if (!getCat) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 2: Find and remove the specific expense within the expenses array
    const expense = getCat.expenses.id(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Remove the expense from the expenses array
    expense.deleteOne();

    // Step 3: Save the updated document
    const saveExpense = await getCat.save();

    res.status(200).json({
      message: "Expense deleted successfully",
      expense: saveExpense,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// Get Categories
app.post("/budget/categories/all", async (req, res) => {
  try {
    const token = req.body;
    const user = verifyToken(token.token);
    const categories = await Budget.find({ userId: user.id });
    res.status(200).json({
      message: "success",
      categories,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// =============Checklist

app.post("/checklist", async (req, res) => {
  try {
    const data = req.body;
    const { token, title, date, category } = data;

    const user = verifyToken(token);

    const newTodo = new Checklist({
      userId: user.id,
      title,
      date,
      category,
    });

    const saveTodo = await newTodo.save();

    res.status(200).json({
      message: "success",
      todo: saveTodo,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

app.put("/checklist/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const { title, category, status } = data;

    // Extract token from headers (assuming token is passed in headers)

    // const user = verifyToken(token);

    // Ensure the user ID matches the one in the document
    const newTodo = await Checklist.findOneAndUpdate(
      { _id: id },
      { title, category, status },
      { new: true } // Option to return the updated document
    );

    if (!newTodo) {
      return res.status(404).json({
        message: "Todo not found or you're not authorized to update this todo",
      });
    }

    res.status(200).json({
      message: "success",
      todo: newTodo,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

app.delete("/checklist/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const { title, category, status } = data;

    // Extract token from headers (assuming token is passed in headers)

    // const user = verifyToken(token);

    // Ensure the user ID matches the one in the document
    const newTodo = await Checklist.findOneAndDelete(
      { _id: id },
      { title, category, status }
    );

    res.status(200).json({
      message: "success",
      todo: newTodo,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

app.post("/checklist/all", async (req, res) => {
  try {
    const token = req.body;

    const user = verifyToken(token.token);
    const checklists = await Checklist.find({ userId: user.id });

    res.status(200).json({
      message: "success",
      todos: checklists,
    });
  } catch (error) {
    res.status(400).json({
      message: "success",
      error: error.message,
    });
  }
});

// =======================Guest
app.post("/guest", async (req, res) => {
  try {
    const data = req.body;
    const { token, name, ageCategory, group, gender, menu } = data;
    const user = verifyToken(token);

    // console.log(data);
    // console.log(user.id);

    const newGuest = await Guest.create({
      userId: user.id,
      name: name,
      ageCategory: ageCategory,
      group: group,
      gender: gender,
      menu: menu,
    });
    // const saveUser = await newGuest.save();

    res.status(200).json({
      message: "success",
      guest: newGuest,
    });
  } catch (error) {
    res.status(200).json({
      message: "success",
      error: error.message,
    });
  }
});

// Get all guests
app.post("/guests/all", async (req, res) => {
  try {
    const token = req.body;
    const user = verifyToken(token.token);
    const guests = await Guest.find({ userId: user.id });
    res.status(200).json({
      message: "success",
      guests: guests,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

app.put("/guest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const guests = await Guest.findByIdAndUpdate(
      id,
      {
        name: data.name,
        ageCategory: data.ageCategory,
        group: data.group,
        gender: data.gender,
        menu: data.menu,
      },
      { new: true } // This option returns the updated document
    );

    if (!guests) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    res.status(200).json({
      message: "success",
      guests: guests,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

app.delete("/guest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const user = verifyToken(token.token);
    const guests = await Guest.findByIdAndDelete({ _id: id });
    res.status(200).json({
      message: "success",
      guests: guests,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed",
      error: error.message,
    });
  }
});

// Last rout
app.listen(3000, () => {
  console.log("Server starts on 3000");
});
