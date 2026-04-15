const express = require("express");
const router = express.Router();
const Deadline = require("../models/Deadline");

// Create
router.post("/", async (req, res) => {
  try {
    const deadline = new Deadline(req.body);
    await deadline.save();
    // emit socket event if available
    const io = req.app.get('io');
    if (io) io.emit('deadlineCreated', deadline);
    res.json(deadline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all
router.get("/", async (req, res) => {
  try {
    const deadlines = await Deadline.find();
    res.json(deadlines);
  } catch (err) {
    console.error("get all deadlines error:", err.message);
    res.json([]);
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Deadline.findByIdAndDelete(req.params.id);
    const io = req.app.get('io');
    if (io && deleted) io.emit('deadlineDeleted', deleted);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update (e.g., mark completed)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Deadline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const io = req.app.get('io');
    if (io && updated) io.emit('deadlineUpdated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get upcoming within N days (default 7)
router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const now = new Date();
    const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const upcoming = await Deadline.find({ date: { $gte: now, $lte: until }, status: 'Pending' }).sort('date');
    res.json(upcoming);
  } catch (err) {
    console.error("get upcoming deadlines error:", err.message);
    res.json([]);
  }
});

module.exports = router;