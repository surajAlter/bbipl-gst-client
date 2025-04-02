import React, { useState, useEffect } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const WorkTypeManagement = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [workTypes, setWorkTypes] = useState([]);
  const [newWorkTypeName, setNewWorkTypeName] = useState("");
  const [updatedWorkTypeName, setUpdatedWorkTypeName] = useState("");
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState("");

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Update work types when the site is selected
  useEffect(() => {
    if (selectedSiteId) {
      const selectedSite = states
        .find((state) => state._id === selectedStateId)
        ?.districts.find((district) => district._id === selectedDistrictId)
        ?.blocks.find((block) => block._id === selectedBlockId)
        ?.sites.find((site) => site._id === selectedSiteId);

      setWorkTypes(selectedSite?.workType || []);
    }
  }, [selectedSiteId, states]);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/site-management/find-site-details`);
      const data = await response.json();
      setStates(data?.data[0]?.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleAddWorkType = async () => {
    if (newWorkTypeName.trim() && selectedSiteId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/add-work-type-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockId: selectedBlockId,
            siteId: selectedSiteId,
            workTypeName: newWorkTypeName.trim(),
          }),
        });

        if (response.ok) {
          setNewWorkTypeName("");
          fetchStates();
          alert("Work Type added successfully!");
        } else {
          alert("Failed to add Work Type. Please try again.");
        }
      } catch (error) {
        console.error("Error adding Work Type:", error);
      }
    } else {
      alert("Please select a site and enter a Work Type name.");
    }
  };

  const handleUpdateWorkType = async () => {
    if (updatedWorkTypeName.trim() && selectedWorkTypeId && selectedSiteId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/update-work-type-name`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockId: selectedBlockId,
            siteId: selectedSiteId,
            workTypeId: selectedWorkTypeId,
            workTypeName: updatedWorkTypeName.trim(),
          }),
        });

        if (response.ok) {
          setUpdatedWorkTypeName("");
          fetchStates();
          alert("Work Type updated successfully!");
        } else {
          alert("Failed to update Work Type. Please try again.");
        }
      } catch (error) {
        console.error("Error updating Work Type:", error);
      }
    } else {
      alert("Please select a Work Type and enter a new name.");
    }
  };

  const handleDeleteWorkType = async () => {
    if (selectedWorkTypeId && selectedSiteId) {
      const confirmDelete = window.confirm("Are you sure you want to delete this Work Type?");
      if (!confirmDelete) return;

      try {
        const response = await fetch(`${serverUrl}/api/site-management/delete-work-type-name`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockId: selectedBlockId,
            siteId: selectedSiteId,
            workTypeId: selectedWorkTypeId,
          }),
        });

        if (response.ok) {
          fetchStates();
          alert("Work Type deleted successfully!");
        } else {
          alert("Failed to delete Work Type. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting Work Type:", error);
      }
    } else {
      alert("Please select a Work Type to delete.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Work Type Management</h2>

      {/* Dropdowns for State, District, Block, Site */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700">State</label>
        <select
          value={selectedStateId}
          onChange={(e) => {
            setSelectedStateId(e.target.value);
            setSelectedDistrictId("");
            setSelectedBlockId("");
            setSelectedSiteId("");
          }}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="">Select a State</option>
          {states.map((state) => (
            <option key={state._id} value={state._id}>
              {state.stateName}
            </option>
          ))}
        </select>
      </div>

      {selectedStateId && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">District</label>
          <select
            value={selectedDistrictId}
            onChange={(e) => {
              setSelectedDistrictId(e.target.value);
              setSelectedBlockId("");
              setSelectedSiteId("");
            }}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select a District</option>
            {states
              .find((state) => state._id === selectedStateId)
              ?.districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.districtName}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedDistrictId && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Block</label>
          <select
            value={selectedBlockId}
            onChange={(e) => {
              setSelectedBlockId(e.target.value);
              setSelectedSiteId("");
            }}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select a Block</option>
            {states
              .find((state) => state._id === selectedStateId)
              ?.districts.find((district) => district._id === selectedDistrictId)
              ?.blocks.map((block) => (
                <option key={block._id} value={block._id}>
                  {block.blockName}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedBlockId && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Site</label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select a Site</option>
            {states
              .find((state) => state._id === selectedStateId)
              ?.districts.find((district) => district._id === selectedDistrictId)
              ?.blocks.find((block) => block._id === selectedBlockId)
              ?.sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.siteName}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Work Type Management */}
      {selectedSiteId && (
        <div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Add Work Type</label>
            <input
              type="text"
              value={newWorkTypeName}
              onChange={(e) => setNewWorkTypeName(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter Work Type name"
            />
            <button
              onClick={handleAddWorkType}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Work Type
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Work Types</label>
            <select
              value={selectedWorkTypeId}
              onChange={(e) => setSelectedWorkTypeId(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select a Work Type</option>
              {workTypes.map((workType) => (
                <option key={workType._id} value={workType._id}>
                  {workType.workTypeName}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={updatedWorkTypeName}
              onChange={(e) => setUpdatedWorkTypeName(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter updated Work Type name"
            />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleUpdateWorkType}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={handleDeleteWorkType}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTypeManagement;
