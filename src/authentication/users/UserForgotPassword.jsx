import React, { useState } from "react";
import axios from "axios";
import { data, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const UserForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const dataToSend = { email };
      console.log(dataToSend);
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/forgot-password/user`, dataToSend);

      // alert(response.data.message || "Password reset link sent!");
      setSuccess(response.data?.message || "Password reset link sent!");

      window.location.href = "/authentication/users/user-login";
    } catch (e) {
      // console.log(e);
      setError(e.response?.data?.message || "Failed to reset password!");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleForgotPassword}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter email"
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
          Submit
        </button>
        <p className="my-2 text-sm text-gray-600 ">
          I know my password?{" "}
          <Link
            to="/authentication/users/user-login"
            className="text-blue-500 hover:underline"
          >
            Go Back
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserForgotPassword;
