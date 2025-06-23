import React, { useState, useEffect } from "react";
import { Edit2, Eye, RefreshCw, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import CreateTroubleTicketModal from "./CreateTroubleTicketModal";

export default function TroubleTicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editTicket, setEditTicket] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/tmf-api/troubleTicket/v5/troubleTicket"
      );
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      const res = await fetch(
        "http://localhost:5000/tmf-api/troubleTicket/v5/troubleTicket",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticketData),
        }
      );
      if (res.ok) {
        fetchTickets();
        setShowCreateModal(false); // Close modal on successful creation
      } else {
        const errorData = await res.json();
        console.error("Failed to create ticket:", res.status, errorData);
        alert(
          `Failed to create ticket: ${errorData.message || res.statusText}`
        );
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("An error occurred while creating the ticket. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/tmf-api/troubleTicket/v5/troubleTicket/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) fetchTickets();
      else {
        const errorData = await res.json();
        console.error("Failed to delete ticket:", res.status, errorData);
        alert(
          `Failed to delete ticket: ${errorData.message || res.statusText}`
        );
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("An error occurred while deleting the ticket. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "acknowledged":
        return "bg-blue-500";
      case "rejected":
        return "bg-red-600";
      case "pending":
        return "bg-yellow-500";
      case "held":
        return "bg-gray-500";
      case "inProgress":
        return "bg-indigo-500";
      case "cancelled":
        return "bg-red-400";
      case "closed":
        return "bg-black";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const closeViewModal = () => setSelectedTicket(null);
  const closeEditModal = () => setEditTicket(null);
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? t.status === filterStatus : true;
    const matchesPriority = filterPriority
      ? t.priority === filterPriority
      : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEditChange = (field, value) => {
    setEditTicket({ ...editTicket, [field]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Use editTicket.id or editTicket._id for the ID
    const ticketId = editTicket.id || editTicket._id;

    if (!editTicket || !ticketId) {
      // Check for both editTicket existence and a valid ID
      console.error("No ticket selected for editing or ticket ID is missing.");
      alert("Cannot update: Ticket information is incomplete.");
      return;
    }

    setEditLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/tmf-api/troubleTicket/v5/troubleTicket/${ticketId}`, // Use the derived ticketId here
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editTicket),
        }
      );
      if (res.ok) {
        await fetchTickets();
        setEditTicket(null);
      } else {
        const errorData = await res.json();
        console.error("Failed to update ticket:", res.status, errorData);
        alert(
          `Failed to update ticket: ${errorData.message || res.statusText}`
        );
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("An error occurred while updating the ticket. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slot-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-stone-200 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full">
            <div className="flex flex-wrap gap-2 flex-grow">
              <input
                type="text"
                placeholder="Search by name..."
                className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-700"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {[
                  "acknowledged",
                  "rejected",
                  "pending",
                  "held",
                  "inProgress",
                  "cancelled",
                  "closed",
                  "resolved",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-700"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                onClick={fetchTickets}
                className="bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center transition"
              >
                <RefreshCw size={16} className="mr-1" /> Refresh
              </button>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                + Create Ticket
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading tickets...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <h1 className="text-3xl font-bold ml-5 text-slate-800 mb-4">
              Trouble Tickets
            </h1>
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-slate-200 text-slate-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Creation Date</th>
                  <th className="py-3 px-6 text-left">Expected</th>
                  <th className="py-3 px-6 text-left">Requested</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm font-light">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id || t._id}
                    className="border-b border-slate-200 hover:bg-slate-100"
                  >
                    <td className="py-3 px-6">{t.name}</td>
                    <td className="py-3 px-6 capitalize">
                      {t.type || t.ticketType}
                    </td>
                    <td className="py-3 px-6 capitalize">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">{formatDate(t.creationDate)}</td>
                    <td className="py-3 px-6">
                      {formatDate(t.expectedResolutionDate)}
                    </td>
                    <td className="py-3 px-6">
                      {formatDate(t.requestedResolutionDate)}
                    </td>
                    <td className="py-3 px-6 text-center space-x-2">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="text-indigo-500 hover:text-indigo-700"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => setEditTicket(t)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit Ticket"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id || t._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Ticket"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTicket && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeViewModal}
          >
            <div
              className="bg-white rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Ticket Details
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-800">
                <div>
                  <p className="text-slate-500">ID</p>
                  <p>{selectedTicket.id || selectedTicket._id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Name</p>
                  <p>{selectedTicket.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Type</p>
                  <p>{selectedTicket.type || selectedTicket.ticketType}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-500">Priority</p>
                  <p>{selectedTicket.priority || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Severity</p>
                  <p>{selectedTicket.severity || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p>{formatDate(selectedTicket.creationDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Expected</p>
                  <p>{formatDate(selectedTicket.expectedResolutionDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Requested</p>
                  <p>{formatDate(selectedTicket.requestedResolutionDate)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Resolved</p>
                  <p>{formatDate(selectedTicket.resolutionDate)}</p>
                </div>
              </div>

              {selectedTicket.attachment?.length > 0 && (
                <div className="mt-4">
                  <p className="text-slate-500 font-medium">Attachments</p>
                  <ul className="list-disc ml-5 text-sm text-slate-800">
                    {selectedTicket.attachment.map((a, i) => (
                      <li key={i}>
                        {a.url ? (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline"
                          >
                            {a.name || a.url}
                          </a>
                        ) : (
                          a.name
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTicket.description && (
                <div className="mt-4">
                  <p className="text-slate-500">Description</p>
                  <p>{selectedTicket.description}</p>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeViewModal}
                  className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {editTicket && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeEditModal}
          >
            <div
              className="bg-white rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Edit Ticket
              </h2>

              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editTicket.name || ""}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Type
                    </label>
                    <input
                      type="text"
                      value={editTicket.ticketType || editTicket.type || ""}
                      onChange={(e) =>
                        handleEditChange("ticketType", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Status
                    </label>
                    <select
                      value={editTicket.status || ""}
                      onChange={(e) =>
                        handleEditChange("status", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    >
                      {[
                        "acknowledged",
                        "rejected",
                        "pending",
                        "held",
                        "inProgress",
                        "cancelled",
                        "closed",
                        "resolved",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Priority
                    </label>
                    <select
                      value={editTicket.priority || ""}
                      onChange={(e) =>
                        handleEditChange("priority", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="">-</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-500 mb-1 font-medium">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editTicket.description || ""}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Expected Resolution Date
                    </label>
                    <input
                      type="date"
                      value={
                        editTicket.expectedResolutionDate
                          ? editTicket.expectedResolutionDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleEditChange(
                          "expectedResolutionDate",
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">
                      Requested Resolution Date
                    </label>
                    <input
                      type="date"
                      value={
                        editTicket.requestedResolutionDate
                          ? editTicket.requestedResolutionDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleEditChange(
                          "requestedResolutionDate",
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    />
                  </div>

                  {/* Attachments */}
                  <div className="col-span-2">
                    <label className="block text-slate-500 mb-1 font-medium">
                      Attachments
                    </label>
                    {Array.isArray(editTicket.attachment) &&
                    editTicket.attachment.length > 0 ? (
                      editTicket.attachment.map((att, idx) => (
                        <div
                          key={idx}
                          className="mb-3 p-3 border border-slate-300 rounded relative"
                        >
                          <label className="block text-slate-600 text-xs mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={att.name || ""}
                            onChange={(e) => {
                              const newAttachments = [...editTicket.attachment];
                              newAttachments[idx] = {
                                ...newAttachments[idx],
                                name: e.target.value,
                              };
                              setEditTicket({
                                ...editTicket,
                                attachment: newAttachments,
                              });
                            }}
                            className="w-full border border-slate-300 rounded px-2 py-1 mb-2"
                          />

                          <label className="block text-slate-600 text-xs mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={att.description || ""}
                            onChange={(e) => {
                              const newAttachments = [...editTicket.attachment];
                              newAttachments[idx] = {
                                ...newAttachments[idx],
                                description: e.target.value,
                              };
                              setEditTicket({
                                ...editTicket,
                                attachment: newAttachments,
                              });
                            }}
                            className="w-full border border-slate-300 rounded px-2 py-1 mb-2"
                          />

                          <label className="block text-slate-600 text-xs mb-1">
                            URL
                          </label>
                          <input
                            type="text"
                            value={att.url || ""}
                            onChange={(e) => {
                              const newAttachments = [...editTicket.attachment];
                              newAttachments[idx] = {
                                ...newAttachments[idx],
                                url: e.target.value,
                              };
                              setEditTicket({
                                ...editTicket,
                                attachment: newAttachments,
                              });
                            }}
                            className="w-full border border-slate-300 rounded px-2 py-1 mb-2"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const newAttachments = [...editTicket.attachment];
                              newAttachments.splice(idx, 1);
                              setEditTicket({
                                ...editTicket,
                                attachment: newAttachments,
                              });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                            title="Remove attachment"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        No attachments
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const newAttachments = Array.isArray(
                          editTicket.attachment
                        )
                          ? [...editTicket.attachment]
                          : [];
                        newAttachments.push({
                          id: Date.now().toString(),
                          name: "",
                          description: "",
                          url: "",
                          attachmentType: "",
                          mimeType: "",
                          "@type": "AttachmentRef",
                        });
                        setEditTicket({
                          ...editTicket,
                          attachment: newAttachments,
                        });
                      }}
                      className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    >
                      + Add Attachment
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <CreateTroubleTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTicket}
        />
      </div>
    </div>
  );
}
