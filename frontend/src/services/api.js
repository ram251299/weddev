import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const apiService = {
  // Welcome and general info
  getWelcome: () => api.get('/'),
  
  // Expenses
  createExpense: (expense) => api.post('/expenses/', expense),
  getExpenses: (skip = 0, limit = 100) => api.get(`/expenses/?skip=${skip}&limit=${limit}`),
  getExpensesByCategory: (category) => api.get(`/expenses/category/${category}`),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
  
  // Budgets
  createBudget: (budget) => api.post('/budgets/', budget),
  getBudgets: () => api.get('/budgets/'),
  
  // Analytics
  getSpendingAnalytics: () => api.get('/analytics/spending'),
  
  // Recommendations
  getRecommendations: () => api.get('/recommendations'),
  
  // Motivation
  getMotivation: () => api.get('/motivation'),
  
  // Goals
  createGoal: (goal) => api.post('/goals/', goal),
  getGoals: () => api.get('/goals/'),
};

export default apiService;