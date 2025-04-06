import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context.jsx";
import axios from "../config/axios.js";
import { ProjectList } from "../components/ProjectList.jsx";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project Submitted: ", {
      name: formData.projectName,
      description: formData.description,
    });
    axios
      .post("api/projects/create", {
        name: formData.projectName,
        description: formData.description,
      })
      .then((res) => {
        console.log("Project Created: ", res.data);
        setIsModalOpen(false);
        setFormData({ projectName: "", description: "" });
      })
      .catch((err) => {
        console.log("Project Creation Failed: ", err);
      });
  };


  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.user?.email || "User"}!
          </h1>
        </div>

        {/* New Project Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <i className="ri-add-line text-xl"></i>
          <span>New Project</span>
        </button>
      </div>

      {/* Project List */}
      <div className="projects grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
        <ProjectList />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter project description"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;