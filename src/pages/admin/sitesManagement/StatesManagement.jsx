import React, { useState, useEffect } from 'react';

// Get the server URL from environment variables
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StatesManagement = () => {
    const [states, setStates] = useState([]); // Holds the list of states
    const [newState, setNewState] = useState(''); // State for new state input
    const [editIndex, setEditIndex] = useState(null); // Index of the state being edited
    const [editValue, setEditValue] = useState(''); // Value for the state being edited

    // Fetch states from the API when the component mounts
    useEffect(() => {
        fetchStates();
    }, []);

    // Fetch states function
    const fetchStates = async () => {
        try {
            const response = await fetch(`${serverUrl}/api/site-management/find-site-details`);
            const data = await response.json();
            setStates(data?.data[0]?.states);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    // Function to add a new state
    const addState = async () => {
        if (newState.trim()) {
            try {
                const response = await fetch(`${serverUrl}/api/site-management/add-state-name`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ state: newState.trim() }),
                });

                if (response.ok) {
                    setNewState('');
                    fetchStates(); // Refresh the list of states after adding
                }
            } catch (error) {
                console.error("Error adding state:", error);
            }
        }
    };

    // Function to update an existing state
    const updateState = async (stateId) => {
        const res=window.confirm("Are you sure?");
        if(!res){
            return ;
        }
        if (editValue.trim()) {
            try {
                const response = await fetch(`${serverUrl}/api/site-management/update-state-name?stateId=${stateId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ stateName: editValue?.trim() }), // Use editValue for the update
                });

                if (response.ok) {
                    setEditIndex(null); // Reset the editing state
                    setEditValue('');
                    fetchStates(); // Refresh the list of states after updating
                }
            } catch (error) {
                console.error("Error updating state:", error);
            }
        }
    };

    // Function to delete a state
    const deleteState = async (stateId) => {

        const res=window.confirm("Are you sure? All the data of this state will be deleted permanently.");
        if(!res){
            return ;
        }
        try {
            const response = await fetch(`${serverUrl}/api/site-management/delete-state-name?stateId=${stateId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchStates(); // Refresh the list of states after deleting
            }
        } catch (error) {
            console.error("Error deleting state:", error);
        }
    };

    const handleEditChange = (e) => {
        setEditValue(e.target.value);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="Enter state name"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={addState}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Add State
                </button>
            </div>

            <ul className="space-y-4">
                {states.map((state, index) => (
                    <li key={state.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                        {editIndex === index ? (
                            <input
                                type="text"
                                value={editValue}
                                onChange={handleEditChange}
                                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <span className="text-gray-700">{state.stateName}</span>
                        )}
                        <div className="flex space-x-4">
                            {editIndex === index ? (
                                <button
                                    onClick={() => updateState(state._id)}
                                    className="text-green-500 hover:text-green-700"
                                >
                                    Update
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditIndex(index);
                                        setEditValue(state.stateName); // Set current state name for editing
                                    }}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => deleteState(state._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatesManagement;
