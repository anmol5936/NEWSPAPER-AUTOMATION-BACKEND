const Delivery = require('../models/Delivery');
const Customer = require('../models/Customer');
const User = require('../models/User');

exports.getTodayDeliveries = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active customers (not withheld)
    const customers = await Customer.find({
      $or: [
        { withhold: { $exists: false } },
        { 'withhold.endDate': { $lt: today } },
        { 'withhold.startDate': { $gt: today } }
      ]
    }).populate('subscriptions').sort('address');

    // Get all deliverers
    const deliverers = await User.find({ role: 'deliverer' });
    if (!deliverers.length) {
      return res.status(404).json({ message: 'No deliverers found' });
    }

    // Distribute customers among deliverers
    const deliveriesPerDeliverer = Math.ceil(customers.length / deliverers.length);
    const deliveryAssignments = deliverers.map((deliverer, index) => {
      const start = index * deliveriesPerDeliverer;
      const end = start + deliveriesPerDeliverer;
      const assignedCustomers = customers.slice(start, end);

      return {
        delivererId: deliverer._id,
        deliveries: assignedCustomers.map(customer => ({
          address: customer.address,
          publications: customer.subscriptions
        }))
      };
    });

    res.json(deliveryAssignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const deliveries = await Delivery.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$customerId',
          publicationsDelivered: { $sum: 1 }
        }
      }
    ]);

    const summary = await Promise.all(deliveries.map(async (delivery) => {
      const customer = await Customer.findById(delivery._id);
      return {
        name: customer.name,
        publicationsDelivered: delivery.publicationsDelivered
      };
    }));

    res.json({ customers: summary });
  } catch (error) {
    res.status(500).json({ message: 'Error generating delivery summary' });
  }
};