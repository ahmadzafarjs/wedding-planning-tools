import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import { errorResponse, response } from "../utils/apiResponse.js";
import Budget from "../models/Budget.js";

const mockupData = {
  userId: "64cfa4f74b4f4e9e0d7f1b79",
  estimatedBudget: 3000,
  finalCost: 2900,
  paid: 2800,
  categories: {
    shopping: {
      estimatedBudget: 1000,
      finalCost: 950,
      paid: 900,
      expenses: [
        {
          expense: "Clothing",
          estimatedBudget: 600,
          finalCost: 550,
          paid: {
            amount: 500,
            isPaid: true,
            dateOfPayment: "2024-07-03",
            paymentDueBy: "2024-07-10",
            paidBy: "Sarah Davis",
            paymentMethod: "Credit Card",
          },
        },
        {
          expense: "Electronics",
          estimatedBudget: 400,
          finalCost: 400,
          paid: {
            amount: 400,
            isPaid: true,
            dateOfPayment: "2024-07-08",
            paymentDueBy: "2024-07-15",
            paidBy: "Sarah Davis",
            paymentMethod: "Debit Card",
          },
        },
      ],
    },
  },
};

export async function signupUser(req, res) {
  try {
    const {
      surname,
      email,
      password,
      eventLocation,
      country,
      eventDate,
      phone,
      userStatus,
    } = req.body;

    const checkUserExists = await User.findOne({ email });

    if (checkUserExists) {
      throw new Error("User already exists!");
    }

    const newUser = await User.create({
      surname,
      email,
      password,
      eventLocation,
      country,
      eventDate,
      phone,
      userStatus,
    });

    if (!newUser) {
      throw new Error("Something went wrong! Try again");
    }

    let updateUserIdInMockupData;
    mockupData.userId = newUser._id;
    updateUserIdInMockupData = mockupData;

    const saveBudget = await Budget.insertMany(updateUserIdInMockupData);

    response(
      res,
      200,
      !saveBudget
        ? "Signup Successfully but 'Data not stored!'"
        : "Signup Successfully",
      newUser
    );
  } catch (error) {
    errorResponse(res, 400, error.message, error);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check user
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      throw new Error("User does't exists! Please Signup");
    }

    const checkPassword = bcrypt.compareSync(password, checkUser.password);

    if (!checkPassword) {
      throw new Error("Invalid Password");
    }

    const token = checkUser.generateToken();

    res.cookie("token", token);

    response(res, 200, "Successfully Login", { user: checkUser, token });
  } catch (error) {
    errorResponse(res, 400, error.message, error);
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.end();
  } catch (error) {
    errorResponse(res, 400, error.message, error);
  }
}
