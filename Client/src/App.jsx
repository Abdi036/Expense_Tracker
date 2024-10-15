import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { AuthProvider } from "./utils/AuthContext";

const App = () => {
  const userName = "John Doe";
  const profilePic = "https://via.placeholder.com/150";

  return (
    <Router>
      <AuthProvider>
        <Navbar userName={userName} profilePic={profilePic} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
