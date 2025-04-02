import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import OfficialProfile from "./OfficialProfile";
import FormDetails from "../FormDetails";

const OfficialDashboard = () => {
    const location = useLocation();
    const [activeComponent, setActiveComponent] = useState("profile");
    const { user, logoutUser } = useUser();
    const navigate = useNavigate();

    const renderComponent = () => {
        switch (activeComponent) {
            case "profile":
                return <OfficialProfile />;
            case "gst-forms":
                return <FormDetails />;
            default:
                return <p className="text-gray-600">Please select an option from above.</p>;
        }
    };

    const handleLogout = () => {
        const allowMe = window.confirm("Are you sure to logout?");
        if (allowMe) {
            logoutUser();
            navigate("/");
        }
    };

    // useEffect(() => console.log(user), [user]);

    const getButtonClass = (component) => {
        return activeComponent === component
            ? "w-100 px-4 py-2 bg-gray-300 text-black rounded hover:bg-white transition duration-100"
            : "w-100 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-100";
    };

    return (
        <div className="p-1 bg-gray-100">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-14">
                    Hi! {user?.firstName} {user?.lastName}
                </h1>
            </div>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 p-2">
                <button
                    onClick={() => setActiveComponent("profile")}
                    className={getButtonClass("profile")}
                >
                    Official Profile
                </button>
                <button
                    onClick={() => setActiveComponent("gst-forms")}
                    className={getButtonClass("gst-forms")}
                >
                    GST Forms
                </button>
                <button
                    onClick={() => handleLogout()}
                    className="w-100 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                    Logout
                </button>
            </div>
            <div className="bg-slate-500 h-1 my-2"></div>
            <div className="bg-gray-50 rounded shadow p-4">{renderComponent()}</div>
        </div>
    );
};

export default OfficialDashboard;
