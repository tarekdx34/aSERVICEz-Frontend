import { Star, MessageCircle, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router';

interface ServiceHeaderProps {
  title: string;
  category: string;
  categoryEn: string;
  subcategory: string;
  subcategoryEn: string;
  expert: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    level: string;
    levelEn: string;
    badge: string;
    rating: number;
    reviewCount: number;
  };
  isRTL?: boolean;
}

export function ServiceHeader({ title, category, categoryEn, subcategory, subcategoryEn, expert, isRTL = true }: ServiceHeaderProps) {
  const levelColors = {
    new: 'bg-gray-100 text-gray-700',
    seller: 'bg-blue-100 text-blue-700',
    featured: 'bg-purple-100 text-purple-700',
    pro: 'bg-teal-100 text-teal-700',
  };

  const levelIcons = {
    new: '',
    seller: '',
    featured: '🏅',
    pro: '👑',
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>

      {/* Expert & Category Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Expert Profile */}
        <div className="flex items-center gap-3">
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <Link 
                to={`/expert/${expert.id}`}
                className="font-semibold text-gray-900 hover:text-teal-600 transition-colors"
              >
                {expert.name}
              </Link>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  levelColors[expert.badge as keyof typeof levelColors]
                }`}
              >
                {levelIcons[expert.badge as keyof typeof levelIcons]} {isRTL ? expert.level : expert.levelEn}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">@{expert.username}</span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{expert.rating}</span>
                <span className="text-gray-500">({expert.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button variant="outline" className="gap-2">
            <UserPlus className="w-4 h-4" />
            {isRTL ? 'متابعة' : 'Follow'}
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            {isRTL ? 'إرسال رسالة' : 'Message'}
          </Button>
        </div>
      </div>

      {/* Category Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>🏷️</span>
        <Link to="/" className="hover:text-teal-600 transition-colors">
          {isRTL ? 'الرئيسية' : 'Home'}
        </Link>
        <span>›</span>
        <Link to={`/browse?category=${category}`} className="hover:text-teal-600 transition-colors">
          {isRTL ? category : categoryEn}
        </Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">
          {isRTL ? subcategory : subcategoryEn}
        </span>
      </div>
    </div>
  );
}
