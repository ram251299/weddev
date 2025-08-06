# 💻 Code Preview - Budget Tracker

## 🚀 **Main React App (src/App.js)**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Motivation from './pages/Motivation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/motivation" element={<Motivation />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
```

## 🔧 **FastAPI Backend (backend/main.py)**
```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import random

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./budget_tracker.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)

# FastAPI app
app = FastAPI(title="Budget Tracker API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Motivational messages
MOTIVATIONAL_MESSAGES = [
    "You're doing great! Every small step towards financial freedom counts! 💪",
    "Remember, budgeting is self-care for your future self! 🌟",
    "You've got this! Financial discipline today means freedom tomorrow! 🚀"
]

# API Endpoints
@app.get("/")
async def welcome():
    return {
        "message": "Welcome to your Personal Budget Tracker! 🌟",
        "motivation": random.choice(MOTIVATIONAL_MESSAGES),
        "features": [
            "Track expenses with custom notes",
            "Set and monitor budgets",
            "Get personalized financial advice",
            "View spending analytics"
        ]
    }

@app.post("/expenses/")
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense
```

## 💳 **Expense Tracking Component (src/pages/Expenses.js)**
```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create expense with custom notes
    await apiService.createExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      notes: formData.notes || null
    });
    
    toast.success('Expense added successfully! 🎉');
    fetchExpenses();
  };

  return (
    <div className="space-y-6">
      {/* Add Expense Form */}
      {showForm && (
        <motion.div className="card">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Personal Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Add any personal notes about this expense..."
              />
              <p className="text-xs text-gray-500">
                💡 Tip: Add notes like "Could have cooked at home"
              </p>
            </div>
          </form>
        </motion.div>
      )}

      {/* Expenses List */}
      {expenses.map((expense) => (
        <motion.div key={expense.id} className="expense-card">
          <h3>{expense.description}</h3>
          <span>${expense.amount.toFixed(2)}</span>
          
          {expense.notes && (
            <div className="bg-white/70 rounded-lg p-3">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <p>Personal Notes: {expense.notes}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
```

## 📊 **Analytics Dashboard (src/pages/Analytics.js)**
```javascript
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const categoryData = analytics?.category_breakdown 
    ? Object.entries(analytics.category_breakdown).map(([category, amount]) => ({
        name: category,
        value: amount
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="card">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="amount" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50">
        <h3>💡 Personalized Recommendations</h3>
        {recommendations.recommendations?.map((rec, index) => (
          <div key={index} className="bg-white rounded-lg p-3">
            <p>{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 💪 **Motivation System (src/pages/Motivation.js)**
```javascript
const Motivation = () => {
  const [motivation, setMotivation] = useState(null);

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
    }
  ];

  return (
    <div className="space-y-8">
      {/* Daily Motivation */}
      <motion.div className="card bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="text-center">
          <h2>🌟 Today's Motivation</h2>
          <div className="bg-white rounded-lg p-6">
            <p className="text-lg font-medium">{motivation.message}</p>
            <p className="text-sm">{motivation.encouragement}</p>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badge */}
      <motion.div className="card bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full mx-auto mb-4">
            <TrophyIcon className="h-8 w-8 text-green-600" />
          </div>
          <h3>🏆 Daily Achievement Unlocked!</h3>
          <p>{motivation?.achievement}</p>
        </div>
      </motion.div>

      {/* Financial Wisdom */}
      <div className="card">
        <h3>💎 Wisdom from Financial Experts</h3>
        {financialWisdom.map((wisdom, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl">{wisdom.icon}</span>
            <p className="italic">"{wisdom.quote}"</p>
            <p className="font-medium">— {wisdom.author}</p>
          </div>
        ))}
      </div>

      {/* Daily Affirmations */}
      <div className="card bg-gradient-to-r from-rose-50 to-pink-50">
        <h3>❤️ Daily Affirmations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p>✨ I am in control of my financial future</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p>💪 I make smart money decisions</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p>🌱 My wealth grows with every good choice</p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 🎨 **Tailwind CSS Styling (src/index.css)**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-xl shadow-lg p-6 border border-gray-100;
  }
  
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2;
  }
  
  .expense-card {
    @apply bg-white rounded-lg shadow-md p-4 border-l-4 hover:shadow-lg transition-shadow duration-200;
  }
  
  .stat-card {
    @apply bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 shadow-lg;
  }
}
```

## 📦 **Package Dependencies (package.json)**
```json
{
  "name": "budget-tracker-frontend",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.4",
    "recharts": "^2.5.0",
    "tailwindcss": "^3.2.7",
    "@heroicons/react": "^2.0.16",
    "framer-motion": "^10.8.5",
    "react-hot-toast": "^2.4.0",
    "date-fns": "^2.29.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

## 🚀 **Deployment Configuration (vercel.json)**
```json
{
  "name": "budget-tracker",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_API_URL": "https://your-backend.railway.app"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔗 **Links to Share:**

**📍 Repository**: https://github.com/ram251299/weddev
**🚀 Deploy Frontend**: https://vercel.com/new/clone?repository-url=https://github.com/ram251299/weddev
**🔧 Deploy Backend**: https://railway.app/new/template?template=https://github.com/ram251299/weddev

**✨ Features**: Complete budget tracker with expense notes, analytics, motivation, and smart recommendations!