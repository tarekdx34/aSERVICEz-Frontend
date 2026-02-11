import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { SearchHero } from '../components/SearchHero';
import { CategoryScroll } from '../components/CategoryScroll';
import { FilterSidebar } from '../components/FilterSidebar';
import { ServiceGrid } from '../components/ServiceGrid';
import { Pagination } from '../components/Pagination';
import { Footer } from '../components/Footer';
import { serviceApi, type ServiceResponse, type PaginationResponse } from '../services/api';
import { Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

export function MarketplacePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 500] as [number, number],
    deliveryTime: [] as string[],
    rating: 0,
    sellerLevel: [] as string[],
  });

  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const servicesPerPage = 12;

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await serviceApi.list({
        page: currentPage,
        limit: servicesPerPage,
        search: searchQuery || undefined,
        category: activeCategory !== 'all' ? activeCategory : undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 500 ? filters.priceRange[1] : undefined,
        sortBy: sortBy !== 'relevant' ? sortBy : undefined,
      });
      setServices(res.data.services || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, activeCategory, filters.priceRange, sortBy]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Apply client-side filters for fields the API doesn't support
  const filteredServices = services.filter(service => {
    if (filters.deliveryTime.length > 0 && service.deliveryTime) {
      const days = service.deliveryTime;
      const matches = filters.deliveryTime.some(dt => {
        if (dt === '2days') return days <= 2;
        if (dt === '3days') return days <= 3;
        if (dt === '7days') return days <= 7;
        if (dt === '7plus') return days > 7;
        return false;
      });
      if (!matches) return false;
    }
    if (filters.rating > 0 && (service.rating == null || service.rating < filters.rating)) {
      return false;
    }
    if (filters.sellerLevel.length > 0 && service.expert?.badge) {
      if (!filters.sellerLevel.includes(service.expert.badge)) return false;
    }
    return true;
  });

  const totalResults = filteredServices.length;
  const totalPages = pagination?.totalPages || Math.ceil(totalResults / servicesPerPage);

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 500],
      deliveryTime: [],
      rating: 0,
      sellerLevel: [],
    });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-from-bottom {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fade-in 0.4s ease-out, slide-in-from-bottom 0.4s ease-out;
        }
      `}</style>

      <Navbar 
        isRTL={isRTL} 
        onLanguageToggle={toggleLanguage} 
      />
      
      <SearchHero 
        isRTL={isRTL}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      <CategoryScroll 
        isRTL={isRTL}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar 
              isRTL={isRTL}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button 
              onClick={() => setShowMobileFilters(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <Filter className="w-4 h-4" />
              {isRTL ? 'تصفية النتائج' : 'Filter Results'}
            </Button>
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <FilterSidebar 
              isRTL={isRTL}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile={true}
              onClose={() => setShowMobileFilters(false)}
            />
          )}

          {/* Main Content */}
          <ServiceGrid 
            services={filteredServices}
            isRTL={isRTL}
            totalResults={pagination?.totalItems || totalResults}
            currentPage={currentPage}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isRTL={isRTL}
          />
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
