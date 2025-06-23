import React, { useState } from "react";

export default function CreateTroubleTicketModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ticketType: "",
    severity: "Minor",
    status: "acknowledged",
    priority: "",
    expectedResolutionDate: "",
    requestedResolutionDate: "",
  });

  const [attachment, setAttachment] = useState({
    name: "",
    url: "",
    attachmentType: "",
    mimeType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttachmentChange = (e) => {
    setAttachment({ ...attachment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== "") acc[key] = value;
      return acc;
    }, {});

    // If any attachment field is filled, validate and add
    const hasAttachment =
      attachment.name ||
      attachment.url ||
      attachment.attachmentType ||
      attachment.mimeType;

    if (hasAttachment) {
      if (!attachment.attachmentType || !attachment.mimeType) {
        alert(
          "Attachment Type and MIME Type are required if adding an attachment."
        );
        return;
      }

      cleanData.attachment = [
        {
          ...attachment,
          "@type": "AttachmentRef",
        },
      ];
    }

    onCreate(cleanData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Create Trouble Ticket</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 text-sm"
        >
          {/* Main Fields */}
          <div className="col-span-2">
            <label className="block font-medium">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter ticket name"
            />
          </div>

          <div className="col-span-2">
            <label className="block font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block font-medium">Type *</label>
            <input
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g., technical, billing"
            />
          </div>

          <div>
            <label className="block font-medium">Severity *</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="acknowledged">Acknowledged</option>
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
              <option value="held">Held</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Expected Resolution</label>
            <input
              type="date"
              name="expectedResolutionDate"
              value={formData.expectedResolutionDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Requested Resolution</label>
            <input
              type="date"
              name="requestedResolutionDate"
              value={formData.requestedResolutionDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Optional Attachment Section */}
          <div className="col-span-2 pt-2">
            <h3 className="font-semibold text-sm mb-2">
              Attachment (Optional)
            </h3>
          </div>

          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              value={attachment.name}
              onChange={handleAttachmentChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="File name"
            />
          </div>

          <div>
            <label className="block font-medium">URL</label>
            <input
              name="url"
              value={attachment.url}
              onChange={handleAttachmentChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="https://example.com/file.pdf"
            />
          </div>

          <div>
            <label className="block font-medium">Attachment Type *</label>
            <input
              name="attachmentType"
              value={attachment.attachmentType}
              onChange={handleAttachmentChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g., document, image"
            />
          </div>

          <div>
            <label className="block font-medium">MIME Type *</label>
            <input
              name="mimeType"
              value={attachment.mimeType}
              onChange={handleAttachmentChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g., application/pdf"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
