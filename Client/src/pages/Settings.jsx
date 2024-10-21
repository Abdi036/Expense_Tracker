import { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings() {
  const [currentPage, setCurrentPage] = useState("updateProfile");

  const handleLinkClick = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "updateProfile":
        return (
          <div>
            <UpdateProfile />
          </div>
        );
      case "updatePassword":
        return (
          <div>
            <UpdatePassword />
          </div>
        );
      default:
        return <div>Select an option from the left.</div>;
    }
  };

  return (
    <div className="h-[100vh] flex justify-center">
      <div className="w-[20%] bg-gray-200 p-4 mt-16">
        <button
          onClick={() => handleLinkClick("updateProfile")}
          className="block mb-2 pb-2 border-b border-gray-400 w-full text-left"
        >
          Update Profile
        </button>
        <button
          onClick={() => handleLinkClick("updatePassword")}
          className="block mb-2 pb-2 border-b border-gray-400 w-full text-left"
        >
          Update Password
        </button>
        <button className="block mb-2 pb-2 border-b border-gray-400 w-full text-left text-red-600 text-red font-extrabold">
          Delete Profile
        </button>
      </div>
      <div className="flex-1 bg-gray-100 p-4 mt-16">{renderContent()}</div>
    </div>
  );
}
