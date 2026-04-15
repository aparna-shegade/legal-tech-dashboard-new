const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  taskTitle: String,
  dueDate: Date,
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  completionPercentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);