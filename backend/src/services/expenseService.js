const Expense = require('../models/Expense');
const logger = require('../utils/logger');

class ExpenseService {
  async createExpense(expenseData, userId) {
    try {
      const expense = new Expense({ ...expenseData, user: userId });
      await expense.save();
      logger.info('Expense created successfully', { expenseId: expense._id, userId });
      return expense;
    } catch (error) {
      logger.error('Error creating expense:', error);
      throw error;
    }
  }

  async getExpenses(filters = {}, page = 1, limit = 20, userId) {
    try {
      const query = this.buildQuery({ ...filters, user: userId });
      const skip = (page - 1) * limit;

      const [expenses, total] = await Promise.all([
        Expense.find(query)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Expense.countDocuments(query)
      ]);

      return {
        expenses,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: expenses.length,
          totalRecords: total
        }
      };
    } catch (error) {
      logger.error('Error fetching expenses:', error);
      throw error;
    }
  }

  async getExpenseById(id, userId) {
    try {
      const expense = await Expense.findOne({ _id: id, user: userId });
      if (!expense) {
        throw new Error('Expense not found');
      }
      return expense;
    } catch (error) {
      logger.error('Error fetching expense by ID:', error);
      throw error;
    }
  }

  async updateExpense(id, updateData, userId) {
    try {
      const expense = await Expense.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!expense) {
        throw new Error('Expense not found');
      }
      
      logger.info('Expense updated successfully', { expenseId: id });
      return expense;
    } catch (error) {
      logger.error('Error updating expense:', error);
      throw error;
    }
  }

  async deleteExpense(id, userId) {
    try {
      const expense = await Expense.findOneAndDelete({ _id: id, user: userId });
      if (!expense) {
        throw new Error('Expense not found');
      }
      
      logger.info('Expense deleted successfully', { expenseId: id });
      return expense;
    } catch (error) {
      logger.error('Error deleting expense:', error);
      throw error;
    }
  }

  async getAnalytics(userId) {
    try {
      const analytics = await Expense.aggregate([
        {
          $match: { user: userId }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              category: '$category'
            },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              year: '$_id.year',
              month: '$_id.month'
            },
            categories: {
              $push: {
                category: '$_id.category',
                amount: '$totalAmount',
                count: '$count'
              }
            },
            totalAmount: { $sum: '$totalAmount' }
          }
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1
          }
        }
      ]);

      // Get summary statistics
      const summary = await Expense.aggregate([
        {
          $match: { user: userId }
        },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$amount' },
            totalTransactions: { $sum: 1 },
            avgExpense: { $avg: '$amount' }
          }
        }
      ]);

      // Get category breakdown
      const categoryBreakdown = await Expense.aggregate([
        {
          $match: { user: userId }
        },
        {
          $group: {
            _id: '$category',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { totalAmount: -1 }
        }
      ]);

      return {
        monthlyData: analytics,
        summary: summary[0] || { totalExpenses: 0, totalTransactions: 0, avgExpense: 0 },
        categoryBreakdown
      };
    } catch (error) {
      logger.error('Error fetching analytics:', error);
      throw error;
    }
  }

  buildQuery(filters) {
    const query = {};

    // User filter (always include)
    if (filters.user) {
      query.user = filters.user;
    }

    // Date filter
    if (filters.dateFilter) {
      const now = new Date();
      let startDate;

      switch (filters.dateFilter) {
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last30Days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90Days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          break;
      }

      if (startDate) {
        query.date = { $gte: startDate };
      }
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      query.category = { $in: filters.categories };
    }

    // Payment mode filter
    if (filters.paymentModes && filters.paymentModes.length > 0) {
      query.paymentMode = { $in: filters.paymentModes };
    }

    return query;
  }
}

module.exports = new ExpenseService();
