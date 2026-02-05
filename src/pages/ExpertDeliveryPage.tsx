import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import {
  Upload,
  FileText,
  X,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export function ExpertDeliveryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'progress' | 'draft' | 'deliver'>('progress');
  const [progress, setProgress] = useState(60);
  const [progressMessage, setProgressMessage] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleDeliver = () => {
    alert(isRTL ? 'تم تسليم الطلب بنجاح!' : 'Order delivered successfully!');
    navigate('/expert-orders');
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إدارة التسليم' : 'Manage Delivery'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'رقم الطلب:' : 'Order ID:'} <span className="font-mono font-semibold">{id}</span>
          </p>
        </div>

        {/* Progress Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{isRTL ? 'تقدم الطلب' : 'Order Progress'}</h3>
            <span className="text-2xl font-bold text-teal-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-teal-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{isRTL ? 'الموعد النهائي: 3 أيام متبقية' : 'Deadline: 3 days remaining'}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'progress' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'تحديث التقدم' : 'Update Progress'}
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'draft' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'مشاركة مسودة' : 'Share Draft'}
          </button>
          <button
            onClick={() => setActiveTab('deliver')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'deliver' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'التسليم النهائي' : 'Final Delivery'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Progress Update Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isRTL ? 'إرسال تحديث التقدم' : 'Send Progress Update'}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'نسبة الإنجاز' : 'Completion Percentage'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm text-gray-600 mt-1">{progress}%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'رسالة التحديث' : 'Update Message'}
                </label>
                <textarea
                  value={progressMessage}
                  onChange={(e) => setProgressMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder={isRTL 
                    ? 'أخبر العميل عن تقدمك...'
                    : 'Tell the customer about your progress...'
                  }
                />
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                {isRTL ? 'إرسال التحديث' : 'Send Update'}
              </Button>
            </div>
          )}

          {/* Share Draft Tab */}
          {activeTab === 'draft' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isRTL ? 'مشاركة مسودة للمراجعة' : 'Share Draft for Review'}
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {isRTL 
                    ? 'شارك مسودة عملك للحصول على ملاحظات العميل قبل التسليم النهائي'
                    : 'Share a draft of your work to get customer feedback before final delivery'
                  }
                </p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-400 transition-colors cursor-pointer"
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isRTL ? 'رفع ملفات المسودة' : 'Upload draft files'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.ai,.psd"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'رسالة مع المسودة' : 'Message with Draft'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder={isRTL 
                    ? 'اطلب ملاحظات محددة...'
                    : 'Request specific feedback...'
                  }
                />
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                {isRTL ? 'مشاركة المسودة' : 'Share Draft'}
              </Button>
            </div>
          )}

          {/* Final Delivery Tab */}
          {activeTab === 'deliver' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isRTL ? 'التسليم النهائي' : 'Final Delivery'}
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  {isRTL ? 'قائمة التحقق النهائية:' : 'Final Checklist:'}
                </h3>
                <div className="space-y-2">
                  {[
                    { en: 'All requirements met', ar: 'تم تلبية جميع المتطلبات' },
                    { en: 'Files are in correct format', ar: 'الملفات بالصيغة الصحيحة' },
                    { en: 'Quality checked', ar: 'تم فحص الجودة' },
                    { en: 'Ready for customer review', ar: 'جاهز لمراجعة العميل' }
                  ].map((item, index) => (
                    <label key={index} className="flex items-center gap-2 text-sm text-green-800">
                      <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                      <span>{isRTL ? item.ar : item.en}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-300 bg-teal-50 rounded-lg p-12 text-center hover:border-teal-400 transition-colors cursor-pointer"
              >
                <Upload className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                <p className="text-teal-900 font-medium mb-2">
                  {isRTL ? 'رفع الملفات النهائية' : 'Upload Final Files'}
                </p>
                <p className="text-sm text-teal-700">
                  {isRTL ? 'رفع جميع الملفات المكتملة' : 'Upload all completed files'}
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'رسالة التسليم' : 'Delivery Message'}
                </label>
                <textarea
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder={isRTL 
                    ? 'اشرح ما قمت بتسليمه...'
                    : 'Explain what you have delivered...'
                  }
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    {isRTL 
                      ? 'بمجرد التسليم، سيبدأ العميل في المراجعة. تأكد من أن جميع الملفات صحيحة.'
                      : 'Once delivered, the customer will start reviewing. Make sure all files are correct.'
                    }
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleDeliver}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {isRTL ? 'تأكيد التسليم' : 'Mark as Delivered'}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
