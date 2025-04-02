import React, { useState } from "react";
import axios from "axios";
import { data, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const OfficialForgotPassword = () => {
    const [input, setInput] = useState("");
    const [dept, setDept] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!input) {
            setError("Please enter input!");
            setLoading(false);
            return;
        } else if (!dept || !role) {
            setError("Please select all the options!");
            setLoading(false);
            return;
        }

        try {
            let dataToSend = {};
            if (input.includes("@")) {
                dataToSend["email"] = input;
            } else {
                dataToSend["officialId"] = input;
            }

            dataToSend["dept"] = dept;
            dataToSend["role"] = role;
            // console.log(dataToSend);

            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/forgot-password/official`, dataToSend);

            // alert(response.data.message || "Password reset link sent!");
            setSuccess(response.data?.message || "Password reset link sent!");

            window.location.href = "/authentication/officials/officials-login";
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
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        placeholder="Enter Email"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="dept"
                        className=" block text-sm font-medium text-gray-700 mb-2"
                    >
                        Department
                    </label>
                    <select
                        id="dept"
                        name="dept"
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    >
                        <option value="">Select Department</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>


                <div className="mb-6">
                    <label
                        htmlFor="role"
                        className=" block text-sm font-medium text-gray-700 mb-2"
                    >
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="backendSupport">Backend Support</option>
                        <option value="teamLeader">Team Leader</option>
                        <option value="telecaller">Telecaller</option>
                        {/* <option value="developer">Developer</option> */}
                        {/* <option value="construction">Construction</option> */}
                        {/* <option value="finance">Finance</option> */}
                    </select>
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
                        to="/authentication/officials/officials-login"
                        className="text-blue-500 hover:underline"
                    >
                        Go Back
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default OfficialForgotPassword;
