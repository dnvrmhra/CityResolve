const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  priority: { type: String, default: 'Low' },
  title: String,
  description: String,
  category: String,
  status: {
    type: String,
    default: "Pending"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);