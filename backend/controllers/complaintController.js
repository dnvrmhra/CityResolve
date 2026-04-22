const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  const complaint = await Complaint.create({
    ...req.body,
    user: req.user._id
  });
  res.json(complaint);
};

exports.getComplaints = async (req, res) => {
  const complaints = await Complaint.find().populate("user", "name");
  res.json(complaints);
};

exports.updateComplaint = async (req, res) => {
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};