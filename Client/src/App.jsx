import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Settings from "./pages/Settings";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { AuthProvider } from "./utils/AuthContext";
import ExpenseTracker from "./pages/ExpenceTracker";

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
              <Route path="/settings" element={<Settings />} />
              <Route path="/expensetracker" element={<ExpenseTracker />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
