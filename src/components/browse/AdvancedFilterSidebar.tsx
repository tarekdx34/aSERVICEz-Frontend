import { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

export interface AdvancedFilters {
  searchQuery: string;
  categories: string[];
  subcategories: string[];
  priceRange: [number, number];
  pricePresets: string[];
  deliveryTime: string[];
  rating: number;
  sellerLevel: string[];
  languages: string[];
  additionalOptions: string[];
}

interface AdvancedFilterSidebarProps {
  filters: AdvancedFilters;
  onFilterChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  isRTL?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  selectedCategory?: string;
}

export function AdvancedFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isRTL = true,
  isMobile = false,
  onClose,
  selectedCategory,
}: AdvancedFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    subcategories: false,
    price: true,
    delivery: true,
    rating: true,
    sellerLevel: true,
    languages: false,
    additional: false,
  });

  const categories = [
    { id: 'design', label: isRTL ? 'تصميم وجرافيك' : 'Design & Graphics', labelEn: 'Design & Graphics', count: 1234, icon: '🎨' },
    { id: 'programming', label: isRTL ? 'برمجة وتطوير' : 'Programming & Development', labelEn: 'Programming & Development', count: 892, icon: '💻' },
    { id: 'writing', label: isRTL ? 'كتابة وترجمة' : 'Writing & Translation', labelEn: 'Writing & Translation', count: 654, icon: '✍️' },
    { id: 'marketing', label: isRTL ? 'تسويق رقمي' : 'Digital Marketing', labelEn: 'Digital Marketing', count: 543, icon: '📱' },
    { id: 'video', label: isRTL ? 'فيديو وأنيميشن' : 'Video & Animation', labelEn: 'Video & Animation', count: 421, icon: '🎬' },
    { id: 'business', label: isRTL ? 'أعمال' : 'Business', labelEn: 'Business', count: 312, icon: '💼' },
  ];

  const subcategories: Record<string, { id: string; label: string; labelEn: string }[]> = {
    design: [
      { id: 'logo', label: isRTL ? 'تصميم شعارات' : 'Logo Design', labelEn: 'Logo Design' },
      { id: 'social', label: isRTL ? 'تصميم سوشيال ميديا' : 'Social Media Design', labelEn: 'Social Media Design' },
      { id: 'ui', label: isRTL ? 'تصميم واجهات' : 'UI Design', labelEn: 'UI Design' },
    ],
    programming: [
      { id: 'web', label: isRTL ? 'تطوير مواقع' : 'Web Development', labelEn: 'Web Development' },
      { id: 'mobile', label: isRTL ? 'تطوير تطبيقات' : 'Mobile Apps', labelEn: 'Mobile Apps' },
      { id: 'backend', label: isRTL ? 'برمجة خلفية' : 'Backend Development', labelEn: 'Backend Development' },
    ],
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckbox = (field: keyof AdvancedFilters, value: string) => {
    const currentValues = filters[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({ ...filters, [field]: newValues });
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors"
    >
      <span>{title}</span>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  const content = (
    <div className="space-y-1">
      {/* Search within results */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {isRTL ? 'البحث في النتائج' : 'Search within results'}
        </label>
        <div className="relative">
          <Search className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-4 h-4 text-gray-400`} />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder={isRTL ? 'ابحث هنا...' : 'Search here...'}
            className={`w-full h-10 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
          />
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Categories */}
      <div>
        <SectionHeader 
          title={isRTL ? 'الفئة الرئيسية' : 'Main Category'} 
          section="categories" 
        />
        {expandedSections.categories && (
          <div className="space-y-2 pb-4">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => handleCheckbox('categories', cat.id)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm text-gray-700 group-hover:text-teal-600 flex-1">
                  {cat.label}
                </span>
                <span className="text-xs text-gray-400">
                  ({cat.count.toLocaleString(isRTL ? 'ar-SA' : 'en-US')})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Subcategories (show when category selected) */}
      {selectedCategory && subcategories[selectedCategory] && (
        <>
          <div>
            <SectionHeader 
              title={isRTL ? 'الفئة الفرعية' : 'Subcategory'} 
              section="subcategories" 
            />
            {expandedSections.subcategories && (
              <div className="space-y-2 pb-4">
                {subcategories[selectedCategory].map(sub => (
                  <label key={sub.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.subcategories.includes(sub.id)}
                      onChange={() => handleCheckbox('subcategories', sub.id)}
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-teal-600">
                      {sub.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200"></div>
        </>
      )}

      {/* Price Range */}
      <div>
        <SectionHeader 
          title={isRTL ? 'نطاق السعر' : 'Price Range'} 
          section="price" 
        />
        {expandedSections.price && (
          <div className="space-y-4 pb-4">
            {/* Range inputs */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">
                  {isRTL ? 'من' : 'From'}
                </label>
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => onFilterChange({ 
                    ...filters, 
                    priceRange: [Number(e.target.value), filters.priceRange[1]] 
                  })}
                  className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
              </div>
              <span className="text-gray-400 mt-5">-</span>
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">
                  {isRTL ? 'إلى' : 'To'}
                </label>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => onFilterChange({ 
                    ...filters, 
                    priceRange: [filters.priceRange[0], Number(e.target.value)] 
                  })}
                  className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
              </div>
            </div>

            {/* Price presets */}
            <div className="space-y-2">
              {[
                { id: '5', label: '$5' },
                { id: '10-25', label: '$10 - $25' },
                { id: '25-50', label: '$25 - $50' },
                { id: '50+', label: '$50+' },
              ].map(preset => (
                <label key={preset.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.pricePresets.includes(preset.id)}
                    onChange={() => handleCheckbox('pricePresets', preset.id)}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-teal-600">
                    {preset.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Delivery Time */}
      <div>
        <SectionHeader 
          title={isRTL ? 'مدة التسليم' : 'Delivery Time'} 
          section="delivery" 
        />
        {expandedSections.delivery && (
          <div className="space-y-2 pb-4">
            {[
              { id: '24h', label: isRTL ? 'خلال 24 ساعة ⚡' : 'Within 24 hours ⚡', labelEn: 'Within 24 hours ⚡' },
              { id: '3days', label: isRTL ? 'حتى 3 أيام' : 'Up to 3 days', labelEn: 'Up to 3 days' },
              { id: '7days', label: isRTL ? 'حتى 7 أيام' : 'Up to 7 days', labelEn: 'Up to 7 days' },
              { id: '14days', label: isRTL ? 'حتى 14 يوم' : 'Up to 14 days', labelEn: 'Up to 14 days' },
              { id: '14+', label: isRTL ? 'أكثر من أسبوعين' : 'More than 2 weeks', labelEn: 'More than 2 weeks' },
            ].map(time => (
              <label key={time.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.deliveryTime.includes(time.id)}
                  onChange={() => handleCheckbox('deliveryTime', time.id)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-teal-600">
                  {time.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Rating */}
      <div>
        <SectionHeader 
          title={isRTL ? 'تقييم الخبير' : 'Expert Rating'} 
          section="rating" 
        />
        {expandedSections.rating && (
          <div className="space-y-2 pb-4">
            {[
              { value: 5, label: '★★★★★', text: isRTL ? '5 نجوم' : '5 stars' },
              { value: 4, label: '★★★★☆', text: isRTL ? '4+ نجوم' : '4+ stars' },
              { value: 3, label: '★★★☆☆', text: isRTL ? '3+ نجوم' : '3+ stars' },
            ].map(rating => (
              <label key={rating.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating.value}
                  onChange={() => onFilterChange({ ...filters, rating: rating.value })}
                  className="w-4 h-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-yellow-500">{rating.label}</span>
                <span className="text-sm text-gray-700 group-hover:text-teal-600">
                  {rating.text}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Seller Level */}
      <div>
        <SectionHeader 
          title={isRTL ? 'مستوى الخبير' : 'Expert Level'} 
          section="sellerLevel" 
        />
        {expandedSections.sellerLevel && (
          <div className="space-y-2 pb-4">
            {[
              { id: 'new', label: isRTL ? 'جديد' : 'New', labelEn: 'New', icon: '' },
              { id: 'seller', label: isRTL ? 'بائع' : 'Seller', labelEn: 'Seller', icon: '' },
              { id: 'featured', label: isRTL ? 'بائع متميز' : 'Featured Seller', labelEn: 'Featured Seller', icon: '🏅' },
              { id: 'pro', label: isRTL ? 'بائع محترف' : 'Pro Seller', labelEn: 'Pro Seller', icon: '👑' },
            ].map(level => (
              <label key={level.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.sellerLevel.includes(level.id)}
                  onChange={() => handleCheckbox('sellerLevel', level.id)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-teal-600">
                  {level.label} {level.icon}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Languages */}
      <div>
        <SectionHeader 
          title={isRTL ? 'لغة الخدمة' : 'Service Language'} 
          section="languages" 
        />
        {expandedSections.languages && (
          <div className="space-y-2 pb-4">
            {[
              { id: 'ar', label: isRTL ? 'العربية' : 'Arabic', labelEn: 'Arabic' },
              { id: 'en', label: isRTL ? 'الإنجليزية' : 'English', labelEn: 'English' },
              { id: 'fr', label: isRTL ? 'الفرنسية' : 'French', labelEn: 'French' },
            ].map(lang => (
              <label key={lang.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(lang.id)}
                  onChange={() => handleCheckbox('languages', lang.id)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-teal-600">
                  {lang.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Additional Options */}
      <div>
        <SectionHeader 
          title={isRTL ? 'خيارات إضافية' : 'Additional Options'} 
          section="additional" 
        />
        {expandedSections.additional && (
          <div className="space-y-2 pb-4">
            {[
              { id: 'portfolio', label: isRTL ? 'خدمات مع عينات أعمال' : 'Services with portfolio', labelEn: 'Services with portfolio' },
              { id: 'express', label: isRTL ? 'توصيل سريع متاح' : 'Express delivery available', labelEn: 'Express delivery available' },
              { id: 'revisions', label: isRTL ? 'مراجعات مجانية' : 'Free revisions', labelEn: 'Free revisions' },
              { id: 'online', label: isRTL ? 'الخبراء المتصلون الآن' : 'Experts online now', labelEn: 'Experts online now' },
            ].map(option => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.additionalOptions.includes(option.id)}
                  onChange={() => handleCheckbox('additionalOptions', option.id)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-teal-600">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Clear Filters Button */}
      <Button
        onClick={onClearFilters}
        variant="outline"
        className="w-full text-red-600 border-red-300 hover:bg-red-50"
      >
        {isRTL ? 'مسح كل الفلاتر' : 'Clear All Filters'}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" onClick={onClose}>
        <div 
          className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-full w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900">
              {isRTL ? 'الفلاتر' : 'Filters'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {isRTL ? 'تصفية النتائج' : 'Filter Results'}
      </h2>
      {content}
    </div>
  );
}
