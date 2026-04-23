const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'https://city-resolve.vercel.app',
    'https://cityresolve.vercel.app',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '20mb' }));

// Multer: memory storage, images only, max 5MB each, up to 3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

const ComplaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  name: String,
  phone: String,
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Low" },
  images: [{ type: String }],   // base64 data-URLs, e.g. "data:image/jpeg;base64,..."
  createdAt: { type: Date, default: Date.now },
});
const Complaint = mongoose.model("Complaint", ComplaintSchema);

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(401);
  }
};

// Priority scoring
const calcPriority = (title = '', description = '') => {
  const text = (title + ' ' + description).toLowerCase();
  const highWords = ['urgent', 'dangerous', 'accident', 'flood', 'fire', 'broken', 'emergency', 'hazard', 'toxic', 'sewage', 'overflow'];
  const medWords = ['leak', 'pothole', 'light', 'garbage', 'water', 'road', 'traffic', 'damage'];
  if (highWords.some(w => text.includes(w))) return 'High';
  if (medWords.some(w => text.includes(w))) return 'Medium';
  return 'Low';
};

app.get("/", (req, res) => res.send("CityResolve Backend Running 🚀"));

app.post("/api/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "User not found" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/complaints", async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/complaints", upload.array("images", 3), async (req, res) => {
  try {
    const priority = calcPriority(req.body.title, req.body.description);
    // Convert uploaded image buffers → base64 data-URLs
    const images = (req.files || []).map(f =>
      `data:${f.mimetype};base64,${f.buffer.toString('base64')}`
    );
    const data = await Complaint.create({ ...req.body, priority, images });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/complaints/:id", async (req, res) => {
  try {
    const data = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/complaints/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));