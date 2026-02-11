import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { adminApi, type ServiceResponse } from '../services/api';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Image as ImageIcon,
  DollarSign,
  Loader2
} from 'lucide-react';

export function AdminServicesPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  const fetchPendingServices = () => {
    setIsLoading(true);
    adminApi.getPendingServices()
      .then(res => setServices(res.data || []))
      .catch(() => setServices([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPendingServices();
  }, []);

  const selectedService = services.find(s => (s.serviceId ?? s.id) === selectedServiceId);

  const handleApprove = async (serviceId: number) => {
    setActionLoading(true);
    try {
      await adminApi.approveService(serviceId, 'ACTIVE');
      fetchPendingServices();
      setSelectedServiceId(null);
    } catch (err) {
      console.error('Failed to approve service:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (serviceId: number) => {
    setActionLoading(true);
    try {
      await adminApi.approveService(serviceId, 'INACTIVE');
      fetchPendingServices();
      setSelectedServiceId(null);
      setRejectionNote('');
    } catch (err) {
      console.error('Failed to reject service:', err);
    } finally {
      setActionLoading(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'قيد الانتظار' : 'Pending'}</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي للمراجعة' : 'To Review'}</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Queue */}
          <div className={selectedServiceId ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{isRTL ? 'قائمة الانتظار' : 'Approval Queue'}</h2>

              {services.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">{isRTL ? 'لا توجد خدمات بانتظار الموافقة' : 'No pending services'}</p>
                </div>
              ) : (
              <div className="space-y-3">
                {services.map((s) => {
                  const sId = s.serviceId ?? Number(s.id);
                  return (
                  <div
                    key={sId}
                    onClick={() => setSelectedServiceId(sId)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedServiceId === sId ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {s.thumbnail ? (
                        <img src={s.thumbnail} alt={s.title} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{s.expert?.name || '—'}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-teal-600">${s.price}</span>
                          <span className="text-xs text-gray-500">• {s.category?.name || ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>

          {/* Service Review */}
          {selectedServiceId && selectedService && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{isRTL ? 'مراجعة الخدمة' : 'Service Review'}</h2>
                  <Button onClick={() => setSelectedServiceId(null)} variant="ghost" size="sm">✕</Button>
                </div>

                {/* Service Details */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    {selectedService.thumbnail ? (
                      <img src={selectedService.thumbnail} alt={selectedService.title} className="w-32 h-32 rounded-lg object-cover" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedService.title}</h3>
                      <p className="text-gray-600 mb-2">{selectedService.description || '—'}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${selectedService.price}
                        </span>
                        {selectedService.duration && (
                          <span className="text-gray-500">{selectedService.duration} {isRTL ? 'أيام' : 'days'}</span>
                        )}
                        <span className="text-gray-500">{selectedService.category?.name || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Info */}
                {selectedService.expert && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">{isRTL ? 'معلومات الخبير' : 'Expert Information'}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedService.expert.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedService.expert.name}</p>
                      {selectedService.expert.rating != null && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedService.expert.rating}</span>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {/* Rejection Feedback */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? 'ملاحظات الرفض (اختياري)' : 'Rejection Feedback (Optional)'}
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder={isRTL ? 'قدم ملاحظات للتحسين...' : 'Provide feedback for improvement...'}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={actionLoading}
                    onClick={() => handleApprove(selectedServiceId)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isRTL ? 'الموافقة على الخدمة' : 'Approve Service'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    disabled={actionLoading}
                    onClick={() => handleReject(selectedServiceId)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {isRTL ? 'رفض الخدمة' : 'Reject Service'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
