import jwt from "jsonwebtoken";
import { response } from "../utils/apiResponse.js";

export async function restrictToLoggedInUsers(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Invalid credentials! Login again");
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      throw new Error("Invalid credentials! Login again");
    }

    req.user = decode;

    next();
  } catch (error) {
    response(res, 401, "Unauthorized access", error);
  }
}
