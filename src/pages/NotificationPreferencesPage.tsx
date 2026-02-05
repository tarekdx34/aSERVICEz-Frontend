import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  CheckCircle
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  email: boolean;
  inApp: boolean;
}

export function NotificationPreferencesPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [showSuccess, setShowSuccess] = useState(false);

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      label: 'Order Updates',
      labelAr: 'تحديثات الطلبات',
      description: 'Notifications about order status changes, delivery, and completion',
      descriptionAr: 'إشعارات حول تغييرات حالة الطلب والتسليم والإكمال',
      email: true,
      inApp: true
    },
    {
      id: 'messages',
      label: 'Messages',
      labelAr: 'الرسائل',
      description: 'New messages from experts',
      descriptionAr: 'رسائل جديدة من الخبراء',
      email: true,
      inApp: true
    },
    {
      id: 'payment',
      label: 'Payment & Billing',
      labelAr: 'الدفع والفواتير',
      description: 'Payment confirmations, refunds, and billing updates',
      descriptionAr: 'تأكيدات الدفع والمبالغ المستردة وتحديثات الفواتير',
      email: true,
      inApp: true
    },
    {
      id: 'reviews',
      label: 'Review Reminders',
      labelAr: 'تذكيرات المراجعة',
      description: 'Reminders to review completed orders',
      descriptionAr: 'تذكيرات لمراجعة الطلبات المكتملة',
      email: true,
      inApp: true
    },
    {
      id: 'promotions',
      label: 'Promotions & Offers',
      labelAr: 'العروض الترويجية',
      description: 'Special offers, discounts, and promotional campaigns',
      descriptionAr: 'عروض خاصة وخصومات وحملات ترويجية',
      email: false,
      inApp: true
    },
    {
      id: 'tips',
      label: 'Tips & Tutorials',
      labelAr: 'نصائح ودروس',
      description: 'Helpful tips and tutorials to get the most out of the platform',
      descriptionAr: 'نصائح مفيدة ودروس للاستفادة القصوى من المنصة',
      email: false,
      inApp: false
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      labelAr: 'النشرة الإخبارية',
      description: 'Monthly newsletter with platform updates and featured services',
      descriptionAr: 'نشرة شهرية تحتوي على تحديثات المنصة والخدمات المميزة',
      email: false,
      inApp: false
    }
  ]);

  const toggleSetting = (id: string, type: 'email' | 'inApp') => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, [type]: !s[type] } : s
    ));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/notifications" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'العودة إلى الإشعارات' : 'Back to Notifications'}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'اختر كيف ومتى تريد تلقي الإشعارات' : 'Choose how and when you want to receive notifications'}
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">
                {isRTL ? 'تم حفظ التفضيلات بنجاح!' : 'Preferences saved successfully!'}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          {/* Table Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <h3 className="font-semibold text-gray-900">
                  {isRTL ? 'نوع الإشعار' : 'Notification Type'}
                </h3>
              </div>
              <div className="col-span-3 text-center">
                <div className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </span>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <div className="inline-flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    {isRTL ? 'في التطبيق' : 'In-App'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className="divide-y divide-gray-200">
            {settings.map((setting) => (
              <div key={setting.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Label & Description */}
                  <div className="col-span-6">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {isRTL ? setting.labelAr : setting.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isRTL ? setting.descriptionAr : setting.description}
                    </p>
                  </div>

                  {/* Email Toggle */}
                  <div className="col-span-3 flex justify-center">
                    <button
                      onClick={() => toggleSetting(setting.id, 'email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.email ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.email ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* In-App Toggle */}
                  <div className="col-span-3 flex justify-center">
                    <button
                      onClick={() => toggleSetting(setting.id, 'inApp')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.inApp ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.inApp ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {isRTL 
                  ? 'ملاحظة: بعض الإشعارات الهامة لا يمكن تعطيلها لضمان حماية حسابك.'
                  : 'Note: Some critical notifications cannot be disabled to ensure your account security.'
                }
              </p>
              <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white">
                {isRTL ? 'حفظ التفضيلات' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile View Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">
                {isRTL ? 'إشعارات الهاتف المحمول' : 'Mobile Notifications'}
              </p>
              <p>
                {isRTL 
                  ? 'للحصول على إشعارات فورية على هاتفك المحمول، قم بتنزيل تطبيقنا من App Store أو Google Play.'
                  : 'To receive push notifications on your mobile device, download our app from the App Store or Google Play.'
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
