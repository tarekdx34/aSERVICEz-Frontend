import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
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
  XCircle
} from 'lucide-react';

export function AdminUsersPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'customer' | 'expert'>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users = [
    {
      id: 'USR-001',
      name: 'Sarah Johnson',
      nameAr: 'سارة جونسون',
      email: 'sarah@example.com',
      type: 'expert',
      status: 'active',
      verified: true,
      trustBadge: true,
      orders: 156,
      revenue: '$15,600',
      rating: 4.9,
      joinDate: '2023-06-15'
    },
    {
      id: 'USR-002',
      name: 'Ahmed Hassan',
      nameAr: 'أحمد حسن',
      email: 'ahmed@example.com',
      type: 'expert',
      status: 'pending_verification',
      verified: false,
      trustBadge: false,
      orders: 24,
      revenue: '$2,400',
      rating: 4.7,
      joinDate: '2024-01-10'
    },
    {
      id: 'USR-003',
      name: 'Mike Chen',
      nameAr: 'مايك تشن',
      email: 'mike@example.com',
      type: 'customer',
      status: 'active',
      verified: true,
      trustBadge: false,
      orders: 45,
      revenue: '$4,500',
      rating: null,
      joinDate: '2023-09-22'
    }
  ];

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.type === filter);
  const user = users.find(u => u.id === selectedUser);

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

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن المستخدمين...' : 'Search users...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isRTL ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setFilter('customer')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'customer' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isRTL ? 'العملاء' : 'Customers'}
              </button>
              <button
                onClick={() => setFilter('expert')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'expert' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isRTL ? 'الخبراء' : 'Experts'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className={selectedUser ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'المستخدم' : 'User'}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'النوع' : 'Type'}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'الحالة' : 'Status'}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className={selectedUser === u.id ? 'bg-teal-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 flex items-center gap-2">
                                {isRTL ? u.nameAr : u.name}
                                {u.verified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                                {u.trustBadge && <Shield className="w-4 h-4 text-yellow-600" />}
                              </p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.type === 'expert' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.type === 'expert' ? (isRTL ? 'خبير' : 'Expert') : (isRTL ? 'عميل' : 'Customer')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.status === 'active' ? 'bg-green-100 text-green-700' :
                            u.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {u.status === 'active' ? (isRTL ? 'نشط' : 'Active') :
                             u.status === 'pending_verification' ? (isRTL ? 'قيد التحقق' : 'Pending') :
                             (isRTL ? 'معلق' : 'Suspended')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => setSelectedUser(u.id)}
                            size="sm"
                            variant="outline"
                            className="border-teal-600 text-teal-600 hover:bg-teal-50"
                          >
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* User Details Panel */}
          {selectedUser && user && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{isRTL ? 'تفاصيل الحساب' : 'Account Details'}</h2>
                  <Button
                    onClick={() => setSelectedUser(null)}
                    variant="ghost"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>

                {/* User Info */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{isRTL ? user.nameAr : user.name}</h3>
                      <p className="text-gray-600 mb-2">{user.email}</p>
                      <div className="flex gap-2">
                        {user.verified && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {isRTL ? 'موثق' : 'Verified'}
                          </span>
                        )}
                        {user.trustBadge && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {isRTL ? 'خبير موثوق' : 'Trusted'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{isRTL ? 'الطلبات' : 'Orders'}</p>
                    <p className="text-2xl font-bold text-gray-900">{user.orders}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{isRTL ? 'الإيرادات' : 'Revenue'}</p>
                    <p className="text-2xl font-bold text-gray-900">{user.revenue}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{isRTL ? 'التقييم' : 'Rating'}</p>
                    <p className="text-2xl font-bold text-gray-900">{user.rating || 'N/A'}</p>
                  </div>
                </div>

                {/* Verification Documents */}
                {user.type === 'expert' && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{isRTL ? 'مستندات التحقق' : 'Verification Documents'}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">ID_Document.pdf</span>
                        </div>
                        <Button size="sm" variant="ghost">{isRTL ? 'عرض' : 'View'}</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">Proof_Address.pdf</span>
                        </div>
                        <Button size="sm" variant="ghost">{isRTL ? 'عرض' : 'View'}</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {!user.verified && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <UserCheck className="w-4 h-4 mr-2" />
                      {isRTL ? 'الموافقة على التحقق' : 'Approve Verification'}
                    </Button>
                  )}
                  {user.type === 'expert' && !user.trustBadge && (
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      <Award className="w-4 h-4 mr-2" />
                      {isRTL ? 'منح شارة موثوق' : 'Grant Trust Badge'}
                    </Button>
                  )}
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    <Ban className="w-4 h-4 mr-2" />
                    {isRTL ? 'تعليق الحساب' : 'Suspend Account'}
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700">
                    <UserX className="w-4 h-4 mr-2" />
                    {isRTL ? 'إنهاء الحساب' : 'Terminate Account'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
