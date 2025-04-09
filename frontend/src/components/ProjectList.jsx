import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";

export const ProjectList = ({ reload }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    axios
      .get("/api/projects/all", {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      })
      .then((res) => {
        console.log(res.data.projects);
        setProjects(res.data.projects);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      });
  }, [reload]); // Re-fetch projects when reload changes

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div
          onClick={() =>
            navigate("/project", {
              state: { project },
            })
          }
          key={project._id}
          className="project flex flex-col gap-4 cursor-pointer p-6 bg-white shadow-md rounded-lg hover:shadow-lg hover:bg-gray-100 transition-all duration-200 overflow-hidden"
        >
          <h2 className="font-semibold text-lg text-gray-800">{project.name}</h2>

          <div className="flex items-center gap-2 text-gray-600">
            <i className="ri-user-3-line text-blue-500"></i>
            <small className="text-sm">
              Collaborators: {project.user.length}
            </small>
          </div>

          <div className="border-t border-gray-300 mt-4"></div>
        </div>
      ))}
    </div>
  );
};