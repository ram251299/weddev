# 💰 Budget Tracker - Your Personal Finance Companion

A comprehensive budget tracking application with modern features designed to help you manage your finances, stay motivated, and achieve your financial goals.

## ✨ Features

### 🏠 Dashboard
- **Personalized Welcome Message** with daily motivation
- **Quick Stats Overview** showing total expenses, categories, and transactions
- **Financial Tip of the Day** to help improve your financial habits
- **Real-time Analytics** with visual charts and breakdowns

### 💳 Expense Tracking
- **Add Expenses** with detailed information (amount, category, description)
- **Custom Notes** for each expense to track thoughts and reflections
- **Categorized Tracking** with 12+ predefined categories
- **Visual Expense Cards** with color-coded categories
- **Delete/Edit** functionality for expense management

### 📊 Budget Management
- **Set Monthly Budgets** by category
- **Real-time Progress Tracking** with visual progress bars
- **Budget Status Indicators** (On Track, Warning, Over Budget)
- **Smart Recommendations** when approaching budget limits
- **Budget vs. Actual Spending** comparisons

### 📈 Analytics & Insights
- **Spending Analytics** with pie charts and bar graphs
- **Category Breakdown** showing where your money goes
- **Monthly Spending Trends** to identify patterns
- **Personalized Recommendations** based on spending habits
- **Financial Health Assessment**

### 🎯 Goal Setting
- **Financial Goals** with target amounts and deadlines
- **Progress Tracking** with visual progress bars
- **Goal Milestones** and achievement celebrations
- **SMART Goal Framework** guidance
- **Success Strategies** and tips

### 💪 Motivation System
- **Daily Motivational Messages** to keep you inspired
- **Achievement Badges** for financial milestones
- **Financial Wisdom** from experts like Warren Buffett
- **Daily Affirmations** for positive mindset
- **Encouraging Messages** when you're feeling low
- **Personalized Action Plans** for improvement

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Composable charting library
- **React Hot Toast** - Beautiful notifications
- **Heroicons** - Beautiful hand-crafted SVG icons

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd budget-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend (http://localhost:8000) and frontend (http://localhost:3000) simultaneously.

### Manual Setup

If you prefer to run the services separately:

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📱 Usage

### Getting Started
1. **Welcome Dashboard** - View your financial overview and daily motivation
2. **Add Your First Expense** - Start tracking with detailed notes
3. **Set Monthly Budgets** - Create realistic spending limits
4. **Create Financial Goals** - Set targets for savings or purchases
5. **Stay Motivated** - Visit the motivation page when you need encouragement

### Best Practices
- **Track Daily** - Add expenses as they happen for better accuracy
- **Use Notes** - Add personal reflections to understand spending patterns
- **Review Weekly** - Check your progress and adjust habits
- **Set Realistic Budgets** - Start conservative and adjust as needed
- **Celebrate Wins** - Acknowledge when you stay within budget

## 🎨 Screenshots

The application features a modern, responsive design with:
- **Gradient backgrounds** and smooth animations
- **Color-coded categories** for easy expense identification
- **Interactive charts** for data visualization
- **Mobile-friendly** responsive design
- **Dark mode support** (coming soon)

## 🔧 API Endpoints

### Expenses
- `POST /expenses/` - Create new expense
- `GET /expenses/` - Get all expenses
- `GET /expenses/category/{category}` - Get expenses by category
- `DELETE /expenses/{id}` - Delete expense

### Budgets
- `POST /budgets/` - Create budget
- `GET /budgets/` - Get all budgets

### Analytics
- `GET /analytics/spending` - Get spending analytics
- `GET /recommendations` - Get personalized recommendations

### Motivation
- `GET /motivation` - Get daily motivation
- `GET /` - Get welcome message with tips

### Goals
- `POST /goals/` - Create financial goal
- `GET /goals/` - Get all goals

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Future Features

- **Income Tracking** - Track multiple income sources
- **Investment Portfolio** - Monitor investments and returns
- **Bill Reminders** - Get notified about upcoming bills
- **Export Data** - Download your data in various formats
- **Mobile App** - Native iOS and Android applications
- **Multi-currency Support** - Support for different currencies
- **Family Sharing** - Share budgets with family members

## 🏆 Motivation Philosophy

This app is built on the belief that financial wellness is not just about numbers - it's about building healthy habits, staying motivated, and celebrating progress. Every feature is designed to:

- **Encourage** rather than judge
- **Educate** through tips and insights
- **Empower** with actionable recommendations
- **Celebrate** every financial milestone

Remember: Financial wellness is a journey, not a destination. Every small step counts! 🌟

---

*Built with ❤️ for better financial health*
