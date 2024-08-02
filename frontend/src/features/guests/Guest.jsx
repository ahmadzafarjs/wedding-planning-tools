import React, { useState } from "react";
import Button from "../../ui/Button";
import { RxDotsHorizontal } from "react-icons/rx";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function Guest({ guest, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGuest, setEditedGuest] = useState(guest);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (updateData) => {
      const res = await axios.put(
        `http://localhost:3000/guest/${editedGuest._id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Successfully updated");
      refetch();
      setIsEditing(false); // Close the edit modal
    },
    onError: (error) => toast.error(error.message),
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false); // Close the edit modal without saving changes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGuest({ ...editedGuest, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(editedGuest);
  };

  async function handleDelete() {
    try {
      const res = await axios.delete(
        `http://localhost:3000/guest/${editedGuest._id}`
      );

      if (res.status !== 200) {
        toast.error("Failed to delete");
        return;
      }

      const data = res.data;
      toast.success("Deleted Successfully");
      refetch();
      return data;
    } catch (error) {
      toast.error("Failed to delete");
      console.error(error); // Optional: log the error for debugging purposes
    }
  }
  return (
    <tr key={guest._id}>
      <td>{guest.name}</td>
      <td>{guest.ageCategory}</td>
      <td>{guest.gender}</td>
      <td>{guest.group}</td>
      <td>{guest.menu}</td>
      <td>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            <RxDotsHorizontal />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li onClick={handleEdit}>
              <a>Edit</a>
            </li>
            <li>
              <a>
                <button onClick={handleDelete}>Delete</button>
              </a>
            </li>
          </ul>
        </div>
      </td>
      <td>
        {/* Edit Modal */}
        {isEditing && (
          <dialog className="modal" open>
            <div className="modal-box">
              <form
                className="p-6 grid grid-cols-2 gap-4 w-full"
                onSubmit={handleSubmit}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={handleCancel}
                >
                  ✕
                </button>
                <label className="text-md text-stone-600 italic" htmlFor="name">
                  Name
                </label>
                <input
                  className="capitalize"
                  type="text"
                  name="name"
                  value={editedGuest.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />

                <label
                  className="text-md text-stone-600 italic"
                  htmlFor="ageCategory"
                >
                  Age Category
                </label>
                <select
                  className="p-2 border-2"
                  name="ageCategory"
                  value={editedGuest.ageCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Age</option>
                  <option value="Adult">Adult</option>
                  <option value="Child">Child</option>
                  <option value="Baby">Baby</option>
                </select>

                <label
                  className="text-md text-stone-600 italic"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  className="p-2 border-2"
                  name="gender"
                  value={editedGuest.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <label
                  className="text-md text-stone-600 italic"
                  htmlFor="group"
                >
                  Group
                </label>
                <select
                  className="p-2 border-2"
                  name="group"
                  value={editedGuest.group}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Group</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Family">Family</option>
                  <option value="Friends">Friends</option>
                </select>

                <label className="text-md text-stone-600 italic" htmlFor="menu">
                  Menu
                </label>
                <select
                  className="p-2 border-2"
                  name="menu"
                  value={editedGuest.menu}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Menu</option>
                  <option value="Adult">Adults</option>
                  <option value="Children">Children</option>
                  <option value="Other">Other</option>
                </select>

                <Button
                  color="bg-red-600"
                  fontColor="text-stone-100"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </form>
            </div>
          </dialog>
        )}
      </td>
    </tr>
  );
}
