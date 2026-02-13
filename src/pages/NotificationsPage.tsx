import { useState, useEffect } from 'react';
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
  Clock,
  Loader2,
  ShoppingBag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { notificationApi, type NotificationResponse } from '../services/api';

// Map notification types to icons and colors
const getNotificationConfig = (type: string) => {
  const configs: Record<string, { icon: typeof Package; color: string; bgColor: string }> = {
    ORDER_PLACED: { icon: ShoppingBag, color: 'text-teal-600', bgColor: 'bg-teal-100' },
    ORDER_ACCEPTED: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    ORDER_DECLINED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    ORDER_DELIVERED: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    ORDER_COMPLETED: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    ORDER_CANCELLED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    ORDER_REVISION: { icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    MESSAGE: { icon: MessageCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    PAYMENT: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    REVIEW: { icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    DEADLINE: { icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    SERVICE_APPROVED: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    SERVICE_REJECTED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  };
  return configs[type] || { icon: Bell, color: 'text-gray-600', bgColor: 'bg-gray-100' };
};

// Format relative time
const formatRelativeTime = (dateStr: string, isRTL: boolean) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return isRTL ? 'الآن' : 'Just now';
  if (diffMins < 60) return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return isRTL ? `منذ ${diffDays} يوم` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function NotificationsPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await notificationApi.getAll({ filter: filter === 'unread' ? 'unread' : 'all' });
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications');
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [filter]);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err.message || 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err: any) {
      alert(err.message || 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationApi.delete(id);
      const notification = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete notification');
    }
  };

  const clearAll = async () => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف جميع الإشعارات؟' : 'Are you sure you want to clear all notifications?')) {
      try {
        await notificationApi.clearAll();
        setNotifications([]);
        setUnreadCount(0);
      } catch (err: any) {
        alert(err.message || 'Failed to clear notifications');
      }
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

        {/* Notifications List */}
        {!isLoading && !error && (
          <>
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
                  const config = getNotificationConfig(notification.type);
                  const Icon = config.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg border transition-all hover:shadow-md ${
                        notification.isRead ? 'border-gray-200' : 'border-teal-200 bg-teal-50/30'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <h3 className={`font-semibold ${notification.isRead ? 'text-gray-900' : 'text-gray-900'}`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(notification.createdAt, isRTL)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                          {!notification.isRead && (
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
          </>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
