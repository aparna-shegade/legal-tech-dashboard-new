const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  date: { type: Date, required: true },
  type: { type: String, enum: ["Court Date", "Deadline", "Reminder"] },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Deadline", deadlineSchema);