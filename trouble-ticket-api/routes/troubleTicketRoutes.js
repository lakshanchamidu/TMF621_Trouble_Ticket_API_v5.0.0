const express = require("express");
const router = express.Router();
const controller = require("../controllers/troubleTicketController");

router.post("/", controller.createTicket);
router.get("/", controller.getAllTickets);
router.get("/:id", controller.getTicketById);
router.patch("/:id", controller.updateTicketById);
router.delete("/:id", controller.deleteTicketById);

module.exports = router;
