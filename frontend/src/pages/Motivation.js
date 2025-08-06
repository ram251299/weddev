import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  SparklesIcon, 
  LightBulbIcon, 
  TrophyIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Motivation = () => {
  const [motivation, setMotivation] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  const achievementQuotes = [
    "Every dollar saved is a step towards financial freedom! 💪",
    "You're building your future, one expense at a time! 🏗️",
    "Financial awareness is the first step to financial success! 🎯",
    "Your commitment to budgeting shows real maturity! 🌟",
    "Small steps today, giant leaps tomorrow! 🚀"
  ];

  const financialWisdom = [
    {
      quote: "It's not how much money you make, but how much money you keep.",
      author: "Robert Kiyosaki",
      icon: "💰"
    },
    {
      quote: "Do not save what is left after spending, but spend what is left after saving.",
      author: "Warren Buffett",
      icon: "🏦"
    },
    {
      quote: "The real measure of your wealth is how much you'd be worth if you lost all your money.",
      author: "Anonymous",
      icon: "📊"
    },
    {
      quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
      author: "Dave Ramsey",
      icon: "☮️"
    }
  ];

  const encouragingMessages = [
    {
      title: "You're Doing Amazing! 🌟",
      message: "The fact that you're here tracking your expenses shows you're serious about your financial future. Keep it up!",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Every Journey Starts With One Step 👣",
      message: "Remember, even the smallest effort towards better financial habits can lead to huge changes over time.",
      color: "from-green-400 to-green-600"
    },
    {
      title: "Progress Over Perfection 📈",
      message: "You don't have to be perfect with your budget. What matters is that you're being mindful and making progress.",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Your Future Self Will Thank You 🙏",
      message: "Every smart financial decision you make today is an investment in your future happiness and security.",
      color: "from-pink-400 to-pink-600"
    }
  ];

  useEffect(() => {
    const fetchMotivationData = async () => {
      try {
        const [motivationRes, recommendationsRes] = await Promise.all([
          apiService.getMotivation(),
          apiService.getRecommendations()
        ]);
        
        setMotivation(motivationRes.data);
        setRecommendations(recommendationsRes.data);
      } catch (error) {
        toast.error('Failed to load motivation data');
      } finally {
        setLoading(false);
      }
    };

    fetchMotivationData();
  }, []);

  const refreshMotivation = async () => {
    try {
      const response = await apiService.getMotivation();
      setMotivation(response.data);
      toast.success('New motivation loaded! 🌟');
    } catch (error) {
      toast.error('Failed to load new motivation');
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <HeartIcon className="h-10 w-10 mr-3 animate-bounce-light" />
            <h1 className="text-4xl font-bold">Stay Motivated!</h1>
            <HeartIcon className="h-10 w-10 ml-3 animate-bounce-light" />
          </div>
          <p className="text-xl opacity-90">
            Your journey to financial wellness deserves celebration
          </p>
        </div>
      </motion.div>

      {/* Daily Motivation */}
      {motivation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-yellow-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Today's Motivation</h2>
              <SparklesIcon className="h-8 w-8 text-yellow-600 ml-2" />
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-lg text-gray-700 font-medium mb-2">{motivation.message}</p>
                <p className="text-sm text-gray-600">{motivation.encouragement}</p>
              </div>
              
              <button 
                onClick={refreshMotivation}
                className="btn-primary mx-auto"
              >
                <FireIcon className="h-5 w-5" />
                Get New Motivation
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievement Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
      >
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrophyIcon className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Achievement Unlocked!</h3>
          <p className="text-gray-700 mb-4">
            {motivation?.achievement || achievementQuotes[Math.floor(Math.random() * achievementQuotes.length)]}
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Encouraging Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {encouragingMessages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`card bg-gradient-to-r ${message.color} text-white`}
          >
            <h3 className="text-xl font-bold mb-3">{message.title}</h3>
            <p className="opacity-90">{message.message}</p>
          </motion.div>
        ))}
      </div>

      {/* Financial Wisdom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          💎 Wisdom from Financial Experts
        </h3>
        <div className="space-y-4">
          {financialWisdom.map((wisdom, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{wisdom.icon}</span>
                <div>
                  <p className="text-gray-700 italic mb-2">"{wisdom.quote}"</p>
                  <p className="text-sm text-gray-600 font-medium">— {wisdom.author}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Financial Tips Section */}
      {motivation?.daily_tip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <LightBulbIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Today's Financial Tip</h3>
              <p className="text-gray-700">{motivation.daily_tip}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Personalized Recommendations */}
      {recommendations && recommendations.recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🎯 Your Personalized Action Plan
          </h3>
          <div className="space-y-3">
            {recommendations.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-400"
              >
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-100 text-purple-600 text-sm font-medium px-2 py-1 rounded">
                    Step {index + 1}
                  </span>
                  <p className="text-gray-700">{rec}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="text-center card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Take Action? 🚀</h3>
        <p className="text-gray-600 mb-6">
          You've got the motivation, now let's put it into practice!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/expenses" className="btn-primary">
            Track New Expense
          </a>
          <a href="/budget" className="btn-secondary">
            Set a Budget
          </a>
          <a href="/goals" className="btn-secondary">
            Create a Goal
          </a>
        </div>
      </motion.div>

      {/* Affirmations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="card bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          ❤️ Daily Affirmations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-700">✨ I am in control of my financial future</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-700">💪 I make smart money decisions</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-700">🌱 My wealth grows with every good choice</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-700">🎯 I am committed to my financial goals</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-700">🏆 I celebrate every financial milestone</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-gray-700">🚀 I am building a better tomorrow today</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Motivation;