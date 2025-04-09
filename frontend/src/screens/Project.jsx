import React, { useState } from "react";
import { LeftSection } from "../components/LeftSection.jsx";
import { useNavigate } from "react-router-dom";
import RightSection from "../components/RightSection.jsx";
import { IoArrowBack, IoChatbubblesOutline, IoFolderOutline } from "react-icons/io5"; // Import icons for Chats and Files

export const Project = () => {
  const [activeTab, setActiveTab] = useState("left");
  const navigate = useNavigate();

  const TabButton = ({ tab, Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`py-2 px-4 flex items-center justify-center ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${tab === "right" ? "rounded-br-md" : "rounded-tr-md"}`}
    >
      <Icon size={20} /> {/* Render the icon */}
    </button>
  );

  const TabHeader = () => (
    <div className="flex flex-col">
      <TabButton tab="left" Icon={IoChatbubblesOutline} /> {/* Chats Icon */}
      <TabButton tab="right" Icon={IoFolderOutline} /> {/* Files Icon */}
    </div>
  );

  const renderActiveTab = () => {
    if (activeTab === "left") {
      return <LeftSection />;
    } else if (activeTab === "right") {
      return <RightSection />;
    }
  };

  return (
    <div className="relative">
      {/* Back Arrow */}
      <div className="absolute top-2 left-2">
        <button
          onClick={() => navigate("/")} // Navigate to the home page
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <IoArrowBack size={24} /> {/* Arrow Icon */}
        </button>
      </div>
      <div className="flex justify-between items-center bg-white shadow-md p-1 rounded-md top-1/2 fixed">
        <TabHeader />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 rounded-b-md">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default Project;