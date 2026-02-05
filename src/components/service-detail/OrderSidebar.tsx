import { useState } from 'react';
import { ShoppingCart, MessageCircle, Heart, Share2, Shield, Clock, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Link, useParams } from 'react-router';

interface Package {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

interface Extra {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  icon: string;
}

interface OrderSidebarProps {
  packages: Package[];
  extras: Extra[];
  stats: {
    sales: number;
    inQueue: number;
    views: number;
    rating: number;
  };
  isRTL?: boolean;
}

export function OrderSidebar({ packages, extras, stats, isRTL = true }: OrderSidebarProps) {
  const { id } = useParams();
  const [selectedPackage, setSelectedPackage] = useState(packages[1]?.id || packages[0]?.id);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const currentPackage = packages.find(pkg => pkg.id === selectedPackage);
  
  const totalPrice = (currentPackage?.price || 0) + 
    selectedExtras.reduce((sum, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(isRTL ? 'تم نسخ الرابط!' : 'Link copied!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Order Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-24">
        <div className="space-y-6">
          {/* Package Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              📦 {isRTL ? 'اختر الباقة:' : 'Select Package:'}
            </label>
            <div className="space-y-2">
              {packages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {isRTL ? pkg.name : pkg.nameEn}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pkg.deliveryDays} {isRTL ? 'أيام' : 'days'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-teal-600">
                      ${pkg.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          {extras.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                🎁 {isRTL ? 'خدمات إضافية:' : 'Service Extras:'}
              </label>
              <div className="space-y-2">
                {extras.map(extra => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-teal-300 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={() => toggleExtra(extra.id)}
                        className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-2xl">{extra.icon}</span>
                      <span className="text-sm text-gray-700">
                        {isRTL ? extra.name : extra.nameEn}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">
                      +${extra.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isRTL ? 'التسليم:' : 'Delivery:'}</span>
                <span className="font-semibold text-gray-900">
                  {currentPackage?.deliveryDays} {isRTL ? 'أيام' : 'days'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isRTL ? 'المراجعات:' : 'Revisions:'}</span>
                <span className="font-semibold text-gray-900">
                  {currentPackage?.revisions}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to={`/order/${id}`}>
              <Button className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isRTL ? 'اطلب الآن' : 'Order Now'}
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-12 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              {isRTL ? 'تواصل مع البائع' : 'Contact Seller'}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>{isRTL ? 'دفع آمن ومضمون' : 'Secure payment'}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-teal-600" />
              <span>{isRTL ? 'استرجاع المال' : 'Money-back guarantee'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>{isRTL ? 'دعم على مدار الساعة' : '24/7 Support'}</span>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isRTL ? 'أضف للمفضلة' : 'Add to favorites'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              {isRTL ? 'شارك' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Service Stats Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          📊 {isRTL ? 'إحصائيات الخدمة' : 'Service Stats'}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">🛍️ {isRTL ? 'المبيعات' : 'Sales'}</span>
            <span className="font-semibold text-gray-900">{stats.sales.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">⏳ {isRTL ? 'جاري التنفيذ' : 'In queue'}</span>
            <span className="font-semibold text-gray-900">{stats.inQueue}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">👁️ {isRTL ? 'المشاهدات' : 'Views'}</span>
            <span className="font-semibold text-gray-900">{stats.views.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">⭐ {isRTL ? 'التقييم' : 'Rating'}</span>
            <span className="font-semibold text-gray-900">{stats.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}