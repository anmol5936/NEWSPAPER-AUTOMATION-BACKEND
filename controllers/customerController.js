const Customer = require('../models/Customer');

exports.addCustomer = async (req, res) => {
  try {
    const { name, address, phone, subscriptions } = req.body;
    const customer = new Customer({
      name,
      address,
      phone,
      subscriptions
    });
    await customer.save();
    res.status(201).json({ message: 'Customer added successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer' });
  }
};

exports.editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, subscriptions } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, address, phone, subscriptions },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer' });
  }
};

exports.withholdSubscription = async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        withhold: {
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Subscription withheld successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error withholding subscription' });
  }
};