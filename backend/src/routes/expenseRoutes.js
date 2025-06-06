const express = require('express');
const expenseController = require('../controllers/expenseController');
const { authenticateToken } = require('../middleware/auth');
const { validateExpense, validateExpenseFilters } = require('../validators/expenseValidator');

const router = express.Router();

// All expense routes require authentication
router.use(authenticateToken);

// POST /api/expenses - Create a new expense
router.post('/', validateExpense, expenseController.createExpense);

// GET /api/expenses/analytics - Get expense analytics (must come before /:id)
router.get('/analytics', expenseController.getAnalytics);

// GET /api/expenses - Get all expenses with filtering
router.get('/', validateExpenseFilters, expenseController.getExpenses);

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', expenseController.getExpenseById);

// PUT /api/expenses/:id - Update expense by ID
router.put('/:id', validateExpense, expenseController.updateExpense);

// DELETE /api/expenses/:id - Delete expense by ID
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
