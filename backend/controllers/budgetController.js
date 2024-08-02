import Budget from "../models/Budget.js";
import { response, errorResponse } from "../utils/apiResponse.js";

export async function addNewCategory(req, res) {
  try {
    const {} = req.body;
    response(res, 200, "successfully added", newCategory);
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
}
