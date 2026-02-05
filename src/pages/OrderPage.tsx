import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  Check, 
  Upload, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Package, 
  FileText, 
  DollarSign,
  ChevronRight,
  Info,
  Clock,
  Star
} from 'lucide-react';

// Mock service data - in real app this would come from API
const mockService = {
  id: '1',
  title: 'Professional Logo Design with Brand Guidelines',
  titleAr: 'تصميم شعار احترافي مع دليل الهوية البصرية',
  expert: {
    name: 'Ahmed Hassan',
    nameAr: 'أحمد حسن',
    avatar: 'AH',
    rating: 4.9,
    reviewCount: 127
  },
  packages: [
    {
      id: 'basic',
      name: 'Basic',
      nameAr: 'الأساسية',
      price: 50,
      deliveryDays: 3,
      features: ['1 Logo Concept', '2 Revisions', 'High-Res Files'],
      featuresAr: ['تصميم شعار واحد', 'تعديلان', 'ملفات عالية الدقة']
    },
    {
      id: 'standard',
      name: 'Standard',
      nameAr: 'القياسية',
      price: 100,
      deliveryDays: 5,
      features: ['3 Logo Concepts', '5 Revisions', 'High-Res Files', 'Vector Source'],
      featuresAr: ['3 تصاميم شعار', '5 تعديلات', 'ملفات عالية الدقة', 'ملفات فيكتور']
    },
    {
      id: 'premium',
      name: 'Premium',
      nameAr: 'المتقدمة',
      price: 200,
      deliveryDays: 7,
      features: ['5 Logo Concepts', 'Unlimited Revisions', 'High-Res Files', 'Vector Source', 'Brand Guidelines'],
      featuresAr: ['5 تصاميم شعار', 'تعديلات غير محدودة', 'ملفات عالية الدقة', 'ملفات فيكتور', 'دليل الهوية']
    }
  ],
  addons: [
    { id: '1', name: 'Express Delivery', nameAr: 'توصيل سريع', price: 20, days: -1 },
    { id: '2', name: 'Extra Revision', nameAr: 'تعديل إضافي', price: 15 },
    { id: '3', name: 'Social Media Kit', nameAr: 'حزمة السوشيال ميديا', price: 30 },
    { id: '4', name: '3D Mockups', nameAr: 'نماذج ثلاثية الأبعاد', price: 25 }
  ]
};

