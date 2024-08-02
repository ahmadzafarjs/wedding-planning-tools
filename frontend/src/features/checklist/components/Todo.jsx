import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CiCircleCheck } from "react-icons/ci";

export default function Todo({ todo, refetch }) {
  const [myTodo, setMyTodo] = useState(todo);
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation({
    mutationFn: async (updatedTodo) => {
      try {
        const res = await axios.put(
          `http://localhost:3000/checklist/${todo._id}`,
          updatedTodo
        );
        const data = await res.data;
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: () => {
      toast.success("Todo updated successfully");
      refetch();
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete(
          `http://localhost:3000/checklist/${todo._id}`
        );
        const data = await res.data;
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: () => {
      toast.success("Todo deleted successfully");
      refetch();
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMyTodo({ ...myTodo, [name]: value });
  };

  const handleCheckboxChange = () => {
    const updatedTodo = {
      ...myTodo,
      status: myTodo.status === "pending" ? "done" : "pending",
    };
    setMyTodo(updatedTodo);
    mutateUpdate(updatedTodo);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    mutateUpdate(myTodo);
  };

  const handleDelete = () => {
    mutateDelete();
  };

  return (
    <div className="p-4 border-b-2 flex items-center justify-start gap-4">
      <CiCircleCheck
        className={`text-5xl ${
          myTodo.status === "done" ? "text-green-600" : "text-stone-600"
        } hover:text-green-600`}
        onClick={handleCheckboxChange}
      />
      <div className="flex flex-col">
        <button
          className={`text-xl font-semibold ${
            myTodo.status === "done" && "line-through text-stone-400"
          }`}
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          {myTodo.title}
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <form
              className="grid grid-cols-2 gap-2 p-6"
              onSubmit={handleUpdate}
            >
              <div className="border-2 flex p-2 gap-2 items-center">
                <input
                  type="checkbox"
                  checked={myTodo.status === "done"}
                  onChange={(e) =>
                    setMyTodo({
                      ...myTodo,
                      status: myTodo.status === "pending" ? "done" : "pending",
                    })
                  }
                />
                <span>Completed</span>
              </div>
              <select
                name="date"
                value={myTodo.date}
                onChange={handleInputChange}
                className="p-2 border-2"
              >
                <option value="">Select date</option>
                <option value="From 10 to 12 months">
                  From 10 to 12 months
                </option>
                <option value="From 7 to 9 months">From 7 to 9 months</option>
                <option value="From 4 to 6 months">From 4 to 6 months</option>
                <option value="From 2 to 3 months">From 2 to 3 months</option>
                <option value="The last month">The last month</option>
                <option value="2 weeks">2 weeks</option>
                <option value="Last week">Last week</option>
              </select>
              <select
                name="category"
                value={myTodo.category}
                onChange={handleInputChange}
                className="p-2 border-2"
              >
                <option value="">Select category</option>
                <option value="Planning">Planning</option>
                <option value="Other">Other</option>
                <option value="Events">Events</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Catering">Catering</option>
                <option value="Essential">Essential</option>
                <option value="Wedding cards">Wedding cards</option>
                <option value="Flowers and Decoration">
                  Flowers and Decoration
                </option>
                <option value="Photography and video">
                  Photography and video
                </option>
                <option value="Transportation">Transportation</option>
              </select>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={myTodo.title}
                onChange={handleInputChange}
                className="p-2 border-2"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="p-2 bg-red-600 text-white rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 bg-stone-200 text-stone-700 rounded"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </dialog>
        <span className="text-stone-400 italic text-xs w-auto">
          {myTodo.category}
        </span>
      </div>
    </div>
  );
}
