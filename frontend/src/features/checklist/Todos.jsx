import React, { useEffect, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { CiCircleCheck, CiCirclePlus } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";
import Todo from "./components/Todo";
import { Button } from "react-daisyui";
import axios from "axios";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// const todos = [
//   {
//     title: "Check if your wedding date is on an auspicious day",
//     category: "Planning",
//     status: "pending",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Do you want a destination wedding?",
//     category: "Planning",
//     status: "done",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Short list date options for all pre-wedding functions",
//     category: "Planning",
//     status: "pending",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Delegate responsibilities",
//     category: "Other",
//     status: "pending",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Decide whether or not you'd like to use a wedding planner",
//     category: "Planning",
//     status: "pending",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Download the WeddingWire App",
//     category: "Planning",
//     status: "done",
//     action: "Download Now",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Create initial guest list using our guest list tool",
//     category: "Planning",
//     status: "pending",
//     action: "Start guest list",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Confirm venue budget",
//     category: "Events",
//     status: "pending",
//     action: "Update your events budget",
//     date: "From 10 to 12 months",
//   },
//   {
//     title: "Book your wedding venue",
//     category: "Events",
//     status: "pending",
//     date: "From 7 to 9 months",
//   },
//   {
//     title: "Hire a photographer and videographer",
//     category: "Photography and video",
//     status: "pending",
//     date: "From 7 to 9 months",
//   },
//   {
//     title: "Order wedding invitations",
//     category: "Wedding cards",
//     status: "done",
//     date: "From 7 to 9 months",
//   },
//   {
//     title: "Choose your wedding dress",
//     category: "Jewellery",
//     status: "pending",
//     date: "From 7 to 9 months",
//   },
//   {
//     title: "Arrange transportation",
//     category: "Transportation",
//     status: "pending",
//     date: "From 7 to 9 months",
//   },
//   {
//     title: "Book a caterer",
//     category: "Catering",
//     status: "pending",
//     date: "From 7 to 9 months",
//   },
//   {
//     title: "Order flowers and decorations",
//     category: "Flowers and Decoration",
//     status: "pending",
//     date: "From 4 to 6 months",
//   },
//   {
//     title: "Schedule hair and makeup artists",
//     category: "Essential",
//     status: "pending",
//     date: "From 4 to 6 months",
//   },
//   {
//     title: "Plan honeymoon details",
//     category: "Planning",
//     status: "pending",
//     date: "From 4 to 6 months",
//   },
//   {
//     title: "Prepare a timeline for the wedding day",
//     category: "Planning",
//     status: "pending",
//     date: "From 4 to 6 months",
//   },
//   {
//     title: "Send out wedding invitations",
//     category: "Wedding cards",
//     status: "pending",
//     date: "From 4 to 6 months",
//   },
//   {
//     title: "Buy wedding rings",
//     category: "Jewellery",
//     status: "pending",
//     date: "From 4 to 6 months",
//   },
//   {
//     title: "Organize a rehearsal dinner",
//     category: "Events",
//     status: "pending",
//     date: "From 2 to 3 months",
//   },
//   {
//     title: "Apply for a marriage license",
//     category: "Essential",
//     status: "pending",
//     date: "From 2 to 3 months",
//   },
//   {
//     title: "Finalize guest list",
//     category: "Planning",
//     status: "pending",
//     date: "From 2 to 3 months",
//   },
//   {
//     title: "Confirm all vendor bookings",
//     category: "Planning",
//     status: "pending",
//     date: "From 2 to 3 months",
//   },
//   {
//     title: "Pack for honeymoon",
//     category: "Essential",
//     status: "pending",
//     date: "The last month",
//   },
//   {
//     title: "Arrange for wedding day emergency kit",
//     category: "Essential",
//     status: "pending",
//     date: "The last month",
//   },
//   {
//     title: "Practice your wedding vows",
//     category: "Other",
//     status: "pending",
//     date: "The last month",
//   },
//   {
//     title: "Get final dress fitting",
//     category: "Jewellery",
//     status: "pending",
//     date: "The last month",
//   },
//   {
//     title: "Confirm final guest count with caterer",
//     category: "Catering",
//     status: "pending",
//     date: "2 weeks",
//   },
//   {
//     title: "Enjoy your wedding day!",
//     category: "Events",
//     status: "pending",
//     date: "Last week",
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

const dates = [
  "From 10 to 12 months",
  "From 7 to 9 months",
  "From 4 to 6 months",
  "From 2 to 3 months",
  "The last month",
  "2 weeks",
  "Last week",
  "After the wedding",
];

const Todos = () => {
  // const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    category: "",
    status: "pending", // Default status
    date: "",
  });
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const category = searchParams.get("category");

  const queryClient = useQueryClient();

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (newTodoToAdd) => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/checklist", {
          token: token,
          title: newTodoToAdd.title,
          date: newTodoToAdd.date,
          category: newTodoToAdd.category,
        });
        const data = await res.data;
        return data;
      } catch (error) {
        throw new Error(error.response.data.message || error.message);
      }
    },
    onSuccess: () => {
      toast.success("New Todo added");
      refetch();
      setNewTodo({
        title: "",
        category: "",
        status: "pending",
        date: "",
      }); // Clear the form after successful addition
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const groupTodosByDate = (todos) => {
    return todos?.reduce((groups, todo) => {
      const date = todo.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(todo);
      return groups;
    }, {});
  };

  const filterTodos = (todos) => {
    return todos?.filter((todo) => {
      return (
        (!status || todo.status === status) &&
        (!date || todo.date === date) &&
        (!category || todo.category === category)
      );
    });
  };

  const filteredTodos = filterTodos(todos);
  const groupedTodos = groupTodosByDate(filteredTodos);

  const handleNewTodoSubmit = (e) => {
    e.preventDefault();
    mutate(newTodo);
    console.log(newTodo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section>
      {/* Add new todo modal */}
      <div>
        <button
          onClick={() => document.getElementById("addTodoModal").showModal()} // Consider using state to manage modal visibility
          className="p-4 border-2 rounded-lg w-full flex items-center justify-start text-red-600 gap-3"
        >
          <CiCirclePlus className="text-5xl" />
          <span className="text-xl text-stone-600">Add a new task</span>
        </button>

        <dialog id="addTodoModal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <form
              className="grid grid-cols-2 gap-2 p-6"
              onSubmit={handleNewTodoSubmit}
            >
              <div className="border-2 flex p-2 gap-2 items-center">
                <input
                  type="checkbox"
                  checked={newTodo.status === "done"}
                  onChange={() =>
                    setNewTodo({
                      ...newTodo,
                      status: newTodo.status === "pending" ? "done" : "pending",
                    })
                  }
                />
                Completed
              </div>
              <select
                className="p-2 border-2"
                name="date"
                value={newTodo.date}
                onChange={handleInputChange}
              >
                {/* Assuming dates and categories are predefined */}
                <option key="date">Select Date</option>
                {dates.map((d, i) => (
                  <>
                    <option key={i} value={d}>
                      {d}
                    </option>
                  </>
                ))}
              </select>
              <select
                className="p-2 border-2"
                name="category"
                value={newTodo.category}
                onChange={handleInputChange}
              >
                <option key="category">Select Category</option>
                {categories.map((cat, i) => (
                  <>
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  </>
                ))}
              </select>
              <input
                type="text"
                name="title"
                placeholder="Name"
                value={newTodo.title}
                onChange={handleInputChange}
              />
              <button type="submit" className="btn bg-red-600 text-stone-100">
                Save
              </button>
            </form>
          </div>
        </dialog>
      </div>

      {/* Display todos */}
      <div>
        {Object.keys(groupedTodos).map((date) => (
          <div key={date} className="my-8">
            <h3 className="font-semibold text-xl mb-3">{date}</h3>
            <div className="border-2 rounded-lg">
              {groupedTodos[date].map((todo, index) => (
                <Todo key={index} todo={todo} refetch={refetch} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Todos;
