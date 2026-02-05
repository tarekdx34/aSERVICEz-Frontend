import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { SearchHero } from '../components/SearchHero';
import { CategoryScroll } from '../components/CategoryScroll';
import { FilterSidebar } from '../components/FilterSidebar';
import { ServiceGrid } from '../components/ServiceGrid';
import { Pagination } from '../components/Pagination';
import { Footer } from '../components/Footer';
import { mockServices } from '../data/mockServices';
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

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let result = mockServices.map(service => ({
      ...service,
      title: isRTL ? service.title : service.titleEn,
      expert: {
        ...service.expert,
        name: isRTL ? service.expert.name : service.expert.nameEn,
        level: isRTL ? service.expert.level : service.expert.levelEn,
      },
    }));

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(service => 
        service.title.toLowerCase().includes(query) ||
        service.expert.name.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(service => service.category === activeCategory);
    }

    // Apply price filter
    result = result.filter(service => 
      service.price >= filters.priceRange[0] && 
      service.price <= filters.priceRange[1]
    );

    // Apply delivery time filter
    if (filters.deliveryTime.length > 0) {
      result = result.filter(service => 
        filters.deliveryTime.includes(service.deliveryTime)
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter(service => service.rating >= filters.rating);
    }

    // Apply seller level filter
    if (filters.sellerLevel.length > 0) {
      result = result.filter(service => 
        filters.sellerLevel.includes(service.expert.badge)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = [...result].reverse();
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default:
        // relevant - keep original order
        break;
    }

    return result;
  }, [searchQuery, activeCategory, filters, sortBy, isRTL]);

  // Pagination
  const servicesPerPage = 12;
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    return filteredServices.slice(startIndex, startIndex + servicesPerPage);
  }, [filteredServices, currentPage]);

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
      {/* Import Cairo font for Arabic */}
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
              {isRTL ? 'تصفية ��لنتائج' : 'Filter Results'}
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
            services={paginatedServices}
            isRTL={isRTL}
            totalResults={filteredServices.length}
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