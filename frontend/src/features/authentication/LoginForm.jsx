import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const inputStyles = `w-full bg-transparent py-2 border-b-2 focus:border-stone-400 outline-none`;
const inputParent = `my-3`;

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (userdata) => {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata), // body data type must match "Content-Type" header
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully Login");
      navigate("/");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

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
            <h3 className="text-2xl mb-6 text-center">
              Welcome back! Login 👏
            </h3>
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
            {/* submit */}
            <button className="py-3 w-full my-4 bg-red-600 text-stone-100 font-normal rounded-full">
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-stone-500">
              Don&apos;t have account? Signup for free.{" "}
              <i>
                <Link className="text-red-600" to="/signup">
                  Signup
                </Link>
              </i>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
