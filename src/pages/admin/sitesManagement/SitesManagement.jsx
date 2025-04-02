import React, { useState, useEffect } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const SitesManagement = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const [updatedSiteName, setUpdatedSiteName] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedStateId && selectedDistrictId && selectedBlockId) {
      const selectedState = states.find((state) => state._id === selectedStateId);
      if (selectedState) {
        const selectedDistrict = selectedState.districts.find(
          (district) => district._id === selectedDistrictId
        );
        if (selectedDistrict) {
          const selectedBlock = selectedDistrict.blocks.find(
            (block) => block._id === selectedBlockId
          );
          if (selectedBlock) {
            setSelectedSiteId(""); // Reset Site dropdown when block changes
          }
        }
      }
    }
  }, [selectedStateId, selectedDistrictId, selectedBlockId, states]);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/site-management/find-site-details`);
      const data = await response.json();
      setStates(data?.data[0]?.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleAddSite = async () => {
    if (newSiteName.trim() && selectedStateId && selectedDistrictId && selectedBlockId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/add-site-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockId: selectedBlockId,
            siteName: newSiteName.trim(),
          }),
        });

        if (response.ok) {
          setNewSiteName("");
          fetchStates();
          alert("Site added successfully!");
        } else {
          alert("Failed to add site. Please try again.");
        }
      } catch (error) {
        console.error("Error adding site:", error);
      }
    } else {
      alert("Please select a state, district, block, and enter a site name.");
    }
  };

  const handleUpdateSite = async () => {
    if (updatedSiteName.trim() && selectedStateId && selectedDistrictId && selectedBlockId && selectedSiteId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/update-site-name`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockId: selectedBlockId,
            siteId: selectedSiteId,
            siteName: updatedSiteName.trim(),
          }),
        });

        if (response.ok) {
          fetchStates();
          alert("Site updated successfully!");
        } else {
          alert("Failed to update site. Please try again.");
        }
      } catch (error) {
        console.error("Error updating site:", error);
      }
    } else {
      alert("Please select a state, district, block, and site to update.");
    }
  };

  const handleDeleteSite = async () => {
    if (selectedStateId && selectedDistrictId && selectedBlockId && selectedSiteId) {
      const res = window.confirm("Are you sure you want to delete this site?");
      if (!res) return;

      try {
        const response = await fetch(`${serverUrl}/api/site-management/delete-site-name`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            stateId: selectedStateId, 
            districtId: selectedDistrictId, 
            blockId: selectedBlockId,
            siteId: selectedSiteId 
          }),
        });

        if (response.ok) {
          fetchStates();
          alert("Site deleted successfully!");
        } else {
          alert("Failed to delete site. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting site:", error);
      }
    } else {
      alert("Please select a state, district, block, and site to delete.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sites Management</h2>

      {/* Add Site */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Site</h3>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">State</label>
          <select
            value={selectedStateId}
            onChange={(e) => {
              setSelectedStateId(e.target.value);
              setSelectedDistrictId("");
              setSelectedBlockId("");
              setSelectedSiteId(""); // Reset site selection
            }}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-lg font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="Enter new site name"
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <button
          onClick={handleAddSite}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
        >
          Add Site
        </button>
      </div>

      {/* Edit/Delete Site */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit or Delete Site</h3>
        {/* Similar dropdowns for selecting state, district, block */}
        {/* Add site dropdown */}
        {selectedBlockId && (
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Site</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {selectedSiteId && (
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Edit Site Name</label>
            <input
              type="text"
              value={updatedSiteName}
              onChange={(e) => setUpdatedSiteName(e.target.value)}
              placeholder="Enter new site name"
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="space-x-4">
          <button
            onClick={handleUpdateSite}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
          >
            Update Site
          </button>
          <button
            onClick={handleDeleteSite}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Delete Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitesManagement;
