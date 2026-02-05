import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    country: string;
    countryFlag: string;
  };
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  helpfulCount: number;
  sellerReply?: {
    comment: string;
    date: string;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  isRTL?: boolean;
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  ratingBreakdown,
  isRTL = true,
}: ReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    })
    .slice(0, displayCount);

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (rating: number) => {
    return totalReviews > 0 ? Math.round((ratingBreakdown[rating as keyof typeof ratingBreakdown] / totalReviews) * 100) : 0;
  };

  const sortOptions = [
    { value: 'recent', label: isRTL ? 'الأحدث' : 'Most Recent' },
    { value: 'highest', label: isRTL ? 'الأعلى تقييماً' : 'Highest Rated' },
    { value: 'lowest', label: isRTL ? 'الأقل تقييماً' : 'Lowest Rated' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ⭐ {isRTL ? 'التقييمات' : 'Reviews'} ({totalReviews.toLocaleString(isRTL ? 'ar-SA' : 'en-US')})
      </h2>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center bg-teal-50 rounded-lg p-6">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating), 'lg')}
          <p className="text-sm text-gray-600 mt-2">
            {isRTL ? 'من 5.0' : 'out of 5.0'}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const percentage = getRatingPercentage(rating);
            const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
            
            return (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? 'all' : rating)}
                className={`w-full flex items-center gap-3 group hover:bg-gray-50 p-2 rounded transition-colors ${
                  filterRating === rating ? 'bg-teal-50' : ''
                }`}
              >
                <div className="flex items-center gap-1 w-20">
                  {renderStars(rating, 'sm')}
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-16 text-right">
                  {count} ({percentage}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {isRTL ? 'تصفية:' : 'Filter:'}
          </span>
          <Button
            onClick={() => setFilterRating('all')}
            variant={filterRating === 'all' ? 'default' : 'outline'}
            className={`text-sm ${filterRating === 'all' ? 'bg-teal-600 text-white' : ''}`}
          >
            {isRTL ? 'الكل' : 'All'}
          </Button>
          {[5, 4, 3].map(rating => (
            <Button
              key={rating}
              onClick={() => setFilterRating(rating)}
              variant={filterRating === rating ? 'default' : 'outline'}
              className={`text-sm ${filterRating === rating ? 'bg-teal-600 text-white' : ''}`}
            >
              {rating} ⭐
            </Button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 transition-colors"
          >
            <span className="text-gray-700">
              {isRTL ? 'ترتيب:' : 'Sort:'}
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
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20`}>
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as typeof sortBy);
                      setShowSortDropdown(false);
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
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map(review => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
            {/* Review Header */}
            <div className="flex items-start gap-4 mb-3">
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-semibold text-gray-900">{review.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {review.user.countryFlag} {review.user.country}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <p className="text-gray-700 leading-relaxed mb-3">
              {review.comment}
            </p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}

            {/* Helpful Actions */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>{isRTL ? 'مفيد' : 'Helpful'} ({review.helpfulCount})</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            {/* Seller Reply */}
            {review.sellerReply && (
              <div className="mt-4 ml-12 bg-gray-50 rounded-lg p-4 border-l-4 border-teal-600">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-gray-900">
                    {isRTL ? 'رد البائع:' : 'Seller Reply:'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.sellerReply.date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  {review.sellerReply.comment}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredReviews.length < reviews.length && (
        <div className="text-center mt-6">
          <Button
            onClick={() => setDisplayCount(prev => prev + 5)}
            variant="outline"
            className="border-teal-600 text-teal-600 hover:bg-teal-50"
          >
            {isRTL ? 'عرض المزيد من التقييمات' : 'Load More Reviews'}
          </Button>
        </div>
      )}

      {/* No Reviews Message */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isRTL ? 'لا توجد تقييمات بهذا التصنيف' : 'No reviews with this rating'}
          </p>
        </div>
      )}
    </div>
  );
}
