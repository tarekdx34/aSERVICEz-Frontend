import { ServiceCard } from './ServiceCard';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Service {
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
  deliveryTime: string;
  category: string;
}

interface ServiceGridProps {
  services: Service[];
  isRTL: boolean;
  totalResults: number;
  currentPage: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ServiceGrid({ 
  services, 
  isRTL, 
  totalResults,
  currentPage,
  sortBy,
  onSortChange 
}: ServiceGridProps) {
  const sortOptions = isRTL ? [
    { value: 'relevant', label: 'الأكثر صلة' },
    { value: 'newest', label: 'الأحدث' },
    { value: 'rating', label: 'الأعلى تقييماً' },
    { value: 'price-low', label: 'السعر من الأقل' },
    { value: 'price-high', label: 'السعر من الأعلى' },
  ] : [
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  const startIndex = (currentPage - 1) * 20 + 1;
  const endIndex = Math.min(currentPage * 20, totalResults);

  return (
    <div className="flex-1">
      {/* Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-gray-600">
          {isRTL 
            ? `عرض ${startIndex}-${endIndex} من ${totalResults} خدمة`
            : `Showing ${startIndex}-${endIndex} of ${totalResults} services`
          }
        </p>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {isRTL ? 'ترتيب حسب:' : 'Sort by:'}
          </span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <ServiceCard service={service} isRTL={isRTL} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {isRTL ? 'لم يتم العثور على خدمات' : 'No services found'}
          </h3>
          <p className="text-gray-600">
            {isRTL 
              ? 'جرب تعديل الفلاتر أو البحث بكلمات مختلفة'
              : 'Try adjusting your filters or search terms'
            }
          </p>
        </div>
      )}
    </div>
  );
}
