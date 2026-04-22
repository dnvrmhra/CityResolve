const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"));

// Models
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});

const Complaint = mongoose.model("Complaint", {
  title: String,
  description: String,
  category: String,
  status: { type: String, default: "Pending" }
});

// JWT
const jwt = require("jsonwebtoken");

// AUTH
app.post("/api/register", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hash });
  res.json(user);
});

app.post("/api/login", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const user = await User.findOne({ email: req.body.email });
  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.status(401).send("Invalid");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// MIDDLEWARE
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

// COMPLAINTS
app.post("/api/complaints", protect, async (req, res) => {
  const data = await Complaint.create(req.body);
  res.json(data);
});

app.get("/api/complaints", async (req, res) => {
  const data = await Complaint.find();
  res.json(data);
});

app.put("/api/complaints/:id", async (req, res) => {
  const data = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
});

app.listen(5000, () => console.log("Server running"));