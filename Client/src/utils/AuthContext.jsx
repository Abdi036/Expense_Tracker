/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Signup function
  const signupUser = async (name, email, password, confirmPassword) => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        { name, email, password, confirmPassword }
      );

      if (response.data.token) {
        alert("Signup successful ✨");
        navigate("/login");
      } else {
        setError("Signup failed: No token received");
      }

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Login function
  const loginUser = async (email, password) => {
    setError(null);
    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/login",
      { email, password }
    );

    console.log(response);

    if (response.data) {
      setUser(true);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userName", response.data.user.name);
      alert("Login successful ✨");
      navigate("/expensetracker");

      return response;
    }
  };

  // Logout function
  const logoutUser = () => {
    setUser(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const contextData = {
    error,
    signupUser,
    loginUser,
    logoutUser,
    user,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
