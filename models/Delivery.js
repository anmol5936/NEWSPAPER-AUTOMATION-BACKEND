const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  publicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication',
    required: true
  },
  delivererId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);