// Customer Model
const Customer = require("../models/Customer");

//validation

const customers = {
  index: async (req, res, next) => {
    const customers = await Customer.find(req.query).sort({ date: -1 });
    res.status(200).json(customers);
  },

  newCustomer: async (req, res, next) => {
    const newCustomer = new Customer(req.body);
    const user = await newCustomer.save();
    return res.status(201).json(user);
  },

  getCustomer: async (req, res, next) => {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    return res.status(200).json(customer);
  },

  replaceCustomer: async (req, res, next) => {
    const { customerId } = req.params;
    const newCustomer = req.body;
    await Customer.findByIdAndUpdate(customerId, newCustomer);
    res.status(200).json({ success: true });
  },
  updateCustomer: async (req, res, next) => {
    const { customerId } = req.params;
    const newCustomer = req.body;
    try {
      const result = await Customer.findByIdAndUpdate(customerId, newCustomer);
    } catch (e) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true });
  },
  deleteCustomer: async (req, res, next) => {
    const { customerId } = req.params;
    const result = await Customer.findByIdAndRemove(customerId);
    res.status(200).json({ success: true });
  }
};

module.exports = customers;
