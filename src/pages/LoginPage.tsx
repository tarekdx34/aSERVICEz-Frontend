import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FormInput } from '../components/auth/FormInput';
import { SocialButton } from '../components/auth/SocialButton';
import { Mail, Lock, ArrowRight, Loader2, Zap } from 'lucide-react';
import logo from 'figma:asset/5641928ebf37f4553480c47d5388ea1a15d27a75.png';

export function LoginPage() {
  const { isRTL } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accountType: 'customer' as 'customer' | 'expert',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await login(formData.email, formData.password, formData.accountType);
      
      if (success) {
        // Navigate based on account type
        if (formData.accountType === 'expert') {
          navigate('/add-service');
        } else {
          navigate('/');
        }
      } else {
        setErrors({
          general: isRTL 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            : 'Invalid email or password',
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

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Handle social login
  };

  // Dev quick login functions
  const handleDevLogin = async (role: 'customer' | 'expert' | 'admin') => {
    setIsLoading(true);
    try {
      const emails = {
        customer: 'customer@aservicea.com',
        expert: 'expert@aservicea.com',
        admin: 'admin@aservicea.com'
      };
      
      await login(emails[role], 'password', role === 'admin' ? 'expert' : role);
      
      // Navigate based on role
      if (role === 'expert') {
        navigate('/expert-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Dev login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

        .animate-slide-in {
          animation: slide-in-right 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.2s both;
        }
      `}</style>

      {/* Left Side - Form (60% on desktop) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md animate-slide-in">
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
              {isRTL ? 'مرحباً بعودتك!' : 'Welcome Back!'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'سجل دخولك للوصول إلى حسابك' : 'Sign in to access your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label={isRTL ? 'البريد الإلكتروني أو اسم المتخدم' : 'Email or Username'}
              type="email"
              placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              isRTL={isRTL}
            />

            <FormInput
              label={isRTL ? 'كلمة المرور' : 'Password'}
              type="password"
              placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
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

            {/* Account Type Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                {isRTL ? 'نوع الحساب' : 'Account Type'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'customer' })}
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    formData.accountType === 'customer'
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300'
                  }`}
                >
                  👤 {isRTL ? 'عميل' : 'Customer'}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: 'expert' })}
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    formData.accountType === 'expert'
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300'
                  }`}
                >
                  ⭐ {isRTL ? 'خبير' : 'Expert'}
                </button>
              </div>
            </div>

            {/* Demo Credentials Helper */}
            {formData.accountType && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <p className="font-semibold text-blue-900 mb-1">
                  💡 {isRTL ? 'بيانات تجريبية:' : 'Demo Credentials:'}
                </p>
                <div className="text-blue-800 space-y-0.5">
                  {formData.accountType === 'expert' ? (
                    <>
                      <p>📧 expert@aservicea.com</p>
                      <p>🔐 Expert123!</p>
                    </>
                  ) : (
                    <>
                      <p>📧 customer@aservicea.com</p>
                      <p>🔐 Customer123!</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  {isRTL ? 'تذكرني' : 'Remember me'}
                </span>
              </label>

              <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </>
              ) : (
                isRTL ? 'تسجيل الدخول' : 'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">
                  {isRTL ? 'أو' : 'or'}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <SocialButton provider="google" isRTL={isRTL} onClick={() => handleSocialLogin('google')} />
              <SocialButton provider="facebook" isRTL={isRTL} onClick={() => handleSocialLogin('facebook')} />
              <SocialButton provider="apple" isRTL={isRTL} onClick={() => handleSocialLogin('apple')} />
            </div>

            {/* DEV: Quick Login Buttons */}
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-purple-900 uppercase">
                  {isRTL ? 'وضع التطوير - تسجيل سريع' : 'Dev Mode - Quick Login'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDevLogin('customer')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  👤 {isRTL ? 'عميل' : 'Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDevLogin('expert')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⭐ {isRTL ? 'خبير' : 'Expert'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDevLogin('admin')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🛡️ {isRTL ? 'مسؤول' : 'Admin'}
                </button>
              </div>
            </div>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
                {isRTL ? 'سجل الآن' : 'Sign up now'}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Visual Panel (40% on desktop) */}
      <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-teal-600 to-emerald-600 p-12 items-center justify-center animate-fade-in">
        <div className="text-white space-y-8 max-w-md">
          {/* Floating Icons */}
          <div className="flex gap-4 text-6xl mb-8 opacity-20">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎨</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>💻</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✍️</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>📱</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              {isRTL 
                ? 'انضم لأكبر منصة خدمات رقمية في الوطن العربي' 
                : 'Join the Largest Digital Services Platform in the Arab World'}
            </h2>
            <p className="text-teal-100 text-lg">
              {isRTL 
                ? 'سواء كنت تبحث عن خدمة أو تقدم خدماتك' 
                : 'Whether you\'re looking for a service or offering your services'}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '✓', text: isRTL ? 'آلاف الخدمات المتنوعة' : 'Thousands of diverse services' },
              { icon: '✓', text: isRTL ? 'خبراء محترفون موثوقون' : 'Trusted professional experts' },
              { icon: '✓', text: isRTL ? 'دفع آمن ومضمون 🔒' : 'Secure and guaranteed payment 🔒' },
              { icon: '✓', text: isRTL ? 'دعم فني 24/7' : '24/7 technical support' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-lg">
                <span className="text-2xl font-bold text-teal-200">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}