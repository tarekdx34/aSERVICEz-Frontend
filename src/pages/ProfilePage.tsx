import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { authApi } from '../services/api';
import {
  User, Mail, Calendar, Award, Star, Briefcase, Code,
  Lock, Bell, Globe, Shield, Loader2, Save, Plus, X, Phone
} from 'lucide-react';

type Tab = 'profile' | 'edit' | 'password' | 'preferences';

export function ProfilePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || '');
  const [skillInput, setSkillInput] = useState('');
  const [specialization, setSpecialization] = useState(user?.specialization || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const skillsList = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      const updated = [...skillsList, trimmed].join(', ');
      setSkills(updated);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const updated = skillsList.filter((_, i) => i !== index).join(', ');
    setSkills(updated);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await authApi.updateProfile({
        name,
        phone,
        bio,
        ...(user?.role === 'expert' ? { skills, specialization } : {}),
      });
      await refreshProfile();
      setMessage({ type: 'success', text: isRTL ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || (isRTL ? 'فشل في حفظ التغييرات' : 'Failed to save changes') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match' });
      return;
    }
    setIsChangingPassword(true);
    setMessage(null);
    try {
      await authApi.updateProfile({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: isRTL ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || (isRTL ? 'فشل في تحديث كلمة المرور' : 'Failed to update password') });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs: { key: Tab; label: string; labelAr: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', labelAr: 'الملف الشخصي', icon: <User className="w-4 h-4" /> },
    { key: 'edit', label: 'Edit Profile', labelAr: 'تعديل الملف', icon: <Save className="w-4 h-4" /> },
    { key: 'password', label: 'Password', labelAr: 'كلمة المرور', icon: <Lock className="w-4 h-4" /> },
    { key: 'preferences', label: 'Preferences', labelAr: 'التفضيلات', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        body { font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"}; }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-28"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                user?.role === 'expert' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user?.role === 'expert' ? (isRTL ? '👑 خبير' : '👑 Expert') : (isRTL ? '👤 عميل' : '👤 Customer')}
              </span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`rounded-lg p-3 text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs + Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="md:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setMessage(null); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-teal-50 text-teal-700 border-l-3 border-teal-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {isRTL ? tab.labelAr : tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile View Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isRTL ? 'معلومات الملف الشخصي' : 'Profile Information'}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                      <p className="font-medium text-gray-900 text-sm">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isRTL ? 'الهاتف' : 'Phone'}</p>
                      <p className="font-medium text-gray-900 text-sm">{user?.phone || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isRTL ? 'عضو منذ' : 'Member Since'}</p>
                      <p className="font-medium text-gray-900 text-sm">{new Date().getFullYear()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isRTL ? 'الحالة' : 'Status'}</p>
                      <p className="font-medium text-green-600 text-sm">{isRTL ? 'نشط' : 'Active'}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{isRTL ? 'نبذة عني' : 'About Me'}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {user?.bio || (isRTL ? 'لا توجد نبذة بعد. أضف واحدة من تعديل الملف الشخصي.' : 'No bio yet. Add one from Edit Profile.')}
                  </p>
                </div>

                {/* Expert Details */}
                {user?.role === 'expert' && (
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700">{isRTL ? 'معلومات الخبير' : 'Expert Details'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {user.rating != null && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{isRTL ? 'التقييم' : 'Rating'}</p>
                            <p className="font-medium text-gray-900 text-sm">{user.rating} / 5</p>
                          </div>
                        </div>
                      )}
                      {user.specialization && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{isRTL ? 'التخصص' : 'Specialization'}</p>
                            <p className="font-medium text-gray-900 text-sm">{user.specialization}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-teal-600" />
                        <p className="text-xs text-gray-500">{isRTL ? 'المهارات' : 'Skills'}</p>
                      </div>
                      {user.skills ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.split(',').map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">{isRTL ? 'لم تتم إضافة مهارات بعد' : 'No skills added yet'}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === 'edit' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input type="email" defaultValue={user?.email} disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'نبذة عني' : 'Bio'}</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" />
                  </div>

                  {user?.role === 'expert' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'التخصص' : 'Specialization'}</label>
                        <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)}
                          placeholder={isRTL ? 'مثال: تطوير الواجهات الأمامية' : 'e.g. Frontend Development'}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                      </div>

                      {/* Skills with tag-style UI */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          <Code className="w-4 h-4 inline mr-1" />
                          {isRTL ? 'المهارات' : 'Skills'}
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skillsList.map((skill, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                              {skill}
                              <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-500 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                            placeholder={isRTL ? 'اكتب مهارة واضغط Enter أو +' : 'Type a skill and press Enter or +'}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                          <Button type="button" variant="outline" onClick={addSkill} className="px-3">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 text-white">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal-600" />
                  {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                </h2>
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <Button onClick={handleChangePassword} disabled={isChangingPassword} className="bg-teal-600 hover:bg-teal-700 text-white">
                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
                  </Button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-teal-600" />
                    {isRTL ? 'الإشعارات' : 'Notifications'}
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">{isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">{isRTL ? 'إشعارات الطلبات' : 'Order Notifications'}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">{isRTL ? 'تحديثات التسويق' : 'Marketing Updates'}</span>
                      <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-600" />
                    {isRTL ? 'اللغة والمنطقة' : 'Language & Region'}
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{isRTL ? 'اللغة' : 'Language'}</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option value="ar">{isRTL ? 'العربية' : 'Arabic'}</option>
                      <option value="en">{isRTL ? 'الإنجليزية' : 'English'}</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600" />
                    {isRTL ? 'الخصوصية والأمان' : 'Privacy & Security'}
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">{isRTL ? 'ملف شخصي عام' : 'Public Profile'}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">{isRTL ? 'إظهار البريد الإلكتروني' : 'Show Email'}</span>
                      <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">{isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</span>
                      <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
