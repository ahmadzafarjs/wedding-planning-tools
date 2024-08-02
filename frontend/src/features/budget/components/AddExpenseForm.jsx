import React, { useState } from "react";
import InputResizeable from "./InputResizeable";

const tbStyle = "py-3 px-3 ";
const expInput =
  "w-full focus:border-b-2 focus:border-stone-600 border-b-2 focus:border-stone-00 outline-none pb-1 ";

export default function AddExpenseForm({ newExpense, setNewExpense }) {
  const [isAddNewExpense, setIsAddNewExpense] = useState(false);
  //   const [newExpense, setNewExpense] = useState({
  //     name: "",
  //     estimatedBudget: "",
  //     finalCost: "",
  //     paid: "",
  //   });
  return (
    <tr>
      <td className={tbStyle}>
        <input
          type="text"
          className={expInput}
          value={newExpense.name}
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
        />
      </td>
      <td className={tbStyle}>
        <InputResizeable
          value={newExpense.estimatedBudget}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              estimatedBudget: e.target.value,
            })
          }
        />
      </td>
      <td className={tbStyle}>
        <InputResizeable
          value={newExpense.finalCost}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              finalCost: e.target.value,
            })
          }
        />
      </td>
      <td className={tbStyle}>
        <InputResizeable
          value={newExpense.paid}
          onChange={(e) =>
            setNewExpense({ ...newExpense, paid: e.target.value })
          }
        />
      </td>
    </tr>
  );
}
