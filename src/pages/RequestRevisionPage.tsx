import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';

export function RequestRevisionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [revisionDetails, setRevisionDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Handle revision request submission
    alert(isRTL ? 'تم إرسال طلب التعديل بنجاح!' : 'Revision request submitted successfully!');
    navigate(`/order-detail/${id}`);
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/order-detail/${id}`} className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'العودة إلى تفاصيل الطلب' : 'Back to Order Details'}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'طلب تعديلات' : 'Request Revisions'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'رقم الطلب:' : 'Order ID:'} <span className="font-mono font-semibold">{id}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  {isRTL ? 'إرشادات طلب التعديلات' : 'Revision Request Guidelines'}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    {isRTL 
                      ? 'كن واضحاً ومحدداً بشأن التغييرات التي تريدها'
                      : 'Be clear and specific about the changes you want'
                    }
                  </li>
                  <li>
                    {isRTL 
                      ? 'أرفق أي مراجع أو أمثلة مفيدة'
                      : 'Attach any helpful references or examples'
                    }
                  </li>
                  <li>
                    {isRTL 
                      ? 'لديك 2 تعديلات متبقية في هذه الباقة'
                      : 'You have 2 revisions remaining in this package'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Revision Details Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'وصف التعديلات المطلوبة *' : 'Describe Required Changes *'}
              </label>
              <textarea
                value={revisionDetails}
                onChange={(e) => setRevisionDetails(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder={isRTL 
                  ? 'يرجى وصف التغييرات التي تريدها بالتفصيل. على سبيل المثال: "يرجى تغيير اللون من الأزرق إلى الأخضر، وجعل الخط أكبر قليلاً..."'
                  : 'Please describe in detail what changes you would like. For example: "Please change the color from blue to green, and make the font slightly larger..."'
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                {isRTL ? 'حد أدنى 50 حرف' : 'Minimum 50 characters'}
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'رفع ملفات مرجعية (اختياري)' : 'Upload Reference Files (Optional)'}
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  {isRTL ? 'انقر للتحميل أو اسحب الملفات وأفلتها هنا' : 'Click to upload or drag and drop files here'}
                </p>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'PNG, JPG, PDF حتى 10MB' : 'PNG, JPG, PDF up to 10MB'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                {isRTL ? 'نصائح لطلب تعديلات فعال:' : 'Tips for Effective Revision Requests:'}
              </h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>{isRTL ? 'حدد العناصر المحددة التي تحتاج إلى تغيير' : 'Specify which elements need to be changed'}</li>
                <li>{isRTL ? 'قدم أمثلة مرئية إذا أمكن' : 'Provide visual examples if possible'}</li>
                <li>{isRTL ? 'اشرح "لماذا" وليس فقط "ماذا" لمساعدة الخبير على الفهم بشكل أفضل' : 'Explain "why" not just "what" to help the expert understand better'}</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={revisionDetails.length < 50}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isRTL ? 'إرسال طلب التعديل' : 'Submit Revision Request'}
              </Button>
              <Link to={`/order-detail/${id}`} className="flex-1">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
