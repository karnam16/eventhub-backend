const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://eventhub-frontend-theta.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    userId: req.userId,
  });
});

app.get("/", (req, res) => {
  res.send("HELLO FROM EXPRESS SERVER");
});


const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
