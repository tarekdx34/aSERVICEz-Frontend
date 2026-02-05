import { useState } from 'react';
import { useParams } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/browse/Breadcrumb';
import { ImageGallery } from '../components/service-detail/ImageGallery';
import { ServiceHeader } from '../components/service-detail/ServiceHeader';
import { OrderSidebar } from '../components/service-detail/OrderSidebar';
import { PackageComparison } from '../components/service-detail/PackageComparison';
import { ExpertProfile } from '../components/service-detail/ExpertProfile';
import { ReviewsSection } from '../components/service-detail/ReviewsSection';
import { ServiceCard } from '../components/ServiceCard';
import { Check } from 'lucide-react';

// Mock service data - In real app, fetch from API using serviceId
const getServiceData = (id: string) => ({
  id,
  title: 'تصميم شعار احترافي لشركتك مع 3 مفاهيم مختلفة',
  titleEn: 'Professional logo design for your company with 3 different concepts',
  category: 'تصميم وجرافيك',
  categoryEn: 'Design & Graphics',
  subcategory: 'تصميم شعارات',
  subcategoryEn: 'Logo Design',
  images: [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
  ],
  description: `مرحباً بك في خدمة تصميم الشعارات الاحترافية!

أنا مصمم جرافيك محترف مع خبرة تزيد عن 5 سنوات في تصميم الهويات البصرية والشعارات للشركات والمشاريع المختلفة.

ما الذي ستحصل عليه؟
• تصميم شعار فريد واحترافي يعكس هوية علامتك التجارية
• 3 مفاهيم تصميمية مختلفة للاختيار من بينها
• تعديلات غير محدودة حتى تحصل على التصميم المثالي
• ملفات عالية الجودة بجميع الصيغ (PNG, JPG, AI, PDF, SVG)
• دليل استخدام الشعار (Brand Guidelines)

لماذا تختارني؟
✓ خبرة واسعة في مجال التصميم
✓ تسليم سريع وفي الوقت المحدد
✓ تواصل مستمر طوال فترة المشروع
✓ دعم ما بعد التسليم لمدة 30 يوم`,
  descriptionEn: 'Professional logo design service with 5+ years of experience...',
  features: [
    { label: 'تصميم 3 مفاهيم مختلفة', labelEn: '3 different design concepts' },
    { label: 'مراجعات غير محدودة', labelEn: 'Unlimited revisions' },
    { label: 'ملفات بجميع الصيغ', labelEn: 'All file formats' },
    { label: 'دليل استخدام العلامة التجارية', labelEn: 'Brand usage guide' },
    { label: 'دعم لمدة 30 يوم', labelEn: '30-day support' },
  ],
  excludes: [
    { label: 'طباعة المواد التسويقية', labelEn: 'Printing marketing materials' },
    { label: 'تطبيقات ثلاثية الأبعاد', labelEn: '3D applications' },
  ],
  requirements: [
    { label: 'اسم الشركة أو المشروع', labelEn: 'Company or project name' },
    { label: 'الألوان المفضلة (اختياري)', labelEn: 'Preferred colors (optional)' },
    { label: 'أمثلة للإلهام (اختياري)', labelEn: 'Inspiration examples (optional)' },
  ],
  packages: [
    {
      id: 'basic',
      name: 'باقة أساسية',
      nameEn: 'Basic Package',
      price: 10,
      deliveryDays: 3,
      revisions: 1,
      features: [],
    },
    {
      id: 'standard',
      name: 'باقة متقدمة',
      nameEn: 'Standard Package',
      price: 25,
      deliveryDays: 5,
      revisions: 2,
      features: [],
    },
    {
      id: 'premium',
      name: 'باقة احترافية',
      nameEn: 'Premium Package',
      price: 50,
      deliveryDays: 7,
      revisions: 3,
      features: [],
    },
  ],
  packageFeatures: [
    {
      label: 'عدد التصاميم',
      labelEn: 'Number of designs',
      basic: '1',
      standard: '3',
      premium: '5',
    },
    {
      label: 'صيغ الملفات',
      labelEn: 'File formats',
      basic: 'PNG',
      standard: 'PNG, AI',
      premium: 'All formats',
    },
    {
      label: 'ملف المصدر',
      labelEn: 'Source file',
      basic: false,
      standard: true,
      premium: true,
    },
    {
      label: 'توصيل سريع',
      labelEn: 'Express delivery',
      basic: false,
      standard: false,
      premium: true,
    },
    {
      label: 'فترة الدعم',
      labelEn: 'Support period',
      basic: '15 ' + 'يوم',
      standard: '30 ' + 'يوم',
      premium: '60 ' + 'يوم',
    },
  ],
  extras: [
    {
      id: 'express',
      name: 'توصيل سريع (24 ساعة)',
      nameEn: 'Express delivery (24h)',
      price: 15,
      icon: '⚡',
    },
    {
      id: 'source',
      name: 'ملف المصدر',
      nameEn: 'Source file',
      price: 10,
      icon: '📄',
    },
  ],
  portfolioImages: [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
  ],
  stats: {
    sales: 145,
    inQueue: 3,
    views: 2847,
    rating: 4.9,
  },
  expert: {
    id: '1',
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohamed',
    username: 'ahmed_designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    level: 'بائع محترف',
    levelEn: 'Pro Seller',
    badge: 'pro',
    rating: 4.9,
    reviewCount: 1245,
    completedOrders: 856,
    memberSince: '2023',
    isOnline: true,
    responseTime: 'خلال ساعة',
    bio: 'مصمم جرافيك محترف متخصص في تصميم الهويات البصرية والشعارات. أعمل مع الشركات والأفراد لإنشاء تصاميم فريدة تعكس رؤيتهم وقيمهم.',
    bioEn: 'Professional graphic designer specializing in visual identities and logos...',
    skills: ['Photoshop', 'Illustrator', 'Logo Design', 'Branding', 'UI/UX'],
    achievements: [
      { label: 'أفضل بائع لشهر يناير 2024', labelEn: 'Top seller January 2024' },
      { label: '100% معدل تسليم في الوقت المحدد', labelEn: '100% on-time delivery rate' },
      { label: 'أكثر من 850 مشروع مكتمل', labelEn: 'Over 850 completed projects' },
    ],
  },
  reviews: [
    {
      id: '1',
      user: {
        name: 'سارة أحمد',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
        country: 'السعودية',
        countryFlag: '🇸🇦',
      },
      rating: 5,
      comment: 'عمل رائع وسريع! تعاملت مع Ahmed عدة مرات وكان دائماً محترفاً ومبدعاً. الشعار الذي صممه لي تجاوز توقعاتي بكثير. أنصح بالتعامل معه بشدة!',
      date: '2024-01-28',
      helpfulCount: 12,
      sellerReply: {
        comment: 'شكراً جزيلاً سارة! سعيد جداً بتعاملنا المستمر وثقتك الغالية. دائماً في الخدمة! 🙏',
        date: '2024-01-28',
      },
    },
    {
      id: '2',
      user: {
        name: 'خالد العتيبي',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled',
        country: 'الكويت',
        countryFlag: '🇰🇼',
      },
      rating: 5,
      comment: 'تجربة ممتازة! التصميم احترافي جداً والتواصل سريع. قدم لي عدة خيارات وكان متعاوناً في التعديلات.',
      date: '2024-01-25',
      helpfulCount: 8,
    },
    {
      id: '3',
      user: {
        name: 'ليلى حسن',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Layla',
        country: 'الإمارات',
        countryFlag: '🇦🇪',
      },
      rating: 4,
      comment: 'تصميم جيد وسعر مناسب. كنت أتمنى تسليم أسرع لكن النتيجة النهائية ممتازة.',
      date: '2024-01-20',
      helpfulCount: 5,
    },
  ],
  ratingBreakdown: {
    5: 245,
    4: 30,
    3: 8,
    2: 2,
    1: 0,
  },
});

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, toggleLanguage } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState('standard');

  // Get service data
  const service = getServiceData(id || '1');

  // Related services (mock data)
  const relatedServices = [
    {
      id: 2,
      title: isRTL ? 'تصميم بطاقة عمل احترافية' : 'Professional business card design',
      titleEn: 'Professional business card design',
      thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
      expert: {
        name: isRTL ? 'محمد علي' : 'Mohamed Ali',
        nameEn: 'Mohamed Ali',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed',
        level: isRTL ? 'بائع' : 'Seller',
        levelEn: 'Seller',
        badge: 'seller',
      },
      rating: 4.8,
      reviewCount: 156,
      price: 15,
      category: 'design',
      sales: 89,
      deliveryTime: '3days',
    },
    {
      id: 3,
      title: isRTL ? 'تصميم هوية بصرية متكاملة' : 'Complete brand identity design',
      titleEn: 'Complete brand identity design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      expert: {
        name: isRTL ? 'فاطمة سعيد' : 'Fatima Said',
        nameEn: 'Fatima Said',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
        level: isRTL ? 'بائع متميز' : 'Featured Seller',
        levelEn: 'Featured Seller',
        badge: 'featured',
      },
      rating: 4.9,
      reviewCount: 203,
      price: 75,
      category: 'design',
      sales: 124,
      deliveryTime: '7days',
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Import Cairo font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: isRTL ? 'الرئيسية' : 'Home', href: '/' },
            { label: isRTL ? service.category : service.categoryEn, href: `/browse?category=${service.category}` },
            { label: isRTL ? service.subcategory : service.subcategoryEn, href: `/browse?category=${service.category}` },
            { label: isRTL ? service.title.slice(0, 50) + '...' : service.titleEn.slice(0, 50) + '...' },
          ]}
          isRTL={isRTL}
        />

        {/* Main Content - 2 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={service.images} isRTL={isRTL} />

            {/* Service Header */}
            <ServiceHeader
              title={isRTL ? service.title : service.titleEn}
              category={service.category}
              categoryEn={service.categoryEn}
              subcategory={service.subcategory}
              subcategoryEn={service.subcategoryEn}
              expert={service.expert}
              isRTL={isRTL}
            />

            {/* Description Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📝 {isRTL ? 'وصف الخدمة' : 'Service Description'}
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {isRTL ? service.description : service.descriptionEn}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ✓ {isRTL ? 'ماذا ستحصل:' : "What's Included:"}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700">{isRTL ? feature.label : feature.labelEn}</span>
                  </div>
                ))}
              </div>

              {service.excludes.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">
                    ✗ {isRTL ? 'ما لا يشمله:' : 'Not Included:'}
                  </h3>
                  <div className="space-y-2">
                    {service.excludes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-600">
                        <span>•</span>
                        <span>{isRTL ? item.label : item.labelEn}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">
                📋 {isRTL ? 'متطلبات من المشتري:' : 'Buyer Requirements:'}
              </h3>
              <div className="space-y-2">
                {service.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <span>•</span>
                    <span>{isRTL ? req.label : req.labelEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Comparison */}
            <PackageComparison
              packages={service.packages}
              features={service.packageFeatures}
              selectedPackage={selectedPackage}
              onSelectPackage={setSelectedPackage}
              isRTL={isRTL}
            />

            {/* Portfolio Gallery */}
            {service.portfolioImages.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🖼️ {isRTL ? 'معرض الأعمال السابقة' : 'Portfolio Gallery'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {service.portfolioImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden group cursor-pointer">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewsSection
              reviews={service.reviews}
              averageRating={service.stats.rating}
              totalReviews={service.expert.reviewCount}
              ratingBreakdown={service.ratingBreakdown}
              isRTL={isRTL}
            />

            {/* Expert Profile - Mobile */}
            <div className="lg:hidden">
              <ExpertProfile expert={service.expert} isRTL={isRTL} />
            </div>
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <OrderSidebar
              packages={service.packages}
              extras={service.extras}
              stats={service.stats}
              isRTL={isRTL}
            />

            {/* Expert Profile - Desktop */}
            <div className="hidden lg:block mt-4">
              <ExpertProfile expert={service.expert} isRTL={isRTL} />
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isRTL ? 'خدمات مشابهة' : 'Related Services'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map(relatedService => (
              <ServiceCard
                key={relatedService.id}
                service={relatedService}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
