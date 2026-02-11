import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { serviceApi, type ServiceResponse } from '../services/api';
import { Plus, Package, Trash2, Edit, Loader2 } from 'lucide-react';

export function MyServicesPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyServices = () => {
    setIsLoading(true);
    serviceApi.getMyServices()
      .then(res => setServices(res.data || []))
      .catch(() => setServices([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleDelete = async (serviceId: number) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Are you sure you want to delete this service?')) return;
    try {
      await serviceApi.delete(serviceId);
      fetchMyServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'خدماتي' : 'My Services'}
          </h1>
          <Link to="/add-service">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              {isRTL ? 'إضافة خدمة جديدة' : 'Add New Service'}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'لا توجد خدمات بعد' : 'No services yet'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isRTL 
                ? 'ابدأ بإضافة خدمتك الأولى وشاركها مع آلاف العملاء المحتملين على المنصة'
                : 'Start by adding your first service and share it with thousands of potential clients on the platform'
              }
            </p>
            <Link to="/add-service">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-5 h-5 mr-2" />
                {isRTL ? 'إضافة خدمة' : 'Add Service'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => {
              const sId = service.serviceId ?? Number(service.id);
              const statusColors: Record<string, string> = {
                ACTIVE: 'bg-green-100 text-green-700',
                APPROVED: 'bg-green-100 text-green-700',
                PENDING: 'bg-yellow-100 text-yellow-700',
                INACTIVE: 'bg-red-100 text-red-700',
              };
              return (
                <div key={sId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {service.thumbnail && (
                    <img src={service.thumbnail} alt={service.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{service.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[service.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                        {service.status}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-teal-600 mb-3">${service.price}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(sId)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        {isRTL ? 'حذف' : 'Delete'}
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
