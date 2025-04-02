import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
const serverURL = process.env.REACT_APP_SERVER_URL;

const Admin = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    // dept: "",
    mobile: "",
    officialId: "",
  });
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/auth/all-officials`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const fetchedData = response?.data?.officials || [];
        setData(fetchedData); // Set the full data
        setFilteredData(fetchedData); // Initially, display all data
        // console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    setLoading(true);
    fetchData();
    setLoading(false);
  }, []); // Fetch data only once when the component mounts

  // Apply filters in memory with case-insensitive role filtering
  useEffect(() => {
    const applyFilters = () => {
      const filtered = data.filter((item) => {
        // console.log(item.mobile);
        const roleMatch =
          filters.role === "" ||
          item.role === filters.role;
        const mobileMatch =
          filters.mobile === "" || item.mobile.includes(filters.mobile);
        const idMatch =
          filters.officialId === "" || String(item.officialId).includes(filters.officialId);
        // const deptMatch =
        //   filters.dept === "" || item.dept.toLowerCase().includes(filters.dept.toLowerCase());

        return roleMatch && mobileMatch && idMatch
        // && deptMatch;
      });
      setFilteredData(filtered); // Update the filtered data based on the filters
    };

    applyFilters(); // Apply the filters whenever filters state changes
  }, [filters, data]); // Depend on both filters and data

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="container mx-auto bg-white p-2 rounded-lg shadow-md">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Department
            </label>
            <select
              value={filters.dept}
              onChange={(e) =>
                setFilters({ ...filters, dept: e.target.value })
              }
              className="w-full p-3 border rounded-md text-gray-700"
            >
              <option value="">All Departments</option>
              <option value="finance">Finance</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters({ ...filters, role: e.target.value })
              }
              className="w-full p-3 border rounded-md text-gray-700"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              {/* <option value="manager">Manager</option> */}
              <option value="backendSupport">Backend Support</option>
              {/* <option value="teamLeader">Team Leader</option>
              <option value="telecaller">Telecaller</option> */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Mobile
            </label>
            <input
              type="text"
              placeholder="mobile number"
              value={filters.mobile}
              onChange={(e) =>
                setFilters({ ...filters, mobile: e.target.value })
              }
              className="w-full p-3 border rounded-md text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Official ID
            </label>
            <input
              type="text"
              value={filters.officialId}
              onChange={(e) =>
                setFilters({ ...filters, officialId: e.target.value })
              }
              placeholder="Enter Official ID"
              className="w-full p-3 border rounded-md text-gray-700"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3 text-left">Official ID</th>
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Role</th>
                <th className="border border-gray-300 p-3 text-left">Mobile</th>
                <th className="border border-gray-300 p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (<div className="flex items-center justify-center mb-4">
                {loading && (
                  <ClipLoader color="#4A90E2" loading={loading} size={50} />
                )}
              </div>) : (filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.officialId} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 p-3">{item.officialId}</td>
                    <td className="border border-gray-300 p-3">{`${item.firstName} ${item.lastName}`}</td>
                    <td className="border border-gray-300 p-3">{item.role}</td>
                    {/* <td className="border border-gray-300 p-3">{item.dept}</td> */}
                    <td className="border border-gray-300 p-3">{item.mobile}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => setSelectedOfficial(item)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-5 text-gray-500 italic"
                  >
                    No records found.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Details Modal */}
      {selectedOfficial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Official Details
            </h2>
            <p><strong>ID:</strong> {selectedOfficial.officialId}</p>
            <p><strong>Name:</strong> {`${selectedOfficial.firstName} ${selectedOfficial.lastName}`}</p>
            <p><strong>Role:</strong> {selectedOfficial.role}</p>
            {/* <p><strong>Department:</strong> {selectedOfficial.dept}</p> */}
            <p><strong>Email:</strong> {selectedOfficial.email}</p>
            <p><strong>Phone:</strong> {selectedOfficial.countryCode}-{selectedOfficial.mobile}</p>
            <div className="mt-4">
              <button
                onClick={() => setSelectedOfficial(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
