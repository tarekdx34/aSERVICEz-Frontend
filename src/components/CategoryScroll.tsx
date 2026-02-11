import { ChevronLeft, ChevronRight, Palette, Code, PenTool, Megaphone, Video, Briefcase, GraduationCap, Camera, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { categoryApi, type CategoryResponse } from '../services/api';

interface CategoryScrollProps {
  isRTL: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

// Fallback icon map for known category slugs
const iconMap: Record<string, any> = {
  design: Palette,
  programming: Code,
  writing: PenTool,
  marketing: Megaphone,
  video: Video,
  business: Briefcase,
  training: GraduationCap,
  photography: Camera,
};

export function CategoryScroll({ isRTL, activeCategory, onCategoryChange }: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [apiCategories, setApiCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryApi.listWithSubcategories()
      .then(res => setApiCategories(res.data.categories || []))
      .catch(() => setApiCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = apiCategories.map(cat => ({
    icon: iconMap[cat.slug || cat.id] || Briefcase,
    name: isRTL ? cat.name : (cat.nameEn || cat.name),
    key: cat.slug || cat.id,
  }));

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">
          <button
            onClick={() => scroll(isRTL ? 'right' : 'left')}
            className="absolute left-0 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-all"
          >
            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide mx-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => onCategoryChange('all')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isRTL ? 'الكل' : 'All'}
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.key}
                  onClick={() => onCategoryChange(category.key)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeCategory === category.key
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scroll(isRTL ? 'left' : 'right')}
            className="absolute right-0 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-all"
          >
            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
