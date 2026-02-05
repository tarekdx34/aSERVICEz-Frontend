import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Flag,
  MessageSquare
} from 'lucide-react';

export function SupportTicketPage() {
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ticketType, setTicketType] = useState<'service' | 'expert' | ''>('');
  const [category, setCategory] = useState('');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = {
    service: [
      { id: 'quality', label: 'Quality Issues', labelAr: 'مشاكل في الجودة' },
      { id: 'delivery', label: 'Delivery Delay', labelAr: 'تأخير في التسليم' },
      { id: 'requirements', label: 'Requirements Not Met', labelAr: 'عدم تلبية المتطلبات' },
      { id: 'communication', label: 'Communication Issues', labelAr: 'مشاكل في التواصل' },
      { id: 'other', label: 'Other Service Issue', labelAr: 'مشكلة أخرى في الخدمة' }
    ],
    expert: [
      { id: 'unprofessional', label: 'Unprofessional Behavior', labelAr: 'سلوك غير محترف' },
      { id: 'harassment', label: 'Harassment', labelAr: 'مضايقة' },
      { id: 'fraud', label: 'Fraudulent Activity', labelAr: 'نشاط احتيالي' },
      { id: 'copyright', label: 'Copyright Violation', labelAr: 'انتهاك حقوق الطبع' },
      { id: 'other', label: 'Other Expert Issue', labelAr: 'مشكلة أخرى مع الخبير' }
    ]
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!ticketType || !category || !subject || !description) {
      alert(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
          
          body {
            font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
          }
        `}</style>

        <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isRTL ? 'تم إرسال التذكرة بنجاح!' : 'Ticket Submitted Successfully!'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {isRTL 
                ? 'شكراً لك! تم استلام تذكرتك وسيتم مراجعتها من قبل فريق الدعم خلال 24 ساعة.'
                : 'Thank you! Your ticket has been received and will be reviewed by our support team within 24 hours.'
              }
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
              <p className="text-sm text-gray-600 mb-1">{isRTL ? 'رقم التذكرة' : 'Ticket Number'}</p>
              <p className="text-2xl font-bold text-teal-600 font-mono">#TKT-{Date.now().toString().slice(-6)}</p>
            </div>

            <p className="text-sm text-gray-500">
              {isRTL ? 'جاري إعادة التوجيه...' : 'Redirecting...'}
            </p>
          </div>
        </main>

        <Footer isRTL={isRTL} />
      </div>
    );
  }

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
          <Link to="/orders" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'العودة إلى الطلبات' : 'Back to Orders'}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'إنشاء تذكرة دعم' : 'Create Support Ticket'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'قم بإبلاغنا عن أي مشكلة تواجهها' : 'Report any issues you are experiencing'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  {isRTL ? 'قبل إنشاء تذكرة' : 'Before Creating a Ticket'}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    {isRTL 
                      ? 'حاول التواصل مع الخبير أولاً لحل المشكلة'
                      : 'Try to communicate with the expert first to resolve the issue'
                    }
                  </li>
                  <li>
                    {isRTL 
                      ? 'قدم أكبر قدر ممكن من التفاصيل لمساعدتنا في حل المشكلة بسرعة'
                      : 'Provide as much detail as possible to help us resolve quickly'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ticket Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isRTL ? 'ماذا تريد الإبلاغ عنه؟ *' : 'What do you want to report? *'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setTicketType('service')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  ticketType === 'service'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className={`w-6 h-6 ${ticketType === 'service' ? 'text-teal-600' : 'text-gray-400'}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {isRTL ? 'مشكلة في الخدمة' : 'Service Issue'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL 
                        ? 'الإبلاغ عن مشاكل في جودة العمل أو التسليم'
                        : 'Report issues with work quality or delivery'
                      }
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTicketType('expert')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  ticketType === 'expert'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Flag className={`w-6 h-6 ${ticketType === 'expert' ? 'text-teal-600' : 'text-gray-400'}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {isRTL ? 'مشكلة مع الخبير' : 'Expert Issue'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL 
                        ? 'الإبلاغ عن سلوك غير لائق أو نشاط مشبوه'
                        : 'Report inappropriate behavior or suspicious activity'
                      }
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Order ID (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'رقم الطلب (اختياري)' : 'Order ID (Optional)'}
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={isRTL ? 'مثال: ORD-1738756891234' : 'e.g., ORD-1738756891234'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
            />
          </div>

          {/* Category Selection */}
          {ticketType && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'فئة المشكلة *' : 'Issue Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">{isRTL ? 'اختر فئة' : 'Select a category'}</option>
                {categories[ticketType].map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isRTL ? cat.labelAr : cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'عنوان المشكلة *' : 'Issue Subject *'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={isRTL ? 'مثال: تأخير في تسليم الطلب' : 'e.g., Delay in order delivery'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'وصف المشكلة بالتفصيل *' : 'Detailed Description *'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder={isRTL 
                ? 'يرجى وصف المشكلة بالتفصيل، بما في ذلك أي تواريخ أو أحداث ذات صلة...'
                : 'Please describe the issue in detail, including any relevant dates or events...'
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {isRTL ? 'حد أدنى 100 حرف' : 'Minimum 100 characters'}
            </p>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'إرفاق ملفات داعمة (اختياري)' : 'Attach Supporting Files (Optional)'}
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

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">
                  {isRTL ? 'تحذير' : 'Important'}
                </p>
                <p>
                  {isRTL 
                    ? 'الإبلاغات الكاذبة قد تؤدي إلى تعليق حسابك. يرجى تقديم معلومات دقيقة فقط.'
                    : 'False reports may result in account suspension. Please provide accurate information only.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={!ticketType || !category || !subject || description.length < 100}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isRTL ? 'إرسال التذكرة' : 'Submit Ticket'}
            </Button>
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
