import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import Button from "../../ui/Button";
import ExpenseRow from "./components/ExpenseRow";
import AddExpenseForm from "./components/AddExpenseForm";
import { BiCross } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const thStyle = "font-light py-2 px-3 text-stone-600 text-left text-sm";
const tbStyle = "py-3 px-3 ";

// const categories = [
//   {
//     name: "Events",
//     amount: 270284,
//     expenses: [
//       {
//         name: "Welcome Party / Cocktails: Venue rental",
//         estimatedBudget: 0,
//         finalCost: 356,
//         paid: 0,
//       },
//       {
//         name: "Mehndi: Venue rental",
//         estimatedBudget: 0,
//         finalCost: 0,
//         paid: 0,
//       },
//       {
//         name: "Sangeet: Venue rental",
//         estimatedBudget: 1002,
//         finalCost: 0,
//         paid: 0,
//       },
//       {
//         name: "Reception: Venue rental",
//         estimatedBudget: 0,
//         finalCost: 6,
//         paid: 0,
//       },
//       {
//         name: "Ceremony: Venue rental",
//         estimatedBudget: 1692,
//         finalCost: 0,
//         paid: 0,
//       },
//       { name: "Tent house rental", estimatedBudget: 0, finalCost: 0, paid: 0 },
//       {
//         name: "Chairs, linens, etc",
//         estimatedBudget: 0,
//         finalCost: 876,
//         paid: 0,
//       },
//     ],
//   },
//   { name: "Catering", amount: 465938, expenses: [] },
//   { name: "Photography and video", amount: 105894, expenses: [] },
//   { name: "Planning", amount: 50426, expenses: [] },
//   { name: "Jewellery", amount: 352982, expenses: [] },
//   { name: "Transportation", amount: 40342, expenses: [] },
//   { name: "Wedding cards", amount: 40340, expenses: [] },
//   { name: "Flowers and Decoration", amount: 144218, expenses: [] },
//   { name: "Bridal accessories", amount: 110940, expenses: [] },
//   { name: "Groom's accessories", amount: 70596, expenses: [] },
//   { name: "Health & Beauty", amount: 45384, expenses: [] },
//   { name: "Entertainment", amount: 35300, expenses: [] },
//   { name: "Guests", amount: 50426, expenses: [] },
//   { name: "Honeymoon", amount: 110936, expenses: [] },
//   { name: "Ceremony", amount: 15228, expenses: [] },
//   { name: "Other", amount: 90976, expenses: [] },
// ];

export default function BudgetExpenses({
  data,
  refetch,
  filteredCategories,
  params,
  isLoading,
}) {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: "",
    estimatedBudget: "",
    finalCost: "",
    paid: "",
  });
  const [updateExpense, setUpdateExpense] = useState({
    id: "",
    name: "",
    estimatedBudget: "",
    finalCost: "",
    paid: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setExpenses(filteredCategories?.expenses);
  }, [filteredCategories, expenses, params]);

  const [isAddNewExpense, setIsAddNewExpense] = useState(false);

  // Add new Expense
  const { mutate: addExpense, isPending: isAddingExpense } = useMutation({
    mutationFn: async (newExp) => {
      const res = axios.post(`http://localhost:3000/budget/${params}/expense`, {
        ...newExp,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Expense Successfully added");
      refetch();
      setIsAddNewExpense(false);
    },
    onError: (err) => toast.error(err.message),
  });

  // Total Prices
  const calculateTotalEstimatedBudget = expenses?.reduce(
    (total, exp) => total + Number(exp.estimatedBudget),
    0
  );

  const calculateTotalFinalCost = expenses?.reduce(
    (total, exp) => total + Number(exp.finalCost),
    0
  );

  const calculateTotalPaid = expenses?.reduce(
    (total, exp) => total + Number(exp.paid),
    0
  );

  const percentage = Math.floor(
    (calculateTotalFinalCost / calculateTotalEstimatedBudget) * 100
  );

  function handleNewExpense(e) {
    e.preventDefault();
    addExpense(newExpense);
    // Implement logic for handling new expense submission
  }

  if (isLoading) {
    return (
      <div className="h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="rounded-lg border-2 relative">
      <button
        onClick={() => setSearchParams({ category: "" })}
        className="btn absolute top-4 right-4"
      >
        <RxCross2 />
      </button>
      {/* header */}
      <div className="py-12 flex flex-col items-center justify-center gap-4 border-b-2">
        <h3 className="text-3xl font-semibold">{filteredCategories?.name}</h3>
        <div className="flex items-center justify-center gap-3">
          <span>
            <p>
              Estimated Budget: <b>${calculateTotalEstimatedBudget}</b>{" "}
            </p>
          </span>
          <span>
            <p>
              Final Cost: <b>${calculateTotalFinalCost}</b>
            </p>
          </span>
          <span>
            <button className="flex gap-2 items-center justify-start px-4 py-2 hover:border-2 rounded-lg">
              <MdDeleteOutline className="text-lg" />
              <h2 className="text-lg text-stone-500">Remove</h2>
            </button>
          </span>
        </div>
        <div className="relative bg-stone-300 rounded-full w-[300px] py-1 px-3">
          <div
            className={`bg-green-400 absolute top-0 left-0 w-[${percentage}%] rounded-full h-full`}
          ></div>
          <p className="z-10 text-xs relative italic">
            {calculateTotalEstimatedBudget - calculateTotalFinalCost}{" "}
          </p>
        </div>
      </div>
      {/* expenses */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2">
              <th className={`${thStyle}`}>EXPENSES</th>
              <th className={thStyle}>ESTIMATED BUDGET</th>
              <th className={thStyle}>FINAL COST</th>
              <th className={thStyle}>PAID</th>
              <th className={thStyle}></th>
            </tr>
          </thead>

          <tbody>
            {expenses?.map((exp, i) => {
              return (
                <ExpenseRow
                  key={i}
                  exp={exp}
                  refetch={refetch}
                  params={params}
                />
              );
            })}
            {/* add new expense form  */}
            {isAddNewExpense && (
              <AddExpenseForm
                newExpense={newExpense}
                setNewExpense={setNewExpense}
              />
            )}
            {/* new expense btn  */}
            <tr>
              {!isAddNewExpense ? (
                <td>
                  <button
                    className="w-full border-b border-stone-200 flex p-4 items-center justify-start text-red-500 gap-3 font-semibold"
                    onClick={() => setIsAddNewExpense(!isAddNewExpense)}
                  >
                    <IoIosAddCircleOutline className="text-2xl" /> New category
                  </button>
                </td>
              ) : (
                <td className="p-3 flex gap-4">
                  <Button
                    onClick={handleNewExpense}
                    color="bg-red-500"
                    fontColor="text-stone-100"
                  >
                    {isAddingExpense ? "Adding..." : "Add"}
                  </Button>
                  <Button
                    onClick={() => setIsAddNewExpense(false)}
                    color="bg-stone-200"
                    fontColor="text-stone-700"
                  >
                    Cancel
                  </Button>
                </td>
              )}
            </tr>
          </tbody>

          <tfoot className="bg-stone-100">
            <tr>
              <td className={tbStyle}>Total</td>
              <td className={tbStyle}>{calculateTotalEstimatedBudget}</td>
              <td className={tbStyle}>{calculateTotalFinalCost}</td>
              <td className={tbStyle}>{calculateTotalPaid}</td>
              <td className={tbStyle}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
