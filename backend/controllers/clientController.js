const Client = require("../models/Client");

// CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    req.app.get('io').emit('clientCreated', newClient);
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL CLIENTS
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error("getClients error:", err.message);
    res.json([]);
  }
};

// GET SINGLE CLIENT
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    req.app.get('io').emit('clientUpdated', updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    req.app.get('io').emit('clientDeleted', { id: req.params.id });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};