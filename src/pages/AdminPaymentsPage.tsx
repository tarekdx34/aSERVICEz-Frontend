import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Clock
} from 'lucide-react';

export function AdminPaymentsPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'gateways' | 'escrow' | 'disputes'>('gateways');

  const gateways = [
    { name: 'Stripe', status: 'active', transactions: 12450, fees: '2.9% + $0.30' },
    { name: 'PayPal', status: 'active', transactions: 8234, fees: '3.5%' },
    { name: 'Bank Transfer', status: 'active', transactions: 2156, fees: '$5.00' }
  ];

  const escrowTransactions = [
    {
      id: 'ESC-001',
      order: 'ORD-1738756891234',
      amount: '$100',
      customer: 'Sarah Johnson',
      expert: 'Ahmed Hassan',
      status: 'pending_delivery',
      date: '2024-02-05'
    },
    {
      id: 'ESC-002',
      order: 'ORD-1738756123456',
      amount: '$500',
      customer: 'Mike Chen',
      expert: 'Fatima Said',
      status: 'awaiting_approval',
      date: '2024-02-04'
    }
  ];

  const disputes = [
    {
      id: 'DIS-001',
      order: 'ORD-1738755987654',
      amount: '$350',
      customer: 'Emma Williams',
      expert: 'Omar Ali',
      reason: 'Quality dispute',
      status: 'under_review',
      date: '2024-02-03'
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إدارة نظام الدفع' : 'Payment System Administration'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة البوابات، الضمان والنزاعات' : 'Manage gateways, escrow and disputes'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي الضمان' : 'Total Escrow'}</p>
                <p className="text-2xl font-bold text-gray-900">$45,230</p>
              </div>
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'قيد الانتظار' : 'Pending'}</p>
                <p className="text-2xl font-bold text-gray-900">$12,450</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'النزاعات' : 'Disputes'}</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'تم الإصدار' : 'Released'}</p>
                <p className="text-2xl font-bold text-gray-900">$186,420</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'gateways' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'البوابات' : 'Payment Gateways'}
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'escrow' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'نظام الضمان' : 'Escrow System'}
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'disputes' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'النزاعات' : 'Disputes'}
          </button>
        </div>

        {/* Payment Gateways */}
        {activeTab === 'gateways' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isRTL ? 'بوابات الدفع' : 'Payment Gateways'}</h2>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                {isRTL ? '+ إضافة بوابة' : '+ Add Gateway'}
              </Button>
            </div>

            <div className="space-y-4">
              {gateways.map((gateway, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{gateway.name}</h3>
                        <p className="text-sm text-gray-600">
                          {gateway.transactions.toLocaleString()} {isRTL ? 'معاملة' : 'transactions'} • 
                          {isRTL ? ' الرسوم:' : ' Fees:'} {gateway.fees}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {isRTL ? 'نشط' : 'Active'}
                      </span>
                      <Button size="sm" variant="outline">{isRTL ? 'إعدادات' : 'Settings'}</Button>
                      <Button size="sm" variant="outline">{isRTL ? 'اختبار' : 'Test'}</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Escrow System */}
        {activeTab === 'escrow' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{isRTL ? 'معاملات الضمان' : 'Escrow Transactions'}</h2>

            <div className="space-y-4">
              {escrowTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-gray-600">{transaction.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'pending_delivery' ? 'bg-yellow-100 text-yellow-700' :
                          transaction.status === 'awaiting_approval' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {transaction.status === 'pending_delivery' ? (isRTL ? 'في انتظار التسليم' : 'Pending Delivery') :
                           transaction.status === 'awaiting_approval' ? (isRTL ? 'في انتظار الموافقة' : 'Awaiting Approval') :
                           (isRTL ? 'مكتمل' : 'Completed')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {isRTL ? 'الطلب:' : 'Order:'} {transaction.order}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.customer} → {transaction.expert}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-1">{transaction.amount}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'إصدار الدفع' : 'Release Payment'}
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'رفض' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disputes */}
        {activeTab === 'disputes' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{isRTL ? 'نزاعات الدفع' : 'Payment Disputes'}</h2>

            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="border border-red-200 bg-red-50 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-mono text-sm text-gray-900 font-semibold">{dispute.id}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {isRTL ? 'قيد المراجعة' : 'Under Review'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1">{dispute.reason}</p>
                      <p className="text-sm text-gray-700">
                        {isRTL ? 'الطلب:' : 'Order:'} {dispute.order}
                      </p>
                      <p className="text-sm text-gray-700">
                        {dispute.customer} vs {dispute.expert}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-1">{dispute.amount}</p>
                      <p className="text-sm text-gray-600">{dispute.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      {isRTL ? 'مراجعة' : 'Review Dispute'}
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {isRTL ? 'معالجة الاسترداد' : 'Process Refund'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
