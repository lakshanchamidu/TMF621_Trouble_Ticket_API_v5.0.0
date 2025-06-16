const TroubleTicket = require("../models/troubleTicketModel");

exports.createTicket = async (req, res) => {
  try {
    const troubleTicket = new TroubleTicket(req.body);
    await troubleTicket.save();
    res.status(201).json({ message: "Successfully create trouble ticket." });
  } catch (error) {
    res.status(400).json({ message: "Trouble Ticket generate error." });
    console.log(error);
  }
};

exports.getAllTroubleTicket = async (req, res) => {
  try {
    const troubleTickets = await TroubleTicket.find();
    if (!troubleTickets)
      res.status(400).json({ message: "Zero Trouble Tickets in database" });
    res.status(200).json(troubleTickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets." });
    console.log(error);
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const troubleTicket = await TroubleTicket.findById(req.params.id);
    if (!troubleTicket)
      res.status(400).json({ message: "Ticket not found in database." });
    res.status(200).json(troubleTicket);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ticket." });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const troubleTicket = await TroubleTicket.findByIdAndDelete(req.params.id);

    if (!troubleTicket)
      res.status(400).json({ message: "Ticket not found in database." });

    res.status(200).json({ message: "Successfully deleted ticket." });
  } catch (error) {
    res.statu(400).json({ message: "Error deleting ticket." });
  }
};
exports.updateTicket = async (req, res) => {
  try {
    const updated = await TroubleTicket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Ticket not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
