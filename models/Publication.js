const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);