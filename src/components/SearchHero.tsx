import { Search } from 'lucide-react';
import { Button } from './ui/button';

interface SearchHeroProps {
  isRTL: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchHero({ isRTL, searchQuery, onSearchChange }: SearchHeroProps) {
  const popularKeywords = isRTL 
    ? ['تصميم شعار', 'برمجة موقع', 'كتابة محتوى', 'تصميم فيديو', 'ترجمة']
    : ['Logo Design', 'Web Development', 'Content Writing', 'Video Editing', 'Translation'];

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl mb-6 text-gray-900">
          {isRTL ? 'ابحث عن الخدمة المثالية لمشروعك' : 'Find the Perfect Service for Your Project'}
        </h1>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} text-gray-400`}>
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isRTL ? 'ابحث عن أي خدمة...' : 'Search for any service...'}
              className={`w-full ${isRTL ? 'pr-12 pl-32' : 'pl-12 pr-32'} py-4 rounded-full border-2 border-gray-200 focus:border-teal-500 focus:outline-none text-lg transition-all`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <Button 
              className={`absolute ${isRTL ? 'left-2' : 'right-2'} bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8`}
            >
              {isRTL ? 'بحث' : 'Search'}
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-gray-600 text-sm">
            {isRTL ? 'شائع:' : 'Popular:'}
          </span>
          {popularKeywords.map((keyword, index) => (
            <button
              key={index}
              className="px-4 py-1 text-sm bg-white border border-gray-200 rounded-full hover:border-teal-500 hover:text-teal-600 transition-all"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
