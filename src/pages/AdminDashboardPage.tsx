import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { adminApi, type DashboardStats } from '../services/api';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FolderOpen
} from 'lucide-react';

export function AdminDashboardPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setStats(res.data))
      .catch(err => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setIsLoading(false));
  }, []);

  const kpiCards = [
    {
      title: 'Total Users',
      titleAr: 'إجمالي المستخدمين',
      value: stats ? stats.totalUsers.toLocaleString() : '—',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Experts',
      titleAr: 'إجمالي الخبراء',
      value: stats ? stats.totalExperts.toLocaleString() : '—',
      icon: ShoppingBag,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Total Services',
      titleAr: 'إجمالي الخدمات',
      value: stats ? stats.totalServices.toLocaleString() : '—',
      icon: Package,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Pending Services',
      titleAr: 'خدمات بانتظار الموافقة',
      value: stats ? stats.pendingApprovals.services.toLocaleString() : '—',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
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
            {isRTL ? 'لوحة تحكم المسؤول' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'مراقبة أداء المنصة وإدارتها' : 'Monitor and manage platform performance'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiCards.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${kpi.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{isRTL ? kpi.titleAr : kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Link to="/admin-users" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                  <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{isRTL ? 'إدارة المستخدمين' : 'User Management'}</p>
                </Link>
                <Link to="/admin-services" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                  <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{isRTL ? 'الموافقة على الخدمات' : 'Service Approval'}</p>
                  {stats && stats.pendingApprovals.services > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {stats.pendingApprovals.services} {isRTL ? 'بانتظار' : 'pending'}
                    </span>
                  )}
                </Link>
                <Link to="/admin-payments" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{isRTL ? 'إدارة المدفوعات' : 'Payment System'}</p>
                </Link>
                <Link to="/customer-service" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                  <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{isRTL ? 'خدمة العملاء' : 'Customer Service'}</p>
                </Link>
                <Link to="/admin-categories" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                  <FolderOpen className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{isRTL ? 'إدارة الفئات' : 'Categories'}</p>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
