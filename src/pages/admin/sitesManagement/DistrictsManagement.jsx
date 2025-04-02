import React, { useState, useEffect } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const DistrictsManagement = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState({}); // Tracks selected districts for each state

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/site-management/find-site-details`);
      const data = await response.json();
      setStates(data?.data[0]?.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const addDistrict = async () => {
    if (newDistrict.trim() && selectedStateId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/add-district-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stateId: selectedStateId, districtName: newDistrict.trim() }),
        });

        if (response.ok) {
          setNewDistrict("");
          setSelectedStateId("");
          fetchStates();
        } else {
          console.log("Failed to add district.");
        }
      } catch (error) {
        console.error("Error adding district:", error);
      }
    }
  };

  const updateDistrict = async (stateId, districtId, districtName) => {
    if (districtName.trim()) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/update-district-name?stateId=${stateId}&districtId=${districtId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            districtName: districtName.trim(),
          }),
        });

        if (response.ok) {
          fetchStates();
        } else {
          console.log("Failed to update district.");
        }
      } catch (error) {
        console.error("Error updating district:", error);
      }
    }
  };

  const deleteDistrict = async (stateId, districtId) => {
    const res = window.confirm("Are you sure? Note: All data of this district will be deleted permanently.");
    if (!res) return;

    try {
      const response = await fetch(`${serverUrl}/api/site-management/delete-district-name?stateId=${stateId}&districtId=${districtId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stateId, districtId }),
      });

      if (response.ok) {
        fetchStates();
      } else {
        console.log("Failed to delete district.");
      }
    } catch (error) {
      console.error("Error deleting district:", error);
    }
  };

  const handleDistrictSelection = (stateId, districtId, districtName) => {
    setSelectedDistricts((prev) => ({
      ...prev,
      [stateId]: { districtId, districtName },
    }));
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Districts Management</h2>

      <div className="mb-6">
        <label htmlFor="state-select" className="block text-lg font-medium text-gray-700">
          Select State
        </label>
        <select
          id="state-select"
          value={selectedStateId}
          onChange={(e) => setSelectedStateId(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a State</option>
          {states.map(
            (state) =>
              state.status === "Active" && (
                <option key={state._id} value={state._id}>
                  {state.stateName}
                </option>
              )
          )}
        </select>
      </div>

      {selectedStateId && (
        <div className="mb-6">
          <label htmlFor="district-name" className="block text-lg font-medium text-gray-700">
            District Name
          </label>
          <input
            id="district-name"
            type="text"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            placeholder="Enter district name"
            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addDistrict}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add District
          </button>
        </div>
      )}

      <div className="space-y-6">
        {states.map((state) => (
          <div key={state._id} className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{state.stateName}</h3>
            <div className="mb-6">
              <label htmlFor={`district-to-edit-${state._id}`} className="block text-lg font-medium text-gray-700">
                Select District to Edit/Delete
              </label>
              <select
                id={`district-to-edit-${state._id}`}
                value={selectedDistricts[state._id]?.districtId || ""}
                onChange={(e) => {
                  const selectedDistrict = state.districts.find(
                    (district) => district._id === e.target.value
                  );
                  handleDistrictSelection(
                    state._id,
                    selectedDistrict?._id || "",
                    selectedDistrict?.districtName || ""
                  );
                }}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a District</option>
                {state.districts?.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.districtName}
                  </option>
                ))}
              </select>
            </div>

            {selectedDistricts[state._id]?.districtId && (
              <>
                <div className="mb-4 flex items-center gap-4">
                  <input
                    type="text"
                    value={selectedDistricts[state._id]?.districtName || ""}
                    onChange={(e) =>
                      handleDistrictSelection(
                        state._id,
                        selectedDistricts[state._id]?.districtId,
                        e.target.value
                      )
                    }
                    className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() =>
                      updateDistrict(
                        state._id,
                        selectedDistricts[state._id]?.districtId,
                        selectedDistricts[state._id]?.districtName
                      )
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                  >
                    Update
                  </button>
                </div>
                <button
                  onClick={() =>
                    deleteDistrict(
                      state._id,
                      selectedDistricts[state._id]?.districtId
                    )
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                >
                  Delete District
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictsManagement;
