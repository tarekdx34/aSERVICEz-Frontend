import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import {
  User,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Upload,
  X,
  CheckCircle,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Plus
} from 'lucide-react';

export function ExpertSetupPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const verificationInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Profile
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  // Step 2: Portfolio
  const [portfolioItems, setPortfolioItems] = useState<Array<{file: File, description: string}>>([]);

  // Step 3: Verification
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');

  const steps = [
    { id: 1, icon: User, label: 'Profile', labelAr: 'الملف الشخصي' },
    { id: 2, icon: Briefcase, label: 'Portfolio', labelAr: 'معرض الأعمال' },
    { id: 3, icon: ShieldCheck, label: 'Verification', labelAr: 'التحقق' },
    { id: 4, icon: CreditCard, label: 'Payment', labelAr: 'الدفع' }
  ];

  const addSkill = () => {
    if (skillInput.trim() && skills.length < 10) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems = Array.from(e.target.files).map(file => ({
        file,
        description: ''
      }));
      setPortfolioItems([...portfolioItems, ...newItems]);
    }
  };

  const handleVerificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVerificationDocs([...verificationDocs, ...Array.from(e.target.files)]);
    }
  };

  const handleComplete = () => {
    alert(isRTL ? 'تم إعداد ملفك بنجاح!' : 'Profile setup completed successfully!');
    navigate('/expert-dashboard');
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إعداد حساب الخبير' : 'Expert Account Setup'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'أكمل ملفك الشخصي لبدء تقديم الخدمات' : 'Complete your profile to start offering services'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-green-600' : isActive ? 'bg-teal-600' : 'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-600'}`}>
                      {isRTL ? step.labelAr : step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'الملف الشخصي المهني' : 'Professional Profile'}
              </h2>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'صورة الملف الشخصي *' : 'Profile Picture *'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    {profilePicture ? (
                      <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    {isRTL ? 'رفع صورة' : 'Upload Photo'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'نبذة عنك *' : 'Bio / About You *'}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder={isRTL 
                    ? 'اكتب نبذة احترافية عن نفسك وخبراتك...'
                    : 'Write a professional bio about yourself and your experience...'
                  }
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'المهارات (حتى 10) *' : 'Skills (up to 10) *'}
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder={isRTL ? 'أضف مهارة...' : 'Add a skill...'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <Button onClick={addSkill} disabled={skills.length >= 10}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full flex items-center gap-2">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(index)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'مستوى الخبرة *' : 'Experience Level *'}
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">{isRTL ? 'اختر مستوى الخبرة' : 'Select experience level'}</option>
                  <option value="beginner">{isRTL ? 'مبتدئ (0-2 سنوات)' : 'Beginner (0-2 years)'}</option>
                  <option value="intermediate">{isRTL ? 'متوسط (2-5 سنوات)' : 'Intermediate (2-5 years)'}</option>
                  <option value="expert">{isRTL ? 'خبير (5+ سنوات)' : 'Expert (5+ years)'}</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Portfolio */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'معرض الأعمال' : 'Portfolio'}
              </h2>

              <div 
                onClick={() => portfolioInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-400 transition-colors cursor-pointer"
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isRTL ? 'انقر للتحميل أو اسحب العينات وأفلتها هنا' : 'Click to upload or drag and drop portfolio samples'}
                </p>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'PNG, JPG, PDF حتى 20MB' : 'PNG, JPG, PDF up to 20MB'}
                </p>
                <input
                  ref={portfolioInputRef}
                  type="file"
                  multiple
                  onChange={handlePortfolioUpload}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </div>

              {portfolioItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        {item.file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(item.file)} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <FileText className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...portfolioItems];
                          newItems[index].description = e.target.value;
                          setPortfolioItems(newItems);
                        }}
                        placeholder={isRTL ? 'وصف العمل...' : 'Work description...'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                      />
                      <Button
                        onClick={() => setPortfolioItems(portfolioItems.filter((_, i) => i !== index))}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {isRTL ? 'حذف' : 'Remove'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'عملية التحقق' : 'Verification Process'}
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  {isRTL ? 'متطلبات التحقق:' : 'Verification Requirements:'}
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    {isRTL ? 'بطاقة هوية سارية (جواز سفر أو بطاقة وطنية)' : 'Valid ID (passport or national ID)'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    {isRTL ? 'إثبات العنوان (فاتورة مرافق حديثة)' : 'Proof of address (recent utility bill)'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    {isRTL ? 'شهادات مهنية (اختياري)' : 'Professional certifications (optional)'}
                  </li>
                </ul>
              </div>

              <div 
                onClick={() => verificationInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-400 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isRTL ? 'رفع المستندات للتحقق' : 'Upload verification documents'}
                </p>
                <input
                  ref={verificationInputRef}
                  type="file"
                  multiple
                  onChange={handleVerificationUpload}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </div>

              {verificationDocs.length > 0 && (
                <div className="space-y-2">
                  {verificationDocs.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <button
                        onClick={() => setVerificationDocs(verificationDocs.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? 'إعداد طرق الدفع' : 'Payment Methods Setup'}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'طريقة السحب *' : 'Withdrawal Method *'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">{isRTL ? 'اختر طريقة' : 'Select method'}</option>
                  <option value="bank">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                  <option value="paypal">{isRTL ? 'PayPal' : 'PayPal'}</option>
                  <option value="wise">{isRTL ? 'Wise' : 'Wise'}</option>
                </select>
              </div>

              {paymentMethod === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'اسم البنك *' : 'Bank Name *'}
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'رقم الحساب البنكي *' : 'Bank Account Number *'}
                    </label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                    />
                  </div>
                </>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">
                      {isRTL ? 'معلوماتك آمنة' : 'Your Information is Secure'}
                    </p>
                    <p>
                      {isRTL 
                        ? 'جميع معلومات الدفع مشفرة ومحمية وفقاً لمعايير الأمان العالمية.'
                        : 'All payment information is encrypted and protected according to global security standards.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              variant="outline"
            >
              {isRTL ? 'السابق' : 'Previous'}
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isRTL ? 'التالي' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isRTL ? 'إنهاء الإعداد' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
