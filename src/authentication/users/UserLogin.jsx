import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { ClipLoader } from "react-spinners";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const UserLogin = () => {
  const [userInput, setUserinput] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    let dataToSend = {};

    if (userInput.length === 10 && /^[0-9]+$/.test(userInput)) {
      dataToSend = { mobile: userInput, password: password };
    } else if (userInput.includes("@")) {
      dataToSend = { email: userInput, password: password };
    } else {
      setError("Invalid input!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/login/user`, dataToSend);
      // console.log(response.data)
      const data = response.data;
      localStorage.setItem("token", data.token);
      loginUser(data.user); // Store user data in context
      setSuccess("Login successful!");
      // console.log(data.user);

      // alert(data.message || "Login successful!");
      window.location.href = "/pages/user-dashboard";
    } catch (e) {
      // console.log(e);
      // alert(e.response?.data?.message || "Login failed!");
      setError(e.response?.data?.message || "Login failed!");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email or Mobile</label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserinput(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="flex items-center justify-center mb-4">
          {loading && (
            <ClipLoader color="#4A90E2" loading={loading} size={50} />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/authentication/users/user-sign-up"
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        <p className="my-2 text-sm text-gray-600 ">
          Didn’t remember password?{" "}
          <Link
            to="/authentication/users/user-forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;
