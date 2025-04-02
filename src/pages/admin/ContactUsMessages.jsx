import axios from "axios";
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

// Modal component for sending replies
const ContactUsMessageModal = ({ isOpen, contact, onClose, onSendReply }) => {
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("email"); // Default method is email
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (message.trim() === "") {
      alert("Message cannot be empty.");
      return;
    }
    setIsLoading(true)
    await onSendReply(method, contact, message);
    setIsLoading(false)
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Send a Reply to {contact.name}
        </h2>
        <div className="flex items-center justify-center mb-4">
          {isLoading && (
            <ClipLoader color="#4A90E2" loading={isLoading} size={50} />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Response Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="email">Email</option>
            <option value="mobile">Mobile</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Type your reply here"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Go Back
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-green-600 text-white py-2 px-4 rounded ${contact.status === "Complete"
              ? "cursor-not-allowed opacity-50"
              : ""
              }`}
            disabled={contact.status === "Complete"} // Disable if status is "Complete"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ContactUsMessages component
const ContactUsMessages = () => {
  const [fetchMe, setFetchMe] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch contacts from the server
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/contact-us`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch contacts");
        }

        console.log(response);
        setContacts(response.data?.data); // Assuming server returns an array of contacts
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [fetchMe]);

  if (loading) {
    return <div className="text-center">Loading contacts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleSendReply = async (method, contact, message) => {
    try {
      // setIsLoading(true)
      const responseData = {
        id: contact._id, // The contact's ID
        responseMethod: method, // The selected response method (phone, email, or both)
        responseMessage: message, // The message being sent as the reply
        status: "Complete", // Status is set to 'Complete' after the reply
      };

      console.log("Sending data as:\n", responseData);

      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/contact-us`, responseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.status !== 200) {
        throw new Error("Failed to send reply");
      } else {
        setFetchMe(fetchMe + 1)
        alert("Response sent.");
        // console.log("Email sent successfully:", response.data?.message);
      }

      // const data = await response.json();
      // console.log("Reply sent successfully:", data.message);
      // try {
      //   const result = await sendEmai(
      //     contact.email,
      //     "Test Email",
      //     message,
      //     "<h1>Test Email</h1>"
      //   );
      //   if (result) {
      //     setFetchMe(fetchMe + 1)
      //     alert("Response sent.");
      //     console.log("Email sent successfully:", result);
      //   }
      // } catch (error) {
      //   console.error("Error:", error);
      // }

      //   alert(`Reply sent via ${method}: ${message}`);
    } catch (err) {
      // console.error("Error sending reply:", err);
      alert(err.response?.data?.message || err.message || "Error sending reply.");
    }
  };

  //send email function
  // const sendEmail = async (to, subject, text, html) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_URL}/api/email/send-email`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           to,
  //           subject,
  //           text,
  //           html,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to send email");
  //     }

  //     const data = await response.json();
  //     console.log("Email sent successfully:", data.message);
  //     return data; // You can return the response if needed
  //   } catch (err) {
  //     console.error("Error sending email:", err);
  //     throw new Error("Error sending email");
  //   }
  // };

  return (
    (
      contacts.length === 0 ? <p className="text-center">No Contact Us messages yet</p> :
        <div className="container mx-auto p-4 ">
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Phone
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Message
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenModal(contact)}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {contact.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {contact.mobile}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {contact.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 whitespace-normal overflow-x-auto break-all">
                      {contact.message}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 text-center 
                    ${contact.status === "Pending"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                        }`}
                    >
                      {contact.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(contact.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for sending reply */}
          <ContactUsMessageModal
            isOpen={isModalOpen}
            contact={selectedContact}
            onClose={handleCloseModal}
            onSendReply={handleSendReply}
          />
        </div>
    )
  );
};

export default ContactUsMessages;
