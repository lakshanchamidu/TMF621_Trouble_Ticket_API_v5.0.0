const express = require("express");
const router = express.Router();
const controller = require("../controllers/troubleTicetController");

router.post("/", controller.createTicket);
router.get("/", controller.getAllTroubleTicket);
router.get("/:id", controller.getTicketById);
router.patch("/:id", controller.updateTicket);
router.delete("/:id", controller.deleteTicket);

module.exports = router;
