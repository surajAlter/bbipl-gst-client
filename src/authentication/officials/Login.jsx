import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useUser } from "../../context/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Login() {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empId: "",
    password: "",
    role: '',
    // dept: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // navigate("/pages/civil-attendance-form");
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    let { empId, ...dataToSend } = formData;

    if (empId) {
      // Check if the input looks like a mobile number or empId
      if (empId.startsWith('BB-FIN-')) {
        dataToSend["officialId"] = empId;
      } else if (empId.length === 10 && /^[0-9]+$/.test(empId)) {
        dataToSend["mobile"] = empId;
      } else if (empId.includes("@")) {
        dataToSend["email"] = empId;
      } else {
        setError("Invalid input!");
        setLoading(false);
        return;
      }

      // console.log(dataToSend);

      try {
        const url = `${SERVER_URL}/api/auth/login/official`;
        const response = await axios.post(url, dataToSend);

        // if (!response.ok) {
        //   throw new Error("Invalid credentials");
        // }

        const data = response.data;

        // Redirect or perform additional actions upon successful login
        // if (role === "admin" && data.user.role === ADMIN_CODE) {
        // console.log(data.user);

        if (data.official.role) {
          // Save token and role to local storage
          localStorage.setItem("token", data.token);
          loginUser(data.official); // Save official data in context
          setSuccess("Login successful!");

          const role = data.official.role;

          if (role === 'admin') {
            navigate("/pages/admin-dashboard");
          } else if (role === "backendSupport") {
            navigate("/pages/backend-support-dashboard");
          } else {
            throw new Error("This role is not supported yet!");
          }
        } else {
          // alert("Unauthorized access!");
          throw new Error("Unauthorized access!");
        }

        // console.log(data?.user);
        // alert("Login successful!");
      } catch (e) {
        // alert(e.response?.data?.message || "Login failed!");
        setError(e.response?.data?.message || e.message || "Login failed!");
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-screen">
      <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <div className="mb-6">
            <label
              htmlFor="empId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Official ID / Mobile No / Email
            </label>
            <input
              id="empId"
              name="empId" // We only use this field for either empId or empMobile
              value={formData.empId}
              onChange={handleChange}
              placeholder="Enter input"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between password and text type
                id="password"
                name="password"
                value={formData["password"]}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute top-2 right-3 text-gray-600"
                onClick={() => setShowPassword((prevState) => !prevState)} // Toggle password visibility
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* <div className="mb-6">
            <label
              htmlFor="dept"
              className=" block text-sm font-medium text-gray-700 mb-2"
            >
              Department
            </label>
            <select
              id="dept"
              name="dept"
              value={formData["dept"]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Department</option>
              <option value="finance">Finance</option>
            </select>
          </div> */}


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
              value={formData["role"]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="backendSupport">Backend Support</option>
            </select>
          </div>

          <div className="flex items-center justify-center mb-4">
            {loading && (
              <ClipLoader color="#4A90E2" loading={loading} size={50} />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          >
            Login
          </button>
        </form>
        {/* <p className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/authentication/sign-up"
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>*/}
        <p className="my-2 text-sm text-gray-600 ">
          Didn’t remember password?{" "}
          <Link
            to="/authentication/officials/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
