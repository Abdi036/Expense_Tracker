import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/SignUp';

const App = () => {
  const userName = "John Doe"; // Replace with actual user name
  const profilePic = "https://via.placeholder.com/150"; // Replace with actual profile picture URL

  return (
    <Router>
      <Navbar userName={userName} profilePic={profilePic}  />
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
