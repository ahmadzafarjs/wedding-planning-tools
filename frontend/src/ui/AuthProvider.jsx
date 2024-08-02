import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthProvider() {
  // Initialize token state with the value from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setToken("");
    }
  }, [token]);

  // If the token exists, render the nested routes (Outlet)
  // Otherwise, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/login" />;
}
