import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { orderApi, type OrderResponse } from '../services/api';

const getStatusConfig = (status: string, isRTL: boolean) => {
  const configs: Record<string, { label: string; icon: typeof Clock; color: string; bgColor: string; borderColor: string }> = {
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
    },
    declined: {
      label: isRTL ? 'مرفوض' : 'Declined',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    revision_requested: {
      label: isRTL ? 'طلب تعديل' : 'Revision Requested',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  };
  return configs[status] || configs.pending;
};

export function OrdersPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch orders based on user role
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const statusFilter = activeTab === 'all' ? undefined : activeTab;
        let res;
        
        if (user?.role === 'expert') {
          res = await orderApi.getExpertOrders({ status: statusFilter });
        } else {
          res = await orderApi.getMyOrders({ status: statusFilter });
        }
        
        setOrders(res.data.orders);
        
        // Update counts from API response or calculate locally
        if (res.data.counts) {
          setCounts({
            all: res.data.counts.all || res.data.orders.length,
            active: res.data.counts.active || res.data.orders.filter(o => ['pending', 'in_progress', 'delivered', 'revision_requested'].includes(o.status)).length,
            completed: res.data.counts.completed || res.data.orders.filter(o => o.status === 'completed').length,
            cancelled: res.data.counts.cancelled || res.data.orders.filter(o => ['cancelled', 'declined'].includes(o.status)).length
          });
        } else {
          // Calculate counts locally if not provided
          const allOrders = res.data.orders;
          setCounts({
            all: allOrders.length,
            active: allOrders.filter(o => ['pending', 'in_progress', 'delivered', 'revision_requested'].includes(o.status)).length,
            completed: allOrders.filter(o => o.status === 'completed').length,
            cancelled: allOrders.filter(o => ['cancelled', 'declined'].includes(o.status)).length
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.role, activeTab]);

  // Accept delivery handler
  const handleAcceptDelivery = async (orderId: string) => {
    try {
      await orderApi.acceptDelivery(orderId);
      // Refresh orders
      setActiveTab(prev => prev); // Trigger re-fetch
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to accept delivery');
    }
  };

  // Filter tabs
  const tabs = [
    { id: 'all', label: isRTL ? 'الكل' : 'All', count: counts.all },
    { id: 'active', label: isRTL ? 'نشط' : 'Active', count: counts.active },
    { id: 'completed', label: isRTL ? 'مكتمل' : 'Completed', count: counts.completed },
    { id: 'cancelled', label: isRTL ? 'ملغي' : 'Cancelled', count: counts.cancelled }
  ];

  // Filter orders based on active tab (client-side filtering as backup)
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'in_progress', 'delivered', 'revision_requested'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return ['cancelled', 'declined'].includes(order.status);
    return true;
  });

  // Calculate days remaining
  const getDaysRemaining = (deadline: string | undefined) => {
    if (!deadline) return 0;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            {user?.role === 'expert' 
              ? (isRTL ? 'طلبات الخدمات' : 'Service Orders')
              : (isRTL ? 'طلباتي' : 'My Orders')
            }
          </h1>
          <p className="text-gray-600">
            {user?.role === 'expert'
              ? (isRTL ? 'إدارة الطلبات الواردة على خدماتك' : 'Manage orders for your services')
              : (isRTL ? 'تتبع وإدارة جميع طلباتك في مكان واحد' : 'Track and manage all your orders in one place')
            }
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-red-800 mb-1">
              {isRTL ? 'حدث خطأ' : 'Error'}
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && (
          <>
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {isRTL ? 'لا توجد طلبات' : 'No orders found'}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {isRTL 
                    ? 'لا توجد طلبات في هذه الفئة'
                    : 'No orders found in this category'
                  }
                </p>
                {user?.role === 'customer' && (
                  <Link to="/browse">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status, isRTL);
                  const StatusIcon = statusConfig.icon;
                  const daysRemaining = order.daysRemaining ?? getDaysRemaining(order.deliveryDate);

                  return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {order.thumbnail ? (
                            <img
                              src={order.thumbnail}
                              alt={order.serviceTitle}
                              className="w-full lg:w-32 h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full lg:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {order.serviceTitle}
                              </h3>
                              {/* Show customer info for experts, expert info for customers */}
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                {user?.role === 'expert' && order.customer && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {order.customer.avatar || order.customer.name?.charAt(0).toUpperCase() || 'C'}
                                    </div>
                                    <span>{order.customer.name}</span>
                                  </div>
                                )}
                                {user?.role === 'customer' && order.expert && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {order.expert.avatar || order.expert.name?.charAt(0).toUpperCase() || 'E'}
                                    </div>
                                    <span>{order.expert.name}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {statusConfig.label}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${order.price?.toFixed(2) || '0.00'}</p>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">{isRTL ? 'رقم الطلب' : 'Order ID'}</p>
                              <p className="font-medium text-gray-900 font-mono text-xs">#{order.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">{isRTL ? 'تاريخ الطلب' : 'Order Date'}</p>
                              <p className="font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                            </div>
                            {order.deliveryDate && (
                              <div>
                                <p className="text-gray-500 mb-1">{isRTL ? 'التسليم المتوقع' : 'Expected Delivery'}</p>
                                <p className="font-medium text-gray-900">{formatDate(order.deliveryDate)}</p>
                              </div>
                            )}
                            {daysRemaining > 0 && !['completed', 'cancelled', 'declined'].includes(order.status) && (
                              <div>
                                <p className="text-gray-500 mb-1">{isRTL ? 'الأيام المتبقية' : 'Days Remaining'}</p>
                                <p className="font-medium text-blue-600 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {daysRemaining} {isRTL ? 'أيام' : 'days'}
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
                                  {isRTL ? 'مراسلة' : 'Message'}
                                </Button>
                              </Link>
                            )}
                            {order.status === 'delivered' && user?.role === 'customer' && (
                              <Button 
                                onClick={() => handleAcceptDelivery(order.id)}
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {isRTL ? 'قبول التسليم' : 'Accept Delivery'}
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
          </>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
