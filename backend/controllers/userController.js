import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import { errorResponse, response } from "../utils/apiResponse.js";
import Budget from "../models/Budget.js";
import { mockupData } from "../data/budgetMockup.js";

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

    newUser.password = undefined;

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
