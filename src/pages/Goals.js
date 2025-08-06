import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, TrophyIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await apiService.getGoals();
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.target_amount) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await apiService.createGoal({
        title: formData.title,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline || null
      });
      
      toast.success('Goal created successfully! 🎯');
      setFormData({ title: '', target_amount: '', deadline: '' });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const getGoalProgress = (goal) => {
    return (goal.current_amount / goal.target_amount) * 100;
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          <h1 className="text-3xl font-bold text-gray-800">🎯 Financial Goals</h1>
          <p className="text-gray-600 mt-1">Set and track your financial milestones</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5" />
          Add Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field"
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                    className="input-field pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date (Optional)
                </label>
                <div className="relative">
                  <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Goal
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

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <TrophyIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Goals Set</h3>
            <p className="text-gray-500 mb-6">Create financial goals to stay motivated and track your progress</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Set Your First Goal
            </button>
          </motion.div>
        ) : (
          goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <TrophyIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-600">
                        Created {format(new Date(goal.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      ${goal.target_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Target</p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Progress: ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                      </span>
                      <span className="text-primary-600 font-medium">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-success-600">
                        ${goal.current_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">Saved</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-warning-600">
                        ${(goal.target_amount - goal.current_amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">Remaining</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-primary-600">
                        {daysRemaining !== null ? 
                          (daysRemaining > 0 ? `${daysRemaining}d` : 'Overdue') : 
                          'No deadline'
                        }
                      </p>
                      <p className="text-xs text-gray-600">
                        {daysRemaining !== null ? 'Days left' : 'Timeline'}
                      </p>
                    </div>
                  </div>

                  {/* Deadline Info */}
                  {goal.deadline && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">
                          Target Date: {format(new Date(goal.deadline), 'MMMM dd, yyyy')}
                        </span>
                        {daysRemaining !== null && (
                          <span className={`text-sm font-medium ${
                            daysRemaining > 30 ? 'text-green-600' :
                            daysRemaining > 7 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {daysRemaining > 0 ? 
                              `${daysRemaining} days remaining` : 
                              `${Math.abs(daysRemaining)} days overdue`
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Achievement Status */}
                  {progress >= 100 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🎉</div>
                        <h4 className="text-lg font-bold text-green-800 mb-1">
                          Congratulations!
                        </h4>
                        <p className="text-sm text-green-700">
                          You've achieved your goal! Time to celebrate this financial milestone!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress Encouragement */}
                  {progress < 100 && progress >= 50 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 text-center">
                        🌟 You're halfway there! Keep up the great work!
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Goal Setting Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Goal Setting Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">💡 SMART Goals</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Specific:</strong> Be clear about what you want</li>
              <li>• <strong>Measurable:</strong> Set a specific amount</li>
              <li>• <strong>Achievable:</strong> Make it realistic</li>
              <li>• <strong>Relevant:</strong> Align with your priorities</li>
              <li>• <strong>Time-bound:</strong> Set a deadline</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">🚀 Success Strategies</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Break large goals into smaller milestones</li>
              <li>• Automate savings when possible</li>
              <li>• Review and adjust regularly</li>
              <li>• Celebrate small wins along the way</li>
              <li>• Find an accountability partner</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Goals;