export function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(mockService.packages[1]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [orderId] = useState(`ORD-${Date.now()}`);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const steps = [
    { number: 1, label: isRTL ? 'اختيار الخدمة' : 'Service Selection', icon: Package },
    { number: 2, label: isRTL ? 'متطلبات المشروع' : 'Requirements', icon: FileText },
    { number: 3, label: isRTL ? 'الدفع' : 'Payment', icon: DollarSign },
    { number: 4, label: isRTL ? 'التأكيد' : 'Confirmation', icon: CheckCircle }
  ];

  // Calculate total price
  const calculateTotal = () => {
    let total = selectedPackage.price;
    selectedAddons.forEach(addonId => {
      const addon = mockService.addons.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    return total;
  };

  // Calculate delivery time
  const calculateDelivery = () => {
    let days = selectedPackage.deliveryDays;
    selectedAddons.forEach(addonId => {
      const addon = mockService.addons.find(a => a.id === addonId);
      if (addon?.days) days += addon.days;
    });
    return Math.max(days, 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleNext = () => {
    if (currentStep < 4) {
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
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep > step.number 
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : currentStep === step.number
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step.number ? 'text-teal-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step.number ? 'bg-teal-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isRTL ? 'اختر الباقة المناسبة' : 'Choose Your Package'}
                    </h2>
                    <p className="text-gray-600">
                      {isRTL ? 'اختر الباقة التي تناسب احتياجاتك' : 'Select the package that best fits your needs'}
                    </p>
                  </div>

                  {/* Service Info */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {mockService.expert.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {isRTL ? mockService.titleAr : mockService.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {isRTL ? mockService.expert.nameAr : mockService.expert.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{mockService.expert.rating}</span>
                          <span className="text-sm text-gray-500">({mockService.expert.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      {isRTL ? 'الباقات المتاحة' : 'Available Packages'}
                    </h3>
                    {mockService.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPackage.id === pkg.id
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {isRTL ? pkg.nameAr : pkg.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {pkg.deliveryDays} {isRTL ? 'أيام' : 'days'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-teal-600">${pkg.price}</span>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {(isRTL ? pkg.featuresAr : pkg.features).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      {isRTL ? 'إضافات اختيارية' : 'Optional Add-ons'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {mockService.addons.map((addon) => (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddons.includes(addon.id)
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {isRTL ? addon.nameAr : addon.name}
                              </h4>
                              {addon.days && (
                                <span className="text-xs text-gray-600">
                                  {addon.days > 0 ? '+' : ''}{addon.days} {isRTL ? 'يوم' : 'days'}
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-teal-600">+${addon.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Requirements */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isRTL ? 'متطلبات المشروع' : 'Project Requirements'}
                    </h2>
                    <p className="text-gray-600">
                      {isRTL ? 'قدم تفاصيل مشروعك لمساعدة الخبير على فهم احتياجاتك' : 'Provide project details to help the expert understand your needs'}
                    </p>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'وصف المشروع *' : 'Project Description *'}
                    </label>
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      placeholder={isRTL ? 'اشرح بالتفصيل ما تحتاجه...' : 'Describe in detail what you need...'}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {isRTL ? 'حد أدنى 50 حرف' : 'Minimum 50 characters'}
                    </p>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'رفع الملفات' : 'Upload Files'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">
                        {isRTL ? 'اسحب الملفات وأفلتها هنا أو' : 'Drag and drop files here or'}
                      </p>
                      <label className="inline-block">
                        <span className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
                          {isRTL ? 'تصفح الملفات' : 'Browse Files'}
                        </span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        {isRTL ? 'PNG, JPG, PDF حتى 10MB' : 'PNG, JPG, PDF up to 10MB'}
                      </p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <FileText className="w-4 h-4 text-teal-600" />
                            <span>{file.name}</span>
                            <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'تعليمات خاصة' : 'Special Instructions'}
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      placeholder={isRTL ? 'أي ملاحظات أو تفضيلات إضافية...' : 'Any additional notes or preferences...'}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isRTL ? 'معلومات الدفع' : 'Payment Information'}
                    </h2>
                    <p className="text-gray-600">
                      {isRTL ? 'اختر طريقة الدفع المفضلة لديك' : 'Choose your preferred payment method'}
                    </p>
                  </div>

                  {/* Escrow Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        {isRTL ? 'حماية الدفع بنظام الضمان' : 'Payment Protection with Escrow'}
                      </h4>
                      <p className="text-sm text-blue-800">
                        {isRTL 
                          ? 'أموالك محمية. لن يتم تحويل المبلغ للبائع إلا بعد اكتمال الطلب بنجاح ورضاك التام.'
                          : 'Your money is protected. Funds are only released to the seller after successful order completion and your satisfaction.'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </label>
                    
                    <div
                      onClick={() => setPaymentMethod('credit-card')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'credit-card'
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {isRTL ? 'بطاقة ائتمان / خصم' : 'Credit / Debit Card'}
                          </h4>
                          <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('paypal')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          P
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">PayPal</h4>
                          <p className="text-sm text-gray-600">{isRTL ? 'دفع آمن عبر PayPal' : 'Secure payment via PayPal'}</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('bank-transfer')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'bank-transfer'
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {isRTL ? 'تحويل بنكي' : 'Bank Transfer'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {isRTL ? 'التحويل المباشر إلى الحساب البنكي' : 'Direct transfer to bank account'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                      <span className="text-sm text-gray-700">
                        {isRTL 
                          ? 'أوافق على شروط الخدمة وسياسة الخصوصية والشروط الإضافية'
                          : 'I agree to the Terms of Service, Privacy Policy, and additional terms'
                        }
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isRTL ? 'تم تأكيد طلبك بنجاح!' : 'Order Confirmed Successfully!'}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {isRTL ? 'شكراً لك! تم استلام طلبك وسيبدأ الخبير العمل عليه قريباً' : 'Thank you! Your order has been received and the expert will start working on it soon'}
                  </p>

                  {/* Order ID */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                    <div className="text-sm text-gray-600 mb-1">
                      {isRTL ? 'رقم الطلب' : 'Order ID'}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 font-mono">
                      {orderId}
                    </div>
                  </div>

                  {/* Order Details Summary */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'الخدمة:' : 'Service:'}</span>
                        <span className="font-medium text-gray-900">
                          {isRTL ? mockService.titleAr : mockService.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'الباقة:' : 'Package:'}</span>
                        <span className="font-medium text-gray-900">
                          {isRTL ? selectedPackage.nameAr : selectedPackage.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'وقت التسليم:' : 'Delivery Time:'}</span>
                        <span className="font-medium text-gray-900">
                          {calculateDelivery()} {isRTL ? 'أيام' : 'days'}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="text-gray-600">{isRTL ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                        <span className="font-bold text-teal-600 text-lg">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      {isRTL ? 'الخطوات القادمة' : 'Next Steps'}
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          {isRTL 
                            ? 'سيراجع الخبير متطلباتك ويبدأ العمل على المشروع'
                            : 'The expert will review your requirements and start working on the project'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          {isRTL 
                            ? 'ستتلقى إشعارات بالتحديثات عبر البريد الإلكتروني'
                            : 'You will receive email notifications about updates'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          {isRTL 
                            ? 'يمكنك متابعة حالة الطلب من صفحة "طلباتي"'
                            : 'You can track order status from "My Orders" page'
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          {isRTL 
                            ? 'المبلغ محمي في نظام الضمان حتى اكتمال العمل'
                            : 'Funds are secured in escrow until work completion'
                          }
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/orders">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                        {isRTL ? 'عرض طلباتي' : 'View My Orders'}
                      </Button>
                    </Link>
                    <Link to="/browse">
                      <Button variant="outline" className="border-gray-300 text-gray-700">
                        {isRTL ? 'تصفح المزيد من الخدمات' : 'Browse More Services'}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                    disabled={currentStep === 1}
                  >
                    {isRTL ? 'السابق' : 'Back'}
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {currentStep === 3 
                      ? (isRTL ? 'تأكيد الطلب' : 'Confirm Order')
                      : (isRTL ? 'التالي' : 'Next')
                    }
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{isRTL ? 'الباقة:' : 'Package:'}</span>
                  <span className="font-medium">
                    {isRTL ? selectedPackage.nameAr : selectedPackage.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{isRTL ? 'سعر الباقة:' : 'Package Price:'}</span>
                  <span className="font-medium">${selectedPackage.price}</span>
                </div>

                {selectedAddons.length > 0 && (
                  <>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-700">
                        {isRTL ? 'الإضافات:' : 'Add-ons:'}
                      </span>
                    </div>
                    {selectedAddons.map(addonId => {
                      const addon = mockService.addons.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {isRTL ? addon.nameAr : addon.name}
                          </span>
                          <span className="font-medium">${addon.price}</span>
                        </div>
                      ) : null;
                    })}
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-900">
                    {isRTL ? 'الإجمالي:' : 'Total:'}
                  </span>
                  <span className="text-2xl font-bold text-teal-600">${calculateTotal()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {isRTL ? 'التسليم في' : 'Delivery in'} {calculateDelivery()} {isRTL ? 'أيام' : 'days'}
                  </span>
                </div>
              </div>

              {currentStep < 4 && (
                <div className="bg-teal-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-teal-800">
                      {isRTL 
                        ? 'أموالك محمية بنظام الضمان حتى اكتمال العمل'
                        : 'Your funds are protected with escrow until work completion'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
