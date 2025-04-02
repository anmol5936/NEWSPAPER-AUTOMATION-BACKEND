const Customer = require('../models/Customer');
const Delivery = require('../models/Delivery');
const Publication = require('../models/Publication');

exports.getBills = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const customers = await Customer.find().populate('subscriptions');
    
    const bills = await Promise.all(customers.map(async (customer) => {
      const deliveries = await Delivery.find({
        customerId: customer._id,
        date: { $gte: startOfMonth }
      }).populate('publicationId');

      const totalCost = deliveries.reduce((sum, delivery) => {
        return sum + (delivery.publicationId ? delivery.publicationId.price : 0);
      }, 0);

      return {
        customerId: customer._id,
        customerName: customer.name,
        publications: customer.subscriptions,
        totalCost,
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        year: startOfMonth.getFullYear()
      };
    }));

    res.json({ bills });
  } catch (error) {
    res.status(500).json({ message: 'Error generating bills' });
  }
};