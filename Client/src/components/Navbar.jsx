/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext"; // Ensure this path is correct

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 mb-20 flex items-center justify-between fixed z-10 w-full">
      <div className="flex items-center">
        {user ? (
          <>
            {/* Profile Picture */}
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-2 border-2 border-blue-500"
            />
            {/* User Name */}
            <span className="text-lg font-semibold">{user.name}</span>
          </>
        ) : (
          <span className="text-lg font-semibold">Welcome</span>
        )}
      </div>

      {/* Links */}
      <div className="hidden md:flex space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-500">
              Profile
            </Link>
            <Link to="/settings" className="text-gray-700 hover:text-blue-500">
              Settings
            </Link>
            <button
              onClick={logoutUser}
              className="text-gray-700 hover:text-blue-500"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-gray-700 hover:text-blue-500">
            Login
          </Link>
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
