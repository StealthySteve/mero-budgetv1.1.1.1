'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the type for a record
interface Record {
  date: string; // ISO date string
  amount: number; // Amount spent
  category: string; // Expense category
  type: string; // Record type: 'expense' or 'income'
}

const BarChart = ({ records }: { records: Record[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop width

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  // Aggregate expenses by date
  const aggregateByDate = (records: Record[]) => {
    const dateMap = new Map<
      string,
      { 
        totalExpense: number; 
        totalIncome: number; 
        categories: string[]; 
        originalDate: string 
      }
    >();

    records.forEach((record) => {
      // Parse the date string properly and extract just the date part (YYYY-MM-DD)
      const dateObj = new Date(record.date);
      // Use UTC methods to avoid timezone issues
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const existing = dateMap.get(dateKey);

      if (existing) {
        if (record.type === 'expense') {
          existing.totalExpense += record.amount;
        } else {
          existing.totalIncome += record.amount;
        }
        if (!existing.categories.includes(record.category)) {
          existing.categories.push(record.category);
        }
      } else {
        dateMap.set(dateKey, {
          totalExpense: record.type === 'expense' ? record.amount : 0,
          totalIncome: record.type === 'income' ? record.amount : 0,
          categories: [record.category],
          originalDate: record.date, // Keep original ISO date for sorting
        });
      }
    });

    // Convert to array and sort by date (oldest to newest)
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        totalExpense: data.totalExpense,
        totalIncome: data.totalIncome,
        categories: data.categories,
        originalDate: data.originalDate,
      }))
      .sort(
        (a, b) =>
          new Date(a.originalDate).getTime() -
          new Date(b.originalDate).getTime()
      );
  };

  const aggregatedData = aggregateByDate(records);

  // Prepare data for the chart
  const data = {
    labels: aggregatedData.map((item) => {
      // Format date as MM/DD for better readability
      const [, month, day] = item.date.split('-');
      return `${month}/${day}`;
    }),
    datasets: [
      {
        label: 'Expenses',
        data: aggregatedData.map((item) => item.totalExpense),
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
        borderColor: isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Income',
        data: aggregatedData.map((item) => item.totalIncome),
        backgroundColor: isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
        borderColor: isDark ? 'rgba(34, 197, 94, 0.9)' : 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow flexible height
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: isMobile ? 10 : 12,
            weight: '500' as const,
          },
          color: isDark ? '#d1d5db' : '#374151',
          usePointStyle: true,
          pointStyle: 'rectRounded',
          padding: 15,
        },
      },
      title: {
        display: false, // Remove chart title
      },
      tooltip: {
        backgroundColor: isDark
          ? 'rgba(31, 41, 55, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f9fafb' : '#1f2937',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        titleFont: {
          size: isMobile ? 12 : 14,
          weight: '600' as const,
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        padding: 12,
        callbacks: {
          label: function (context: { dataIndex: number; datasetIndex: number; parsed: { y: number } }) {
            const dataIndex = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            const item = aggregatedData[dataIndex];
            const type = datasetIndex === 0 ? 'Expense' : 'Income';
            const amount = datasetIndex === 0 ? item.totalExpense : item.totalIncome;
            
            return [
              `${type}: Rs.${amount.toFixed(2)}`,
              `Categories: ${item.categories.join(', ')}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: isMobile ? 12 : 14,
            weight: 'bold' as const,
          },
          color: isDark ? '#d1d5db' : '#2c3e50',
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          color: isDark ? '#9ca3af' : '#7f8c8d', // Gray x-axis labels
          maxRotation: isMobile ? 45 : 0, // Rotate labels on mobile
          minRotation: isMobile ? 45 : 0,
        },
        grid: {
          display: true,
          color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)',
          drawOnChartArea: true,
          drawTicks: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (Rs.)',
          font: {
            size: isMobile ? 12 : 16, // Smaller font on mobile
            weight: 'bold' as const,
          },
          color: isDark ? '#d1d5db' : '#2c3e50',
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12, // Smaller font on mobile
          },
          color: isDark ? '#9ca3af' : '#7f8c8d', // Gray y-axis labels
          callback: function (value: string | number) {
            return 'Rs.' + value; // Add Rs. sign to y-axis labels
          },
        },
        grid: {
          color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)',
          drawOnChartArea: true,
          drawTicks: false,
        },
        beginAtZero: true, // Start y-axis at zero for expenses
      },
    },
  };

  return (
    <div className='relative w-full h-64 sm:h-72 md:h-80 lg:h-96'>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
