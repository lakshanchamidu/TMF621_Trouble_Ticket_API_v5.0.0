import React from "react";
import { Link } from "react-router-dom"; // Import Link

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md w-full py-4 px-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          <div className="text-2xl font-bold text-gray-800 tracking-wide">
            TMF621 Trouble Ticket Management
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Manage customer complaints and service issues
          </div>
        </div>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="/">
            <button className="bg-gray-100 text-black font-medium px-5 py-3 shadow-md rounded-2xl hover:bg-gray-200 transition duration-200">
              Home
            </button>
          </Link>
          <Link to="/apiTester">
            <button className="bg-gray-100 text-black font-medium shadow-md px-5 py-3 rounded-2xl hover:bg-gray-200 transition duration-200">
              API Tester
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
