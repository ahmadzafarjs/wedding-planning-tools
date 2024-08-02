import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

const inputStyles = `w-full bg-transparent py-2 border-b-2 focus:border-stone-400 outline-none`;
const inputParent = `my-3`;

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    surname: "",
    email: "",
    password: "",
    location: "",
    country: "india",
    date: "",
    phone: "",
    status: "",
  });

  // const handleSubmit = async () => {
  //   const response = await fetch("http://localhost:3000/signup", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData), // body data type must match "Content-Type" header
  //   });
  //   return response.json();
  // };

  const { mutate, isPending } = useMutation({
    mutationFn: async (userdata) => {
      const response = await axios.post("http://localhost:3000/signup", {
        surname: userdata.surname,
        email: userdata.email,
        password: userdata.password,
        eventLocation: userdata.location,
        country: "india",
        eventDate: userdata.date,
        phone: userdata.phone,
        userStatus: userdata.status,
      });
      if (!response.ok) {
        const errorData = await response.data;
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Something went wrong");
      }
      const data = await response.data;
      console.log(data);
    },
    onSuccess: () => {
      toast.success("Successfully Signup");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    mutate(formData);
    navigate("/login");
  }

  return (
    <>
      <nav className="my-8">
        <h2 className="text-2xl text-center text-red-600 font-semibold">
          WEDDINGWIRE.IN
        </h2>
      </nav>

      <div className="max-w-[900px] h-[795px] flex justify-center mx-auto">
        <div className="max-w-[385px] overflow-hidden flex-1">
          <img
            className="h-full object-cover"
            src="https://cdn1.weddingwire.in/assets/img/layer-alta/default_en-IN.jpg"
            alt="banner-img"
          />
        </div>
        <div className="shadow-lg w-[513px] p-8">
          <form className="w-full" onSubmit={handleSubmit}>
            <h3 className="text-2xl mb-6 text-center">Signup for free 😊</h3>
            {/* // Surname */}
            <div className={inputParent}>
              <input
                className={inputStyles}
                name="surname"
                type="text"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </div>
            {/* email */}
            <div className={inputParent}>
              <input
                className={inputStyles}
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* password */}
            <div className={inputParent}>
              <input
                className={inputStyles}
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* location */}
            <div className="grid grid-cols-2 gap-5">
              <div className={inputParent}>
                <input
                  className={inputStyles}
                  name="location"
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className={inputParent}>
                <select
                  className={inputStyles}
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="india">India</option>
                </select>
              </div>
            </div>
            {/* date & phone */}
            <div className="grid grid-cols-2 gap-5">
              <div className={inputParent}>
                <input
                  className={inputStyles}
                  name="date"
                  type="date"
                  placeholder="Event Date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className={inputParent}>
                <input
                  className={inputStyles}
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* bridal status */}
            <div className="flex items-center justify-start gap-6 my-4">
              <h3>I am</h3>
              <p className="flex gap-4">
                <span>
                  <input
                    name="status"
                    id="bride"
                    type="radio"
                    value="bride"
                    checked={formData.status === "bride"}
                    onChange={handleChange}
                  />
                  <label
                    className="ml-2 text-stone-700 font-semibold"
                    htmlFor="bride"
                  >
                    Bride
                  </label>
                </span>
                <span>
                  <input
                    name="status"
                    id="groom"
                    type="radio"
                    value="groom"
                    checked={formData.status === "groom"}
                    onChange={handleChange}
                  />
                  <label
                    className="ml-2 text-stone-700 font-semibold"
                    htmlFor="groom"
                  >
                    Groom
                  </label>
                </span>
              </p>
            </div>
            {/* submit */}
            <button className="py-3 w-full my-4 bg-red-600 text-stone-100 font-normal rounded-full">
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Signup"
              )}
            </button>
            <p className="text-stone-500">
              Already have a account?{" "}
              <i>
                <Link className="text-red-600" to="/login">
                  Login
                </Link>
              </i>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
