import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white text-black text-center py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome to GST Registration Portal
          </h1>
          <p className="text-xl mb-6">
            Simplify your GST registration process with our user-friendly portal.
          </p>
          <p className="mb-8">
            <Link
              to="/pages/gst-registration"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </Link>
          </p>
          {/* <div className="flex justify-center gap-6"> */}
          {/* <Link
              to="/pages/services"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Our Services
            </Link> */}
          {/* <Link
              to="/pages/contact-us"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Contact Us
            </Link> */}
          {/* </div> */}
        </div>
      </section>

      {/* About Section */}
      {/* <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg mb-6">
            Our team is dedicated to providing the best solutions for your
            business. With years of experience in the industry, we help our
            clients achieve their goals.
          </p>
          <Link
            to="/about"
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition duration-300"
          >
            Learn More About Us
          </Link>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="py-16 bg-blue-50 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">What Our Clients Say</h2>
          <div className="flex justify-center gap-8">
            <div className="w-1/3 p-6 bg-white shadow-lg rounded-lg">
              <p className="text-xl italic mb-4">
                "This company helped us take our business to the next level!
                Highly recommended."
              </p>
              <p className="font-semibold">John Doe</p>
              <p className="text-gray-600">CEO, Example Corp</p>
            </div>
            <div className="w-1/3 p-6 bg-white shadow-lg rounded-lg">
              <p className="text-xl italic mb-4">
                "Professional and reliable service. A true pleasure to work
                with."
              </p>
              <p className="font-semibold">Jane Smith</p>
              <p className="text-gray-600">Marketing Director, Acme Ltd.</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;