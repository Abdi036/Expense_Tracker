/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const loginUser = (userinfo) => {};
  const logoutUser = () => {};
  const signupUser = (userInfo) => {};
  const checkUserStatus = () => {};

  const contextData = {
    user,
    loginUser,
    logoutUser,
    signupUser,
    checkUserStatus,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=>{return useContext(AuthContext)}

export default AuthContext;
