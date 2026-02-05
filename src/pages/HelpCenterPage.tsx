import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  Search,
  BookOpen,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  User,
  Package,
  DollarSign,
  Settings
} from 'lucide-react';

export function HelpCenterPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'faq'>('articles');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { 
      icon: User, 
      name: 'Getting Started', 
      nameAr: 'البدء', 
      articles: 12,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      icon: Package, 
      name: 'Buying Services', 
      nameAr: 'شراء الخدمات', 
      articles: 18,
      color: 'bg-green-100 text-green-600'
    },
    { 
      icon: TrendingUp, 
      name: 'Selling Services', 
      nameAr: 'بيع الخدمات', 
      articles: 24,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      icon: DollarSign, 
      name: 'Payments & Billing', 
      nameAr: 'الدفع والفواتير', 
      articles: 15,
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      icon: Settings, 
      name: 'Account Settings', 
      nameAr: 'إعدادات الحساب', 
      articles: 10,
      color: 'bg-teal-100 text-teal-600'
    }
  ];

  const popularArticles = [
    { 
      title: 'How to place your first order', 
      titleAr: 'كيفية تقديم طلبك الأول',
      views: 1240,
      category: 'Getting Started',
      categoryAr: 'البدء'
    },
    { 
      title: 'Understanding escrow protection', 
      titleAr: 'فهم حماية الضمان',
      views: 980,
      category: 'Payments',
      categoryAr: 'الدفع'
    },
    { 
      title: 'How to become a verified expert', 
      titleAr: 'كيف تصبح خبيراً موثقاً',
      views: 856,
      category: 'Selling',
      categoryAr: 'البيع'
    },
    { 
      title: 'Request revisions guide', 
      titleAr: 'دليل طلب التعديلات',
      views: 742,
      category: 'Buying',
      categoryAr: 'الشراء'
    }
  ];

  const videos = [
    {
      title: 'Platform Overview - Quick Tour',
      titleAr: 'نظرة عامة على المنصة - جولة سريعة',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      views: 2400
    },
    {
      title: 'How to Find the Right Service',
      titleAr: 'كيفية العثور على الخدمة المناسبة',
      duration: '5:20',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      views: 1800
    },
    {
      title: 'Creating Your Expert Profile',
      titleAr: 'إنشاء ملف الخبير الخاص بك',
      duration: '4:15',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop',
      views: 1520
    },
    {
      title: 'Understanding Order Process',
      titleAr: 'فهم عملية الطلب',
      duration: '6:30',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      views: 1340
    }
  ];

  const faqs = [
    {
      question: 'How long does it take to get verified as an expert?',
      questionAr: 'كم من الوقت يستغرق التحقق كخبير؟',
      answer: 'The verification process typically takes 2-3 business days. You\'ll need to submit your ID, proof of address, and any relevant professional certifications.',
      answerAr: 'تستغرق عملية التحقق عادة 2-3 أيام عمل. ستحتاج إلى تقديم هويتك وإثبات العنوان وأي شهادات مهنية ذات صلة.'
    },
    {
      question: 'What payment methods are accepted?',
      questionAr: 'ما هي طرق الدفع المقبولة؟',
      answer: 'We accept credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers in supported regions.',
      answerAr: 'نقبل بطاقات الائتمان (Visa, Mastercard, Amex) و PayPal والتحويلات البنكية في المناطق المدعومة.'
    },
    {
      question: 'How does the escrow system work?',
      questionAr: 'كيف يعمل نظام الضمان؟',
      answer: 'When you place an order, your payment is held securely in escrow. It\'s only released to the expert after you approve the delivered work.',
      answerAr: 'عند تقديم طلب، يتم الاحتفاظ بدفعتك بأمان في الضمان. يتم تحريرها للخبير فقط بعد موافقتك على العمل المسلم.'
    },
    {
      question: 'Can I request revisions after delivery?',
      questionAr: 'هل يمكنني طلب تعديلات بعد التسليم؟',
      answer: 'Yes, most services include a certain number of revisions. Check the service details for revision policy before ordering.',
      answerAr: 'نعم، تتضمن معظم الخدمات عدداً معيناً من التعديلات. تحقق من تفاصيل الخدمة لسياسة التعديل قبل الطلب.'
    },
    {
      question: 'What is the commission rate for experts?',
      questionAr: 'ما هو معدل العمولة للخبراء؟',
      answer: 'The platform charges a 15% commission on completed orders, plus a small processing fee of $0.50 per transaction.',
      answerAr: 'تفرض المنصة عمولة 15٪ على الطلبات المكتملة، بالإضافة إلى رسوم معالجة صغيرة قدرها 0.50 دولار لكل معاملة.'
    }
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-12 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
          </h1>
          <p className="text-lg mb-6 opacity-90">
            {isRTL ? 'ابحث في مركز المساعدة أو تصفح حسب الفئة' : 'Search our help center or browse by category'}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث عن مقالات المساعدة...' : 'Search for help articles...'}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-teal-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'articles' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {isRTL ? 'المقالات' : 'Articles'}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'videos' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Video className="w-4 h-4" />
            {isRTL ? 'الفيديوهات' : 'Videos'}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'faq' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
          </button>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <>
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'تصفح حسب الفئة' : 'Browse by Category'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, index) => {
                  const Icon = cat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {isRTL ? cat.nameAr : cat.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cat.articles} {isRTL ? 'مقالة' : 'articles'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'المقالات الشائعة' : 'Popular Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-teal-300 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {isRTL ? article.titleAr : article.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-teal-600">{isRTL ? article.categoryAr : article.category}</span>
                      <span className="text-gray-500">{article.views.toLocaleString()} {isRTL ? 'مشاهدة' : 'views'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isRTL ? 'دروس الفيديو' : 'Tutorial Videos'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img src={video.thumbnail} alt="" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-teal-600 border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {isRTL ? video.titleAr : video.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {video.views.toLocaleString()} {isRTL ? 'مشاهدة' : 'views'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isRTL ? 'الأسئلة المتكررة' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">
                      {isRTL ? faq.questionAr : faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-5 pb-5 text-gray-700">
                      {isRTL ? faq.answerAr : faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8 text-center">
          <HelpCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isRTL ? 'لا تزال بحاجة إلى مساعدة؟' : 'Still need help?'}
          </h3>
          <p className="text-gray-600 mb-6">
            {isRTL ? 'تواصل مع فريق الدعم لدينا وسنساعدك' : 'Contact our support team and we\'ll assist you'}
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            {isRTL ? 'اتصل بالدعم' : 'Contact Support'}
          </Button>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
