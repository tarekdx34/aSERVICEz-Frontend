import { X } from 'lucide-react';
import { AdvancedFilters } from './AdvancedFilterSidebar';

interface ActiveFiltersProps {
  filters: AdvancedFilters;
  onRemoveFilter: (filterType: keyof AdvancedFilters, value: string | number) => void;
  onClearAll: () => void;
  isRTL?: boolean;
}

export function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
  isRTL = true,
}: ActiveFiltersProps) {
  const activeFiltersArray: Array<{
    type: keyof AdvancedFilters;
    value: string | number;
    label: string;
  }> = [];

  // Categories
  filters.categories.forEach(cat => {
    activeFiltersArray.push({
      type: 'categories',
      value: cat,
      label: `${isRTL ? 'فئة' : 'Category'}: ${cat}`,
    });
  });

  // Delivery time
  filters.deliveryTime.forEach(time => {
    const labels: Record<string, { ar: string; en: string }> = {
      '24h': { ar: 'خلال 24 ساعة', en: 'Within 24h' },
      '3days': { ar: 'حتى 3 أيام', en: 'Up to 3 days' },
      '7days': { ar: 'حتى 7 أيام', en: 'Up to 7 days' },
      '14days': { ar: 'حتى 14 يوم', en: 'Up to 14 days' },
      '14+': { ar: 'أكثر من أسبوعين', en: 'More than 2 weeks' },
    };
    activeFiltersArray.push({
      type: 'deliveryTime',
      value: time,
      label: isRTL ? labels[time]?.ar : labels[time]?.en,
    });
  });

  // Rating
  if (filters.rating > 0) {
    activeFiltersArray.push({
      type: 'rating',
      value: filters.rating,
      label: `${isRTL ? 'التقييم' : 'Rating'}: ${filters.rating}+ ★`,
    });
  }

  if (activeFiltersArray.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
      <span className="text-sm font-semibold text-gray-700">
        {isRTL ? 'الفلاتر النشطة:' : 'Active Filters:'}
      </span>
      
      {activeFiltersArray.map((filter, index) => (
        <button
          key={`${filter.type}-${filter.value}-${index}`}
          onClick={() => onRemoveFilter(filter.type, filter.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-300 rounded-full text-sm text-gray-700 hover:bg-teal-100 transition-colors group"
        >
          <span>{filter.label}</span>
          <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-600" />
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="text-sm text-red-600 hover:text-red-700 font-medium underline"
      >
        {isRTL ? 'مسح الكل' : 'Clear all'}
      </button>
    </div>
  );
}
