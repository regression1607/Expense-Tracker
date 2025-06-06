const { body, query } = require('express-validator');

const validateExpense = [
  body('amount')
    .isNumeric({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  body('category')
    .isIn(['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'])
    .withMessage('Invalid category'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  
  body('date')
    .isISO8601()
    .withMessage('Date must be in valid ISO format'),
  
  body('paymentMode')
    .isIn(['UPI', 'Credit Card', 'Net Banking', 'Cash'])
    .withMessage('Invalid payment mode')
];

const validateExpenseFilters = [
  query('dateFilter')
    .optional()
    .isIn(['thisMonth', 'last30Days', 'last90Days', 'allTime'])
    .withMessage('Invalid date filter'),
  
  query('categories')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        value = [value];
      }
      if (Array.isArray(value)) {
        const validCategories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
        return value.every(cat => validCategories.includes(cat));
      }
      return false;
    })
    .withMessage('Invalid categories'),
  
  query('paymentModes')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        value = [value];
      }
      if (Array.isArray(value)) {
        const validModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash'];
        return value.every(mode => validModes.includes(mode));
      }
      return false;
    })
    .withMessage('Invalid payment modes'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  validateExpense,
  validateExpenseFilters
};
