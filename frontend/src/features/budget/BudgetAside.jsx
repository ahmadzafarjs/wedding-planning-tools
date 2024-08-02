import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";
import InputResizeable from "./components/InputResizeable";
import Button from "../../ui/Button";
import { useAddCategory } from "./useAddCategory";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// const categories = [
//   {
//     name: "Events",
//     amount: 270284,
//     expenses: [
//       {
//         name: "Welcome Party / Cocktails: Venue rental",
//         estimatedBudget: 0,
//         finalCost: 0,
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
//         estimatedBudget: 100852,
//         finalCost: 0,
//         paid: 0,
//       },
//       {
//         name: "Reception: Venue rental",
//         estimatedBudget: 0,
//         finalCost: 0,
//         paid: 0,
//       },
//       {
//         name: "Ceremony: Venue rental",
//         estimatedBudget: 169432,
//         finalCost: 0,
//         paid: 0,
//       },
//       { name: "Tent house rental", estimatedBudget: 0, finalCost: 0, paid: 0 },
//       {
//         name: "Chairs, linens, etc",
//         estimatedBudget: 0,
//         finalCost: 0,
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

export default function BudgetAside({ setParams, data, refetch }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  // const { mutate, isLoading } = useAddCategory();
  const queryClient = useQueryClient();

  // async function getCategories() {
  //   try {
  //     const token = localStorage.getItem("token"); // Corrected getItem method
  //     const res = await axios.post(
  //       "http://localhost:3000/budget/categories/all",
  //       { token }
  //     );
  //     const data = await res.data; // Assuming data is an array of categories
  //     setCategories(data.categories);
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //     // Handle error (e.g., set error state or show a message)
  //   }
  // }

  // const {
  //   data: fetchedCategories,
  //   isLoading: isGetCat,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: getCategories,
  //   staleTime: 2000,
  // });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (cat) => {
      const token = localStorage.getItem("token"); // Corrected getItem method
      const res = await axios.post("http://localhost:3000/budget/category", {
        name: cat,
        token: token, // Use the retrieved token
      });
      return res.data; // Assuming you want to return data from the response
    },
    onSuccess: () => {
      toast.success("Successfully Added Category");
      refetch();
      document.getElementById("my_modal_3").close();
    },
    onError: (err) => toast.error(err.message),
  });

  function handleAddCat(e) {
    e.preventDefault();
    mutate(newCategory);
  }

  function countExpense(cat) {
    return cat?.reduce((total, count) => count.estimatedBudget + total, 0);
  }

  return (
    <div className="overflow-hidden border-2 border-stone-200 rounded-lg">
      <aside className="">
        {/* New Category Form */}
        <div className="p-1">
          <button
            onClick={() => document.getElementById("my_modal_3").showModal()}
            className="btn w-full text-red-600"
          >
            <IoIosAddCircleOutline className="text-2xl" /> New category
          </button>

          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <form onSubmit={handleAddCat}>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  type="text"
                  placeholder="Category Name"
                  className="py-2 my-4 outline-none border-b-2 w-full "
                />
                <Button
                  color="bg-red-600"
                  fontColor="text-stone-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </form>
            </div>
          </dialog>
        </div>
        {/* categories */}
        <div>
          {/* category */}
          {data?.categories.map((cat, i) => {
            return (
              <button
                key={i}
                onClick={() => {
                  setSearchParams({ category: cat.name });
                  setParams(cat.name);
                }}
                className="w-full p-4 flex items-center justify-between border-b border-stone-200 hover:border-r-4"
              >
                <h3 className="text-md font-semibold capitalize">{cat.name}</h3>
                <p className="italic text-sm font-semibold text-stone-500">
                  ${countExpense(cat.expenses)}
                </p>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
