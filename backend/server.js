// This is the entry point of our backend - the file we actually run
// to start the server. Its job: connect to the database, set up
// middleware, and tell Express which routes exist.

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config(); // loads variables from .env into process.env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ----- MIDDLEWARE -----
// Middleware = code that runs on EVERY request, before it reaches your routes.

app.use(cors());
// ^ allows our React app (running on a different address, e.g. localhost:5173)
//   to make requests to this server (e.g. localhost:5000) without the
//   browser blocking it for security reasons.

app.use(express.json());
// ^ without this, req.body would be undefined when the frontend sends JSON data.
//   this line tells Express: "parse incoming JSON and make it available as req.body"

// ----- ROUTES -----
// Any request starting with /api/expenses gets handled by expenseRoutes
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);

// A simple test route, just to confirm the server is alive
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

// ----- CONNECT TO DATABASE, THEN START SERVER -----
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // We only start listening for requests AFTER the database connects.
    // No point accepting requests if we can't actually save/read data yet.
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });