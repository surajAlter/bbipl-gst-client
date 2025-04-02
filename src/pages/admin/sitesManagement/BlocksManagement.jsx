import React, { useState, useEffect } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const BlocksManagement = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [newBlockName, setNewBlockName] = useState("");
  const [updatedBlockName, setUpdatedBlockName] = useState("");

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
            setUpdatedBlockName(selectedBlock.blockName); // Set the block name for editing
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

  const handleAddBlock = async () => {
    if (newBlockName.trim() && selectedStateId && selectedDistrictId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/add-block-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockName: newBlockName.trim(),
          }),
        });

        if (response.ok) {
          setNewBlockName("");
          fetchStates();
          alert("Block added successfully!");
        } else {
          alert("Failed to add block. Please try again.");
        }
      } catch (error) {
        console.error("Error adding block:", error);
      }
    } else {
      alert("Please select a state, district, and enter a block name.");
    }
  };

  const handleUpdateBlock = async () => {
    if (updatedBlockName.trim() && selectedStateId && selectedDistrictId && selectedBlockId) {
      try {
        const response = await fetch(`${serverUrl}/api/site-management/update-block-name`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            blockId: selectedBlockId,
            blockName: updatedBlockName.trim(),
          }),
        });

        if (response.ok) {
          fetchStates();
          alert("Block updated successfully!");
        } else {
          alert("Failed to update block. Please try again.");
        }
      } catch (error) {
        console.error("Error updating block:", error);
      }
    } else {
      alert("Please select a state, district, block, and enter a new block name.");
    }
  };

  const handleDeleteBlock = async () => {
    if (selectedStateId && selectedDistrictId && selectedBlockId) {
      const res = window.confirm("Are you sure you want to delete this block?");
      if (!res) return;

      try {
        const response = await fetch(`${serverUrl}/api/site-management/delete-block-name`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stateId: selectedStateId, districtId: selectedDistrictId, blockId: selectedBlockId }),
        });

        if (response.ok) {
          fetchStates();
          alert("Block deleted successfully!");
        } else {
          alert("Failed to delete block. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting block:", error);
      }
    } else {
      alert("Please select a state, district, and block to delete.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blocks Management</h2>

      {/* Add Block */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Block</h3>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">State</label>
          <select
            value={selectedStateId}
            onChange={(e) => {
              setSelectedStateId(e.target.value);
              setSelectedDistrictId("");
              setSelectedBlockId("");
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
            <label className="block text-lg font-medium text-gray-700">Block Name</label>
            <input
              type="text"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              placeholder="Enter new block name"
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <button
          onClick={handleAddBlock}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
        >
          Add Block
        </button>
      </div>

      {/* Edit/Delete Block */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit or Delete Block</h3>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">State</label>
          <select
            value={selectedStateId}
            onChange={(e) => {
              setSelectedStateId(e.target.value);
              setSelectedDistrictId("");
              setSelectedBlockId("");
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
              onChange={(e) => {
                setSelectedDistrictId(e.target.value);
                setSelectedBlockId("");
              }}
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
            <label className="block text-lg font-medium text-gray-700">Edit Block Name</label>
            <input
              type="text"
              value={updatedBlockName}
              onChange={(e) => setUpdatedBlockName(e.target.value)}
              placeholder="Enter new block name"
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="space-x-4">
          <button
            onClick={handleUpdateBlock}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
          >
            Update Block
          </button>
          <button
            onClick={handleDeleteBlock}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Delete Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlocksManagement;
