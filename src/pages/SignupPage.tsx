import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FormInput } from '../components/auth/FormInput';
import { SocialButton } from '../components/auth/SocialButton';
import { PasswordStrength } from '../components/auth/PasswordStrength';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, ShoppingCart, Briefcase } from 'lucide-react';
import { 
  validateEmail, 
  validatePassword,
} from '../utils/validation';
import logo from 'figma:asset/5641928ebf37f4553480c47d5388ea1a15d27a75.png';

type AccountType = 'customer' | 'expert';


export function SignupPage() {
  const { isRTL } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    newsletter: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password match validation
  useEffect(() => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match' 
      }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  }, [formData.password, formData.confirmPassword, isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = isRTL ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = isRTL ? 'البريد الإلكتروني غير صالح' : 'Invalid email';
    }
    if (!validatePassword(formData.password).valid) {
      newErrors.password = isRTL ? 'كلمة المرور لا تستوفي المتطلبات' : 'Password does not meet requirements';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.terms = isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        userType: accountType,
      });

      if (result.success) {
        if (accountType === 'customer') {
          navigate('/');
        } else {
          navigate('/expert-setup');
        }
      } else {
        setErrors({
          general: result.error || (isRTL ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred while creating the account'),
        });
      }
    } catch (error) {
      setErrors({
        general: isRTL ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.fullName.length >= 2 &&
    validateEmail(formData.email) &&
    validatePassword(formData.password).valid &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms;

  return (
    <div className={`min-h-screen flex ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Import Cairo font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(${isRTL ? '-' : ''}30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        .animate-slide-in {
          animation: slide-in-right 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.2s both;
        }

        .morph-bg {
          animation: morph 8s ease-in-out infinite;
        }
      `}</style>

      {/* Left Side - Form (60% on desktop) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md animate-slide-in py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="aSERVICEz" className="h-12 w-auto" />
            </Link>
            
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-2 mb-8"
            >
              <ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isRTL ? 'إنشاء حساب جديد' : 'Create New Account'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'انضم إلينا وابدأ رحلتك الآن' : 'Join us and start your journey now'}
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isRTL ? 'نوع الحساب' : 'Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${accountType === 'customer' 
                    ? 'border-teal-600 bg-teal-50 shadow-md' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                  }
                `}
              >
                <ShoppingCart className={`w-8 h-8 mx-auto mb-2 ${
                  accountType === 'customer' ? 'text-teal-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-semibold text-gray-900">
                  {isRTL ? 'عميل' : 'Customer'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'أبحث عن خدمات' : 'Looking for services'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('expert')}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${accountType === 'expert' 
                    ? 'border-teal-600 bg-teal-50 shadow-md' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                  }
                `}
              >
                <Briefcase className={`w-8 h-8 mx-auto mb-2 ${
                  accountType === 'expert' ? 'text-teal-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-semibold text-gray-900">
                  {isRTL ? 'خبير' : 'Expert'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'أقدم خدمات' : 'Offering services'}
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label={isRTL ? 'الاسم الكامل' : 'Full Name'}
              type="text"
              placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              icon={<User className="w-5 h-5" />}
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              error={errors.fullName}
              isRTL={isRTL}
            />

            <FormInput
              label={isRTL ? 'البريد الإلكتروني' : 'Email'}
              type="email"
              placeholder="example@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              isRTL={isRTL}
            />

            <div>
              <FormInput
                label={isRTL ? 'كلمة المرور' : 'Password'}
                type="password"
                placeholder={isRTL ? 'أدخل كلمة مرور قوية' : 'Enter a strong password'}
                icon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                showPasswordToggle
                isRTL={isRTL}
              />
              <PasswordStrength password={formData.password} isRTL={isRTL} />
            </div>

            <FormInput
              label={isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              type="password"
              placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
              }}
              error={errors.confirmPassword}
              validationState={
                formData.confirmPassword 
                  ? (formData.password === formData.confirmPassword ? 'success' : 'error')
                  : 'idle'
              }
              successMessage={isRTL ? 'متطابقة' : 'Matched'}
              showPasswordToggle
              isRTL={isRTL}
            />

            <FormInput
              label={isRTL ? 'رقم الجوال (اختياري)' : 'Phone Number (Optional)'}
              type="tel"
              placeholder="+966 5X XXX XXXX"
              icon={<Phone className="w-5 h-5" />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              isRTL={isRTL}
            />

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => {
                    setFormData({ ...formData, agreeToTerms: e.target.checked });
                    if (errors.terms) setErrors({ ...errors, terms: '' });
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  {isRTL ? 'أوافق على ' : 'I agree to '}
                  <a href="#" className="text-teal-600 hover:text-teal-700 underline">
                    {isRTL ? 'شروط الاستخدام' : 'Terms of Use'}
                  </a>
                  {isRTL ? ' و' : ' and '}
                  <a href="#" className="text-teal-600 hover:text-teal-700 underline">
                    {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Newsletter */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                {isRTL 
                  ? 'أرغب في تلقي العروض والأخبار عبر البريد الإلكتروني' 
                  : 'I want to receive offers and news via email'}
              </span>
            </label>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRTL ? 'جاري الإنشاء...' : 'Creating...'}
                </>
              ) : (
                isRTL ? 'إنشاء حساب' : 'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">
                  {isRTL ? 'أو سجل باستخدام' : 'Or sign up with'}
                </span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="space-y-3">
              <SocialButton provider="google" isRTL={isRTL} />
              <SocialButton provider="facebook" isRTL={isRTL} />
              <SocialButton provider="apple" isRTL={isRTL} />
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                {isRTL ? 'سجل الدخول' : 'Sign in'}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Dynamic Visual Panel (40% on desktop) */}
      <div className={`
        hidden lg:flex w-[40%] p-12 items-center justify-center animate-fade-in
        transition-all duration-500
        ${accountType === 'customer' 
          ? 'bg-gradient-to-br from-teal-600 to-blue-600' 
          : 'bg-gradient-to-br from-orange-600 to-purple-600'
        }
      `}>
        <div className="text-white space-y-8 max-w-md">
          {/* Icon */}
          <div className="text-7xl mb-6 transform transition-transform duration-500 hover:scale-110">
            {accountType === 'customer' ? '🛒' : '💼'}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              {accountType === 'customer' 
                ? (isRTL ? 'ابدأ في إيجاد الخدمات التي تحتاجها' : 'Start Finding the Services You Need')
                : (isRTL ? 'ابدأ في عرض خدماتك واكسب المال' : 'Start Offering Your Services and Earn Money')
              }
            </h2>
          </div>

          <div className="space-y-4">
            {accountType === 'customer' ? (
              <>
                {[
                  { icon: '✓', text: isRTL ? 'تصفح آلاف الخدمات' : 'Browse thousands of services' },
                  { icon: '✓', text: isRTL ? 'اطلب بكل سهولة' : 'Order easily' },
                  { icon: '✓', text: isRTL ? 'ادفع بأمان' : 'Pay securely' },
                  { icon: '✓', text: isRTL ? 'تواصل مع الخبراء' : 'Communicate with experts' },
                  { icon: '✓', text: isRTL ? 'قيّم الخدمات' : 'Rate services' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-lg">
                    <span className="text-2xl font-bold text-teal-200">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { icon: '✓', text: isRTL ? 'أنشئ خدماتك بسهولة' : 'Create your services easily' },
                  { icon: '✓', text: isRTL ? 'حدد أسعارك' : 'Set your prices' },
                  { icon: '✓', text: isRTL ? 'استلم طلبات العملا��' : 'Receive customer orders' },
                  { icon: '✓', text: isRTL ? 'احصل على أرباحك' : 'Get your earnings' },
                  { icon: '✓', text: isRTL ? 'بني سمعتك' : 'Build your reputation' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-lg">
                    <span className="text-2xl font-bold text-orange-200">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Decorative Background Shape */}
          <div className={`
            absolute top-20 ${isRTL ? 'left-10' : 'right-10'} w-64 h-64 opacity-10
            morph-bg
            ${accountType === 'customer' ? 'bg-teal-300' : 'bg-orange-300'}
          `} />
        </div>
      </div>
    </div>
  );
}