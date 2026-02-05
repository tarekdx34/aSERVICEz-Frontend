import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export function AdminDashboardPage() {
  const { isRTL, toggleLanguage } = useLanguage();

  const kpiCards = [
    {
      title: 'Active Users',
      titleAr: 'المستخدمون النشطون',
      value: '12,547',
      change: '+12.5%',
      positive: true,
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Services',
      titleAr: 'إجمالي الخدمات',
      value: '3,842',
      change: '+8.3%',
      positive: true,
      icon: Package,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Active Orders',
      titleAr: 'الطلبات النشطة',
      value: '1,234',
      change: '-3.2%',
      positive: false,
      icon: ShoppingBag,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Monthly Revenue',
      titleAr: 'الإيرادات الشهرية',
      value: '$186,420',
      change: '+24.1%',
      positive: true,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    }
  ];

  const revenueData = [
    { month: 'Jan', monthAr: 'يناير', revenue: 125000, commission: 18750 },
    { month: 'Feb', monthAr: 'فبراير', revenue: 142000, commission: 21300 },
    { month: 'Mar', monthAr: 'مارس', revenue: 138000, commission: 20700 },
    { month: 'Apr', monthAr: 'أبريل', revenue: 165000, commission: 24750 },
    { month: 'May', monthAr: 'مايو', revenue: 178000, commission: 26700 },
    { month: 'Jun', monthAr: 'يونيو', revenue: 186420, commission: 27963 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  const systemStatus = [
    { metric: 'System Uptime', metricAr: 'وقت تشغيل النظام', value: '99.9%', status: 'good' },
    { metric: 'Avg Response Time', metricAr: 'متوسط وقت الاستجابة', value: '245ms', status: 'good' },
    { metric: 'Error Rate', metricAr: 'معدل الخطأ', value: '0.02%', status: 'good' },
    { metric: 'Server Load', metricAr: 'حمل الخادم', value: '42%', status: 'warning' }
  ];

  const userGrowth = [
    { type: 'Customers', typeAr: 'العملاء', count: 8234, percentage: 65.6 },
    { type: 'Experts', typeAr: 'الخبراء', count: 4313, percentage: 34.4 }
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
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{isRTL ? kpi.titleAr : kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isRTL ? 'تحليل الإيرادات' : 'Revenue Analysis'}
              </h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option>{isRTL ? '6 أشهر' : '6 months'}</option>
                <option>{isRTL ? 'سنة' : '1 year'}</option>
              </select>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">{isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
                <p className="text-2xl font-bold">$934,420</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">{isRTL ? 'أرباح العمولة' : 'Commission Earnings'}</p>
                <p className="text-2xl font-bold">$140,163</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">{isRTL ? 'معدل النمو' : 'Growth Rate'}</p>
                <p className="text-2xl font-bold">+24.1%</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div 
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all hover:from-teal-700 hover:to-teal-500 cursor-pointer"
                      style={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
                    >
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <div>{isRTL ? 'الإيرادات:' : 'Revenue:'} ${(data.revenue / 1000).toFixed(0)}k</div>
                        <div>{isRTL ? 'العمولة:' : 'Commission:'} ${(data.commission / 1000).toFixed(0)}k</div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {isRTL ? data.monthAr : data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {isRTL ? 'مراقبة الأداء' : 'Performance Monitoring'}
              </h2>
            </div>

            <div className="space-y-4">
              {systemStatus.map((stat, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{isRTL ? stat.metricAr : stat.metric}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.status === 'good' ? 'bg-green-100 text-green-700' :
                      stat.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {stat.status === 'good' ? <CheckCircle className="w-3 h-3 inline mr-1" /> :
                       stat.status === 'warning' ? <Clock className="w-3 h-3 inline mr-1" /> :
                       <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.status === 'good' ? 'bg-green-600' :
                        stat.status === 'warning' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ 
                        width: stat.status === 'good' ? '95%' : 
                               stat.status === 'warning' ? '60%' : '30%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to="/admin-analytics" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                {isRTL ? 'عرض التقارير المفصلة' : 'View Detailed Reports'}
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isRTL ? 'إحصائيات المستخدمين' : 'User Statistics'}
            </h2>

            <div className="space-y-4 mb-6">
              {userGrowth.map((user, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{isRTL ? user.typeAr : user.type}</span>
                    <span className="text-sm font-bold text-gray-900">{user.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-teal-600'}`}
                      style={{ width: `${user.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{isRTL ? 'تسجيلات جديدة' : 'New Registrations'}</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-xs text-green-600 mt-1">+18% {isRTL ? 'هذا الأسبوع' : 'this week'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{isRTL ? 'معدل النشاط' : 'Activity Rate'}</p>
                <p className="text-2xl font-bold text-gray-900">78.5%</p>
                <p className="text-xs text-green-600 mt-1">+5.2% {isRTL ? 'هذا الشهر' : 'this month'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin-users" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{isRTL ? 'إدارة المستخدمين' : 'User Management'}</p>
              </Link>

              <Link to="/admin-services" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{isRTL ? 'الموافقة على الخدمات' : 'Service Approval'}</p>
              </Link>

              <Link to="/admin-payments" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{isRTL ? 'إدارة المدفوعات' : 'Payment System'}</p>
              </Link>

              <Link to="/customer-service" className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center">
                <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{isRTL ? 'خدمة العملاء' : 'Customer Service'}</p>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to="/help-center" className="block text-center text-teal-600 hover:text-teal-700 font-medium">
                {isRTL ? 'مركز المساعدة' : 'Help Center'} →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
