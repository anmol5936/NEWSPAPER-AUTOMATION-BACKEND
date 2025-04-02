const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  chequeNumber: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);