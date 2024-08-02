import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { RxDotsHorizontal } from "react-icons/rx";
import Guest from "./Guest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

// const guests = [
//   {
//     name: "John Doe",
//     lastName: "Smith",
//     ageCategory: "Adult",
//     gender: "Male",
//     group: "Partner's coworkers",
//     menu: "Adults",
//   },
//   {
//     name: "Jane",
//     lastName: "Doe",
//     ageCategory: "Child",
//     gender: "Female",
//     group: "Partner's coworkers",
//     menu: "Children",
//   },
//   // Other guest objects...
// ];

export default function Guestlist() {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({
    name: "",
    ageCategory: "",
    gender: "",
    group: "",
    menu: "",
  });
  const queryClient = useQueryClient();

  async function getAllGuests() {
    const token = localStorage.getItem("token");
    const res = await axios.post("http://localhost:3000/guests/all", {
      token,
    });
    const data = await res.data.guests;
    setGuests(data);
    return data;
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["guests"],
    queryFn: getAllGuests,
    staleTime: 1000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (newGuestData) => {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/guest", {
        token: token,
        ...newGuestData,
      });
      const data = await res.data.guest;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Successfully added guest");
    },
    onError: (error) => toast.error(error.message),
  });

  function handleNewGuest(e) {
    e.preventDefault();
    mutate(newGuest);
    console.log(newGuest);
    setGuests([...guests, { ...newGuest }]); // Add newGuest to guestList
    document.getElementById("my_modal_3").close();
  }

  if (isLoading) {
    return (
      <section className="h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </section>
    );
  }

  return (
    <section>
      <div>
        <Button
          color="bg-red-600"
          fontColor="text-stone-100"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Add new guest
        </Button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <form
              className="p-6 grid grid-cols-2 gap-4"
              onSubmit={handleNewGuest}
            >
              <label className="text-md text-stone-600 italic col-span-2">
                Name
                <input
                  type="text"
                  placeholder="Name"
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                  className="capitalize p-2 border-2 w-full"
                  required
                />
              </label>
              <label className="text-md text-stone-600 italic col-span-2">
                Age Category
                <select
                  className="p-2 capitalize border-2 w-full"
                  value={newGuest.ageCategory}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, ageCategory: e.target.value })
                  }
                  required
                >
                  <option value="">Select Age</option>
                  <option value="Adult">Adult</option>
                  <option value="Child">Child</option>
                  <option value="Baby">Baby</option>
                </select>
              </label>
              <label className="text-md text-stone-600 italic col-span-2">
                Gender
                <select
                  className="p-2 capitalize border-2 w-full"
                  value={newGuest.gender}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="text-md text-stone-600 italic col-span-2">
                Group
                <select
                  className="p-2 capitalize border-2 w-full"
                  value={newGuest.group}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, group: e.target.value })
                  }
                  required
                >
                  <option value="">Select Group</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Family">Family</option>
                  <option value="Friends">Friends</option>
                </select>
              </label>
              <label className="text-md text-stone-600 italic col-span-2">
                Menu
                <select
                  className="p-2 capitalize border-2 w-full"
                  value={newGuest.menu}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, menu: e.target.value })
                  }
                  required
                >
                  <option value="">Select Menu</option>
                  <option value="Adult">Adults</option>
                  <option value="Children">Children</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <div className="col-span-2">
                <Button
                  color="bg-red-600"
                  fontColor="text-stone-100"
                  type="submit"
                >
                  {isPending ? "Adding" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </dialog>
      </div>

      <div className="border-2 rounded-lg p-8 mt-4">
        <div className="text-2xl text-stone-600 font-bold">Guests</div>
        <div>
          <table className="w-full  text-left">
            <thead className="bg-stone-200 text-lg my-4">
              <tr>
                <th>Name</th>
                <th>Age Category</th>
                <th>Gender</th>
                <th>Group</th>
                <th>Menu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((guest, index) => (
                <Guest key={index} guest={guest} refetch={refetch} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
