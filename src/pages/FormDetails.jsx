import React, { useEffect, useState } from "react";
import axios from "axios";
import GstForm from "./GstForm";

const serverURL = process.env.REACT_APP_SERVER_URL;

export default function FormDetails() {
    const [formDetails, setFormDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        const fetchFormDetails = async (page = 1) => {
            try {
                const response = await axios.get(`${serverURL}/api/gst/`, {
                    params: { page, limit },
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                console.log("Date fetched: ");
                console.log(response.data.data);
                setFormDetails(response.data.data);
                setTotalPages(Math.ceil(response.data.totalDocuments / limit));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching form details:", error);
                setLoading(false);
            }
        };
        fetchFormDetails(currentPage);
    }, [currentPage, limit]);

    const handleMoreDetails = (customer) => {
        setSelectedCustomer(customer);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 mt-8">Loading form details...</p>;
    }

    return (
        <div className="bg-gray-100 py-6">
            <div className="mx-auto">
                <h2 className="max-md:text-center text-3xl font-bold text-gray-800 mb-6">
                    GST Application Details
                </h2>
                {selectedCustomer ? (
                    <GstForm
                        formData={selectedCustomer}
                        onBack={() => setSelectedCustomer(null)}
                    />
                ) : (
                    <>
                        {formDetails.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y bg-zinc-200">
                                        <thead className="bg-slate-300">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trade Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Of Commencement</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residential Address</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {formDetails.map((form, index) => (
                                                <tr key={index} className={`${index % 2 === 0 ? "bg-zinc-200" : ""} hover:bg-gray-300 transition-colors`}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{form.tradeName}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(form.dateOfCommencement).toDateString()}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{form.personName.firstName + " " + form.personName.lastName}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`${form.residentialAddress.city}, ${form.residentialAddress.state}, ${form.residentialAddress.country}`}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{form.reason}</td>
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
