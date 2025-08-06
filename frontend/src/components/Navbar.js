import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Expenses', path: '/expenses', icon: CreditCardIcon },
    { name: 'Budget', path: '/budget', icon: CurrencyDollarIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
    { name: 'Goals', path: '/goals', icon: TrophyIcon },
    { name: 'Motivation', path: '/motivation', icon: HeartIcon },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Budget Tracker</h1>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-primary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;