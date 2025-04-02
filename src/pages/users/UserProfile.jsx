import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from "react-spinners";
const serverURL = process.env.REACT_APP_SERVER_URL;

const UserProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/auth/info`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const fetchedData = response?.data?.user || {};
                setUser(fetchedData);
            } catch (e) {
                setError(e.response?.data?.message || "Login failed!");
            }
        };

        setError("");
        setLoading(true);
        fetchData();
        setLoading(false);
    }, []);

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                {loading ? (
                    <div className="flex justify-center py-6">
                        <ClipLoader color="#4A90E2" loading={loading} size={50} />
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center font-semibold">{error}</p>
                ) : (
                    <div className="text-gray-700">
                        <img src={user?.dp ? user.dp : "../../../../assets/default-user.png"} alt="user badge" className='h-32 w-32 mx-auto rounded-xl object-cover' />
                        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4">User Profile</h2>
                        <div className="space-y-4">
                            <p className="border-b pb-2"><strong className="text-gray-800">First Name:</strong> {user?.firstName}</p>
                            <p className="border-b pb-2"><strong className="text-gray-800">Last Name:</strong> {user?.lastName || "N/A"}</p>
                            <p className="border-b pb-2"><strong className="text-gray-800">Email:</strong> {user?.email}</p>
                            <p className="border-b pb-2"><strong className="text-gray-800">Mobile:</strong> {user?.countryCode || "N/A"}-{user?.mobile}</p>
                            <p className="border-b pb-2"><strong className="text-gray-800">Gender:</strong> {user?.gender}</p>
                            <p className="border-b pb-2"><strong className="text-gray-800">Date of Birth:</strong> {user.dob?.date} {new Date(0, user.dob?.month - 1).toLocaleString('default', { month: 'short' })}, {user.dob?.year}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
