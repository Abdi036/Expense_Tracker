/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  let username = localStorage.getItem("userName");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  function handleLogout() {
    setDropdownOpen(false);
    logoutUser();
    return navigate("/login");
  }

  return (
    <nav className="bg-slate-700 text-white shadow-md p-4 mb-20 flex items-center justify-between fixed z-10 w-full">
      {/* left: Links */}
      <div className="hidden md:flex space-x-4">
        {user ? (
          <>
            <div className="px-20">HELLO {username}</div>
          </>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="text-lg font-semibold px-5"
          >
            Welcome
          </button>
        )}
      </div>

      {/* right: Profile Picture and Name */}
      <div className="relative">
        {user ? (
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none px-20"
          >
            {/* User Name */}
            <span className="text-lg font-semibold px-2">{username}</span>
            {/* Profile Picture */}
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-2 border-2 border-blue-500"
            />
          </button>
        ) : (
          <div className="px-5">
            <Link to="/login" className="hover:text-blue-500">
              Login
            </Link>
          </div>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute left-5 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Settings
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-gray-700 focus:outline-none">
          {/* Icon for Mobile Menu (Hamburger) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
