import { Star, X } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface FilterSidebarProps {
  isRTL: boolean;
  filters: {
    priceRange: [number, number];
    deliveryTime: string[];
    rating: number;
    sellerLevel: string[];
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({ 
  isRTL, 
  filters, 
  onFilterChange, 
  onClearFilters,
  isMobile = false,
  onClose 
}: FilterSidebarProps) {
  const deliveryOptions = isRTL 
    ? [
        { label: 'حتى يومين', value: '2days' },
        { label: 'حتى 3 أيام', value: '3days' },
        { label: 'حتى 7 أيام', value: '7days' },
        { label: 'أكثر من أسبوع', value: '7plus' },
      ]
    : [
        { label: 'Up to 2 days', value: '2days' },
        { label: 'Up to 3 days', value: '3days' },
        { label: 'Up to 7 days', value: '7days' },
        { label: 'More than a week', value: '7plus' },
      ];

  const sellerLevels = isRTL
    ? [
        { label: 'بائع جديد', value: 'new' },
        { label: 'بائع', value: 'seller' },
        { label: 'بائع متميز', value: 'featured' },
        { label: 'بائع محترف', value: 'pro' },
      ]
    : [
        { label: 'New Seller', value: 'new' },
        { label: 'Seller', value: 'seller' },
        { label: 'Featured Seller', value: 'featured' },
        { label: 'Professional Seller', value: 'pro' },
      ];

  const handleDeliveryChange = (value: string, checked: boolean) => {
    const newDeliveryTime = checked
      ? [...filters.deliveryTime, value]
      : filters.deliveryTime.filter(v => v !== value);
    onFilterChange({ ...filters, deliveryTime: newDeliveryTime });
  };

  const handleSellerLevelChange = (value: string, checked: boolean) => {
    const newSellerLevel = checked
      ? [...filters.sellerLevel, value]
      : filters.sellerLevel.filter(v => v !== value);
    onFilterChange({ ...filters, sellerLevel: newSellerLevel });
  };

  const content = (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      {isMobile && (
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h3 className="font-semibold text-lg">
            {isRTL ? 'تصفية النتائج' : 'Filter Results'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {!isMobile && (
        <h3 className="font-semibold text-lg mb-6">
          {isRTL ? 'تصفية النتائج' : 'Filter Results'}
        </h3>
      )}

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium mb-4">
          {isRTL ? 'السعر' : 'Price'}
        </h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
          max={500}
          step={5}
          className="mb-3"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium mb-4">
          {isRTL ? 'مدة التسليم' : 'Delivery Time'}
        </h4>
        <div className="space-y-3">
          {deliveryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={option.value}
                checked={filters.deliveryTime.includes(option.value)}
                onCheckedChange={(checked) => handleDeliveryChange(option.value, checked as boolean)}
              />
              <label
                htmlFor={option.value}
                className="text-sm text-gray-700 cursor-pointer flex-1"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium mb-4">
          {isRTL ? 'تقييم البائع' : 'Seller Rating'}
        </h4>
        <div className="space-y-3">
          {[5, 4, 3].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange({ ...filters, rating })}
              className={`flex items-center space-x-2 space-x-reverse w-full p-2 rounded-lg transition-all ${
                filters.rating === rating
                  ? 'bg-teal-50 text-teal-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700">
                {rating === 5 ? '5★' : `${rating}★+`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Seller Level */}
      <div className="mb-6">
        <h4 className="font-medium mb-4">
          {isRTL ? 'مستوى البائع' : 'Seller Level'}
        </h4>
        <div className="space-y-3">
          {sellerLevels.map((level) => (
            <div key={level.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={level.value}
                checked={filters.sellerLevel.includes(level.value)}
                onCheckedChange={(checked) => handleSellerLevelChange(level.value, checked as boolean)}
              />
              <label
                htmlFor={level.value}
                className="text-sm text-gray-700 cursor-pointer flex-1"
              >
                {level.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="w-full text-gray-700 hover:bg-gray-50"
      >
        {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
