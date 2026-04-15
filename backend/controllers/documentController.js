const Document = require("../models/Document");

// CREATE DOCUMENT
exports.createDocument = async (req, res) => {
  try {
    const newDocument = await Document.create(req.body);
    req.app.get('io').emit('documentCreated', newDocument);
    res.status(201).json(newDocument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL DOCUMENTS
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate("caseId");
    res.json(documents);
  } catch (err) {
    console.error("getDocuments error:", err.message);
    res.json([]);
  }
};

// GET SINGLE DOCUMENT
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE DOCUMENT
exports.updateDocument = async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    req.app.get('io').emit('documentUpdated', updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE DOCUMENT
exports.deleteDocument = async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    req.app.get('io').emit('documentDeleted', { id: req.params.id });
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};