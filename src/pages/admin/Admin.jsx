import React, { useState } from "react";

const Admin = () => {
  // Mock data for employee records
  const [data] = useState([
    { id: 1, name: "John Doe", role: "admin", date: "2023-01-01", email: "john.doe@example.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", role: "developer", date: "2023-02-01", email: "jane.smith@example.com", phone: "987-654-3210" },
    { id: 3, name: "Alice Johnson", role: "finance", date: "2023-03-01", email: "alice.johnson@example.com", phone: "555-666-7777" },
    { id: 4, name: "Bob Brown", role: "worker", date: "2023-04-01", email: "bob.brown@example.com", phone: "444-333-2222" },
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    role: "",
    date: "",
    employeeId: "",
  });

  // State for modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filtered data
  const filteredData = data.filter((item) => {
    return (
      (filters.role === "" || item.role === filters.role) &&
      (filters.date === "" || item.date === filters.date) &&
      (filters.employeeId === "" || String(item.id) === filters.employeeId)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <option value="developer">Developer</option>
              <option value="finance">Finance</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters({ ...filters, date: e.target.value })
              }
              className="w-full p-3 border rounded-md text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Employee ID
            </label>
            <input
              type="text"
              value={filters.employeeId}
              onChange={(e) =>
                setFilters({ ...filters, employeeId: e.target.value })
              }
              placeholder="Enter Employee ID"
              className="w-full p-3 border rounded-md text-gray-700"
            />
          </div>
        </div>

        {/* Data Table */}
        <div>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3 text-left">Employee ID</th>
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Role</th>
                <th className="border border-gray-300 p-3 text-left">Date</th>
                <th className="border border-gray-300 p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 p-3">{item.id}</td>
                    <td className="border border-gray-300 p-3">{item.name}</td>
                    <td className="border border-gray-300 p-3">{item.role}</td>
                    <td className="border border-gray-300 p-3">{item.date}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => setSelectedEmployee(item)}
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
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Employee Details
            </h2>
            <p><strong>ID:</strong> {selectedEmployee.id}</p>
            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>Role:</strong> {selectedEmployee.role}</p>
            <p><strong>Date:</strong> {selectedEmployee.date}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
            <div className="mt-4">
              <button
                onClick={() => setSelectedEmployee(null)}
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
