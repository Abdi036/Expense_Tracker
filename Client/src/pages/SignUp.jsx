import { useState } from "react";
import { useAuth } from "../utils/AuthContext"; // Adjust the path as per your file structure
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signupUser } = useAuth(); // Import the signup function
  const [error, setError] = useState(null); // State for handling errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call the signup function from the Auth context
      await signupUser(email, password);
    } catch (err) {
      setError(err.message); // Set error if sign-up fails
    }
  };

  return (
    <div className="flex justify-center items-center h-auto bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-28">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}{" "}
        {/* Error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Signup
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
