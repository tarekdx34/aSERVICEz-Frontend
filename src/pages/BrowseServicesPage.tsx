import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearchParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/browse/Breadcrumb';
import { CategoryHero } from '../components/browse/CategoryHero';
import { AdvancedFilterSidebar, AdvancedFilters } from '../components/browse/AdvancedFilterSidebar';
import { ActiveFilters } from '../components/browse/ActiveFilters';
import { EmptyState } from '../components/browse/EmptyState';
import { ServiceCard } from '../components/ServiceCard';
import { Pagination } from '../components/Pagination';
import { serviceApi, categoryApi, type ServiceResponse, type PaginationResponse, type CategoryResponse } from '../services/api';
import { Grid3x3, List, Filter, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';

type ViewMode = 'grid' | 'list';
type SortOption = 'relevant' | 'newest' | 'rating' | 'price-low' | 'price-high' | 'bestseller';

export function BrowseServicesPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [filters, setFilters] = useState<AdvancedFilters>({
    searchQuery: searchParams.get('q') || '',
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    subcategories: [],
    priceRange: [0, 500],
    pricePresets: [],
    deliveryTime: [],
    rating: 0,
    sellerLevel: [],
    languages: [],
    additionalOptions: [],
  });

  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryResponse | null>(null);

  const servicesPerPage = 24;
  const selectedCategory = filters.categories.length === 1 ? filters.categories[0] : undefined;

  const selectedSubcategory = filters.subcategories.length === 1 ? filters.subcategories[0] : undefined;

  // Fetch category info when a single category is selected
  useEffect(() => {
    if (selectedCategory) {
      categoryApi.getByIdentifier(selectedCategory)
        .then(res => setCategoryData(res.data))
        .catch(() => setCategoryData(null));
    } else {
      setCategoryData(null);
    }
  }, [selectedCategory]);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Map sort values to API-supported ones
      const apiSortBy = (sortBy === 'rating' || sortBy === 'bestseller') ? undefined : sortBy;

      const res = await serviceApi.list({
        page: currentPage,
        limit: servicesPerPage,
        search: filters.searchQuery || undefined,
        category: selectedSubcategory ? undefined : (selectedCategory || undefined),
        subcategory: selectedSubcategory || undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 500 ? filters.priceRange[1] : undefined,
        sortBy: apiSortBy !== 'relevant' ? apiSortBy : undefined,
      });
      let fetchedServices = res.data.services || [];

      // Client-side sorting for unsupported sort options
      if (sortBy === 'rating') {
        fetchedServices = [...fetchedServices].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'bestseller') {
        fetchedServices = [...fetchedServices].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      }

      setServices(fetchedServices);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters.searchQuery, selectedCategory, selectedSubcategory, filters.priceRange, sortBy]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.categories.length > 0) params.set('category', filters.categories[0]);
    if (sortBy !== 'relevant') params.set('sort', sortBy);
    setSearchParams(params);
  }, [filters.searchQuery, filters.categories, sortBy, setSearchParams]);

  // Apply client-side filters the API doesn't support
  const filteredServices = services.filter(service => {
    // Price presets
    if (filters.pricePresets.length > 0) {
      const match = filters.pricePresets.some(preset => {
        if (preset === '5') return service.price <= 5;
        if (preset === '10-25') return service.price >= 10 && service.price <= 25;
        if (preset === '25-50') return service.price >= 25 && service.price <= 50;
        if (preset === '50+') return service.price >= 50;
        return false;
      });
      if (!match) return false;
    }
    // Delivery time
    if (filters.deliveryTime.length > 0 && service.deliveryTime) {
      const days = service.deliveryTime;
      const match = filters.deliveryTime.some(dt => {
        if (dt === '24h') return days <= 1;
        if (dt === '3days') return days <= 3;
        if (dt === '7days') return days <= 7;
        if (dt === '14days') return days <= 14;
        if (dt === '14+') return days > 14;
        return false;
      });
      if (!match) return false;
    }
    // Rating
    if (filters.rating > 0 && (service.rating == null || service.rating < filters.rating)) {
      return false;
    }
    // Seller level
    if (filters.sellerLevel.length > 0 && service.expert?.badge) {
      if (!filters.sellerLevel.includes(service.expert.badge)) return false;
    }
    return true;
  });

  const totalPages = pagination?.totalPages || Math.ceil(filteredServices.length / servicesPerPage);

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      subcategories: [],
      priceRange: [0, 500],
      pricePresets: [],
      deliveryTime: [],
      rating: 0,
      sellerLevel: [],
      languages: [],
      additionalOptions: [],
    });
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filterType: keyof AdvancedFilters, value: string | number) => {
    if (filterType === 'rating') {
      setFilters({ ...filters, rating: 0 });
    } else if (Array.isArray(filters[filterType])) {
      setFilters({
        ...filters,
        [filterType]: (filters[filterType] as any[]).filter(v => v !== value),
      });
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: AdvancedFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: 'relevant', label: isRTL ? 'الأكثر صلة' : 'Most Relevant' },
    { value: 'newest', label: isRTL ? 'الأحدث' : 'Newest' },
    { value: 'rating', label: isRTL ? 'الأعلى تقييماً' : 'Highest Rated' },
    { value: 'price-low', label: isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { value: 'price-high', label: isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
    { value: 'bestseller', label: isRTL ? 'الأكثر مبيعاً' : 'Best Seller' },
  ];

  // Count active filters
  const activeFilterCount = 
    filters.categories.length +
    filters.pricePresets.length +
    filters.deliveryTime.length +
    (filters.rating > 0 ? 1 : 0) +
    filters.sellerLevel.length +
    filters.languages.length +
    filters.additionalOptions.length;

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: isRTL ? 'الرئيسية' : 'Home', href: '/' },
            { label: isRTL ? 'تصفح الخدمات' : 'Browse Services', href: '/browse' },
            ...(categoryData ? [{ label: isRTL ? categoryData.name : (categoryData.nameEn || categoryData.name) }] : []),
          ]}
          isRTL={isRTL}
        />

        {/* Category Hero (if category selected) */}
        {categoryData && (
          <CategoryHero
            categoryName={categoryData.name}
            categoryNameEn={categoryData.nameEn || categoryData.name}
            description={categoryData.description || ''}
            descriptionEn={categoryData.descriptionEn || categoryData.description || ''}
            icon={categoryData.icon || '📁'}
            serviceCount={pagination?.totalItems || filteredServices.length}
            isRTL={isRTL}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <AdvancedFilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isRTL={isRTL}
              selectedCategory={selectedCategory}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowMobileFilters(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2 relative"
              >
                <Filter className="w-4 h-4" />
                {isRTL ? 'الفلاتر' : 'Filters'}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
              <AdvancedFilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isRTL={isRTL}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
                selectedCategory={selectedCategory}
              />
            )}

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearFilters}
              isRTL={isRTL}
            />

            {/* Top Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  {isRTL
                    ? `${pagination?.totalItems || filteredServices.length} خدمة`
                    : `${pagination?.totalItems || filteredServices.length} services`
                  }
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-gray-400 transition-colors"
                    >
                      <span className="text-gray-700">
                        {isRTL ? 'ترتيب حسب:' : 'Sort by:'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {sortOptions.find(opt => opt.value === sortBy)?.label}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {showSortDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowSortDropdown(false)}
                        ></div>
                        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20`}>
                          {sortOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value as SortOption);
                                setShowSortDropdown(false);
                                setCurrentPage(1);
                              }}
                              className={`w-full text-${isRTL ? 'right' : 'left'} px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                sortBy === option.value ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Grid/List */}
            {filteredServices.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} isRTL={isRTL} />
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {filteredServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isRTL={isRTL}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      isRTL={isRTL}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
