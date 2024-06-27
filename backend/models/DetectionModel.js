const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Model', modelSchema);