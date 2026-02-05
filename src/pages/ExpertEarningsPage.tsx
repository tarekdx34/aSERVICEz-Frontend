import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export function ExpertEarningsPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const stats = {
    totalEarnings: 12450,
    availableBalance: 2450,
    pendingPayments: 1200,
    thisMonth: 3680
  };

  const transactions = [
    {
      id: 'TXN-001',
      type: 'earning',
      description: 'Order #ORD-001 completed',
      descriptionAr: 'اكتمال الطلب #ORD-001',
      amount: '+$100',
      date: '2024-02-05',
      status: 'completed'
    },
    {
      id: 'TXN-002',
      type: 'withdrawal',
      description: 'Withdrawal to Bank Account',
      descriptionAr: 'سحب إلى الحساب البنكي',
      amount: '-$500',
      date: '2024-02-03',
      status: 'completed'
    },
    {
      id: 'TXN-003',
      type: 'earning',
      description: 'Order #ORD-045 completed',
      descriptionAr: 'اكتمال الطلب #ORD-045',
      amount: '+$350',
      date: '2024-02-02',
      status: 'completed'
    },
    {
      id: 'TXN-004',
      type: 'commission',
      description: 'Platform commission (15%)',
      descriptionAr: 'عمولة المنصة (15%)',
      amount: '-$52.50',
      date: '2024-02-02',
      status: 'completed'
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'الأرباح والمالية' : 'Earnings & Finance'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة أرباحك وسحوباتك' : 'Manage your earnings and withdrawals'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">{isRTL ? 'إجمالي الأرباح' : 'Total Earnings'}</p>
            <p className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{isRTL ? 'الرصيد المتاح' : 'Available Balance'}</p>
            <p className="text-3xl font-bold text-gray-900">${stats.availableBalance.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{isRTL ? 'المدفوعات المعلقة' : 'Pending Payments'}</p>
            <p className="text-3xl font-bold text-gray-900">${stats.pendingPayments.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{isRTL ? 'هذا الشهر' : 'This Month'}</p>
            <p className="text-3xl font-bold text-gray-900">${stats.thisMonth.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isRTL ? 'المعاملات الأخيرة' : 'Recent Transactions'}
                </h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  {isRTL ? 'تصدير' : 'Export'}
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'earning' ? 'bg-green-100' :
                        txn.type === 'withdrawal' ? 'bg-blue-100' :
                        'bg-red-100'
                      }`}>
                        {txn.type === 'earning' ? (
                          <ArrowUpRight className={`w-5 h-5 text-green-600`} />
                        ) : txn.type === 'withdrawal' ? (
                          <ArrowDownRight className={`w-5 h-5 text-blue-600`} />
                        ) : (
                          <DollarSign className={`w-5 h-5 text-red-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {isRTL ? txn.descriptionAr : txn.description}
                        </p>
                        <p className="text-sm text-gray-500">{txn.date}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${
                      txn.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Withdraw & Commission */}
          <div className="space-y-6">
            {/* Withdraw */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isRTL ? 'سحب الأرباح' : 'Withdraw Earnings'}
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">{isRTL ? 'الرصيد المتاح للسحب' : 'Available for Withdrawal'}</p>
                <p className="text-2xl font-bold text-gray-900">${stats.availableBalance.toLocaleString()}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'المبلغ' : 'Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'طريقة السحب' : 'Withdrawal Method'}
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option>{isRTL ? 'حساب بنكي (****1234)' : 'Bank Account (****1234)'}</option>
                  <option>PayPal</option>
                  <option>Wise</option>
                </select>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <CreditCard className="w-4 h-4 mr-2" />
                {isRTL ? 'طلب سحب' : 'Request Withdrawal'}
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                {isRTL ? 'يستغرق معالجة السحب 3-5 أيام عمل' : 'Withdrawal processing takes 3-5 business days'}
              </p>
            </div>

            {/* Commission Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isRTL ? 'معلومات العمولة' : 'Commission Info'}
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{isRTL ? 'معدل العمولة' : 'Commission Rate'}</span>
                  <span className="font-semibold text-gray-900">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{isRTL ? 'رسوم المنصة' : 'Platform Fee'}</span>
                  <span className="font-semibold text-gray-900">$0.50</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">{isRTL ? 'مثال على طلب $100' : 'Example on $100 Order'}</span>
                  <span className="font-bold text-green-600">$84.50</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    {isRTL 
                      ? 'يتم خصم العمولة تلقائياً من كل طلب مكتمل'
                      : 'Commission is automatically deducted from each completed order'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
