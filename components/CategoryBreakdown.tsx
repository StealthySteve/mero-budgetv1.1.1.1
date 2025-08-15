'use client';

import { useState, useEffect } from 'react';
import getRecords from '@/app/actions/getRecords';
import { Record } from '@/types/Record';

const CategoryBreakdown = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    const fetchRecords = async () => {
      const { records: fetchedRecords } = await getRecords();
      if (fetchedRecords) {
        setRecords(fetchedRecords);
      }
      setIsLoading(false);
    };
    fetchRecords();
  }, []);

  const getCategoryData = (type: 'expense' | 'income') => {
    const filteredRecords = records.filter(r => r.type === type);
    const categoryTotals = filteredRecords.reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getCategoryEmoji = (category: string, type: string) => {
    if (type === 'income') {
      const incomeEmojis: Record<string, string> = {
        'Salary': '💼', 'Freelance': '💻', 'Business': '🏢', 
        'Investment': '📈', 'Gift': '🎁', 'Other': '💰'
      };
      return incomeEmojis[category] || '💰';
    }
    const expenseEmojis: Record<string, string> = {
      'Food': '🍔', 'Transportation': '🚗', 'Shopping': '🛒',
      'Entertainment': '🎬', 'Bills': '💡', 'Healthcare': '🏥', 'Other': '📦'
    };
    return expenseEmojis[category] || '📦';
  };

  if (isLoading) {
    return (
      <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/2'></div>
          <div className='space-y-3'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-12 bg-gray-200 dark:bg-gray-600 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryData = getCategoryData(activeTab);
  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>📊</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            Category Breakdown
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Spending by category
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className='flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-4'>
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'expense'
              ? 'bg-red-500 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'income'
              ? 'bg-green-500 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-green-500'
          }`}
        >
          Income
        </button>
      </div>

      {/* Category List */}
      <div className='space-y-3'>
        {categoryData.length === 0 ? (
          <div className='text-center py-8'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>📈</span>
            </div>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              No {activeTab} records found
            </p>
          </div>
        ) : (
          categoryData.map(({ category, amount }) => {
            const percentage = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={category} className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg'>{getCategoryEmoji(category, activeTab)}</span>
                    <span className='font-medium text-gray-900 dark:text-gray-100 text-sm'>
                      {category}
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className={`font-bold text-sm ${
                      activeTab === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      Rs. {amount.toFixed(2)}
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full ${
                      activeTab === 'income' 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;