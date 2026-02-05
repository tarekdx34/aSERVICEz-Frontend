import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { Plus, Package } from 'lucide-react';

export function MyServicesPage() {
  const { isRTL, toggleLanguage } = useLanguage();

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

        {/* Empty State */}
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
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
