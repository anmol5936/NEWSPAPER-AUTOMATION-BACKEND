const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const publicationRoutes = require('./routes/publications');
const customerRoutes = require('./routes/customers');
const deliveryRoutes = require('./routes/deliveries');
const billingRoutes = require('./routes/billing');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newspaper-agency')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/bills', billingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});