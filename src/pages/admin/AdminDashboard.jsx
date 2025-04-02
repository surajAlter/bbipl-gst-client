import React, { useState } from "react";
import Details from "./Details"; // Import the Details component
import Upload from "./UploadFiles"; // Import the Upload component
import { useNavigate, useLocation } from "react-router-dom";
import ContactUsMessages from "./ContactUsMessages";
import FormRequirementDetails from "./FormRequirementDetails";
import SiteManagement from "./SitesUpdateManagement";
import ShowUserAttendance from "./ShowUserAttendance";
import { useUser } from "../../context/UserContext";
import OfficialProfile from "../officials/OfficialProfile";

const AdminDashboard = () => {
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState("profile"); // State to track active component
  const { user, logoutUser } = useUser();

  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <OfficialProfile />;
      case "details":
        return <Details />;
      case "upload":
        return <Upload />;
      case "contactUsMessages":
        return <ContactUsMessages />;
      case "form-requirements":
        return <FormRequirementDetails />;
      case "sites-management":
        return <SiteManagement />;
      case "showUserAttendance":
        return <ShowUserAttendance />;
      default:
        return (
          <p className="text-gray-600">Please select an option from above.</p>
        );
    }
  };

  const handleLogout = () => {
    const allowMe = window.confirm("Are you sure to logout?");
    if (allowMe) {
      logoutUser();
      navigate("/");
    }
  };

  const getButtonClass = (component) => {
    return activeComponent === component
      ? "w-100 px-4 py-2 bg-gray-300 text-black rounded hover:bg-white hover:border-1 transition duration-100"
      : "w-100 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-100";
  };

  return (
    <div className="p-1 bg-gray-100 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-14">
          Hi! {user?.firstName} {user?.lastName}
        </h1>
      </div>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-2">
        <button
          onClick={() => setActiveComponent("profile")}
          className={getButtonClass("profile")}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveComponent("details")}
          className={getButtonClass("details")}
        >
          Show Officials
        </button>

        <button
          onClick={() => setActiveComponent("upload")}
          className={getButtonClass("upload")}
        >
          Add Official
        </button>
        {/* <button
          onClick={() => setActiveComponent("sites-management")}
          className={getButtonClass("sites-management")}
        >
          Add Site
        </button> */}
        <button
          onClick={() => setActiveComponent("form-requirements")}
          className={getButtonClass("form-requirements")}
        >
          Loan Application Forms
        </button>
        <button
          onClick={() => setActiveComponent("contactUsMessages")}
          className={getButtonClass("contactUsMessages")}
        >
          Contact Us
        </button>
        {/* <button
          onClick={() => setActiveComponent("showUserAttendance")}
          className={getButtonClass("showUserAttendance")}
        >
          Attendance
        </button> */}
        <button
          onClick={() => handleLogout()}
          className="w-100 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
      <div className="bg-slate-500 h-1 my-2"></div>
      <div className="bg-gray-50 rounded shadow">{renderComponent()}</div>
    </div>
  );
};

export default AdminDashboard;
