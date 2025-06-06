const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, paymentMode: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
