import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormsDropdownOpen, setIsFormsDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFormsDropdown = () => setIsFormsDropdownOpen(!isFormsDropdownOpen);
  const toggleLoginDropdown = () => setIsLoginDropdownOpen(!isLoginDropdownOpen);
  const handleMenuItemClick = () => {
    setIsFormsDropdownOpen(false);
    setIsLoginDropdownOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="bg-gray-50 text-black p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="text-2xl font-bold">
          <img src="/assets/logo/new-logo.png" alt="Logo" className="object-cover object-center w-20 h-12" />
        </Link>

        {/* Navigation Links */}
        <ul className={`pl-4 md:flex space-x-6 font-medium ${isMenuOpen ? "flex" : "hidden"} absolute md:static top-full left-0 w-full md:w-auto bg-gray-50 md:bg-transparent py-4 md:py-0`}>
          <li>
            <Link onClick={handleMenuItemClick} to="/" className="hover:text-blue-600 transition">Home</Link>
          </li>

          {/* {user && (<li className="relative">
            <button onClick={toggleFormsDropdown} className="hover:text-blue-600 transition">Forms</button>
            {isFormsDropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-gray-50 shadow-lg">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link onClick={handleMenuItemClick} to="/loan-application-form">Loan Application</Link>
                </li>
              </ul>
            )}
          </li>)} */}

          {/* <li>
            <Link onClick={handleMenuItemClick} to="/pages/services" className="hover:text-blue-600 transition">Services</Link>
          </li> */}

          {user && (
            <li>
              <Link to="/pages/gst-registration" className="hover:text-blue-600 transition">GST Registration</Link>
            </li>
          )}

          <li className="relative">
            {!user ? ( // ✅ Check if user is logged in
              <button onClick={toggleLoginDropdown} name="login" className="hover:text-blue-600 transition">
                Login
              </button>
            ) : (
              <button onClick={handleLogout} className="hover:text-red-600 transition">
                Logout
              </button>
            )}
            {isLoginDropdownOpen && !user && ( // ✅ Show login dropdown only if not logged in
              <ul className="absolute right-0 mt-2 bg-gray-50 shadow-lg">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link onClick={handleMenuItemClick} to="authentication/users/user-login">User</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link onClick={handleMenuItemClick} to="authentication/officials/officials-login">Official</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Mobile Menu (Hamburger Icon) */}
        <div className="md:hidden">
          <button className="text-black focus:outline-none" aria-label="Toggle navigation" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
