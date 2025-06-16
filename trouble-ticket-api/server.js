require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const troubleTicketRoutes = require("./routes/troubleTicketRoutes");
app.use(express.json());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("Database URI not in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Database connection error.");
    process.exit(1);
  });

app.use("/api/tickets", troubleTicketRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
