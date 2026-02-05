import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Smile,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  Package,
  DollarSign,
  Calendar
} from 'lucide-react';

// Mock messages data
const getMockMessages = () => [
  {
    id: '1',
    sender: 'expert',
    senderName: 'Ahmed Hassan',
    message: 'Hello! Thank you for your order. I have received your requirements and I am excited to work on your logo design. Do you have any specific style preferences?',
    messageAr: 'مرحباً! شكراً لطلبك. لقد استلمت متطلباتك وأنا متحمس للعمل على تصميم شعارك. هل لديك أي تفضيلات محددة للنمط؟',
    timestamp: '2024-02-01 11:20 AM',
    read: true,
    attachments: []
  },
  {
    id: '2',
    sender: 'customer',
    senderName: 'You',
    message: 'Hi Ahmed! I prefer a minimalist and modern design. Something clean and professional that works well in both digital and print formats.',
    messageAr: 'مرحباً أحمد! أفضل تصميماً بسيطاً وعصرياً. شيء نظيف واحترافي يعمل بشكل جيد في كل من الصيغ الرقمية والمطبوعة.',
    timestamp: '2024-02-01 11:45 AM',
    read: true,
    attachments: []
  },
  {
    id: '3',
    sender: 'expert',
    senderName: 'Ahmed Hassan',
    message: 'Perfect! I understand exactly what you need. I will start working on the initial concepts and will share them with you in 2 days. Here are some inspiration references I found.',
    messageAr: 'ممتاز! أفهم تماماً ما تحتاجه. سأبدأ العمل على المفاهيم الأولية وسأشاركها معك خلال يومين. هنا بعض المراجع الملهمة التي وجدتها.',
    timestamp: '2024-02-01 12:10 PM',
    read: true,
    attachments: [
      {
        id: '1',
        name: 'inspiration_board.jpg',
        type: 'image',
        size: '1.2 MB',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'
      }
    ]
  },
  {
    id: '4',
    sender: 'expert',
    senderName: 'Ahmed Hassan',
    message: 'I have created 3 initial logo concepts for your review. Please let me know which direction you prefer and any changes you would like to see.',
    messageAr: 'لقد أنشأت 3 مفاهيم أولية للشعار لمراجعتك. يرجى إخباري بأي اتجاه تفضله وأي تغييرات تريد رؤيتها.',
    timestamp: '2024-02-03 02:30 PM',
    read: true,
    attachments: [
      {
        id: '2',
        name: 'logo_concept_1.jpg',
        type: 'image',
        size: '856 KB',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'
      },
      {
        id: '3',
        name: 'logo_concept_2.jpg',
        type: 'image',
        size: '920 KB',
        url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400'
      },
      {
        id: '4',
        name: 'logo_concept_3.jpg',
        type: 'image',
        size: '1.1 MB',
        url: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400'
      }
    ]
  },
  {
    id: '5',
    sender: 'customer',
    senderName: 'You',
    message: 'These look amazing! I really love concept 2. Could you make the icon slightly larger and try a darker shade of blue?',
    messageAr: 'تبدو رائعة! أحب المفهوم 2 حقاً. هل يمكنك جعل الأيقونة أكبر قليلاً وتجربة درجة أغمق من الأزرق؟',
    timestamp: '2024-02-03 04:15 PM',
    read: true,
    attachments: []
  },
  {
    id: '6',
    sender: 'expert',
    senderName: 'Ahmed Hassan',
    message: 'Great choice! I will work on those revisions right away and have them ready for you tomorrow.',
    messageAr: 'اختيار رائع! سأعمل على تلك التعديلات على الفور وسأجهزها لك غداً.',
    timestamp: '2024-02-03 04:30 PM',
    read: false,
    attachments: []
  }
];

// Mock order context data
const getOrderContext = (id: string) => ({
  id,
  serviceTitle: 'Professional Logo Design',
  serviceTitleAr: 'تصميم شعار احترافي',
  package: 'Standard',
  packageAr: 'القياسية',
  price: 100,
  deliveryDate: '2024-02-06',
  daysRemaining: 3,
  status: 'in_progress'
});

