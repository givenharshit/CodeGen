import axios from "../config/axios.js";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context.jsx";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/register", { email, password })
      .then((res) => { 
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Register
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-white block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-white block mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-400">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
