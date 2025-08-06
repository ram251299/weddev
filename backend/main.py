from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List
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
    created_at = Column(DateTime, default=datetime.utcnow)

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)

class FinancialGoal(Base):
    __tablename__ = "financial_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class ExpenseCreate(BaseModel):
    amount: float
    category: str
    description: str
    notes: Optional[str] = None

class ExpenseResponse(BaseModel):
    id: int
    amount: float
    category: str
    description: str
    notes: Optional[str]
    date: datetime
    
    class Config:
        from_attributes = True

class BudgetCreate(BaseModel):
    category: str
    amount: float
    month: str
    year: int

class FinancialGoalCreate(BaseModel):
    title: str
    target_amount: float
    deadline: Optional[datetime] = None

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

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Motivational messages
MOTIVATIONAL_MESSAGES = [
    "You're doing great! Every small step towards financial freedom counts! 💪",
    "Remember, budgeting is self-care for your future self! 🌟",
    "You've got this! Financial discipline today means freedom tomorrow! 🚀",
    "Stay strong! Your future self will thank you for these smart choices! 💎",
    "Progress, not perfection! Every expense tracked is a win! 🏆",
    "You're building wealth one smart decision at a time! 📈",
    "Believe in yourself! Your financial goals are within reach! ✨",
    "Every penny saved is a step closer to your dreams! 🌈"
]

FINANCIAL_TIPS = [
    "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    "Cook at home more often - it can save you hundreds per month!",
    "Use the 24-hour rule for non-essential purchases",
    "Track your expenses daily to stay mindful of spending",
    "Set up automatic transfers to your savings account",
    "Compare prices before making any purchase over $50",
    "Cancel unused subscriptions - they add up quickly!",
    "Use cash for discretionary spending to avoid overspending"
]

# API Endpoints
@app.get("/")
async def welcome():
    return {
        "message": "Welcome to your Personal Budget Tracker! 🌟",
        "motivation": random.choice(MOTIVATIONAL_MESSAGES),
        "tip": random.choice(FINANCIAL_TIPS),
        "features": [
            "Track expenses with custom notes",
            "Set and monitor budgets",
            "Get personalized financial advice",
            "View spending analytics",
            "Set financial goals",
            "Receive motivational support"
        ]
    }

@app.post("/expenses/", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses/", response_model=List[ExpenseResponse])
async def get_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    expenses = db.query(Expense).order_by(Expense.date.desc()).offset(skip).limit(limit).all()
    return expenses

@app.get("/expenses/category/{category}")
async def get_expenses_by_category(category: str, db: Session = Depends(get_db)):
    expenses = db.query(Expense).filter(Expense.category == category).all()
    total = sum(expense.amount for expense in expenses)
    return {"category": category, "expenses": expenses, "total": total}

@app.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@app.post("/budgets/")
async def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)):
    db_budget = Budget(**budget.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@app.get("/budgets/")
async def get_budgets(db: Session = Depends(get_db)):
    budgets = db.query(Budget).all()
    return budgets

@app.get("/analytics/spending")
async def get_spending_analytics(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    
    # Category breakdown
    category_totals = {}
    for expense in expenses:
        if expense.category in category_totals:
            category_totals[expense.category] += expense.amount
        else:
            category_totals[expense.category] = expense.amount
    
    # Monthly spending
    monthly_spending = {}
    for expense in expenses:
        month_key = expense.date.strftime("%Y-%m")
        if month_key in monthly_spending:
            monthly_spending[month_key] += expense.amount
        else:
            monthly_spending[month_key] = expense.amount
    
    total_expenses = sum(expense.amount for expense in expenses)
    
    return {
        "total_expenses": total_expenses,
        "category_breakdown": category_totals,
        "monthly_spending": monthly_spending,
        "expense_count": len(expenses)
    }

@app.get("/recommendations")
async def get_recommendations(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    
    if not expenses:
        return {
            "message": "Start tracking expenses to get personalized recommendations!",
            "tips": FINANCIAL_TIPS[:3]
        }
    
    # Analyze spending patterns
    category_totals = {}
    for expense in expenses:
        if expense.category in category_totals:
            category_totals[expense.category] += expense.amount
        else:
            category_totals[expense.category] = expense.amount
    
    highest_category = max(category_totals, key=category_totals.get) if category_totals else None
    total_spent = sum(category_totals.values())
    
    recommendations = []
    
    if highest_category:
        recommendations.append(f"Your highest spending category is '{highest_category}' (${category_totals[highest_category]:.2f}). Consider reviewing these expenses.")
    
    if "Food" in category_totals or "Dining" in category_totals:
        food_total = category_totals.get("Food", 0) + category_totals.get("Dining", 0)
        if food_total > total_spent * 0.3:
            recommendations.append("Consider meal planning and cooking at home to reduce food expenses.")
    
    if "Entertainment" in category_totals and category_totals["Entertainment"] > total_spent * 0.2:
        recommendations.append("Look for free entertainment options like parks, libraries, and community events.")
    
    if len(recommendations) == 0:
        recommendations.append("Great job managing your expenses! Keep tracking to maintain awareness.")
    
    return {
        "recommendations": recommendations,
        "motivation": random.choice(MOTIVATIONAL_MESSAGES),
        "financial_tip": random.choice(FINANCIAL_TIPS)
    }

@app.get("/motivation")
async def get_motivation():
    return {
        "message": random.choice(MOTIVATIONAL_MESSAGES),
        "daily_tip": random.choice(FINANCIAL_TIPS),
        "achievement": "🌟 You checked your budget today - that's a win!",
        "encouragement": "Remember: Financial wellness is a journey, not a destination. You're making progress!"
    }

@app.post("/goals/")
async def create_financial_goal(goal: FinancialGoalCreate, db: Session = Depends(get_db)):
    db_goal = FinancialGoal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.get("/goals/")
async def get_financial_goals(db: Session = Depends(get_db)):
    goals = db.query(FinancialGoal).all()
    return goals

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)