import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  TrendingUpIcon, 
  HeartIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [welcomeData, setWelcomeData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [welcomeRes, analyticsRes, motivationRes] = await Promise.all([
          apiService.getWelcome(),
          apiService.getSpendingAnalytics(),
          apiService.getMotivation()
        ]);
        
        setWelcomeData(welcomeRes.data);
        setAnalytics(analyticsRes.data);
        setMotivation(motivationRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 mr-2 animate-bounce-light" />
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <SparklesIcon className="h-8 w-8 ml-2 animate-bounce-light" />
          </div>
          <p className="text-xl mb-4">{welcomeData?.message}</p>
          {motivation && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-2">
                <HeartIcon className="h-5 w-5 mr-2" />
                <span className="font-semibold">Daily Motivation</span>
              </div>
              <p className="text-lg">{motivation.message}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">${analytics?.total_expenses?.toFixed(2) || '0.00'}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-white/80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Categories Tracked</p>
              <p className="text-2xl font-bold">{Object.keys(analytics?.category_breakdown || {}).length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-white/80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold">{analytics?.expense_count || 0}</p>
            </div>
            <TrendingUpIcon className="h-8 w-8 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Financial Tip of the Day */}
      {welcomeData?.tip && (
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-start space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <LightBulbIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Financial Tip of the Day</h3>
              <p className="text-gray-600">{welcomeData.tip}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Overview */}
      <motion.div variants={itemVariants} className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🌟 Your Financial Journey Starts Here</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {welcomeData?.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Motivation Section */}
      {motivation && (
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Stay Motivated</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-700 font-medium">{motivation.achievement}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">{motivation.encouragement}</p>
              </div>
              {motivation.daily_tip && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-primary-700 font-medium">Today's Tip: {motivation.daily_tip}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;