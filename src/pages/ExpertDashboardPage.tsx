import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Bell,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Users,
  BarChart3,
  FileText,
  Plus
} from 'lucide-react';

export function ExpertDashboardPage() {
  const { isRTL, toggleLanguage } = useLanguage();

  const stats = [
    { 
      icon: ShoppingBag, 
      label: 'Active Orders', 
      labelAr: 'الطلبات النشطة',
      value: '8',
      color: 'bg-blue-100 text-blue-600',
      link: '/expert-orders'
    },
    { 
      icon: DollarSign, 
      label: 'Available Balance', 
      labelAr: 'الرصيد المتاح',
      value: '$2,450',
      color: 'bg-green-100 text-green-600',
      link: '/expert-earnings'
    },
    { 
      icon: Star, 
      label: 'Average Rating', 
      labelAr: 'متوسط التقييم',
      value: '4.9',
      color: 'bg-yellow-100 text-yellow-600',
      link: '/expert-analytics'
    },
    { 
      icon: TrendingUp, 
      label: 'Total Services', 
      labelAr: 'إجمالي الخدمات',
      value: '12',
      color: 'bg-purple-100 text-purple-600',
      link: '/my-services'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      service: 'Professional Logo Design',
      serviceAr: 'تصميم شعار احترافي',
      customer: 'Sarah Johnson',
      customerAr: 'سارة جونسون',
      amount: '$100',
      status: 'in_progress',
      deadline: '2 days',
      deadlineAr: 'يومان'
    },
    {
      id: 'ORD-002',
      service: 'Website Redesign',
      serviceAr: 'إعادة تصميم الموقع',
      customer: 'Mike Chen',
      customerAr: 'مايك تشن',
      amount: '$500',
      status: 'pending',
      deadline: '5 days',
      deadlineAr: '5 أيام'
    },
    {
      id: 'ORD-003',
      service: 'Brand Identity Package',
      serviceAr: 'حزمة الهوية التجارية',
      customer: 'Emma Williams',
      customerAr: 'إيما ويليامز',
      amount: '$350',
      status: 'delivered',
      deadline: 'Delivered',
      deadlineAr: 'تم التسليم'
    }
  ];

  const notifications = [
    {
      icon: Bell,
      color: 'text-blue-600',
      message: 'New order received: Logo Design',
      messageAr: 'طلب جديد: تصميم شعار',
      time: '5 min ago',
      timeAr: 'منذ 5 دقائق'
    },
    {
      icon: MessageCircle,
      color: 'text-green-600',
      message: 'New message from Sarah Johnson',
      messageAr: 'رسالة جديدة من سارة جونسون',
      time: '1 hour ago',
      timeAr: 'منذ ساعة'
    },
    {
      icon: Star,
      color: 'text-yellow-600',
      message: 'You received a 5-star review!',
      messageAr: 'حصلت على تقييم 5 نجوم!',
      time: '2 hours ago',
      timeAr: 'منذ ساعتين'
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isRTL ? 'لوحة تحكم الخبير' : 'Expert Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'مرحباً بعودتك! إليك ملخص أعمالك' : 'Welcome back! Here\'s your business summary'}
            </p>
          </div>
          <Link to="/add-service">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? 'إضافة خدمة جديدة' : 'Add New Service'}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.link}>
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{isRTL ? stat.labelAr : stat.label}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isRTL ? 'الطلبات الأخيرة' : 'Recent Orders'}
                </h2>
                <Link to="/expert-orders" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  {isRTL ? 'عرض الكل' : 'View All'} →
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-500">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {order.status === 'in_progress' ? (isRTL ? 'قيد التنفيذ' : 'In Progress') :
                             order.status === 'pending' ? (isRTL ? 'معلق' : 'Pending') :
                             (isRTL ? 'تم التسليم' : 'Delivered')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {isRTL ? order.serviceAr : order.service}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isRTL ? 'من' : 'From'}: {isRTL ? order.customerAr : order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 mb-1">{order.amount}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {isRTL ? order.deadlineAr : order.deadline}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/expert-delivery/${order.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
                          {isRTL ? 'إدارة الطلب' : 'Manage Order'}
                        </Button>
                      </Link>
                      <Link to={`/messages/${order.id}`}>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
              </h2>
              <div className="space-y-2">
                <Link to="/add-service">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    {isRTL ? 'إضافة خدمة جديدة' : 'Create New Service'}
                  </Button>
                </Link>
                <Link to="/expert-analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isRTL ? 'عرض التحليلات' : 'View Analytics'}
                  </Button>
                </Link>
                <Link to="/expert-earnings">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {isRTL ? 'سحب الأرباح' : 'Withdraw Earnings'}
                  </Button>
                </Link>
                <Link to="/expert-tickets">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    {isRTL ? 'الدعم الفني' : 'Support Tickets'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {isRTL ? 'الإشعارات' : 'Notifications'}
                </h2>
                <Link to="/notifications" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  {isRTL ? 'الكل' : 'All'} →
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const Icon = notification.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className={`w-5 h-5 ${notification.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{isRTL ? notification.messageAr : notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{isRTL ? notification.timeAr : notification.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
