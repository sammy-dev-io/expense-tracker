
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


// This is the entry point of our backend - the file we actually run
// to start the server. Its job: connect to the database, set up
// middleware, and tell Express which routes exist.

require("dotenv").config(); // loads variables from .env into process.env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");

const app = express();

// ----- MIDDLEWARE -----
// Middleware = code that runs on EVERY request, before it reaches your routes.

// In development, allow your local Vite server. In production, we'll set
// CLIENT_URL to your real deployed frontend's URL via an environment
// variable on your hosting platform - the code itself doesn't change.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());
// ^ without this, req.body would be undefined when the frontend sends JSON data.
//   this line tells Express: "parse incoming JSON and make it available as req.body"

// ----- ROUTES -----
// Any request starting with /api/expenses gets handled by expenseRoutes
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);

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