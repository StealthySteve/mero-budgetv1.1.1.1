'use client';

import { useState, useEffect } from 'react';
import getRecords from '@/app/actions/getRecords';
import { Record } from '@/types/Record';

const FinancialOverview = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const balance = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3'></div>
          <div className='grid grid-cols-3 gap-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-20 bg-gray-200 dark:bg-gray-600 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>💰</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            Financial Overview
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Your complete financial summary
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
        {/* Total Income */}
        <div className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 sm:p-4 border border-green-200/50 dark:border-green-600/50'>
          <div className='text-center'>
            <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2'>
              <span className='text-white text-sm'>↗️</span>
            </div>
            <p className='text-xs font-medium text-green-600 dark:text-green-300 mb-1 tracking-wide uppercase'>
              Total Income
            </p>
            <div className='text-lg sm:text-xl font-bold text-green-700 dark:text-green-300'>
              Rs. {totalIncome.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className='bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-3 sm:p-4 border border-red-200/50 dark:border-red-600/50'>
          <div className='text-center'>
            <div className='w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2'>
              <span className='text-white text-sm'>↘️</span>
            </div>
            <p className='text-xs font-medium text-red-600 dark:text-red-300 mb-1 tracking-wide uppercase'>
              Total Expenses
            </p>
            <div className='text-lg sm:text-xl font-bold text-red-700 dark:text-red-300'>
              Rs. {totalExpenses.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className={`bg-gradient-to-br ${
          balance >= 0 
            ? 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-600/50' 
            : 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-600/50'
        } rounded-xl p-3 sm:p-4 border`}>
          <div className='text-center'>
            <div className={`w-8 h-8 ${
              balance >= 0 ? 'bg-emerald-500' : 'bg-orange-500'
            } rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <span className='text-white text-sm'>{balance >= 0 ? '💚' : '⚠️'}</span>
            </div>
            <p className={`text-xs font-medium ${
              balance >= 0 
                ? 'text-emerald-600 dark:text-emerald-300' 
                : 'text-orange-600 dark:text-orange-300'
            } mb-1 tracking-wide uppercase`}>
              Net Balance
            </p>
            <div className={`text-lg sm:text-xl font-bold ${
              balance >= 0 
                ? 'text-emerald-700 dark:text-emerald-300' 
                : 'text-orange-700 dark:text-orange-300'
            }`}>
              Rs. {balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;