import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use `useNavigate` from react-router-dom v6

const Logout = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle navigation after logout
  const goToHome = () => {
    navigate('/'); // Redirect to the homepage or any other route if needed
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">You have been logged out</h2>
        <p className="text-gray-600 mb-6">Thank you for using our service!</p>
        <div className="flex justify-center">
          <button
            onClick={goToHome} // Button to go back to the homepage or any other page
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
