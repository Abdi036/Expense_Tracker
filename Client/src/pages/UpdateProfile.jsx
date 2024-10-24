import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();

  const profileURL =
    user?.profilePic && user.profilePic !== "Unknown_person.jpg"
      ? `http://localhost:5000/userImage/${user.profilePic}`
      : "/Unknown_person.jpg";

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    photo: null,
  });

  // Set default profile picture URL

  const [photoPreview, setPhotoPreview] = useState(profileURL);

  const [message, setMessage] = useState(null);

  const { name, email, photo } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    if (photo) {
      form.append("photo", photo);
    }

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/v1/auth/updateprofile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the user state in AuthContext and local storage
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          name: res.data.data.user.name,
          email: res.data.data.user.email,
          profilePic: res.data.data.user.photo || "Unknown_person.jpg",
        };
        // Update local storage
        localStorage.setItem("userName", updatedUser.name);
        localStorage.setItem("email", updatedUser.email);
        localStorage.setItem("profilePic", updatedUser.profilePic);
        return updatedUser;
      });

      alert("Profile updated successfully ✨✨✨");
      navigate("/expensetracker");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-5">Update Profile</h2>
      {message && (
        <div className="text-center mb-4 text-red-500">{message}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex justify-center ">
          <div
            className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile pic"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Click to upload
              </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="group relative flex justify-center border border-transparent text-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-bold py-2 px-4 rounded"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
