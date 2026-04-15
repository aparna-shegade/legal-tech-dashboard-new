const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  caseTitle: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  caseType: { type: String },
  status: { type: String, enum: ["Pending", "Ongoing", "Closed"], default: "Pending" },
  startDate: { type: Date },
  nextHearingDate: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);