import React, { useEffect, useState } from "react";
import InputResizeable from "./InputResizeable";
import { RxDotsHorizontal } from "react-icons/rx";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const tbStyle = "py-3 px-3 ";
const expInput = "w-full focus:border-b-2 outline-none pb-1 border-stone-600";

export default function ExpenseRow({ exp, categoryQuery, refetch, params }) {
  const [expense, setExpense] = useState(exp);
  // const [updateExpense, setUpdateExpense] = useState({

  //   name: "",
  //   estimatedBudget: "",
  //   finalCost: "",
  //   paid: "",
  // });

  useEffect(() => {
    setExpense(exp);
  }, [exp]);

  const { mutate: upgradeExpense, isPending: isUpdragingExpense } = useMutation(
    {
      mutationFn: async (newExp) => {
        const res = await axios.put(
          `http://localhost:3000/budget/${params}/expense/${exp._id}`,
          {
            name: newExp.name,
            estimatedBudget: newExp.estimatedBudget,
            finalCost: newExp.finalCost,
            paid: newExp.paid,
          }
        );
        const data = await res.data;
        return data;
      },
      onSuccess: () => {
        toast.success("Expense Successfully Updated");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `http://localhost:3000/budget/${params}/expense/${exp._id}`
      );
      const data = await res.data;
      return data;
    },
    onSuccess: () => {
      toast.success("Expense Successfully Deleted");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  function handleUpdateExpense() {
    upgradeExpense(expense);
  }

  return (
    <>
      <tr className="border-b-2 ">
        <td className={tbStyle}>
          <input type="hidden" value="0" />
          <input
            type="text"
            value={expense.name}
            className={expInput}
            onChange={(e) => setExpense({ ...expense, name: e.target.value })}
            onBlur={handleUpdateExpense}
          />
        </td>
        <td className={tbStyle}>
          <InputResizeable
            value={expense.estimatedBudget}
            onChange={(e) =>
              setExpense({ ...expense, estimatedBudget: e.target.value })
            }
            onBlur={handleUpdateExpense}
          />
        </td>
        <td className={tbStyle}>
          <InputResizeable
            value={expense.finalCost}
            onChange={(e) =>
              setExpense({ ...expense, finalCost: e.target.value })
            }
            onBlur={handleUpdateExpense}
          />
        </td>
        <td className={tbStyle}>
          <InputResizeable
            value={expense.paid}
            onChange={(e) => setExpense({ ...expense, paid: e.target.value })}
            onBlur={handleUpdateExpense}
          />
        </td>
        <td className={tbStyle}>
          {/* Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              <RxDotsHorizontal className="text-stone-500 cursor-pointer" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg"
            >
              <li>
                <a>
                  <button onClick={deleteExpense}>Delete</button>
                </a>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    </>
  );
}
