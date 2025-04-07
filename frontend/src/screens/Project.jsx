import React, { useState } from "react";
import { LeftSection } from "../components/LeftSection.jsx";
import RightSection from "../components/RightSection.jsx";

export const Project = () => {
  const [activeTab, setActiveTab] = useState("left");

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-1 py-2 ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${label === "Files" ? "rounded-br-md" : "rounded-tr-md"}`}
    >
      {label}
    </button>
  );

  const TabHeader = () => (
    <div className="flex flex-col ">
      <TabButton tab="left" label="Chats" />
      <TabButton tab="right" label="Files" />
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
      <div className="flex justify-between items-center bg-white shadow-md p-1 rounded-md top-60 fixed">
        <TabHeader />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 rounded-b-md ">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default Project;