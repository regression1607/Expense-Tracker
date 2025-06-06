const { validationResult } = require('express-validator');
const expenseService = require('../services/expenseService');
const logger = require('../utils/logger');

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const expense = await expenseService.createExpense(req.body, req.user._id);
      res.status(201).json({
        success: true,
        data: expense,
        message: 'Expense created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpenses(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const {
        dateFilter,
        categories,
        paymentModes,
        page = 1,
        limit = 20
      } = req.query;

      const filters = {
        dateFilter,
        categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
        paymentModes: paymentModes ? (Array.isArray(paymentModes) ? paymentModes : [paymentModes]) : []
      };

      const result = await expenseService.getExpenses(filters, parseInt(page), parseInt(limit), req.user._id);
      
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpenseById(req, res, next) {
    try {
      const expense = await expenseService.getExpenseById(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        data: expense
      });
    } catch (error) {
      if (error.message === 'Expense not found') {
        return res.status(404).json({
          error: 'Expense not found'
        });
      }
      next(error);
    }
  }

  async updateExpense(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const expense = await expenseService.updateExpense(req.params.id, req.body, req.user._id);
      res.status(200).json({
        success: true,
        data: expense,
        message: 'Expense updated successfully'
      });
    } catch (error) {
      if (error.message === 'Expense not found') {
        return res.status(404).json({
          error: 'Expense not found'
        });
      }
      next(error);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      await expenseService.deleteExpense(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Expense not found') {
        return res.status(404).json({
          error: 'Expense not found'
        });
      }
      next(error);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await expenseService.getAnalytics(req.user._id);
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseController();
