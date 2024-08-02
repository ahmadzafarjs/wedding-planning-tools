import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  function handleLogout() {
    localStorage.removeItem("token");
  }

  return (
    <div className="border-b-2">
      <header className="h-[60px] max-w-6xl mx-auto flex items-center justify-between ">
        <div className="flex items-center">
          <h3 className="text-red-500 font-semibold text-xl">WeddingWire.in</h3>
        </div>
        <div className="flex items-center gap-8">
          <div className={`ml-14 ${localStorage.getItem("token") && "hidden"}`}>
            <Link to="login" className="font-semi-bold">
              Login
            </Link>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-700 text-stone-50">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                M
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-stone-700"
              >
                <li>
                  <a>Wellcome Manik</a>
                </li>
                <li>
                  <a>
                    <button onClick={handleLogout}>Logout</button>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
