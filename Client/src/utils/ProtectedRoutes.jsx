// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const ProtectedRoutes = () => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoutes;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading until auth state is checked
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
