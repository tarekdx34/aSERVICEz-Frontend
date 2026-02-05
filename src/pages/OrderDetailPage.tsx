import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Clock,
  Check,
  Package,
  MessageCircle,
  Download,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Star,
  ThumbsUp,
  Flag,
  Eye
} from 'lucide-react';

// Mock order data
const getOrderData = (id: string) => ({
  id,
  status: 'delivered', // Changed to 'delivered' to show delivery screen
  serviceTitle: 'Professional Logo Design with Brand Guidelines',
  serviceTitleAr: 'تصميم شعار احترافي مع دليل الهوية البصرية',
  thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
  package: 'Standard',
  packageAr: 'القياسية',
  price: 100,
  orderDate: '2024-02-01',
  deliveryDate: '2024-02-06',
  daysRemaining: 0,
  deliveredDate: '2024-02-05',
  expert: {
    name: 'Ahmed Hassan',
    nameAr: 'أحمد حسن',
    avatar: 'AH',
    rating: 4.9,
    responseTime: '1 hour'
  },
  requirements: 'I need a modern and professional logo for my tech startup company. The company name is "TechVision". I prefer blue and white colors. Please make it minimalist and scalable.',
  requirementsAr: 'أحتاج إلى شعار عصري واحترافي لشركتي الناشئة في مجال التقنية. اسم الشركة "TechVision". أفضل الألوان الزرقاء والبيضاء. يرجى جعله بسيطاً وقابلاً للتطوير.',
  timeline: [
    {
      status: 'placed',
      label: 'Order Placed',
      labelAr: 'تم تقديم الطلب',
      date: '2024-02-01',
      time: '10:30 AM',
      completed: true
    },
    {
      status: 'accepted',
      label: 'Order Accepted',
      labelAr: 'تم قبول الطلب',
      date: '2024-02-01',
      time: '11:15 AM',
      completed: true
    },
    {
      status: 'in_progress',
      label: 'Work in Progress',
      labelAr: 'جاري العمل',
      date: '2024-02-02',
      time: '09:00 AM',
      completed: true
    },
    {
      status: 'delivered',
      label: 'Order Delivered',
      labelAr: 'تم التسليم',
      date: '2024-02-05',
      time: '03:45 PM',
      completed: true,
      current: true
    },
    {
      status: 'completed',
      label: 'Order Completed',
      labelAr: 'اكتمل الطلب',
      completed: false
    }
  ],
  attachments: [
    {
      id: '1',
      name: 'brand_references.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'customer',
      uploadDate: '2024-02-01'
    },
    {
      id: '2',
      name: 'color_palette.jpg',
      type: 'image',
      size: '856 KB',
      uploadedBy: 'customer',
      uploadDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'logo_draft_v1.ai',
      type: 'file',
      size: '5.2 MB',
      uploadedBy: 'expert',
      uploadDate: '2024-02-03'
    }
  ],
  deliverables: [
    {
      id: '1',
      name: 'TechVision_Logo_Final.ai',
      type: 'vector',
      size: '5.2 MB',
      preview: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'TechVision_Logo_PNG.png',
      type: 'image',
      size: '1.8 MB',
      preview: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
      downloadUrl: '#'
    },
    {
      id: '3',
      name: 'TechVision_Logo_SVG.svg',
      type: 'vector',
      size: '245 KB',
      preview: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
      downloadUrl: '#'
    },
    {
      id: '4',
      name: 'Brand_Guidelines.pdf',
      type: 'pdf',
      size: '3.4 MB',
      preview: null,
      downloadUrl: '#'
    }
  ],
  expertNote: 'Thank you for your patience! I have completed your logo design with all the requested features. The package includes the logo in multiple formats (AI, PNG, SVG) and a comprehensive brand guidelines document. Please review and let me know if you need any adjustments.',
  expertNoteAr: 'شكراً لصبرك! لقد أكملت تصميم شعارك بجميع الميزات المطلوبة. تتضمن الحزمة الشعار بصيغ متعددة (AI، PNG، SVG) ووثيقة شاملة لإرشادات العلامة التجارية. يرجى المراجعة وإخباري إذا كنت بحاجة إلى أي تعديلات.',
  packageDetails: {
    deliveryTime: '5 days',
    revisions: 2,
    features: [
      '3 Logo Concepts',
      '2 Revisions',
      'High-Resolution Files',
      'Vector Source Files',
      'Commercial Use'
    ],
    featuresAr: [
      '3 مفاهيم للشعار',
      'تعديلان',
      'ملفات عالية الدقة',
      'ملفات فيكتور المصدر',
      'استخدام تجاري'
    ]
  }
});

