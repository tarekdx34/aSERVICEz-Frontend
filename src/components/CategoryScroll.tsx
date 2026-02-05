import { ChevronLeft, ChevronRight, Palette, Code, PenTool, Megaphone, Video, Briefcase, GraduationCap, Camera } from 'lucide-react';
import { useRef } from 'react';

interface CategoryScrollProps {
  isRTL: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryScroll({ isRTL, activeCategory, onCategoryChange }: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = isRTL ? [
    { icon: Palette, name: 'تصميم وجرافيك', key: 'design' },
    { icon: Code, name: 'برمجة وتطوير', key: 'programming' },
    { icon: PenTool, name: 'كتابة وترجمة', key: 'writing' },
    { icon: Megaphone, name: 'تسويق رقمي', key: 'marketing' },
    { icon: Video, name: 'فيديو وصوتيات', key: 'video' },
    { icon: Briefcase, name: 'أعمال', key: 'business' },
    { icon: GraduationCap, name: 'تدريب واستشارات', key: 'training' },
    { icon: Camera, name: 'تصوير', key: 'photography' },
  ] : [
    { icon: Palette, name: 'Design & Graphics', key: 'design' },
    { icon: Code, name: 'Programming', key: 'programming' },
    { icon: PenTool, name: 'Writing & Translation', key: 'writing' },
    { icon: Megaphone, name: 'Digital Marketing', key: 'marketing' },
    { icon: Video, name: 'Video & Audio', key: 'video' },
    { icon: Briefcase, name: 'Business', key: 'business' },
    { icon: GraduationCap, name: 'Training', key: 'training' },
    { icon: Camera, name: 'Photography', key: 'photography' },
  ];

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
