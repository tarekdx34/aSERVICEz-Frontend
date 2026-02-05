import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  Bell,
  Settings,
  CheckCheck,
  Trash2,
  Package,
  MessageCircle,
  Star,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'order_delivered',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    title: 'Order Delivered',
    titleAr: 'تم تسليم الطلب',
    message: 'Ahmed Hassan has delivered your order #ORD-1738756891234. Please review the work.',
    messageAr: 'قام أحمد حسن بتسليم طلبك #ORD-1738756891234. يرجى مراجعة العمل.',
    time: '5 minutes ago',
    timeAr: 'منذ 5 دقائق',
    read: false,
    link: '/order-detail/ORD-1738756891234'
  },
  {
    id: '2',
    type: 'message',
    icon: MessageCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    title: 'New Message',
    titleAr: 'رسالة جديدة',
    message: 'You have a new message from Fatima Said regarding your order.',
    messageAr: 'لديك رسالة جديدة من فاطمة سعيد بخصوص طلبك.',
    time: '1 hour ago',
    timeAr: 'منذ ساعة واحدة',
    read: false,
    link: '/messages/ORD-1738756123456'
  },
  {
    id: '3',
    type: 'review_reminder',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    title: 'Review Reminder',
    titleAr: 'تذكير بالمراجعة',
    message: 'You have 2 days left to review and accept order #ORD-1738756123456.',
    messageAr: 'لديك يومان متبقيان لمراجعة وقبول الطلب #ORD-1738756123456.',
    time: '3 hours ago',
    timeAr: 'منذ 3 ساعات',
    read: true,
    link: '/order-detail/ORD-1738756123456'
  },
  {
    id: '4',
    type: 'payment_released',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    title: 'Payment Released',
    titleAr: 'تم تحرير الدفع',
    message: 'Payment of $100 has been released to Ahmed Hassan for completed order.',
    messageAr: 'تم تحرير دفعة بقيمة 100 دولار لأحمد حسن للطلب المكتمل.',
    time: '1 day ago',
    timeAr: 'منذ يوم واحد',
    read: true,
    link: '/orders'
  },
  {
    id: '5',
    type: 'order_started',
    icon: TrendingUp,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    title: 'Order Started',
    titleAr: 'بدأ العمل على الطلب',
    message: 'Omar Ali has started working on your order #ORD-1738755987654.',
    messageAr: 'بدأ عمر علي العمل على طلبك #ORD-1738755987654.',
    time: '2 days ago',
    timeAr: 'منذ يومين',
    read: true,
    link: '/order-detail/ORD-1738755987654'
  },
  {
    id: '6',
    type: 'deadline_approaching',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    title: 'Deadline Approaching',
    titleAr: 'اقتراب الموعد النهائي',
    message: 'Order #ORD-1738755987654 delivery deadline is in 1 day.',
    messageAr: 'الموعد النهائي لتسليم الطلب #ORD-1738755987654 خلال يوم واحد.',
    time: '3 days ago',
    timeAr: 'منذ 3 أيام',
    read: true,
    link: '/order-detail/ORD-1738755987654'
  }
];

export function NotificationsPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف جميع الإشعارات؟' : 'Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRTL ? 'الإشعارات' : 'Notifications'}
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0 
                  ? (isRTL ? `لديك ${unreadCount} إشعار غير مقروء` : `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`)
                  : (isRTL ? 'لا توجد إشعارات جديدة' : 'No new notifications')
                }
              </p>
            </div>
            <Link to="/notification-preferences">
              <Button variant="outline" className="border-gray-300 text-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                {isRTL ? 'الإعدادات' : 'Settings'}
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-1">
            <div className="flex gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isRTL ? 'الكل' : 'All'} ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isRTL ? 'غير مقروء' : 'Unread'} ({unreadCount})
              </button>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="ghost"
                  size="sm"
                  className="text-teal-600 hover:bg-teal-50"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  {isRTL ? 'تحديد الكل كمقروء' : 'Mark All Read'}
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isRTL ? 'حذف الكل' : 'Clear All'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'لا توجد إشعارات' : 'No Notifications'}
            </h2>
            <p className="text-gray-600">
              {filter === 'unread'
                ? (isRTL ? 'لا توجد إشعارات غير مقروءة' : 'No unread notifications')
                : (isRTL ? 'ستظهر إشعاراتك هنا' : 'Your notifications will appear here')
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border transition-all hover:shadow-md ${
                    notification.read ? 'border-gray-200' : 'border-teal-200 bg-teal-50/30'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${notification.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                            {isRTL ? notification.titleAr : notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {isRTL ? notification.messageAr : notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isRTL ? notification.timeAr : notification.time}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      {notification.link && (
                        <Link to={notification.link}>
                          <Button size="sm" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </Link>
                      )}
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:bg-gray-100"
                        >
                          <CheckCheck className="w-4 h-4 mr-2" />
                          {isRTL ? 'تحديد كمقروء' : 'Mark as Read'}
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
