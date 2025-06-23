const TroubleTicket = require("../models/troubleTicketModel");
const mongoose = require("mongoose");

exports.createTicket = async (req, res) => {
  try {
    const troubleTicket = new TroubleTicket(req.body);
    await troubleTicket.save();

    res.status(201).json({
      id: troubleTicket._id.toString(),
      ...troubleTicket.toObject(),
      "@type": troubleTicket["@type"] || "TroubleTicket",
    });
  } catch (error) {
    res.status(400).json({
      message: "Trouble Ticket creation error.",
      error: error.message,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await TroubleTicket.find();

    const patchedTickets = tickets.map((t) => {
      const obj = t.toObject();
      return {
        ...obj,
        "@type": obj["@type"] ?? "TroubleTicket",
      };
    });

    res.status(200).json(patchedTickets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid TroubleTicket ID" });
  }

  try {
    const ticket = await TroubleTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    let ticketObj = ticket.toObject();
    ticketObj.id = ticket._id.toString();
    ticketObj["@type"] = ticketObj["@type"] || "TroubleTicket";

    if (req.query.fields) {
      const fields = req.query.fields.split(",");
      const filtered = {
        id: ticketObj.id,
        "@type": ticketObj["@type"],
      };
      fields.forEach((f) => {
        if (ticketObj.hasOwnProperty(f)) {
          filtered[f] = ticketObj[f];
        }
      });
      return res.status(200).json(filtered);
    }

    return res.status(200).json(ticketObj);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
exports.updateTicketById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid TroubleTicket ID" });
  }

  try {
    const updatedTicket = await TroubleTicket.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const ticketObj = updatedTicket.toObject();
    ticketObj.id = updatedTicket._id.toString();
    ticketObj["@type"] = ticketObj["@type"] || "TroubleTicket";

    return res.status(200).json(ticketObj);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating Trouble Ticket",
      error: error.message,
    });
  }
};

exports.deleteTicketById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid TroubleTicket ID" });
  }

  try {
    const deletedTicket = await TroubleTicket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(200).json({
      message: "Trouble Ticket deleted successfully",
      id: deletedTicket._id.toString(),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
