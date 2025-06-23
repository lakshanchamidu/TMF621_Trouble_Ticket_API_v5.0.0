import React, { useState } from "react";
import Navbar from "./Navbar.js";

const ApiTester = () => {
  const [baseUrl, setBaseUrl] = useState(
    "http://localhost:5000/tmf-api/troubleTicket/v5"
  );
  const [endpoint, setEndpoint] = useState("/troubleTicket");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState(""); // <-- for request body
  const [response, setResponse] = useState("Response will appear here...");

  const handleRequest = async () => {
    try {
      const url = baseUrl + endpoint;
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Only attach body for POST, PATCH, PUT
      if (["POST", "PATCH", "PUT"].includes(method)) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      <Navbar />
      <main className="max-w-6xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">API Tester</h1>
        <p className="mb-2 text-gray-600">
          Test TMF671 Promotion Management API endpoints
        </p>

        {/* Base URL */}
        <div className="mb-4">
          <label className="font-medium">Base URL:</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full border mt-1 px-4 py-2 rounded-md shadow-sm"
          />
        </div>

        {/* Method + Endpoint + Button */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>

          <input
            type="text"
            placeholder="/troubleTicket"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 border px-4 py-2 rounded-md shadow-sm"
          />

          <button
            onClick={handleRequest}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Send Request
          </button>
        </div>

        {(method === "POST" || method === "PATCH") && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Request Body (JSON)</h2>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"name":"...", "description":"..."}'
              className="w-full h-48 p-4 border rounded-md bg-gray-50 font-mono text-sm"
            />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">Response</h2>
          <textarea
            value={response}
            readOnly
            className="w-full h-60 p-4 border rounded-md bg-gray-50 font-mono text-sm"
          />
        </div>
      </main>
    </div>
  );
};

export default ApiTester;
