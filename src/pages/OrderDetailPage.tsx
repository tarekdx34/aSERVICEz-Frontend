import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Clock,
  Check,
  Package,
  MessageCircle,
  AlertCircle,
  Star,
  ThumbsUp,
  Loader2,
  XCircle,
  RefreshCw,
  CheckCircle,
  X,
  Send,
  Calendar,
  DollarSign,
  User,
  FileText,
  Ban,
  Play,
  RotateCcw
} from 'lucide-react';
import { orderApi, type OrderResponse } from '../services/api';

const getStatusConfig = (status: string, isRTL: boolean) => {
  const configs: Record<string, { label: string; icon: typeof Clock; color: string; bgColor: string; borderColor: string }> = {
    pending: {
      label: isRTL ? 'قيد الانتظار' : 'Pending',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    in_progress: {
      label: isRTL ? 'قيد التنفيذ' : 'In Progress',
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    delivered: {
      label: isRTL ? 'تم التسليم' : 'Delivered',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    completed: {
      label: isRTL ? 'مكتمل' : 'Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    cancelled: {
      label: isRTL ? 'ملغي' : 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    declined: {
      label: isRTL ? 'مرفوض' : 'Declined',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    revision_requested: {
      label: isRTL ? 'طلب تعديل' : 'Revision Requested',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  };
  return configs[status] || configs.pending;
};

// Generate timeline based on order status
const generateTimeline = (order: OrderResponse, isRTL: boolean) => {
  const steps = [
    { status: 'pending', label: isRTL ? 'تم تقديم الطلب' : 'Order Placed', completed: true },
    { status: 'in_progress', label: isRTL ? 'جاري العمل' : 'In Progress', completed: false },
    { status: 'delivered', label: isRTL ? 'تم التسليم' : 'Delivered', completed: false },
    { status: 'completed', label: isRTL ? 'مكتمل' : 'Completed', completed: false }
  ];

  // Handle special statuses
  if (order.status === 'cancelled' || order.status === 'declined') {
    return [
      { status: 'pending', label: isRTL ? 'تم تقديم الطلب' : 'Order Placed', completed: true, current: false },
      { 
        status: order.status, 
        label: order.status === 'cancelled' 
          ? (isRTL ? 'تم الإلغاء' : 'Cancelled') 
          : (isRTL ? 'تم الرفض' : 'Declined'), 
        completed: true, 
        current: true 
      }
    ];
  }

  if (order.status === 'revision_requested') {
    return [
      { status: 'pending', label: isRTL ? 'تم تقديم الطلب' : 'Order Placed', completed: true, current: false },
      { status: 'in_progress', label: isRTL ? 'جاري العمل' : 'In Progress', completed: true, current: false },
      { status: 'delivered', label: isRTL ? 'تم التسليم' : 'Delivered', completed: true, current: false },
      { status: 'revision_requested', label: isRTL ? 'طلب تعديل' : 'Revision Requested', completed: true, current: true }
    ];
  }

  const statusOrder = ['pending', 'in_progress', 'delivered', 'completed'];
  const currentIndex = statusOrder.indexOf(order.status);

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex
  }));
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal states
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  
  // Form states
  const [declineReason, setDeclineReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [revisionReason, setRevisionReason] = useState('');
  const [revisionDetails, setRevisionDetails] = useState('');
  const [extensionDays, setExtensionDays] = useState(3);
  const [extensionReason, setExtensionReason] = useState('');

  // Fetch order details
  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderApi.getById(id);
      setOrder(res.data);
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setError(err.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine user's role in this order
  const isCustomer = user?.role === 'customer';
  const isExpert = user?.role === 'expert';
  const isAdmin = user?.role === 'admin';

  // Action handlers
  const handleAcceptOrder = async () => {
    if (!order) return;
    setActionLoading('accept');
    try {
      await orderApi.acceptOrder(order.id);
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to accept order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineOrder = async () => {
    if (!order || !declineReason.trim()) return;
    setActionLoading('decline');
    try {
      await orderApi.declineOrder(order.id, { reason: declineReason });
      setShowDeclineModal(false);
      setDeclineReason('');
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to decline order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliverOrder = async () => {
    if (!order) return;
    setActionLoading('deliver');
    try {
      await orderApi.deliverOrder(order.id, deliveryMessage);
      setShowDeliverModal(false);
      setDeliveryMessage('');
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to deliver order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptDelivery = async () => {
    if (!order) return;
    setActionLoading('accept-delivery');
    try {
      await orderApi.acceptDelivery(order.id);
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to accept delivery');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestRevision = async () => {
    if (!order || !revisionReason.trim()) return;
    setActionLoading('revision');
    try {
      await orderApi.requestRevision(order.id, { 
        reason: revisionReason, 
        details: revisionDetails || undefined 
      });
      setShowRevisionModal(false);
      setRevisionReason('');
      setRevisionDetails('');
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to request revision');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !cancelReason.trim()) return;
    setActionLoading('cancel');
    try {
      await orderApi.cancelOrder(order.id, { reason: cancelReason });
      setShowCancelModal(false);
      setCancelReason('');
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtendDelivery = async () => {
    if (!order || extensionDays < 1) return;
    setActionLoading('extend');
    try {
      await orderApi.extendDelivery(order.id, { 
        additionalDays: extensionDays, 
        reason: extensionReason || undefined 
      });
      setShowExtendModal(false);
      setExtensionDays(3);
      setExtensionReason('');
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to extend delivery time');
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '$0.00';
    return `$${amount.toFixed(2)}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRTL ? 'الطلب غير موجود' : 'Order Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">{error || (isRTL ? 'حدث خطأ أثناء تحميل الطلب' : 'An error occurred while loading the order')}</p>
          <Link to="/orders">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              {isRTL ? 'عرض جميع الطلبات' : 'View All Orders'}
            </Button>
          </Link>
        </div>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status, isRTL);
  const StatusIcon = statusConfig.icon;
  const timeline = generateTimeline(order, isRTL);

  // Normalize status to lowercase for comparison
  const orderStatus = order.status?.toLowerCase() || '';

  // Determine available actions based on role and status
  const canAcceptOrder = isExpert && orderStatus === 'pending';
  const canDeclineOrder = isExpert && orderStatus === 'pending';
  const canDeliverOrder = isExpert && (orderStatus === 'in_progress' || orderStatus === 'revision_requested');
  const canAcceptDelivery = isCustomer && orderStatus === 'delivered';
  const canRequestRevision = isCustomer && orderStatus === 'delivered';
  const canCancelOrder = (isCustomer && orderStatus === 'pending') || 
                         (isExpert && (orderStatus === 'pending' || orderStatus === 'in_progress')) ||
                         isAdmin;
  const canExtendDelivery = (isCustomer || isExpert || isAdmin) && 
                            !['completed', 'cancelled', 'declined'].includes(orderStatus);

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        body { font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"}; }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {isRTL ? 'العودة إلى الطلبات' : 'Back to Orders'}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
              </h1>
              <p className="text-gray-600">
                {isRTL ? 'رقم الطلب:' : 'Order ID:'} <span className="font-mono font-semibold">#{order.id}</span>
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="font-medium">{statusConfig.label}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                {isRTL ? 'معلومات الخدمة' : 'Service Information'}
              </h3>
              <div className="flex gap-4">
                {order.thumbnail ? (
                  <img
                    src={order.thumbnail}
                    alt={order.serviceTitle}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {order.serviceTitle}
                  </h2>
                  <div className="text-2xl font-bold text-teal-600">
                    {formatCurrency(order.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                📊 {isRTL ? 'حالة الطلب' : 'Order Status'}
              </h3>
              <div className="relative">
                {timeline.map((step, index) => (
                  <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < timeline.length - 1 && (
                      <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-12 w-0.5 h-full ${
                        step.completed ? 'bg-teal-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? step.status === 'cancelled' || step.status === 'declined'
                          ? 'bg-red-600 text-white'
                          : 'bg-teal-600 text-white'
                        : step.current
                        ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-50'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        step.status === 'cancelled' || step.status === 'declined' ? (
                          <X className="w-5 h-5" />
                        ) : (
                          <Check className="w-5 h-5" />
                        )
                      ) : step.current ? (
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className={`font-semibold ${
                        step.current 
                          ? step.status === 'cancelled' || step.status === 'declined' 
                            ? 'text-red-600' 
                            : 'text-blue-600' 
                          : step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h4>
                      {step.current && (
                        <p className={`text-sm mt-1 ${
                          step.status === 'cancelled' || step.status === 'declined' ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {isRTL ? 'الحالة الحالية' : 'Current status'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {order.requirements && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  {isRTL ? 'متطلبات الطلب' : 'Order Requirements'}
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                  {order.requirements}
                </div>
              </div>
            )}

            {/* Delivery Section - Show when status is delivered or completed */}
            {(orderStatus === 'delivered' || orderStatus === 'completed') && (
              <div className="bg-white rounded-xl border-2 border-green-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📦 {isRTL ? 'تم تسليم العمل' : 'Work Delivered'}
                </h3>
                {order.deliveryMessage ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">{isRTL ? 'رسالة من الخبير:' : 'Message from expert:'}</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{order.deliveryMessage}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-4">
                    {isRTL 
                      ? 'قام الخبير بتسليم العمل. قم بمراجعته واتخذ إجراءً.' 
                      : 'The expert has delivered the work. Please review and take action.'}
                  </p>
                )}
                
                {/* Customer Actions - Accept or Request Revision */}
                {isCustomer && orderStatus === 'delivered' && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-green-200">
                    <Button
                      onClick={handleAcceptDelivery}
                      disabled={actionLoading === 'accept-delivery'}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === 'accept-delivery' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ThumbsUp className="w-4 h-4 mr-2" />
                      )}
                      {isRTL ? 'قبول التسليم' : 'Accept Delivery'}
                    </Button>
                    <Button
                      onClick={() => setShowRevisionModal(true)}
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {isRTL ? 'طلب تعديل' : 'Request Revision'}
                    </Button>
                  </div>
                )}

                {/* Expert info when delivered - show that they can't do anything until customer responds */}
                {isExpert && orderStatus === 'delivered' && (
                  <div className="text-sm text-gray-500 pt-4 border-t border-green-200">
                    {isRTL 
                      ? 'في انتظار رد العميل على التسليم...' 
                      : 'Waiting for customer response on delivery...'}
                  </div>
                )}
              </div>
            )}

            {/* Decline/Cancel Reason */}
            {(order.declineReason || order.cancelReason) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                  <Ban className="w-5 h-5" />
                  {order.declineReason 
                    ? (isRTL ? 'سبب الرفض' : 'Decline Reason')
                    : (isRTL ? 'سبب الإلغاء' : 'Cancellation Reason')
                  }
                </h3>
                <p className="text-red-700">{order.declineReason || order.cancelReason}</p>
              </div>
            )}

            {/* Revision Request */}
            {order.revisionReason && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  {isRTL ? 'طلب التعديل' : 'Revision Request'}
                </h3>
                <p className="text-orange-700 mb-2">{order.revisionReason}</p>
                {order.revisionDetails && (
                  <p className="text-orange-600 text-sm bg-orange-100 rounded p-3 mt-2">{order.revisionDetails}</p>
                )}
              </div>
            )}

            {/* Extension Info */}
            {order.extensionReason && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {isRTL ? 'سبب تمديد الموعد' : 'Deadline Extension Reason'}
                </h3>
                <p className="text-blue-700">{order.extensionReason}</p>
              </div>
            )}

            {/* Action Buttons for Experts */}
            {isExpert && (canAcceptOrder || canDeclineOrder || canDeliverOrder) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {isRTL ? 'إجراءات الخبير' : 'Expert Actions'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {canAcceptOrder && (
                    <Button
                      onClick={handleAcceptOrder}
                      disabled={actionLoading === 'accept'}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === 'accept' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isRTL ? 'قبول الطلب' : 'Accept Order'}
                    </Button>
                  )}
                  {canDeclineOrder && (
                    <Button
                      onClick={() => setShowDeclineModal(true)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'رفض الطلب' : 'Decline Order'}
                    </Button>
                  )}
                  {canDeliverOrder && (
                    <Button
                      onClick={() => setShowDeliverModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isRTL ? 'تسليم العمل' : 'Deliver Work'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</span>
                  <span className="font-medium text-gray-900">{formatDate(order.orderDate)}</span>
                </div>
                {order.deliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{isRTL ? 'موعد التسليم:' : 'Delivery Date:'}</span>
                    <span className="font-medium text-gray-900">{formatDate(order.deliveryDate)}</span>
                  </div>
                )}
                {order.daysRemaining !== undefined && order.daysRemaining > 0 && 
                 !['completed', 'cancelled', 'declined'].includes(orderStatus) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{isRTL ? 'الأيام المتبقية:' : 'Days Left:'}</span>
                    <span className="font-medium text-blue-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {order.daysRemaining} {isRTL ? 'يوم' : 'days'}
                    </span>
                  </div>
                )}
                {order.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{isRTL ? 'تاريخ الإكمال:' : 'Completed:'}</span>
                    <span className="font-medium text-green-600">{formatDate(order.completedDate)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                  <span className="text-2xl font-bold text-teal-600">{formatCurrency(order.price)}</span>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="mt-6 space-y-3">
                {canCancelOrder && (
                  <Button
                    onClick={() => setShowCancelModal(true)}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    {isRTL ? 'إلغاء الطلب' : 'Cancel Order'}
                  </Button>
                )}
                {canExtendDelivery && (
                  <Button
                    onClick={() => setShowExtendModal(true)}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {isRTL ? 'تمديد الموعد' : 'Extend Deadline'}
                  </Button>
                )}
              </div>
            </div>

            {/* Expert Info (for customer view) */}
            {order.expert && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  {isRTL ? 'معلومات الخبير' : 'Expert Info'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {order.expert.avatar || order.expert.name?.charAt(0).toUpperCase() || 'E'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.expert.name}</h4>
                    {order.expert.rating !== undefined && order.expert.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{order.expert.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info (for expert view) */}
            {order.customer && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  {isRTL ? 'معلومات العميل' : 'Customer Info'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {order.customer.avatar || order.customer.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.customer.name}</h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />

      {/* Decline Order Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'رفض الطلب' : 'Decline Order'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isRTL ? 'يرجى تقديم سبب لرفض هذا الطلب' : 'Please provide a reason for declining this order'}
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder={isRTL ? 'سبب الرفض...' : 'Reason for declining...'}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeclineModal(false)}
                variant="outline"
                className="flex-1"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleDeclineOrder}
                disabled={!declineReason.trim() || actionLoading === 'decline'}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading === 'decline' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isRTL ? 'تأكيد الرفض' : 'Confirm Decline'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'إلغاء الطلب' : 'Cancel Order'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isRTL ? 'يرجى تقديم سبب لإلغاء هذا الطلب' : 'Please provide a reason for cancelling this order'}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={isRTL ? 'سبب الإلغاء...' : 'Reason for cancellation...'}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="flex-1"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
              <Button
                onClick={handleCancelOrder}
                disabled={!cancelReason.trim() || actionLoading === 'cancel'}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading === 'cancel' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isRTL ? 'تأكيد الإلغاء' : 'Confirm Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deliver Order Modal */}
      {showDeliverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'تسليم العمل' : 'Deliver Work'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isRTL ? 'أضف رسالة للعميل مع التسليم' : 'Add a message for the customer with your delivery'}
            </p>
            <textarea
              value={deliveryMessage}
              onChange={(e) => setDeliveryMessage(e.target.value)}
              placeholder={isRTL ? 'رسالة التسليم (اختياري)...' : 'Delivery message (optional)...'}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeliverModal(false)}
                variant="outline"
                className="flex-1"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleDeliverOrder}
                disabled={actionLoading === 'deliver'}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {actionLoading === 'deliver' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isRTL ? 'تسليم' : 'Deliver'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'طلب تعديل' : 'Request Revision'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isRTL ? 'اشرح ما تريد تعديله في العمل المسلم' : 'Explain what you want changed in the delivered work'}
            </p>
            <textarea
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder={isRTL ? 'سبب طلب التعديل...' : 'Reason for revision...'}
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <textarea
              value={revisionDetails}
              onChange={(e) => setRevisionDetails(e.target.value)}
              placeholder={isRTL ? 'تفاصيل إضافية (اختياري)...' : 'Additional details (optional)...'}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-20 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowRevisionModal(false)}
                variant="outline"
                className="flex-1"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleRequestRevision}
                disabled={!revisionReason.trim() || actionLoading === 'revision'}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {actionLoading === 'revision' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRTL ? 'إرسال طلب التعديل' : 'Submit Revision'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Deadline Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'تمديد موعد التسليم' : 'Extend Delivery Deadline'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'عدد الأيام الإضافية' : 'Additional Days'}
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={extensionDays}
                onChange={(e) => setExtensionDays(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <textarea
              value={extensionReason}
              onChange={(e) => setExtensionReason(e.target.value)}
              placeholder={isRTL ? 'سبب التمديد (اختياري)...' : 'Reason for extension (optional)...'}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowExtendModal(false)}
                variant="outline"
                className="flex-1"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleExtendDelivery}
                disabled={extensionDays < 1 || actionLoading === 'extend'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {actionLoading === 'extend' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4 mr-2" />
                )}
                {isRTL ? 'تمديد الموعد' : 'Extend Deadline'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
