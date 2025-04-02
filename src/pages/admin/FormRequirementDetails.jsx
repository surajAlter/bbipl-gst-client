import React, { useEffect, useState } from "react";
import axios from "axios";
import LoanCustomerDetails from "./LoanCustomerDetails"; // Import the new component

const serverURL = process.env.REACT_APP_SERVER_URL;

export default function FormRequirementDetails() {
  const [formDetails, setFormDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to track selected customer

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [limit] = useState(10); // Number of items per page

  // Fetch data on component mount or when the page changes
  useEffect(() => {
    // Fetch loan application data from the backend with pagination
    const fetchFormDetails = async (page = 1) => {
      const url = serverURL + "/api/loan-forms";
      try {
        const response = await axios.get(url, {
          params: {
            page,
            limit,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your token here
          },
        });

        setFormDetails(response.data.data); // Set the fetched data to state
        setTotalPages(Math.ceil(response.data.totalDocuments / limit)); // Calculate total pages
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching form details:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchFormDetails(currentPage);
  }, [limit, currentPage]);

  // Handle "More Details" button click
  const handleMoreDetails = (customer) => {
    setSelectedCustomer(customer); // Set the selected customer
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Show loading message while data is being fetched
  if (loading) {
    return <p className="text-center text-gray-500 mt-8">Loading form details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="mx-auto">
        <h2 className="max-md:text-center text-3xl font-bold text-gray-800 mb-6">Loan Application Details</h2>
        {selectedCustomer ? (
          // Display LoanCustomerDetails component if a customer is selected
          <LoanCustomerDetails customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />
        ) : (
          // Display the table if no customer is selected
          <>
            {formDetails.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Wrap the table in a scrollable container */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y bg-zinc-200">
                    <thead className="bg-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Years Employed
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formDetails.map((form, index) => (
                        <tr key={index} className={`${(index % 2 === 0) ? 'bg-zinc-200' : ''} hover:bg-gray-300 transition-colors`}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {form.customerName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {form.mobile}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {form.currentAddress.city + ", " + form.currentAddress.state + ", " + form.currentAddress.country}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {form.yearsTotalEmployed}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{form.loanAmount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                              onClick={() => handleMoreDetails(form)}
                            >
                              More Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4 p-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 mx-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No form details found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}