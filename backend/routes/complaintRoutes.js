const router = require("express").Router();
const {
  createComplaint,
  getComplaints,
  updateComplaint
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createComplaint);
router.get("/", getComplaints);
router.put("/:id", updateComplaint);

module.exports = router;