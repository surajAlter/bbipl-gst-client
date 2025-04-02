import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    role: "",
    state: "",
    district: "",
    businessName: "",
    pan: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(false);
      return;
    }

    try {
      console.log(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/signup/user`,
        formData
      );
      setSuccess(response.data.message || "Sign up successful!");
      window.location.href = "/authentication/users/user-login";
    } catch (error) {
      setError(error.response?.data?.message || "Sign up failed!");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">User Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {/* Role Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="taxpayer">Taxpayer</option>
            <option value="taxDeductor">Tax Deductor</option>
            <option value="taxCollector">Tax Collector</option>
            <option value="gstPractitioner">GST Practitioner</option>
            <option value="nonResidentTaxablePerson">Non-Resident Taxable Person</option>
            <option value="unitedNationBody">United Nation Body</option>
            <option value="consulateOrEmbassyForeignCountry">Consulate or Embassy of Foreign Country</option>
            <option value="otherNotifiedPerson">Other Notified Person</option>
            <option value="nonResidentOnlineServicesProvider">Non-Resident Online Services Provider</option>
          </select>
        </div>

        {/* State Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">State/UT</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter State"
            required
          />
        </div>

        {/* District */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter District"
            required
          />
        </div>

        {/* Business Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">
            Legal Name of Business (as per PAN)
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Business Name"
            required
          />
        </div>

        {/* PAN */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">PAN</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter PAN (10 characters)"
            maxLength="10"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Mobile Number"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Password"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 capitalize">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Confirm Password"
            required
          />
        </div>

        <div className="flex items-center justify-center mb-4">
          {loading && <ClipLoader color="#4A90E2" loading={loading} size={50} />}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
        <p className="my-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/authentication/users/user-login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserSignUp;
