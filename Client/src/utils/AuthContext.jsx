/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // loading state while checking auth status
  const [user, setUser] = useState(false); // state to hold the current user

  // Signup function
  // Signup function
  const signupUser = async (email, password) => {};

  // Login function
  const loginUser = async (email, password) => {};

  // Check user status (to retain session)
  const checkUserStatus = async () => {};

  const contextData = {
    user,
    loginUser,
    signupUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Custom Hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