export function MessagesPage() {
  const { id } = useParams();
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState(getMockMessages());
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const orderContext = getOrderContext(id || '1');

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      const newMsg = {
        id: String(messages.length + 1),
        sender: 'customer',
        senderName: 'You',
        message: newMessage,
        messageAr: newMessage,
        timestamp: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        read: false,
        attachments: selectedFiles.map((file, idx) => ({
          id: String(idx + 1),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          size: `${(file.size / 1024).toFixed(1)} KB`,
          url: URL.createObjectURL(file)
        }))
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
        {/* Header */}
        <div className="mb-6">
          <Link to={`/order-detail/${id}`} className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'العودة إلى تفاصيل الطلب' : 'Back to Order Details'}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[calc(100vh-250px)]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      AH
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {isRTL ? 'أحمد حسن' : 'Ahmed Hassan'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{isRTL ? 'متصل' : 'Online'}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isCustomer ? 'order-2' : 'order-1'}`}>
                        {!isCustomer && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-600">{msg.senderName}</span>
                          </div>
                        )}
                        
                        <div className={`rounded-2xl px-4 py-3 ${
                          isCustomer
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {isRTL ? msg.messageAr : msg.message}
                          </p>
                          
                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.attachments.map((file) => (
                                <div
                                  key={file.id}
                                  className={`flex items-center gap-2 p-2 rounded-lg ${
                                    isCustomer ? 'bg-teal-700' : 'bg-white'
                                  }`}
                                >
                                  {file.type === 'image' ? (
                                    <div className="relative">
                                      <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-48 h-32 object-cover rounded-lg cursor-pointer"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <FileText className={`w-5 h-5 ${isCustomer ? 'text-white' : 'text-gray-600'}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-medium truncate ${isCustomer ? 'text-white' : 'text-gray-900'}`}>
                                          {file.name}
                                        </p>
                                        <p className={`text-xs ${isCustomer ? 'text-teal-200' : 'text-gray-500'}`}>
                                          {file.size}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                          <span>{msg.timestamp}</span>
                          {isCustomer && (
                            msg.read ? (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                {selectedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">{file.name}</span>
                        <button
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isRTL ? 'اكتب رسالتك...' : 'Type your message...'}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={1}
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                    disabled={!newMessage.trim() && selectedFiles.length === 0}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Context Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isRTL ? 'معلومات الطلب' : 'Order Information'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{isRTL ? 'الخدمة' : 'Service'}</p>
                    <p className="font-medium text-gray-900">
                      {isRTL ? orderContext.serviceTitleAr : orderContext.serviceTitle}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{isRTL ? 'رقم الطلب' : 'Order ID'}</p>
                    <p className="font-medium text-gray-900 font-mono text-sm">{orderContext.id}</p>
                  </div>

                  <div className="flex items-center justify-between py-3 border-y border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">{isRTL ? orderContext.packageAr : orderContext.package}</span>
                    </div>
                    <span className="font-semibold text-gray-900">${orderContext.price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{isRTL ? 'التسليم' : 'Delivery'}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{orderContext.deliveryDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{isRTL ? 'المتبقي' : 'Remaining'}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {orderContext.daysRemaining} {isRTL ? 'أيام' : 'days'}
                    </span>
                  </div>
                </div>
              </div>

              <Link to={`/order-detail/${id}`}>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                  {isRTL ? 'عرض تفاصيل الطلب' : 'View Order Details'}
                </Button>
              </Link>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  {isRTL ? 'روابط سريعة' : 'Quick Links'}
                </h4>
                <div className="space-y-2 text-sm">
                  <button className="w-full text-left text-gray-600 hover:text-teal-600 transition-colors">
                    {isRTL ? 'طلب تعديل' : 'Request Revision'}
                  </button>
                  <button className="w-full text-left text-gray-600 hover:text-teal-600 transition-colors">
                    {isRTL ? 'تمديد وقت التسليم' : 'Extend Delivery Time'}
                  </button>
                  <button className="w-full text-left text-red-600 hover:text-red-700 transition-colors">
                    {isRTL ? 'إبلاغ عن مشكلة' : 'Report Issue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
