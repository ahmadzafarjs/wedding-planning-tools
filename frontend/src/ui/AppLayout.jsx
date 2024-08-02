import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

// eslint-disable-next-line react/prop-types
export default function AppLayout() {
  return (
    <>
      <Header />
      <Navbar />
      <main className="max-w-6xl mx-auto">
        <div className="pt-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}
