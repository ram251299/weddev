import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, CurrencyDollarIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7), // Current month in YYYY-MM format
    year: new Date().getFullYear()
  });

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education',
    'Personal Care', 'Home & Garden', 'Gifts & Donations', 'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, analyticsRes] = await Promise.all([
        apiService.getBudgets(),
        apiService.getSpendingAnalytics()
      ]);
      
      setBudgets(budgetsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.month) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await apiService.createBudget({
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: formData.month,
        year: parseInt(formData.month.split('-')[0])
      });
      
      toast.success('Budget set successfully! 🎯');
      setFormData({
        category: '',
        amount: '',
        month: new Date().toISOString().slice(0, 7),
        year: new Date().getFullYear()
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to set budget');
    }
  };

  const getBudgetStatus = (budget) => {
    const categorySpent = analytics?.category_breakdown?.[budget.category] || 0;
    const percentage = (categorySpent / budget.amount) * 100;
    
    if (percentage <= 70) return { status: 'good', color: 'bg-green-500', textColor: 'text-green-700' };
    if (percentage <= 90) return { status: 'warning', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'danger', color: 'bg-red-500', textColor: 'text-red-700' };
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
          <h1 className="text-3xl font-bold text-gray-800">💰 Budget Manager</h1>
          <p className="text-gray-600 mt-1">Set budgets and track your spending goals</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5" />
          Set Budget
        </button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Set New Budget</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Set Budget
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

      {/* Budget Overview */}
      {budgets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">📊 Your Budgets</h2>
          {budgets.map((budget) => {
            const categorySpent = analytics?.category_breakdown?.[budget.category] || 0;
            const percentage = Math.min((categorySpent / budget.amount) * 100, 100);
            const remaining = Math.max(budget.amount - categorySpent, 0);
            const statusInfo = getBudgetStatus(budget);

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{budget.category}</h3>
                    <p className="text-sm text-gray-600">{budget.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">${budget.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Budget</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Spent: ${categorySpent.toFixed(2)}</span>
                      <span className={statusInfo.textColor}>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${statusInfo.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-gray-800">${categorySpent.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">Spent</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-primary-600">${remaining.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">Remaining</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className={`text-lg font-bold ${statusInfo.textColor}`}>
                        {statusInfo.status === 'good' ? '✅ On Track' : 
                         statusInfo.status === 'warning' ? '⚠️ Close' : '🚨 Over Budget'}
                      </p>
                      <p className="text-xs text-gray-600">Status</p>
                    </div>
                  </div>

                  {/* Budget Advice */}
                  {percentage > 80 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        {percentage > 100 
                          ? `💡 You've exceeded your ${budget.category} budget by $${(categorySpent - budget.amount).toFixed(2)}. Consider adjusting your spending or increasing the budget for next month.`
                          : `💡 You're approaching your ${budget.category} budget limit. You have $${remaining.toFixed(2)} left for this month.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* No Budgets State */}
      {budgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <CurrencyDollarIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Budgets Set</h3>
          <p className="text-gray-500 mb-6">Start managing your finances by setting budgets for different categories</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5" />
            Set Your First Budget
          </button>
        </motion.div>
      )}

      {/* Budget Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Budget Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">🎯 Setting Realistic Budgets</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Review your past spending patterns</li>
              <li>• Start with slightly higher amounts and adjust</li>
              <li>• Include a buffer for unexpected expenses</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">📊 Staying on Track</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your budget progress weekly</li>
              <li>• Adjust spending habits when approaching limits</li>
              <li>• Celebrate when you stay under budget</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Budget;