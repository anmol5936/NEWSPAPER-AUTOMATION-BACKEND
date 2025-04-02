const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication'
  }],
  dues: {
    type: Number,
    default: 0
  },
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  withhold: {
    startDate: Date,
    endDate: Date
  },
  pendingSubscriptions: {
    changes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publication'
    }],
    applyDate: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);