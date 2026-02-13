import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/browse/Breadcrumb';
import { ServiceCard } from '../components/ServiceCard';
import { serviceApi, type ServiceResponse } from '../services/api';
import { Star, Clock, ShoppingCart, User, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, toggleLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  const [service, setService] = useState<ServiceResponse | null>(null);
  const [relatedServices, setRelatedServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    serviceApi.getById(id)
      .then(res => {
        setService(res.data);
        // Fetch related services from same category
        if (res.data.category) {
          serviceApi.list({ category: String(res.data.category.categoryId), limit: 3 })
            .then(relRes => {
              setRelatedServices(
                (relRes.data.services || []).filter(s => String(s.id) !== String(id)).slice(0, 2)
              );
            })
            .catch(() => setRelatedServices([]));
        }
      })
      .catch(err => {
        console.error('Failed to fetch service:', err);
        setError(err.message || 'Failed to load service');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

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

  if (error || !service) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <div className="flex flex-col items-center justify-center py-32">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRTL ? 'الخدمة غير موجودة' : 'Service Not Found'}
          </h2>
          <p className="text-gray-600">{error || (isRTL ? 'لم يتم العثور على الخدمة المطلوبة' : 'The requested service could not be found')}</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: isRTL ? 'الرئيسية' : 'Home', href: '/' },
            ...(service.category ? [{ label: service.category.name, href: `/browse?category=${service.category.categoryId}` }] : []),
            ...(service.subcategory ? [{ label: service.subcategory.name }] : []),
            { label: service.title.length > 50 ? service.title.slice(0, 50) + '...' : service.title },
          ]}
          isRTL={isRTL}
        />

        {/* Main Content - 2 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thumbnail */}
            {service.thumbnail && (
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={service.thumbnail}
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Service Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {service.category && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{service.category.name}</span>
                )}
                {service.subcategory && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{service.subcategory.name}</span>
                )}
                {service.rating != null && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{service.rating}</span>
                    <span className="text-gray-500">({service.reviewCount || 0})</span>
                  </div>
                )}
                {service.sales != null && (
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{service.sales} {isRTL ? 'مبيعات' : 'sales'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📝 {isRTL ? 'وصف الخدمة' : 'Service Description'}
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.description}
                </div>
              </div>
            )}

            {/* Expert Info (inline) */}
            {service.expert && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {isRTL ? 'عن مقدم الخدمة' : 'About the Expert'}
                </h2>
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={service.expert.avatar || ''}
                    alt={service.expert.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.expert.name}</h3>
                    {service.expert.level && (
                      <p className="text-sm text-gray-600">{service.expert.level}</p>
                    )}
                    {service.expert.rating != null && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.expert.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">{isRTL ? 'يبدأ من' : 'Starting at'}</p>
                <p className="text-3xl font-bold text-gray-900">${service.price}</p>
              </div>

              {/* Delivery Time */}
              {service.deliveryTime && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>
                    {isRTL ? `التسليم خلال ${service.deliveryTime} أيام` : `Delivery in ${service.deliveryTime} days`}
                  </span>
                </div>
              )}

              {/* Order Button */}
              {user?.role === 'customer' || !isAuthenticated ? (
                <Link to={isAuthenticated ? `/place-order/${id}` : `/login?redirect=/place-order/${id}`}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isRTL ? 'اطلب الآن' : 'Order Now'}
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full bg-gray-400 text-white py-3 text-lg cursor-not-allowed">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isRTL ? 'للعملاء فقط' : 'Customers Only'}
                </Button>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                {service.sales != null && (
                  <div className="flex justify-between">
                    <span>{isRTL ? 'المبيعات' : 'Sales'}</span>
                    <span className="font-medium text-gray-900">{service.sales}</span>
                  </div>
                )}
                {service.reviewCount != null && (
                  <div className="flex justify-between">
                    <span>{isRTL ? 'التقييمات' : 'Reviews'}</span>
                    <span className="font-medium text-gray-900">{service.reviewCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
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
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
