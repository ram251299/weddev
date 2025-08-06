import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  CalendarIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    notes: ''
  });

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education',
    'Personal Care', 'Home & Garden', 'Gifts & Donations', 'Other'
  ];

  const categoryColors = {
    'Food & Dining': 'border-red-400 bg-red-50',
    'Transportation': 'border-blue-400 bg-blue-50',
    'Shopping': 'border-purple-400 bg-purple-50',
    'Entertainment': 'border-pink-400 bg-pink-50',
    'Bills & Utilities': 'border-yellow-400 bg-yellow-50',
    'Healthcare': 'border-green-400 bg-green-50',
    'Travel': 'border-indigo-400 bg-indigo-50',
    'Education': 'border-teal-400 bg-teal-50',
    'Personal Care': 'border-orange-400 bg-orange-50',
    'Home & Garden': 'border-lime-400 bg-lime-50',
    'Gifts & Donations': 'border-rose-400 bg-rose-50',
    'Other': 'border-gray-400 bg-gray-50'
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await apiService.getExpenses();
      setExpenses(response.data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await apiService.createExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        notes: formData.notes || null
      });
      
      toast.success('Expense added successfully! 🎉');
      setFormData({ amount: '', category: '', description: '', notes: '' });
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await apiService.deleteExpense(expenseId);
        toast.success('Expense deleted successfully');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Track your expenses with detailed notes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5" />
          Add Expense
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="input-field pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <div className="relative">
                  <TagIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field pl-10"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field"
                placeholder="What did you spend on?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Notes
              </label>
              <div className="relative">
                <ChatBubbleLeftIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field pl-10 h-24 resize-none"
                  placeholder="Add any personal notes, thoughts, or reminders about this expense..."
                  rows={3}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: Add notes like "Could have cooked at home" or "Necessary expense" to help you reflect on your spending
              </p>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Expense
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No expenses yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your expenses to get insights into your spending habits</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Expense
            </button>
          </div>
        ) : (
          expenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`expense-card ${categoryColors[expense.category] || categoryColors['Other']}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{expense.description}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-800">
                        ${expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete expense"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <TagIcon className="h-4 w-4" />
                      <span>{expense.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {expense.notes && (
                    <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start space-x-2">
                        <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Personal Notes:</p>
                          <p className="text-sm text-gray-600">{expense.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {expenses.length > 0 && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Quick Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  ${expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success-600">{expenses.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning-600">
                  ${(expenses.reduce((total, expense) => total + expense.amount, 0) / expenses.length).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Average per Transaction</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;