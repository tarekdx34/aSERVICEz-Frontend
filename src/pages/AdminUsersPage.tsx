import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { authApi, adminApi, type UserProfile, type DashboardStats } from '../services/api';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Award,
  Ban,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Users
} from 'lucide-react';

export function AdminUsersPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [searchId, setSearchId] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Load stats on mount
  useState(() => {
    adminApi.getDashboard()
      .then(res => setStats(res.data))
      .catch(() => {});
  });

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setIsSearching(true);
    setSearchError('');
    setFoundUser(null);
    try {
      const res = await authApi.getUserById(Number(searchId));
      setFoundUser(res.data);
    } catch (err: any) {
      setSearchError(err.message || (isRTL ? 'المستخدم غير موجود' : 'User not found'));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة الحسابات والتحقق' : 'Manage accounts and verification'}
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">{isRTL ? 'إجمالي المستخدمين' : 'Total Users'}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">{isRTL ? 'إجمالي الخبراء' : 'Total Experts'}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalExperts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">{isRTL ? 'العملاء' : 'Customers'}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers - stats.totalExperts}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search by User ID */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={isRTL ? 'ابحث برقم المستخدم (ID)...' : 'Search by User ID...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="bg-teal-600 hover:bg-teal-700 text-white">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              {isRTL ? 'بحث' : 'Search'}
            </Button>
          </div>
          {searchError && (
            <p className="text-sm text-red-600 mt-2">{searchError}</p>
          )}
        </div>

        {/* User Details */}
        {foundUser && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isRTL ? 'تفاصيل الحساب' : 'Account Details'}</h2>
              <Button onClick={() => setFoundUser(null)} variant="ghost" size="sm">✕</Button>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {foundUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{foundUser.name}</h3>
                  <p className="text-gray-600 mb-1">{foundUser.email}</p>
                  <p className="text-sm text-gray-500">{isRTL ? 'رقم المستخدم' : 'User ID'}: {foundUser.userId}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      foundUser.userType === 'EXPERT' ? 'bg-purple-100 text-purple-700' :
                      foundUser.userType === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {foundUser.userType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {foundUser.phone && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{isRTL ? 'الهاتف' : 'Phone'}</p>
                  <p className="font-medium text-gray-900">{foundUser.phone}</p>
                </div>
              )}
              {foundUser.rating != null && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{isRTL ? 'التقييم' : 'Rating'}</p>
                  <p className="text-2xl font-bold text-gray-900">{foundUser.rating}</p>
                </div>
              )}
              {foundUser.specialization && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{isRTL ? 'التخصص' : 'Specialization'}</p>
                  <p className="font-medium text-gray-900">{foundUser.specialization}</p>
                </div>
              )}
              {foundUser.createdAt && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{isRTL ? 'تاريخ الانضمام' : 'Joined'}</p>
                  <p className="font-medium text-gray-900">{new Date(foundUser.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {foundUser.bio && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{isRTL ? 'نبذة' : 'Bio'}</h3>
                <p className="text-gray-600">{foundUser.bio}</p>
              </div>
            )}

            {foundUser.skills && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{isRTL ? 'المهارات' : 'Skills'}</h3>
                <div className="flex flex-wrap gap-2">
                  {foundUser.skills.split(',').map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