export function OrderDetailPage() {
  const { id } = useParams();
  const { isRTL, toggleLanguage } = useLanguage();
  const [showReportModal, setShowReportModal] = useState(false);

  const order = getOrderData(id || '1');

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
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'العودة إلى الطلبات' : 'Back to Orders'}
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
              </h1>
              <p className="text-gray-600">
                {isRTL ? 'رقم الطلب:' : 'Order ID:'} <span className="font-mono font-semibold">{order.id}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowReportModal(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                {isRTL ? 'إبلاغ' : 'Report'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex gap-4">
                <img
                  src={order.thumbnail}
                  alt={isRTL ? order.serviceTitleAr : order.serviceTitle}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {isRTL ? order.serviceTitleAr : order.serviceTitle}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {order.expert.avatar}
                      </div>
                      <span>{isRTL ? order.expert.nameAr : order.expert.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{order.expert.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                      {isRTL ? order.packageAr : order.package}
                    </span>
                    <span className="font-bold text-teal-600 text-xl">${order.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                📊 {isRTL ? 'حالة الطلب' : 'Order Status'}
              </h3>
              <div className="relative">
                {order.timeline.map((step, index) => (
                  <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Timeline Line */}
                    {index < order.timeline.length - 1 && (
                      <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-12 w-0.5 h-full ${
                        step.completed ? 'bg-teal-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                    
                    {/* Status Icon */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? 'bg-teal-600 text-white'
                        : step.current
                        ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-50'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <Check className="w-5 h-5" />
                      ) : step.current ? (
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>

                    {/* Status Info */}
                    <div className="flex-1 pt-1">
                      <h4 className={`font-semibold ${
                        step.current ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {isRTL ? step.labelAr : step.label}
                      </h4>
                      {step.date && (
                        <p className="text-sm text-gray-600 mt-1">
                          {step.date} {step.time && `• ${step.time}`}
                        </p>
                      )}
                      {step.current && (
                        <p className="text-sm text-blue-600 mt-2">
                          {isRTL ? 'جاري العمل على طلبك...' : 'Currently working on your order...'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📋 {isRTL ? 'متطلبات الطلب' : 'Order Requirements'}
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{isRTL ? order.requirementsAr : order.requirements}</p>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📎 {isRTL ? 'المرفقات' : 'Attachments'}
              </h3>
              <div className="space-y-3">
                {order.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        {file.type === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-teal-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-teal-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {file.size} • {isRTL ? 'رفع بواسطة' : 'Uploaded by'} {file.uploadedBy === 'customer' ? (isRTL ? 'أنت' : 'You') : (isRTL ? order.expert.nameAr : order.expert.name)} • {file.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables (if status is delivered or completed) */}
            {(order.status === 'delivered' || order.status === 'completed') && (
              <div className="bg-white rounded-xl border-2 border-green-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    📦 {isRTL ? 'الملفات المسلمة' : 'Delivered Files'}
                  </h3>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    {isRTL ? 'تحميل الكل' : 'Download All'}
                  </Button>
                </div>

                {/* Expert Note */}
                {order.expertNote && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {order.expert.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {isRTL ? order.expert.nameAr : order.expert.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          {isRTL ? order.expertNoteAr : order.expertNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* File Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {order.deliverables.map((file: any) => (
                    <div
                      key={file.id}
                      className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-teal-300 transition-colors"
                    >
                      {file.preview ? (
                        <div className="aspect-video bg-gray-100 relative group">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <Button
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {isRTL ? 'معاينة' : 'Preview'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">
                        {isRTL ? 'مراجعة العمل المسلم' : 'Review Delivered Work'}
                      </p>
                      <p>
                        {isRTL 
                          ? 'يرجى مراجعة الملفات المسلمة بعناية. إذا كنت راضياً عن العمل، يمكنك قبول التسليم. لديك 3 أيام للمراجعة أو طلب التعديلات.'
                          : 'Please review the delivered files carefully. If you are satisfied with the work, you can accept the delivery. You have 3 days to review or request revisions.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/accept-rate/${order.id}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {isRTL ? 'قبول التسليم وتقييم' : 'Accept & Rate Service'}
                    </Button>
                  </Link>
                  <Link to={`/request-revision/${order.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'طلب تعديل' : 'Request Revision'}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</span>
                  <span className="font-medium text-gray-900">{order.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isRTL ? 'التسليم المتوقع:' : 'Expected Delivery:'}</span>
                  <span className="font-medium text-gray-900">{order.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{isRTL ? 'الأيام المتبقية:' : 'Days Remaining:'}</span>
                  <span className="font-medium text-blue-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {order.daysRemaining} {isRTL ? 'أيام' : 'days'}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                  <span className="text-2xl font-bold text-teal-600">${order.price}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {isRTL ? 'ما تحصل عليه:' : "What You'll Get:"}
                </h4>
                {(isRTL ? order.packageDetails.featuresAr : order.packageDetails.features).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={`/messages/${order.id}`}>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-3">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {isRTL ? 'مراسلة الخبير' : 'Message Expert'}
                </Button>
              </Link>

              {order.status === 'delivered' && (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {isRTL ? 'قبول التسليم' : 'Accept Delivery'}
                </Button>
              )}
            </div>

            {/* Expert Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isRTL ? 'معلومات الخبير' : 'Expert Info'}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {order.expert.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {isRTL ? order.expert.nameAr : order.expert.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{order.expert.rating}</span>
                  </div>
                </div>
              </div>
              <Link to={`/profile/${order.expert.name}`}>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                  {isRTL ? 'عرض الملف الشخصي' : 'View Profile'}
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