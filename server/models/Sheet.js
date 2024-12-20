const mongoose = require('mongoose');

const sheetSchema = mongoose.Schema({
  sheetName: { type: String, required: true },
  data: { type: Array, default: [] }, // Each row as an object
  columns: { type: Array, default: [] }, // Column headers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sheet', sheetSchema);
