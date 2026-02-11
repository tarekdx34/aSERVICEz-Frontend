import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { authApi, adminApi, type UserProfile, type DashboardStats } from '../services/api';
import {
  Search,
  Shield,
  Loader2,
  Users,
  ChevronDown,
  ChevronUp,
  Star,
  X,
} from 'lucide-react';

const roleBadge = (type: string) => {
  const t = type?.toUpperCase();
  if (t === 'ADMIN') return 'bg-red-100 text-red-700';
  if (t === 'EXPERT') return 'bg-purple-100 text-purple-700';
  if (t === 'CUSTOMER_SERVICE') return 'bg-orange-100 text-orange-700';
  return 'bg-blue-100 text-blue-700';
};

export function AdminUsersPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const dashRes = await adminApi.getDashboard();
        setStats(dashRes.data);
        const total = dashRes.data.totalUsers || 0;
        // Fetch all users by ID in batches
        const batchSize = 10;
        const users: UserProfile[] = [];
        for (let start = 1; start <= total + 5; start += batchSize) {
          const batch = Array.from({ length: batchSize }, (_, i) => start + i);
          const results = await Promise.allSettled(
            batch.map(id => authApi.getUserById(id))
          );
          results.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data) {
              users.push(r.value.data);
            }
          });
        }
        setAllUsers(users);
      } catch {
        setAllUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      if (roleFilter !== 'all' && u.userType?.toUpperCase() !== roleFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          String(u.userId).includes(q)
        );
      }
      return true;
    });
  }, [allUsers, searchQuery, roleFilter]);

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'عرض وإدارة جميع الحسابات' : 'View and manage all accounts'}
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  <p className="text-sm text-gray-500">{isRTL ? 'الخبراء' : 'Experts'}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalExperts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">{isRTL ? 'العملاء' : 'Customers'}</p>
                  <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.userType?.toUpperCase() === 'CUSTOMER').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">{isRTL ? 'المشرفون' : 'Admins'}</p>
                  <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.userType?.toUpperCase() === 'ADMIN').length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'ابحث بالاسم أو البريد أو الرقم...' : 'Search by name, email, or ID...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="all">{isRTL ? 'جميع الأنواع' : 'All Roles'}</option>
              <option value="ADMIN">{isRTL ? 'مشرف' : 'Admin'}</option>
              <option value="EXPERT">{isRTL ? 'خبير' : 'Expert'}</option>
              <option value="CUSTOMER">{isRTL ? 'عميل' : 'Customer'}</option>
              <option value="CUSTOMER_SERVICE">{isRTL ? 'خدمة العملاء' : 'Customer Service'}</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mr-3" />
            <span className="text-gray-600">{isRTL ? 'جاري تحميل المستخدمين...' : 'Loading users...'}</span>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {isRTL ? `${filteredUsers.length} مستخدم` : `${filteredUsers.length} users`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'الاسم' : 'Name'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'البريد' : 'Email'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'النوع' : 'Role'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'الهاتف' : 'Phone'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'الانضمام' : 'Joined'}</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.userId} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(selectedUser?.userId === user.userId ? null : user)}>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.userId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge(user.userType)}`}>
                          {user.userType?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {selectedUser?.userId === user.userId ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        {isRTL ? 'لا يوجد مستخدمون' : 'No users found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected User Detail Panel */}
        {selectedUser && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{isRTL ? 'تفاصيل المستخدم' : 'User Details'}</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedUser.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge(selectedUser.userType)}`}>
                    {selectedUser.userType?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{isRTL ? 'رقم المستخدم' : 'User ID'}</p>
                <p className="font-semibold text-gray-900">{selectedUser.userId}</p>
              </div>
              {selectedUser.phone && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{isRTL ? 'الهاتف' : 'Phone'}</p>
                  <p className="font-semibold text-gray-900">{selectedUser.phone}</p>
                </div>
              )}
              {selectedUser.rating != null && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{isRTL ? 'التقييم' : 'Rating'}</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    {selectedUser.rating} <Star className="w-4 h-4 text-yellow-500" />
                  </p>
                </div>
              )}
              {selectedUser.specialization && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{isRTL ? 'التخصص' : 'Specialization'}</p>
                  <p className="font-semibold text-gray-900">{selectedUser.specialization}</p>
                </div>
              )}
              {selectedUser.createdAt && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{isRTL ? 'تاريخ الانضمام' : 'Joined'}</p>
                  <p className="font-semibold text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            {selectedUser.bio && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-1">{isRTL ? 'نبذة' : 'Bio'}</p>
                <p className="text-gray-700">{selectedUser.bio}</p>
              </div>
            )}
            {selectedUser.skills && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">{isRTL ? 'المهارات' : 'Skills'}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.split(',').map((s, i) => (
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
