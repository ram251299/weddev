import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBarIcon, LightBulbIcon, TrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, recommendationsRes] = await Promise.all([
          apiService.getSpendingAnalytics(),
          apiService.getRecommendations()
        ]);
        
        setAnalytics(analyticsRes.data);
        setRecommendations(recommendationsRes.data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const categoryData = analytics?.category_breakdown 
    ? Object.entries(analytics.category_breakdown).map(([category, amount]) => ({
        name: category,
        value: amount
      }))
    : [];

  const monthlyData = analytics?.monthly_spending
    ? Object.entries(analytics.monthly_spending).map(([month, amount]) => ({
        month: month,
        amount: amount
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Spending Analytics</h1>
        <p className="text-gray-600">Gain insights into your spending patterns and improve your financial health</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card"
        >
          <div className="text-center">
            <p className="text-white/80 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold">${analytics?.total_expenses?.toFixed(2) || '0.00'}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl p-6 shadow-lg"
        >
          <div className="text-center">
            <p className="text-white/80 text-sm">Categories</p>
            <p className="text-3xl font-bold">{Object.keys(analytics?.category_breakdown || {}).length}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-xl p-6 shadow-lg"
        >
          <div className="text-center">
            <p className="text-white/80 text-sm">Transactions</p>
            <p className="text-3xl font-bold">{analytics?.expense_count || 0}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
        >
          <div className="text-center">
            <p className="text-white/80 text-sm">Avg per Transaction</p>
            <p className="text-3xl font-bold">
              ${analytics?.expense_count > 0 ? (analytics.total_expenses / analytics.expense_count).toFixed(2) : '0.00'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-primary-600" />
              Spending by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Spending Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUpIcon className="h-6 w-6 mr-2 text-primary-600" />
              Monthly Spending Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                <Bar dataKey="amount" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Category Breakdown List */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Detailed Category Breakdown</h3>
          <div className="space-y-3">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .map((category, index) => {
                const percentage = ((category.value / analytics.total_expenses) * 100).toFixed(1);
                return (
                  <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium text-gray-800">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">${category.value.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{percentage}% of total</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* Recommendations Section */}
      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Personalized Recommendations */}
          <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <LightBulbIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Personalized Recommendations</h3>
                <div className="space-y-2">
                  {recommendations.recommendations?.map((rec, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Stay Motivated</h3>
              <p className="text-gray-700 mb-4">{recommendations.motivation}</p>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-primary-700 font-medium">{recommendations.financial_tip}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* No Data State */}
      {categoryData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <ChartBarIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-gray-500 mb-6">Start adding expenses to see your spending analytics and get personalized recommendations</p>
          <a href="/expenses" className="btn-primary">
            Add Your First Expense
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;