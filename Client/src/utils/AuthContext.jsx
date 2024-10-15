/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supaBase";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // loading state while checking auth status
  const [user, setUser] = useState(null); // state to hold the current user

  // Check user on component mount
  useEffect(() => {
    checkUserStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        navigate("/"); // or the page you want to redirect to
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/login"); // or the page you want to redirect to
      }
      setLoading(false);
    });

    // Return the unsubscribe function to clean up the listener
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  // Signup function
  // Signup function
  const signupUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message); // Throw error to catch in the component
    } else {
      setUser(data.user);
      navigate("/"); // Redirect after successful signup
    }
  };

  // Login function
  const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message); // Throw error to catch in the component
    } else {
      setUser(data.user);
      navigate("/"); // Redirect after successful login
    }
  };

  // Check user status (to retain session)
  const checkUserStatus = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (data.session) {
      setUser(data.session.user);
    } else if (error) {
      console.error("Error checking user status:", error.message);
    }
    setLoading(false);
  };

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
