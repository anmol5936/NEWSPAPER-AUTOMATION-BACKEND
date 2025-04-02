const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Delivery = require('../models/Delivery');

exports.addPayment = async (req, res) => {
  try {
    const { customerId, amount, chequeNumber } = req.body;
    
    const payment = new Payment({
      customerId,
      amount,
      chequeNumber
    });
    
    await payment.save();

    // Update customer's dues and payment history
    const customer = await Customer.findById(customerId);
    customer.dues -= amount;
    customer.paymentHistory.push(payment._id);
    await customer.save();

    res.status(201).json({
      message: 'Payment recorded successfully',
      receipt: {
        receiptNumber: payment._id,
        customerName: customer.name,
        amount,
        chequeNumber,
        date: payment.date
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment' });
  }
};

exports.getDelivererPayments = async (req, res) => {
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
        $lookup: {
          from: 'publications',
          localField: 'publicationId',
          foreignField: '_id',
          as: 'publication'
        }
      },
      {
        $unwind: '$publication'
      },
      {
        $group: {
          _id: '$delivererId',
          totalValue: { $sum: '$publication.price' }
        }
      }
    ]);

    const payments = await Promise.all(deliveries.map(async (delivery) => {
      const deliverer = await User.findById(delivery._id);
      const commission = delivery.totalValue * 0.025; // 2.5% commission

      return {
        delivererId: delivery._id,
        delivererName: deliverer.username,
        totalDeliveryValue: delivery.totalValue,
        commission,
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        year: startOfMonth.getFullYear()
      };
    }));

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating deliverer payments' });
  }
};