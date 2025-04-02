import React, { useState } from "react";

const ContactUsPopUpBox = ({ isOpen, contact, onClose, onUpdateReply }) => {
  const [selectedMethod, setSelectedMethod] = useState("email");
  const [message, setMessage] = useState(contact.message || "");

  const handleUpdate = () => {
    // Update the contact message in the database
    const updatedContact = {
      ...contact,
      responseMethod: selectedMethod,
      responseMessage: message,
    };

    // Call the onUpdateReply function passed from the parent
    onUpdateReply(updatedContact);
    onClose(); // Close modal after updating
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Respond to Contact</h2>
        <p className="mb-2"><strong>Name:</strong> {contact.name}</p>
        <p className="mb-2"><strong>Message:</strong> {contact.message}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Choose Response Method</label>
          <div>
            <input
              type="radio"
              id="phone"
              name="response-method"
              value="phone"
              checked={selectedMethod === "phone"}
              onChange={() => setSelectedMethod("phone")}
            />
            <label htmlFor="phone" className="ml-2">Phone</label>
          </div>
          <div>
            <input
              type="radio"
              id="email"
              name="response-method"
              value="email"
              checked={selectedMethod === "email"}
              onChange={() => setSelectedMethod("email")}
            />
            <label htmlFor="email" className="ml-2">Email</label>
          </div>
          <div>
            <input
              type="radio"
              id="both"
              name="response-method"
              value="both"
              checked={selectedMethod === "both"}
              onChange={() => setSelectedMethod("both")}
            />
            <label htmlFor="both" className="ml-2">Phone and Email</label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPopUpBox;
