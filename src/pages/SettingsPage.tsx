import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { authApi } from '../services/api';
import { User, Mail, Lock, Bell, Globe, Shield, Loader2 } from 'lucide-react';

export function SettingsPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await authApi.updateProfile({ name, phone, bio });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isRTL ? 'الإعدادات' : 'Settings'}
        </h1>

        <div className="space-y-6">
          {/* Status Message */}
          {message && (
            <div className={`rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* Account Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              {isRTL ? 'إعدادات الحساب' : 'Account Settings'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'رقم الهاتف' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'نبذة عني' : 'Bio'}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 text-white">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={isChangingPassword} className="bg-teal-600 hover:bg-teal-700 text-white">
                {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{isRTL ? 'إشعارات الطلبات' : 'Order Notifications'}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{isRTL ? 'تحديثات التسويق' : 'Marketing Updates'}</span>
                <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              </label>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-600" />
              {isRTL ? 'اللغة والمنطقة' : 'Language & Region'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'اللغة' : 'Language'}
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="ar">{isRTL ? 'العربية' : 'Arabic'}</option>
                  <option value="en">{isRTL ? 'الإنجليزية' : 'English'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              {isRTL ? 'الخصوصية والأمان' : 'Privacy & Security'}
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{isRTL ? 'ملف شخصي عام' : 'Public Profile'}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{isRTL ? 'إظهار البريد الإلكتروني' : 'Show Email'}</span>
                <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</span>
                <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              </label>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
