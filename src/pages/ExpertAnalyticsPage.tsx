import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Eye,
  MousePointerClick,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign
} from 'lucide-react';

export function ExpertAnalyticsPage() {
  const { isRTL, toggleLanguage } = useLanguage();

  const metrics = [
    {
      icon: Eye,
      label: 'Profile Views',
      labelAr: 'مشاهدات الملف',
      value: '2,547',
      change: '+12%',
      positive: true,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MousePointerClick,
      label: 'Service Impressions',
      labelAr: 'ظهور الخدمات',
      value: '8,432',
      change: '+8%',
      positive: true,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      label: 'Conversion Rate',
      labelAr: 'معدل التحويل',
      value: '3.2%',
      change: '-0.5%',
      positive: false,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      labelAr: 'متوسط وقت الاستجابة',
      value: '2.4h',
      change: '-15%',
      positive: true,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: CheckCircle,
      label: 'Completion Rate',
      labelAr: 'معدل الإكمال',
      value: '98%',
      change: '+2%',
      positive: true,
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: Star,
      label: 'Average Rating',
      labelAr: 'متوسط التقييم',
      value: '4.9',
      change: '+0.1',
      positive: true,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: DollarSign,
      label: 'Orders Completed',
      labelAr: 'الطلبات المكتملة',
      value: '156',
      change: '+18',
      positive: true,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: TrendingUp,
      label: 'Monthly Revenue',
      labelAr: 'الإيرادات الشهرية',
      value: '$3,680',
      change: '+24%',
      positive: true,
      color: 'bg-emerald-100 text-emerald-600'
    }
  ];

  const revenueData = [
    { month: 'Jan', monthAr: 'يناير', value: 2100 },
    { month: 'Feb', monthAr: 'فبراير', value: 2400 },
    { month: 'Mar', monthAr: 'مارس', value: 1800 },
    { month: 'Apr', monthAr: 'أبريل', value: 2900 },
    { month: 'May', monthAr: 'مايو', value: 3200 },
    { month: 'Jun', monthAr: 'يونيو', value: 3680 }
  ];

  const maxValue = Math.max(...revenueData.map(d => d.value));

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
            {isRTL ? 'تحليلات الأداء' : 'Performance Analytics'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'تتبع أدائك ونموك' : 'Track your performance and growth'}
          </p>
        </div>

        {/* Time Period Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-teal-600 text-white">
            {isRTL ? 'الأسبوع' : 'Week'}
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
            {isRTL ? 'الشهر' : 'Month'}
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
            {isRTL ? 'السنة' : 'Year'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {metric.change}
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{isRTL ? metric.labelAr : metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
          </h2>
          
          <div className="h-64 flex items-end justify-between gap-4">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div 
                    className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all hover:from-teal-700 hover:to-teal-500 cursor-pointer"
                    style={{ height: `${(data.value / maxValue) * 200}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${data.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {isRTL ? data.monthAr : data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isRTL ? 'أفضل الخدمات أداءً' : 'Top Performing Services'}
          </h2>

          <div className="space-y-4">
            {[
              { name: 'Professional Logo Design', nameAr: 'تصميم شعار احترافي', orders: 45, revenue: '$4,500', rating: 4.9 },
              { name: 'Brand Identity Package', nameAr: 'حزمة الهوية التجارية', orders: 32, revenue: '$11,200', rating: 5.0 },
              { name: 'Website Redesign', nameAr: 'إعادة تصميم الموقع', orders: 18, revenue: '$9,000', rating: 4.8 }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{isRTL ? service.nameAr : service.name}</h3>
                    <p className="text-sm text-gray-600">{service.orders} {isRTL ? 'طلبات' : 'orders'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{service.revenue}</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{service.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
