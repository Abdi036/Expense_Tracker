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
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
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

    // Set loading to false after the localStorage check
    setLoading(false);
  }, []);

  // ###### GETPRODUCT ######
  const fetchProducts = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/product/getproducts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching products");
    }
  };

  // ###### ADDPRODUCT ######
  const addProduct = async (formData) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/product/createProduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Product added successfully");
      setProducts([...products, res.data.data.product]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding product");
    }
  };

  // ###### EDITPRODUCT ######
  const editProduct = async (id, editData) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/v1/product/updateproducts/${id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Product updated successfully");
      const updatedProducts = products.map((product) =>
        product._id === id ? res.data.data : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating product");
    }
  };

  // ###### DELETEPRODUCT ######
  const deleteProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/product/deleteProducts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Product deleted successfully");
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting product");
    }
  };

  // ###### SIGNUP ######
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

  // ###### LOGIN ######
  const loginUser = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password }
      );

      if (response.data) {
        const profilePic =
          response.data.data.user.photo || "Unknown_person.jpg";
        setUser({
          token: response.data.token,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          profilePic: profilePic,
        });
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userName", response.data.data.user.name);
        localStorage.setItem("email", response.data.data.user.email);
        localStorage.setItem("profilePic", profilePic);
        navigate("/expensetracker");
        return response;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    }
  };
  // ###### LOGOUT ######
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");
    navigate("/login");
    window.location.reload();
  };

  const updatePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to update your password");
        return;
      }

      const response = await axios.patch(
        "http://localhost:5000/api/v1/auth/updatepassword",
        {
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        alert("Password updated successfully ✨");
        navigate("/expensetracker");
      } else {
        setError("Password update failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Password update failed";
      setError(errorMessage);
      throw err;
    }
  };

  // ###### DELETEPROFILE ######
  const deleteProfile = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to delete your profile");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete your profile?"
      );
      if (!confirmDelete) return;

      await axios.delete("http://localhost:5000/api/v1/auth/deleteProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.clear();
      setUser(null);
      navigate("/signup", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Profile deletion failed";
      setError(errorMessage);
      throw err;
    }
  };

  const contextData = {
    error,
    signupUser,
    loginUser,
    logoutUser,
    updatePassword,
    deleteProfile,
    setUser,
    user,
    loading,
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct,
    products,
    message,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
