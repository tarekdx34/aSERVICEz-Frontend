import { SearchX } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
  isRTL?: boolean;
}

export function EmptyState({ onClearFilters, isRTL = true }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {isRTL ? 'لا توجد نتائج' : 'No Results Found'}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {isRTL 
          ? 'جرب تغيير الفلاتر أو البحث بكلمات أخرى للحصول على نتائج أفضل'
          : 'Try changing the filters or searching with different keywords for better results'
        }
      </p>

      <Button
        onClick={onClearFilters}
        className="bg-teal-600 hover:bg-teal-700 text-white"
      >
        {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
      </Button>
    </div>
  );
}
