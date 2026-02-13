import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  Check, 
  CheckCircle, 
  Package, 
  FileText, 
  ChevronRight,
  Info,
  Clock,
  Star,
  Loader2,
  AlertCircle,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { serviceApi, orderApi, type ServiceResponse } from '../services/api';

export function PlaceOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const [service, setService] = useState<ServiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [requirements, setRequirements] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/place-order/${id}`);
    } else if (user?.role !== 'customer') {
      navigate(`/service/${id}`);
    }
  }, [isAuthenticated, user, navigate, id]);

  // Fetch service details
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    serviceApi.getById(id)
      .then(res => {
        setService(res.data);
        // Set default delivery date based on service delivery time
        if (res.data.deliveryTime) {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + res.data.deliveryTime);
          setDeliveryDate(defaultDate.toISOString().split('T')[0]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch service:', err);
        setError(err.message || 'Failed to load service');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const steps = [
    { number: 1, label: isRTL ? 'تفاصيل الخدمة' : 'Service Details', icon: Package },
    { number: 2, label: isRTL ? 'متطلبات المشروع' : 'Requirements', icon: FileText },
    { number: 3, label: isRTL ? 'التأكيد' : 'Confirmation', icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!service) return;
    
    setIsSubmitting(true);
    try {
      const res = await orderApi.placeOrder({
        serviceId: Number(service.id),
        requirements: requirements || undefined,
        deliveryDeadline: deliveryDate || undefined
      });
      
      setOrderId(res.data.orderId);
      setOrderSuccess(true);
      setCurrentStep(3);
    } catch (err: any) {
      alert(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRTL ? 'الخدمة غير موجودة' : 'Service Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">{error || (isRTL ? 'لم يتم العثور على الخدمة المطلوبة' : 'The requested service could not be found')}</p>
          <Link to="/browse">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
            </Button>
          </Link>
        </div>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

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
        {/* Back Button */}
        <Link to={`/service/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition-colors">
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {isRTL ? 'العودة للخدمة' : 'Back to Service'}
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number || orderSuccess;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : isActive 
                        ? 'bg-white border-teal-600 text-teal-600'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive || isCompleted ? 'text-teal-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 ${
                      currentStep > step.number || orderSuccess ? 'bg-teal-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Step 1: Service Details */}
          {currentStep === 1 && (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'تفاصيل الخدمة' : 'Service Details'}
              </h2>

              {/* Service Card */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex gap-4">
                  {service.thumbnail && (
                    <img
                      src={service.thumbnail}
                      alt={service.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                    {service.expert && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs">
                          {service.expert.name?.charAt(0).toUpperCase() || 'E'}
                        </div>
                        <span>{service.expert.name}</span>
                        {service.expert.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.expert.rating}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {service.category && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {service.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">{isRTL ? 'السعر' : 'Price'}</p>
                  <p className="text-2xl font-bold text-gray-900">${service.price}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">{isRTL ? 'مدة التسليم' : 'Delivery Time'}</p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    {service.deliveryTime || '?'} {isRTL ? 'أيام' : 'days'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {service.description && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{isRTL ? 'وصف الخدمة' : 'Service Description'}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              )}

              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm">
                    {isRTL 
                      ? 'بعد تقديم الطلب، سيقوم الخبير بمراجعته وقبوله أو رفضه. سيتم إشعارك بالنتيجة.'
                      : 'After placing the order, the expert will review and accept or decline it. You will be notified of the result.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 2 && (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'متطلبات المشروع' : 'Project Requirements'}
              </h2>

              {/* Requirements Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'وصف متطلباتك *' : 'Describe Your Requirements *'}
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                  placeholder={isRTL 
                    ? 'اشرح بالتفصيل ما تحتاجه من هذه الخدمة...\n\nمثال:\n- الألوان المفضلة\n- أي ملفات مرجعية\n- متطلبات خاصة'
                    : 'Explain in detail what you need from this service...\n\nExample:\n- Preferred colors\n- Any reference files\n- Special requirements'
                  }
                />
              </div>

              {/* Delivery Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'تاريخ التسليم المطلوب (اختياري)' : 'Requested Delivery Date (Optional)'}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {isRTL 
                    ? `الحد الأدنى للتسليم: ${service.deliveryTime || '?'} أيام`
                    : `Minimum delivery time: ${service.deliveryTime || '?'} days`
                  }
                </p>
              </div>

              {/* Tips */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h4 className="font-medium text-teal-800 mb-2">
                  {isRTL ? '💡 نصائح للحصول على أفضل النتائج' : '💡 Tips for Best Results'}
                </h4>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>• {isRTL ? 'كن محدداً قدر الإمكان في وصف متطلباتك' : 'Be as specific as possible in describing your requirements'}</li>
                  <li>• {isRTL ? 'قدم أمثلة أو مراجع إن وجدت' : 'Provide examples or references if available'}</li>
                  <li>• {isRTL ? 'حدد أي قيود أو تفضيلات مهمة' : 'Mention any important constraints or preferences'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="p-6 lg:p-8 text-center">
              {orderSuccess ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isRTL ? 'تم تقديم الطلب بنجاح!' : 'Order Placed Successfully!'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {isRTL 
                      ? `رقم الطلب: #${orderId}. سيقوم الخبير بمراجعة طلبك قريباً.`
                      : `Order ID: #${orderId}. The expert will review your order soon.`
                    }
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <h4 className="font-medium text-gray-900 mb-2">{isRTL ? 'ملخص الطلب' : 'Order Summary'}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'الخدمة' : 'Service'}</span>
                        <span className="font-medium">{service.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRTL ? 'المبلغ' : 'Amount'}</span>
                        <span className="font-medium">${service.price}</span>
                      </div>
                      {deliveryDate && (
                        <div className="flex justify-between">
                          <span>{isRTL ? 'التسليم المتوقع' : 'Expected Delivery'}</span>
                          <span className="font-medium">{deliveryDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to={`/order-detail/${orderId}`}>
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                        {isRTL ? 'عرض تفاصيل الطلب' : 'View Order Details'}
                      </Button>
                    </Link>
                    <Link to="/orders">
                      <Button variant="outline" className="border-gray-300">
                        {isRTL ? 'عرض جميع الطلبات' : 'View All Orders'}
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isRTL ? 'تأكيد الطلب' : 'Confirm Order'}
                  </h2>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                    <h4 className="font-medium text-gray-900 mb-4 text-center">
                      {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                    </h4>
                    
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex gap-3">
                        {service.thumbnail && (
                          <img
                            src={service.thumbnail}
                            alt={service.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{service.title}</h5>
                          {service.expert && (
                            <p className="text-sm text-gray-500">{isRTL ? 'بواسطة' : 'by'} {service.expert.name}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'سعر الخدمة' : 'Service Price'}</span>
                        <span className="font-medium">${service.price}</span>
                      </div>
                      {deliveryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{isRTL ? 'التسليم المتوقع' : 'Expected Delivery'}</span>
                          <span className="font-medium">{deliveryDate}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                          <span className="text-teal-600">${service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {requirements && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                      <h5 className="font-medium text-blue-800 mb-2">{isRTL ? 'متطلباتك' : 'Your Requirements'}</h5>
                      <p className="text-sm text-blue-700 whitespace-pre-wrap">{requirements}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {!orderSuccess && (
            <div className="px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              {currentStep > 1 ? (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="border-gray-300"
                >
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isRTL ? 'التالي' : 'Next'}
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isRTL ? 'جاري التقديم...' : 'Placing Order...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'تأكيد الطلب' : 'Confirm Order'}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
