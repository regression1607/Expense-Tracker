const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others']
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['UPI', 'Credit Card', 'Net Banking', 'Cash']
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ date: -1, category: 1, paymentMode: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
