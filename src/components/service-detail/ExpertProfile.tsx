import { Star, ShoppingBag, Calendar, Zap, Clock, MessageCircle, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';

interface ExpertProfileProps {
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
    completedOrders: number;
    memberSince: string;
    isOnline: boolean;
    responseTime: string;
    bio: string;
    bioEn: string;
    skills: string[];
    achievements: Array<{ label: string; labelEn: string }>;
  };
  isRTL?: boolean;
}

export function ExpertProfile({ expert, isRTL = true }: ExpertProfileProps) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {isRTL ? 'عن الخبير' : 'About the Expert'}
      </h2>

      {/* Expert Info Card */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with Online Status */}
          <div className="relative mb-4">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {expert.isOnline && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Name & Username */}
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {expert.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            @{expert.username}
          </p>

          {/* Level Badge */}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${
              levelColors[expert.badge as keyof typeof levelColors]
            }`}
          >
            {levelIcons[expert.badge as keyof typeof levelIcons]} {isRTL ? expert.level : expert.levelEn}
          </span>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{isRTL ? 'التقييم' : 'Rating'}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {expert.rating} <span className="text-sm text-gray-500">({expert.reviewCount})</span>
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span>{isRTL ? 'الطلبات' : 'Orders'}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {expert.completedOrders.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span>{isRTL ? 'عضو منذ' : 'Member since'}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {expert.memberSince}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span>{isRTL ? 'وقت الرد' : 'Response'}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {expert.responseTime}
              </p>
            </div>
          </div>

          {/* Online Status */}
          {expert.isOnline && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-4">
              <Zap className="w-4 h-4" />
              {isRTL ? 'متصل الآن' : 'Online now'}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              {isRTL ? 'متابعة' : 'Follow'}
            </Button>
            <Button variant="outline" className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50">
              <MessageCircle className="w-4 h-4 mr-2" />
              {isRTL ? 'رسالة' : 'Message'}
            </Button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          📝 {isRTL ? 'نبذة عن الخبير:' : 'Expert Bio:'}
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {isRTL ? expert.bio : expert.bioEn}
        </p>
      </div>

      {/* Skills */}
      {expert.skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            💼 {isRTL ? 'المهارات:' : 'Skills:'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {expert.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {expert.achievements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            🏆 {isRTL ? 'الإنجازات:' : 'Achievements:'}
          </h4>
          <div className="space-y-2">
            {expert.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span>{isRTL ? achievement.label : achievement.labelEn}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
