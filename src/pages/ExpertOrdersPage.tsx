import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  Bell,
  Check,
  X,
  MessageCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

export function ExpertOrdersPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'delivered'>('all');
  const [showOrderDetail, setShowOrderDetail] = useState<string | null>(null);

  const orders = [
    {
      id: 'ORD-001',
      service: 'Professional Logo Design',
      serviceAr: 'تصميم شعار احترافي',
      customer: 'Sarah Johnson',
      customerAr: 'سارة جونسون',
      customerAvatar: 'SJ',
      amount: '$100',
      status: 'pending',
      deadline: '5 days',
      deadlineAr: '5 أيام',
      requirements: 'I need a modern logo for my tech startup. Blue and white colors preferred. Should be minimalist.',
      requirementsAr: 'أحتاج شعار عصري لشركتي الناشئة. ألوان زرقاء وبيضاء مفضلة. يجب أن يكون بسيطاً.',
      orderDate: '2024-02-05',
      new: true
    },
    {
      id: 'ORD-002',
      service: 'Website Redesign',
      serviceAr: 'إعادة تصميم الموقع',
      customer: 'Mike Chen',
      customerAr: 'مايك تشن',
      customerAvatar: 'MC',
      amount: '$500',
      status: 'active',
      deadline: '3 days',
      deadlineAr: '3 أيام',
      progress: 60,
      orderDate: '2024-02-03'
    },
    {
      id: 'ORD-003',
      service: 'Brand Identity',
      serviceAr: 'الهوية التجارية',
      customer: 'Emma Williams',
      customerAr: 'إيما ويليامز',
      customerAvatar: 'EW',
      amount: '$350',
      status: 'delivered',
      deadline: 'Delivered',
      deadlineAr: 'تم التسليم',
      orderDate: '2024-02-01'
    }
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const newOrdersCount = orders.filter(o => o.new).length;

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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إدارة الطلبات' : 'Order Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة ومراجعة طلباتك' : 'Manage and review your orders'}
          </p>
        </div>

        {/* New Orders Alert */}
        {newOrdersCount > 0 && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {isRTL ? `لديك ${newOrdersCount} طلب جديد!` : `You have ${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''}!`}
                </h3>
                <p className="text-gray-600">
                  {isRTL ? 'يرجى مراجعة الطلب وقبوله أو رفضه في أقرب وقت ممكن' : 'Please review and accept or decline as soon as possible'}
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                {isRTL ? 'مراجعة الآن' : 'Review Now'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'الكل' : 'All'} ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'pending' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'معلق' : 'Pending'} ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'نشط' : 'Active'} ({orders.filter(o => o.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'delivered' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'تم التسليم' : 'Delivered'} ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Customer Avatar */}
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {order.customerAvatar}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-gray-500">{order.id}</span>
                        {order.new && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {isRTL ? 'جديد' : 'NEW'}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') :
                           order.status === 'active' ? (isRTL ? 'نشط' : 'Active') :
                           (isRTL ? 'تم التسليم' : 'Delivered')}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {isRTL ? order.serviceAr : order.service}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {isRTL ? 'من' : 'From'}: <span className="font-medium">{isRTL ? order.customerAr : order.customer}</span>
                      </p>
                      {order.requirements && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {isRTL ? order.requirementsAr : order.requirements}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Deadline */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 mb-1">{order.amount}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                      <Clock className="w-4 h-4" />
                      {isRTL ? order.deadlineAr : order.deadline}
                    </p>
                  </div>
                </div>

                {/* Progress Bar (for active orders) */}
                {order.status === 'active' && order.progress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {isRTL ? 'التقدم' : 'Progress'}
                      </span>
                      <span className="text-sm font-medium text-teal-600">{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  {order.status === 'pending' && (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="w-4 h-4 mr-2" />
                        {isRTL ? 'قبول الطلب' : 'Accept Order'}
                      </Button>
                      <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                        <X className="w-4 h-4 mr-2" />
                        {isRTL ? 'رفض' : 'Decline'}
                      </Button>
                      <Button variant="outline" className="border-gray-300 text-gray-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {isRTL ? 'طلب توضيح' : 'Request Clarification'}
                      </Button>
                    </>
                  )}
                  {order.status === 'active' && (
                    <>
                      <Link to={`/expert-delivery/${order.id}`}>
                        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                          {isRTL ? 'إدارة التسليم' : 'Manage Delivery'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to={`/messages/${order.id}`}>
                        <Button variant="outline" className="border-gray-300 text-gray-700">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {isRTL ? 'رسالة العميل' : 'Message Customer'}
                        </Button>
                      </Link>
                    </>
                  )}
                  {order.status === 'delivered' && (
                    <Link to={`/order-detail/${order.id}`}>
                      <Button variant="outline" className="border-gray-300 text-gray-700">
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'لا توجد طلبات' : 'No Orders Found'}
            </h3>
            <p className="text-gray-600">
              {isRTL ? 'لا توجد طلبات في هذه الفئة' : 'No orders in this category'}
            </p>
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
