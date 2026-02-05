import { Star, Heart, Clock, Package } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    thumbnail: string;
    expert: {
      name: string;
      avatar: string;
      level: string;
      badge: string;
    };
    rating: number;
    reviewCount: number;
    price: number;
    deliveryTime?: '24h' | '3days' | '7days' | '14days';
  };
  isRTL: boolean;
  viewMode?: 'grid' | 'list';
}

export function ServiceCard({ service, isRTL, viewMode = 'grid' }: ServiceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const levelColors = {
    new: 'bg-gray-100 text-gray-700',
    seller: 'bg-blue-100 text-blue-700',
    featured: 'bg-purple-100 text-purple-700',
    pro: 'bg-teal-100 text-teal-700',
  };

  const levelText = isRTL ? {
    new: 'جديد',
    seller: 'بائع',
    featured: 'متميز',
    pro: 'محترف',
  } : {
    new: 'New',
    seller: 'Seller',
    featured: 'Featured',
    pro: 'Pro',
  };

  const deliveryTimeText: Record<string, { ar: string; en: string }> = {
    '24h': { ar: 'خلال 24 ساعة', en: 'Within 24h' },
    '3days': { ar: '3 أيام', en: '3 days' },
    '7days': { ar: '7 أيام', en: '7 days' },
    '14days': { ar: '14 يوم', en: '14 days' },
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="relative sm:w-64 aspect-[16/9] sm:aspect-auto overflow-hidden bg-gray-100 flex-shrink-0">
            <ImageWithFallback
              src={service.thumbnail}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-2 bg-white rounded-full shadow-md transition-all ${
                isHovered ? 'opacity-100' : 'opacity-0'
              } ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" dir={isRTL ? 'rtl' : 'ltr'}>
                {service.title}
              </h3>

              {/* Expert Info */}
              <div className="flex items-center gap-2 mb-3">
                <ImageWithFallback
                  src={service.expert.avatar}
                  alt={service.expert.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700">{service.expert.name}</span>
                {service.expert.badge && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      levelColors[service.expert.badge as keyof typeof levelColors]
                    }`}
                  >
                    {levelText[service.expert.badge as keyof typeof levelText]}
                  </span>
                )}
              </div>

              {/* Rating & Delivery */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">{service.rating}</span>
                  <span className="text-gray-500">({service.reviewCount})</span>
                </div>
                {service.deliveryTime && deliveryTimeText[service.deliveryTime] && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{isRTL ? deliveryTimeText[service.deliveryTime].ar : deliveryTimeText[service.deliveryTime].en}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {isRTL ? 'يبدأ من' : 'Starting at'}
              </p>
              <p className="text-xl font-bold text-gray-900">${service.price}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <Link to={`/service/${service.id}`}>
      <div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={service.thumbnail}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-2 bg-white rounded-full shadow-md transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-gray-900 mb-3 line-clamp-2 h-12" dir={isRTL ? 'rtl' : 'ltr'}>
            {service.title}
          </h3>

          {/* Expert Info */}
          <div className="flex items-center gap-2 mb-3">
            <ImageWithFallback
              src={service.expert.avatar}
              alt={service.expert.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">{service.expert.name}</p>
            </div>
            {service.expert.badge && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  levelColors[service.expert.badge as keyof typeof levelColors]
                }`}
              >
                {levelText[service.expert.badge as keyof typeof levelText]}
              </span>
            )}
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{service.rating}</span>
              <span className="text-sm text-gray-500">({service.reviewCount})</span>
            </div>
            
            <div className="text-right" dir={isRTL ? 'rtl' : 'ltr'}>
              <p className="text-xs text-gray-500">
                {isRTL ? 'يبدأ من' : 'Starting at'}
              </p>
              <p className="font-semibold text-gray-900">${service.price}</p>
            </div>
          </div>

          {/* Delivery Time */}
          {service.deliveryTime && deliveryTimeText[service.deliveryTime] && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>
                {isRTL ? 'تسليم خلال ' : 'Delivery within '}
                {isRTL ? deliveryTimeText[service.deliveryTime].ar : deliveryTimeText[service.deliveryTime].en}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}