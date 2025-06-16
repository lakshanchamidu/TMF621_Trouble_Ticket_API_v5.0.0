const mongoose = require("mongoose");

const TroubleTicketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  exceptedResolutionDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  severity: {
    type: String,
    enum: ["Critical", "Minor", "Major"],
    required: true,
  },
  status: {
    type: String,
    enum: ["acknowledged", "inprogress", "resolve", "closed", "pending"],
    default: "acknowledged",
    required: true,
  },
  resolutionDate: {
    type: Date,
  },
  ticketType: {
    type: String,
    required: true,
  },
  attachment: [
    {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  channel: [
    {
      id: String,
      name: String,
    },
  ],
  note: [
    {
      id: String,
      author: String,
      text: String,
    },
  ],
});

module.exports = mongoose.model("Trouble Ticket", TroubleTicketSchema);
