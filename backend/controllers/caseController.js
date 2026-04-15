const Case = require("../models/Case");

// CREATE
exports.createCase = async (req, res) => {
  try {
    const newCase = await Case.create(req.body);
    // notify clients
    req.app.get('io').emit('caseCreated', newCase);
    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("clientId");
    res.json(cases);
  } catch (err) {
    console.error("getCases error:", err.message);
    // respond with empty array so UI can still render
    res.json([]);
  }
};

// READ ONE
exports.getCaseById = async (req, res) => {
  const caseItem = await Case.findById(req.params.id);
  res.json(caseItem);
};

// UPDATE
exports.updateCase = async (req, res) => {
  const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
  req.app.get('io').emit('caseUpdated', updated);
  res.json(updated);
};

// DELETE
exports.deleteCase = async (req, res) => {
  const deleted = await Case.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('caseDeleted', { id: req.params.id });
  res.json({ message: "Case deleted successfully" });
};