import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  MessageCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-1738756891234',
    serviceTitle: 'Professional Logo Design with Brand Guidelines',
    serviceTitleAr: 'تصميم شعار احترافي مع دليل الهوية البصرية',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    expert: {
      name: 'Ahmed Hassan',
      nameAr: 'أحمد حسن',
      avatar: 'AH'
    },
    package: 'Standard',
    packageAr: 'القياسية',
    price: 100,
    status: 'in_progress',
    orderDate: '2024-02-01',
    deliveryDate: '2024-02-06',
    daysRemaining: 3,
    unreadMessages: 2
  },
  {
    id: 'ORD-1738756123456',
    serviceTitle: 'Complete Brand Identity Design Package',
    serviceTitleAr: 'حزمة تصميم الهوية البصرية الكاملة',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    expert: {
      name: 'Fatima Said',
      nameAr: 'فاطمة سعيد',
      avatar: 'FS'
    },
    package: 'Premium',
    packageAr: 'المتقدمة',
    price: 200,
    status: 'delivered',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-27',
    daysRemaining: 0,
    unreadMessages: 0
  },
  {
    id: 'ORD-1738755987654',
    serviceTitle: 'Social Media Graphics Bundle',
    serviceTitleAr: 'حزمة تصاميم السوشيال ميديا',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
    expert: {
      name: 'Omar Ali',
      nameAr: 'عمر علي',
      avatar: 'OA'
    },
    package: 'Basic',
    packageAr: 'الأساسية',
    price: 50,
    status: 'pending',
    orderDate: '2024-02-05',
    deliveryDate: '2024-02-08',
    daysRemaining: 3,
    unreadMessages: 0
  },
  {
    id: 'ORD-1738754321098',
    serviceTitle: 'Business Card Design',
    serviceTitleAr: 'تصميم بطاقة عمل',
    thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
    expert: {
      name: 'Sara Ahmed',
      nameAr: 'سارة أحمد',
      avatar: 'SA'
    },
    package: 'Standard',
    packageAr: 'القياسية',
    price: 75,
    status: 'completed',
    orderDate: '2024-01-10',
    deliveryDate: '2024-01-15',
    daysRemaining: 0,
    unreadMessages: 0
  },
  {
    id: 'ORD-1738753456789',
    serviceTitle: 'Website UI/UX Design',
    serviceTitleAr: 'تصميم واجهة موقع إلكتروني',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400',
    expert: {
      name: 'Khaled Mohamed',
      nameAr: 'خالد محمد',
      avatar: 'KM'
    },
    package: 'Premium',
    packageAr: 'المتقدمة',
    price: 300,
    status: 'cancelled',
    orderDate: '2024-01-05',
    deliveryDate: '2024-01-12',
    daysRemaining: 0,
    unreadMessages: 0
  }
];

const getStatusConfig = (status: string, isRTL: boolean) => {
  const configs = {
    pending: {
      label: isRTL ? 'قيد الانتظار' : 'Pending',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    in_progress: {
      label: isRTL ? 'قيد التنفيذ' : 'In Progress',
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    delivered: {
      label: isRTL ? 'تم التسليم' : 'Delivered',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    completed: {
      label: isRTL ? 'مكتمل' : 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    cancelled: {
      label: isRTL ? 'ملغي' : 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };
  return configs[status as keyof typeof configs] || configs.pending;
};

export function OrdersPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();

  // Filter tabs
  const tabs = [
    { id: 'all', label: isRTL ? 'الكل' : 'All', count: mockOrders.length },
    { id: 'active', label: isRTL ? 'نشط' : 'Active', count: mockOrders.filter(o => ['pending', 'in_progress', 'delivered'].includes(o.status)).length },
    { id: 'completed', label: isRTL ? 'مكتمل' : 'Completed', count: mockOrders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: isRTL ? 'ملغي' : 'Cancelled', count: mockOrders.filter(o => o.status === 'cancelled').length }
  ];

  const [activeTab, setActiveTab] = React.useState('all');

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'in_progress', 'delivered'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'طلباتي' : 'My Orders'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'تتبع وإدارة جميع طلباتك في مكان واحد' : 'Track and manage all your orders in one place'}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-teal-100 text-teal-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'لا توجد طلبات' : 'No orders found'}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {isRTL 
                ? 'لا توجد طلبات في هذه الفئة'
                : 'No orders found in this category'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status, isRTL);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={order.thumbnail}
                        alt={isRTL ? order.serviceTitleAr : order.serviceTitle}
                        className="w-full lg:w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {isRTL ? order.serviceTitleAr : order.serviceTitle}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {order.expert.avatar}
                              </div>
                              <span>{isRTL ? order.expert.nameAr : order.expert.name}</span>
                            </div>
                            <span>•</span>
                            <span>{isRTL ? order.packageAr : order.package}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusConfig.label}
                            </span>
                            {order.unreadMessages > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-200">
                                <MessageCircle className="w-3 h-3" />
                                {order.unreadMessages}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${order.price}</p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">{isRTL ? 'رقم الطلب' : 'Order ID'}</p>
                          <p className="font-medium text-gray-900 font-mono text-xs">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">{isRTL ? 'تاريخ الطلب' : 'Order Date'}</p>
                          <p className="font-medium text-gray-900">{order.orderDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">{isRTL ? 'التسليم المتوقع' : 'Expected Delivery'}</p>
                          <p className="font-medium text-gray-900">{order.deliveryDate}</p>
                        </div>
                        {order.daysRemaining > 0 && order.status !== 'completed' && order.status !== 'cancelled' && (
                          <div>
                            <p className="text-gray-500 mb-1">{isRTL ? 'الأيام المتبقية' : 'Days Remaining'}</p>
                            <p className="font-medium text-blue-600 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {order.daysRemaining} {isRTL ? 'أيام' : 'days'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Link to={`/order-detail/${order.id}`}>
                          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Eye className="w-4 h-4 mr-2" />
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </Link>
                        {['pending', 'in_progress', 'delivered'].includes(order.status) && (
                          <Link to={`/messages/${order.id}`}>
                            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              {isRTL ? 'مراسلة الخبير' : 'Message Expert'}
                            </Button>
                          </Link>
                        )}
                        {order.status === 'delivered' && (
                          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isRTL ? 'قبول التسليم' : 'Accept Delivery'}
                          </Button>
                        )}
                        {order.status === 'completed' && (
                          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            {isRTL ? 'إعادة الطلب' : 'Reorder'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
