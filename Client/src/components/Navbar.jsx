import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  function handleLogout() {
    setDropdownOpen(false);
    logoutUser();
    navigate("/login");
  }

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-slate-700 text-white shadow-md p-4 mb-20 flex items-center justify-between fixed z-10 w-full">
      <div className="hidden md:flex space-x-4">
        {user ? (
          <button
            onClick={() => navigate("/expensetracker")}
            className="text-lg font-semibold px-5"
          >
            Hello {user.name}
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="text-lg font-semibold px-5"
          >
            Welcome
          </button>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        {user ? (
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none px-20"
          >
            <span className="text-lg font-semibold px-2">{user.name}</span>
            <img
              src={user.profilePic || "/Unknown_person.jpg"}
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
    </nav>
  );
};

export default Navbar;
