// import axios from "axios";
// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "../utils/AuthContext";

// const UpdateProfile = () => {
//   const { user, setUser } = useAuth();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [profilePic, setProfilePic] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Construct URL for the profile photo
//   const profilePhotoUrl = profilePic
//     ? `http://localhost:5000/userImage/${profilePic}`
//     : "Unknown_person.jpg";

//   const fileInputRef = useRef(null);
//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (user) {
//       setName(user.name || "");
//       setEmail(user.email || "");
//     }
//   }, [user]);

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePic(file);

//       // Preview the uploaded image
//       const reader = new FileReader();
//       reader.onload = () => {};
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfilePicClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     if (profilePic) {
//       formData.append("photo", profilePic); // Ensure the image is being sent correctly
//     }

//     try {
//       const response = await axios.patch(
//         "http://localhost:5000/api/v1/auth/updateprofile",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedUser = response.data.data.user;

//       // Update user in state and localStorage
//       setUser((prevUser) => ({
//         ...prevUser,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         profilePic: updatedUser.photo || prevUser.profilePic,
//       }));

//       // Save updated user details to localStorage
//       localStorage.setItem("userName", updatedUser.name);
//       localStorage.setItem("email", updatedUser.email);
//       localStorage.setItem("profilePic", updatedUser.photo);
//     } catch (error) {
//       setError("Failed to update profile. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h2 className="text-xl font-semibold mb-5">Update Profile</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4"
//         encType="multipart/form-data"
//       >
//         <div>
//           <div className="flex justify-center">
//             <img
//               src={profilePhotoUrl}
//               alt="Profile Preview"
//               className="w-24 h-24 rounded-full cursor-pointer border-2 border-blue-500"
//               onClick={handleProfilePicClick}
//             />
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleProfilePicChange}
//               className="hidden"
//               accept="image/*"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block text-gray-700">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//           disabled={loading}
//         >
//           {loading ? "Updating..." : "Update Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateProfile;

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../utils/AuthContext";

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null); // For image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("authToken");

  // Set initial values for the form fields
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfilePicPreview(user.profilePic || "Unknown_person.jpg"); // Set initial profile pic
    }
  }, [user]);

  // Handle file input change (profile pic update)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);

      // Show the preview of the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target.result); // Set preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (profilePic) {
      formData.append("photo", profilePic); // Send the image file
    }

    try {
      const response = await axios.patch(
        "http://localhost:5000/api/v1/auth/updateprofile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.data.user;

      // Update user state and localStorage with the new data
      setUser((prevUser) => ({
        ...prevUser,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.photo || prevUser.profilePic, // Updated profile picture
      }));

      // Save updated user details to localStorage
      localStorage.setItem("userName", updatedUser.name);
      localStorage.setItem("email", updatedUser.email);
      localStorage.setItem("profilePic", updatedUser.photo); // Store updated profile picture
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-5">Update Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <div className="flex justify-center">
            {/* Display preview image or default */}
            <img
              src={profilePicPreview} // Use preview image
              alt="Profile Preview"
              className="w-24 h-24 rounded-full cursor-pointer border-2 border-blue-500"
              onClick={handleProfilePicClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
