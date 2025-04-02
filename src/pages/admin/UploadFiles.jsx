import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const serverURL = process.env.REACT_APP_SERVER_URL;

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [official, setOfficial] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        countryCode: '',
        gender: '',
        dob: '',
        dept: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleOfficialChange = (e) => {
        const { name, value } = e.target;
        setOfficial({ ...official, [name]: value });
    };

    const handleSubmit = async () => {
        // if (!selectedFile) {
        //     setError('Please select a file to upload.');
        //     return;
        // }

        // const formData = new FormData();
        // formData.append('file', selectedFile);
        // formData.append('officialDetails', JSON.stringify(official));

        // console.log("Data to be sent:");
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // try {
        //     setError("");
        //     setSuccess("");
        //     setLoading(true);

        //     const response = await axios.post(`${serverURL}/api/auth/signup/official`, formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });

        //     setSuccess('Submit successful!');
        //     console.log('Server Response:', response.data);
        // } catch (error) {
        //     setError('Upload failed.');
        //     console.error('Error uploading file:', error);
        // }
        try {
            setError("");
            setSuccess("");
            setLoading(true);

            const response = await axios.post(`${serverURL}/api/auth/signup/official`, official, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setSuccess(response.data?.message || 'Submit successful!');

            window.location.href = "/authentication/officials/officials-login";
            // console.log('Server Response:', response.data);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to submit data!");
            // console.error('Error uploading file:', error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* <h1 className="text-2xl font-bold mb-4">Upload File</h1>
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 block"
            /> */}
            {/* <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
                Upload
            </button> */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            <h2 className="text-2xl font-bold mt-8 mb-4">Official Details</h2>
            <div>
                <form onSubmit={handleSubmit} className='md:grid md:grid-cols-4 space-y-5 space-x-4 p-5 rounded-lg text-zinc-600 text-lg'>
                    <label className='col-span-2 mt-5 ml-4'>
                        Official Name
                        <div className='flex space-x-5 mt-1 w-full'>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={official.firstName}
                                onChange={handleOfficialChange}
                                required
                                className='w-full'
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={official.lastName}
                                onChange={handleOfficialChange}
                                required
                                className='w-full'
                            />
                        </div>
                    </label>
                    <label>
                        Country Code
                        <input
                            type="text"
                            name="countryCode"
                            value={official.countryCode}
                            onChange={handleOfficialChange}
                            required
                            className="block mb-2 mt-1 w-full"
                        />
                    </label>
                    <label>
                        Mobile
                        <input
                            type="tel"
                            name="mobile"
                            value={official.mobile}
                            onChange={handleOfficialChange}
                            required
                            className="block mb-2 mt-1 w-full"
                            placeholder="Enter Mobile Number"
                        // autoComplete="off"
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={official.email}
                            onChange={handleOfficialChange}
                            required
                            className="block mb-2 mt-1 w-full"
                            placeholder="Enter Email"
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={official.password}
                            onChange={handleOfficialChange}
                            required
                            className="block mb-2 mt-1 w-full"
                        />
                    </label>
                    <label>
                        Gender
                        <select
                            name="gender"
                            value={official.gender}
                            onChange={handleOfficialChange}
                            required
                            className="block mb-2 mt-1 w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label>
                        Date of Birth
                        <input
                            type="date"
                            name="dob"
                            value={official.dob}
                            onChange={handleOfficialChange}
                            required
                            className="block mb-2 mt-1 w-full"
                        />
                    </label>
                    <label>
                        Department
                        <select
                            id="dept"
                            name="dept"
                            value={official.dept}
                            onChange={handleOfficialChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="finance">Finance</option>
                        </select>
                    </label>
                    <label>
                        Role
                        <select
                            id="role"
                            name="role"
                            value={official.role}
                            onChange={handleOfficialChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="backendSupport">Backend Support</option>
                            <option value="teamLeader">Team Leader</option>
                            <option value="telecaller">Telecaller</option>
                        </select>
                    </label>

                    {/* <div className='w-full text-center'> */}
                    <div className='col-span-full text-center'>
                        <div className="flex items-center justify-center mb-4">
                            {loading && (
                                <ClipLoader color="#4A90E2" loading={loading} size={50} />
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>
            {/* </div> */}
        </div>
    );
};

export default FileUpload;
