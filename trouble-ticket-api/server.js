require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const troubleTicketRoutes = require("./routes/troubleTicketRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/tmf-api/troubleTicket/v5/troubleTicket", troubleTicketRoutes);

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}/tmf-api/troubleTicket/v5/troubleTicket`
  );
});
