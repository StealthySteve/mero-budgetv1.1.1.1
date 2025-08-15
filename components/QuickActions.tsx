'use client';

import { useState } from 'react';
import Link from 'next/link';

const QuickActions = () => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'add-expense',
      title: 'Add Expense',
      description: 'Quick expense entry',
      icon: '💳',
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      borderColor: 'border-red-200/50 dark:border-red-600/50',
      onClick: () => document.getElementById('text')?.focus(),
    },
    {
      id: 'add-income',
      title: 'Add Income',
      description: 'Record new income',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200/50 dark:border-green-600/50',
      onClick: () => {
        const typeButtons = document.querySelectorAll('button[type="button"]');
        const incomeButton = Array.from(typeButtons).find(btn => 
          btn.textContent?.includes('Income')
        ) as HTMLButtonElement;
        incomeButton?.click();
        setTimeout(() => document.getElementById('text')?.focus(), 100);
      },
    },
    {
      id: 'view-stats',
      title: 'View Analytics',
      description: 'Financial insights',
      icon: '📊',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      borderColor: 'border-emerald-200/50 dark:border-emerald-600/50',
      onClick: () => {
        const statsSection = document.querySelector('[data-section="stats"]');
        statsSection?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>⚡</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            Quick Actions
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Fast access to common tasks
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`group relative overflow-hidden bg-gradient-to-br ${action.bgColor} rounded-xl p-4 border ${action.borderColor} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-95`}
          >
            <div className='relative z-10'>
              <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center shadow-lg mb-3 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                <span className='text-white text-lg'>{action.icon}</span>
              </div>
              <h4 className='font-bold text-gray-900 dark:text-gray-100 text-sm mb-1 text-center'>
                {action.title}
              </h4>
              <p className='text-xs text-gray-600 dark:text-gray-400 text-center'>
                {action.description}
              </p>
            </div>
            
            {/* Hover effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200 rounded-xl`}></div>
            
            {/* Active indicator */}
            {hoveredAction === action.id && (
              <div className='absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse'></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;