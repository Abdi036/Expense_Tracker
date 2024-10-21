/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check localStorage for token and user details on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("userName");
    const email = localStorage.getItem("email");
    const profilePic = localStorage.getItem("profilePic");

    if (token && username && email) {
      setUser({ token, name: username, email, profilePic });
    }
    setLoading(false);
  }, []);

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

  const loginUser = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password }
      );

      if (response.data) {
        setUser({
          token: response.data.token,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          profileImg: response.data.data.user.photo,
        });
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userName", response.data.data.user.name);
        localStorage.setItem("email", response.data.data.user.email);
        navigate("/expensetracker");
        return response;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const contextData = {
    error,
    signupUser,
    loginUser,
    logoutUser,
    setUser,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
