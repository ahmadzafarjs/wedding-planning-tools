import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";

const budgetChildStyles =
  "w-full flex flex-col items-center justify-center gap-2 ";

export default function BudgetHome({ data, isLoading }) {
  const [categories, setCategories] = useState(data?.categories);

  // useEffect(() => {
  //   async function getCategories() {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.post(
  //         "http://localhost:3000/budget/categories/all",
  //         { token }
  //       );
  //       const data = res.data; // Assuming data is an object with a 'categories' array
  //       setCategories(data.categories || []);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   }

  //   getCategories();
  // }, []);

  useEffect(() => {
    setCategories(data?.categories);
  }, [data]);

  // Calculate total estimated budget and final cost
  const calculateTotalEstimatedBudget = categories?.reduce(
    (total, category) =>
      total +
      category.expenses.reduce(
        (sum, expense) => sum + Number(expense.estimatedBudget),
        0
      ),
    0
  );

  const calculateTotalFinalCost = categories?.reduce(
    (total, category) =>
      total +
      category.expenses.reduce(
        (sum, expense) => sum + Number(expense.finalCost),
        0
      ),
    0
  );

  const calculateTotalPaid = categories?.reduce(
    (total, category) =>
      total +
      category.expenses.reduce((sum, expense) => sum + Number(expense.paid), 0),
    0
  );

  if (isLoading) {
    return (
      <div className="h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="border-2 overflow-hidden rounded-lg">
      {/* budget  */}
      <div className="py-12">
        <h2 className="text-center text-3xl font-semibold mb-12">Budget</h2>
        <div className="flex items-center justify-center">
          <div className={`${budgetChildStyles} border-r-2`}>
            <BsPiggyBank className="text-5xl" />
            <h3 className="uppercase font-semibold text-md text-stone-600">
              Estimated Budget
            </h3>
            <p className="text-2xl font-semibold">
              ${calculateTotalEstimatedBudget}
            </p>
            <button className="text-red-600 ">Edit budget</button>
          </div>
          <div className={budgetChildStyles}>
            <GiTwoCoins className="text-5xl" />
            <h3 className="uppercase font-semibold text-md text-stone-600">
              Final Cost
            </h3>
            <p className="text-2xl font-semibold">${calculateTotalFinalCost}</p>
            <div>
              <span className="mr-4">
                <b className="text-stone-600 mr-2">Paid:</b>
                <span>${calculateTotalPaid}</span>
              </span>
              <span>
                <b className="text-stone-600 mr-2">Pending:</b>
                <span>${calculateTotalFinalCost - calculateTotalPaid}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Expenses Chart */}
    </section>
  );
}
