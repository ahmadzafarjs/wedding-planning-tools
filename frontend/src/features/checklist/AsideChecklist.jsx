import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-daisyui";
import { RxCross2 } from "react-icons/rx";
import { useSearchParams } from "react-router-dom";

// const todos = [
//   {
//     title: "Check if your wedding date is on an auspicious day",
//     category: "Planning",
//     status: "pending",
//   },
//   {
//     title: "Do you want a destination wedding?",
//     category: "Planning",
//     status: "pending",
//   },
//   {
//     title: "Short list date options for all pre-wedding functions",
//     category: "Planning",
//     status: "pending",
//   },
//   {
//     title: "Delegate responsibilities",
//     category: "Other",
//     status: "pending",
//   },
//   {
//     title: "Decide whether or not you'd like to use a wedding planner",
//     category: "Planning",
//     status: "pending",
//   },
//   {
//     title: "Download the WeddingWire App",
//     category: "Planning",
//     status: "pending",
//     action: "Download Now",
//   },
//   {
//     title: "Create initial guest list using our guest list tool",
//     category: "Planning",
//     status: "pending",
//     action: "Start guest list",
//   },
//   {
//     title: "Confirm venue budget",
//     category: "Events",
//     status: "pending",
//     action: "Update your events budget",
//   },
// ];

const categories = [
  "Essential",
  "Events",
  "Catering",
  "Photography and video",
  "Planning",
  "Jewellery",
  "Transportation",
  "Wedding cards",
  "Flowers and Decoration",
];

const date = [
  "From 10 to 12 months",
  "From 7 to 9 months",
  "From 4 to 6 months",
  "From 2 to 3 months",
  "The last month",
  "2 weeks",
  "Last week",
  "After the wedding",
];

export default function AsideChecklist() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateQuery = searchParams.get("date") || "";
  const statusQuery = searchParams.get("status") || "";
  const categoryQuery = searchParams.get("category") || "";

  async function getAllTodos() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/checklist/all", {
        token,
      });
      const data = await res.data.todos;
      // setTodos(res.data.todos);
      return data;
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  const {
    data: todos,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
    staleTime: 2000,
  });

  const countTodosByStatus = (status) => {
    return todos?.filter((todo) => todo.status === status).length || 0;
  };

  const countTodosByDate = (dateCategory) => {
    return todos?.filter((todo) => todo.date === dateCategory).length || 0;
  };

  const countTodosByCategory = (category) => {
    return todos?.filter((todo) => todo.category === category).length || 0;
  };

  return (
    <aside>
      <h3 className="text-3xl font-semibold ">Checklist</h3>
      {/* filter */}
      <h4 className="uppercase text-md font-semibold mt-8">Your Search</h4>
      <div>
        {statusQuery && (
          <button
            onClick={() =>
              setSearchParams({
                status: "",
                category: categoryQuery,
                date: dateQuery,
              })
            }
            className="my-2 flex items-center justify-center gap-2 border-2 rounded-full py-2 px-4 w-auto"
          >
            <span className="text-sm">{statusQuery}</span>
            <RxCross2 />
          </button>
        )}
        {dateQuery && (
          <button
            onClick={() =>
              setSearchParams({
                status: statusQuery,
                category: categoryQuery,
                date: "",
              })
            }
            className="my-2 flex items-center justify-center gap-2 border-2 rounded-full py-2 px-4 w-auto"
          >
            <span className="text-sm">{dateQuery}</span>
            <RxCross2 />
          </button>
        )}
        {categoryQuery && (
          <button
            onClick={() =>
              setSearchParams({
                status: statusQuery,
                category: "",
                date: dateQuery,
              })
            }
            className="my-2 flex items-center justify-center gap-2 border-2 rounded-full py-2 px-4 w-auto"
          >
            <span className="text-sm">{categoryQuery}</span>
            <RxCross2 />
          </button>
        )}
      </div>
      {/* status  */}
      <div>
        <h2 className="text-stone-800 text-sm font-semibold mt-8">STATUS</h2>
        <div>
          {["done", "pending"].map((status, i) => {
            return (
              <div
                key={i}
                className="p-2 w-full flex items-center justify-between"
              >
                <button
                  onClick={() =>
                    setSearchParams({
                      status: status,
                      category: categoryQuery,
                      date: dateQuery,
                    })
                  }
                  className=" text-md hover:underline capitalize"
                >
                  <span>{status}</span>
                </button>
                <span className="text-stone-500 font-semibold">
                  {countTodosByStatus(status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* date  */}
      <div>
        <h2 className="text-stone-800 text-sm font-semibold mt-8">DATE</h2>
        <div>
          {date.map((d, i) => {
            return (
              <div
                key={i}
                className="p-2 w-full flex items-center justify-between"
              >
                <button
                  onClick={() =>
                    setSearchParams({
                      status: statusQuery,
                      category: categoryQuery,
                      date: d,
                    })
                  }
                  className=" text-md hover:underline capitalize"
                >
                  <span>{d}</span>
                </button>
                <span className="text-stone-500 font-semibold">
                  {" "}
                  {countTodosByDate(d)}{" "}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* categories */}
      <div>
        <h2 className="text-stone-800 text-sm font-semibold mt-8">
          CATEGORIES
        </h2>
        <div>
          {categories.map((cat, i) => {
            return (
              <div
                key={i}
                className="p-2 w-full flex items-center justify-between"
              >
                <button
                  onClick={() =>
                    setSearchParams({
                      status: statusQuery,
                      category: cat,
                      date: dateQuery,
                    })
                  }
                  className=" text-md hover:underline capitalize"
                >
                  <span>{cat}</span>
                </button>
                <span className="text-stone-500 font-semibold">
                  {countTodosByCategory(cat)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
