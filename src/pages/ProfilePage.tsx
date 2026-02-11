import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { User, Mail, Calendar, Award, Star, Briefcase, Code, FileText } from 'lucide-react';

export function ProfilePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-32"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                user?.role === 'expert' 
                  ? 'bg-teal-100 text-teal-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user?.role === 'expert' ? (isRTL ? '👑 خبير' : '👑 Expert') : (isRTL ? '👤 عميل' : '👤 Customer')}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                <p className="text-gray-600">@{user?.name?.toLowerCase().replace(' ', '_')}</p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? 'نوع الحساب' : 'Account Type'}</p>
                    <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? 'عضو منذ' : 'Member Since'}</p>
                    <p className="font-medium text-gray-900">{new Date().getFullYear()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? 'الحالة' : 'Status'}</p>
                    <p className="font-medium text-green-600">{isRTL ? 'نشط' : 'Active'}</p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {isRTL ? 'نبذة عني' : 'About Me'}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {user?.bio || (isRTL 
                    ? 'مرحباً! أنا عضو في منصة aSERVICEa. يمكنك تحديث معلومات ملفك الشخصي من صفحة الإعدادات.'
                    : 'Welcome! I\'m a member of aSERVICEa platform. You can update your profile information from the settings page.'
                  )}
                </p>
              </div>

              {/* Expert-specific Fields */}
              {user?.role === 'expert' && (
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    {isRTL ? 'معلومات الخبير' : 'Expert Details'}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {user.rating != null && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{isRTL ? 'التقييم' : 'Rating'}</p>
                          <p className="font-medium text-gray-900">{user.rating} / 5</p>
                        </div>
                      </div>
                    )}
                    {user.specialization && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{isRTL ? 'التخصص' : 'Specialization'}</p>
                          <p className="font-medium text-gray-900">{user.specialization}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {user.skills && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-teal-600" />
                        <p className="text-sm text-gray-500">{isRTL ? 'المهارات' : 'Skills'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
