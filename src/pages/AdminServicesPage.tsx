import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';

export function AdminServicesPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: 'SRV-001',
      title: 'Professional Logo Design',
      titleAr: 'تصميم شعار احترافي',
      expert: 'Ahmed Hassan',
      price: '$100',
      status: 'pending',
      submittedDate: '2024-02-05',
      category: 'Design',
      description: 'I will create a modern, professional logo for your business...',
      images: 3
    },
    {
      id: 'SRV-002',
      title: 'Website Development',
      titleAr: 'تطوير الموقع',
      expert: 'Fatima Said',
      price: '$500',
      status: 'pending',
      submittedDate: '2024-02-04',
      category: 'Programming',
      description: 'Full-stack web development service...',
      images: 5
    }
  ];

  const service = services.find(s => s.id === selectedService);

  const complianceChecklist = [
    { item: 'Title is clear and descriptive', itemAr: 'العنوان واضح ووصفي', checked: true },
    { item: 'Description meets minimum length', itemAr: 'الوصف يلبي الحد الأدنى', checked: true },
    { item: 'Pricing is within guidelines', itemAr: 'التسعير ضمن الإرشادات', checked: true },
    { item: 'Images meet quality standards', itemAr: 'الصور تلبي معايير الجودة', checked: false },
    { item: 'No prohibited content', itemAr: 'لا محتوى محظور', checked: true }
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'الموافقة على الخدمات' : 'Service Approval Queue'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'مراجعة والموافقة على الخدمات المقدمة' : 'Review and approve submitted services'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'قيد الانتظار' : 'Pending'}</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'متوسط الوقت' : 'Avg Time'}</p>
                <p className="text-2xl font-bold text-gray-900">4.2h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'اليوم' : 'Today'}</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'معدل الرفض' : 'Rejection Rate'}</p>
                <p className="text-2xl font-bold text-gray-900">8%</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Queue */}
          <div className={selectedService ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{isRTL ? 'قائمة الانتظار' : 'Approval Queue'}</h2>

              <div className="space-y-3">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService === s.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{isRTL ? s.titleAr : s.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{s.expert}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-teal-600">{s.price}</span>
                          <span className="text-xs text-gray-500">• {s.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Review */}
          {selectedService && service && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{isRTL ? 'مراجعة الخدمة' : 'Service Review'}</h2>
                  <Button onClick={() => setSelectedService(null)} variant="ghost" size="sm">✕</Button>
                </div>

                {/* Service Details */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{isRTL ? service.titleAr : service.title}</h3>
                      <p className="text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {service.price}
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          {service.images} {isRTL ? 'صور' : 'images'}
                        </span>
                        <span className="text-gray-500">{service.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Info */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">{isRTL ? 'معلومات الخبير' : 'Expert Information'}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {service.expert.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.expert}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9 (156 {isRTL ? 'تقييم' : 'reviews'})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{isRTL ? 'التحقق من الامتثال' : 'Compliance Verification'}</h3>
                  <div className="space-y-2">
                    {complianceChecklist.map((item, index) => (
                      <label key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={item.checked}
                          className="w-5 h-5 text-teal-600 rounded"
                          readOnly
                        />
                        <span className="text-sm text-gray-900">{isRTL ? item.itemAr : item.item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rejection Feedback */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? 'ملاحظات الرفض (اختياري)' : 'Rejection Feedback (Optional)'}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder={isRTL ? 'قدم ملاحظات للتحسين...' : 'Provide feedback for improvement...'}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isRTL ? 'الموافقة على الخدمة' : 'Approve Service'}
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" />
                    {isRTL ? 'رفض الخدمة' : 'Reject Service'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
