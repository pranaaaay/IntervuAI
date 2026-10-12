import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="flex bg-slate-800 items-center pl-5 pt-3 pr-5 pb-3 justify-between sticky w-full">

      {/* Logo and Navigation */}
      <div className="flex space-x-5 items-center">

        <Link
          to="/"
          className="font-sans text-white font-medium text-xl"
        >
          INTERVUAI
        </Link>

        <Link
          to="/"
          className="rounded-lg pl-3 pt-2 pr-3 pb-2 bg-slate-100"
        >
          Dashboard
        </Link>

        <Link
          to="/interview-history"
          className="rounded-lg pl-3 pt-2 pr-3 pb-2 bg-slate-100"
        >
          History
        </Link>

        <Link
          to="/performance"
          className="rounded-lg pl-3 pt-2 pr-3 pb-2 bg-slate-100"
        >
          Performance
        </Link>

      </div>

      {/* Authentication */}
      <div className="flex items-center gap-5 font-medium">

        <Link to="/login">
          <button className="rounded-lg pl-3 pt-2 pr-3 pb-2 bg-slate-100">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button className="rounded-lg pl-3 pt-2 pr-3 pb-2 bg-slate-100">
            Signup
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-lg pl-3 pt-2 pr-3 pb-2 bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Navbar;