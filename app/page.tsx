import AddNewRecord from '@/components/AddNewRecord';
import AIInsights from '@/components/AIInsights';
import FinancialOverview from '@/components/FinancialOverview';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import QuickActions from '@/components/QuickActions';
import Guest from '@/components/Guest';
import RecordChart from '@/components/RecordChart';
import RecordHistory from '@/components/RecordHistory';
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }
  return (
    <main className='bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300'>
      {/* Mobile-optimized container with responsive padding */}
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8'>
        {/* Welcome Section */}
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6'>
          <div className='relative flex-shrink-0'>
            <img
              src={user.imageUrl}
              alt={`${user.firstName}&#39;s profile`}
              className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white dark:border-gray-600 shadow-lg'
            />
            <div className='absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center'>
              <span className='text-white text-xs'>✓</span>
            </div>
          </div>
          <div className='flex-1 text-center sm:text-left'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 mb-3'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
                <span className='text-white text-sm sm:text-lg'>👋</span>
              </div>
              <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100'>
                Welcome Back, {user.firstName}!
              </h2>
            </div>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto sm:mx-0'>
              Track your income and expenses, get AI insights, and manage your complete financial health efficiently.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mb-6'>
          <QuickActions />
        </div>

        {/* Financial Overview */}
        <div className='mb-6'>
          <FinancialOverview />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <div className='space-y-6'>
            <AddNewRecord />
            <CategoryBreakdown />
          </div>
          <div className='space-y-6' data-section="stats">
            <RecordChart />
          </div>
        </div>

        {/* AI Insights */}
        <div className='mb-6'>
          <AIInsights />
        </div>

        {/* Record History */}
        <div>
          <RecordHistory />
        </div>
      </div>
    </main>
  );
}
