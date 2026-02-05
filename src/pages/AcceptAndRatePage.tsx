import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useParams, Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Star,
  CheckCircle,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';

export function AcceptAndRatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLanguage();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const ratingLabels = {
    1: { en: 'Poor', ar: 'ضعيف' },
    2: { en: 'Fair', ar: 'مقبول' },
    3: { en: 'Good', ar: 'جيد' },
    4: { en: 'Very Good', ar: 'جيد جداً' },
    5: { en: 'Excellent', ar: 'ممتاز' }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert(isRTL ? 'يرجى تقديم تقييم' : 'Please provide a rating');
      return;
    }
    setShowConfirmation(true);
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  if (showConfirmation) {
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
              {isRTL ? 'تم بنجاح!' : 'Success!'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {isRTL 
                ? 'شكراً لك! تم قبول الطلب وإرسال تقييمك. سيتم تحويل المبلغ إلى الخبير.'
                : 'Thank you! The order has been accepted and your rating submitted. Payment will be released to the expert.'
              }
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 inline-block">
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {isRTL ? 'تقييمك:' : 'Your Rating:'} {rating} {isRTL ? 'نجوم' : 'Stars'}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {isRTL ? 'جاري إعادة التوجيه إلى صفحة الطلبات...' : 'Redirecting to orders page...'}
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
          <Link to={`/order-detail/${id}`} className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRTL ? 'العودة إلى تفاصيل الطلب' : 'Back to Order Details'}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'قبول وتقييم الخدمة' : 'Accept & Rate Service'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'رقم الطلب:' : 'Order ID:'} <span className="font-mono font-semibold">{id}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {/* Confirmation Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <ThumbsUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">
                  {isRTL ? 'أنت على وشك قبول التسليم' : "You're About to Accept Delivery"}
                </p>
                <p>
                  {isRTL 
                    ? 'بقبول هذا التسليم، فإنك تؤكد أن العمل يلبي توقعاتك وسيتم تحويل الدفع إلى الخبير.'
                    : 'By accepting this delivery, you confirm that the work meets your expectations and payment will be released to the expert.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'قيّم تجربتك' : 'Rate Your Experience'}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-700 mb-4">
                {isRTL ? 'كيف كانت تجربتك مع هذه الخدمة؟' : 'How was your experience with this service?'}
              </p>
              
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              {(rating > 0 || hoverRating > 0) && (
                <p className="text-lg font-semibold text-gray-900">
                  {isRTL 
                    ? ratingLabels[((hoverRating || rating) as keyof typeof ratingLabels)].ar
                    : ratingLabels[((hoverRating || rating) as keyof typeof ratingLabels)].en
                  }
                </p>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'شارك رأيك (اختياري)' : 'Share Your Feedback (Optional)'}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder={isRTL 
                ? 'أخبرنا عن تجربتك... ما الذي أعجبك؟ ما الذي يمكن تحسينه؟'
                : 'Tell us about your experience... What did you like? What could be improved?'
              }
            />
            <p className="text-sm text-gray-500 mt-2">
              {isRTL 
                ? 'سيساعد تقييمك الآخرين في اتخاذ قرار أفضل وسيساعد الخبير على التحسين.'
                : 'Your review will help others make better decisions and help the expert improve.'
              }
            </p>
          </div>

          {/* Review Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  {isRTL ? 'إرشادات التقييم' : 'Review Guidelines'}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{isRTL ? 'كن صادقاً ومحترماً' : 'Be honest and respectful'}</li>
                  <li>{isRTL ? 'ركز على العمل وليس على الشخص' : 'Focus on the work, not the person'}</li>
                  <li>{isRTL ? 'قدم تفاصيل محددة حول تجربتك' : 'Provide specific details about your experience'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {isRTL ? 'تأكيد القبول والتقييم' : 'Confirm Accept & Rating'}
            </Button>
            <Link to={`/order-detail/${id}`} className="flex-1">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>
          </div>

          {/* Payment Release Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{isRTL ? 'ملاحظة:' : 'Note:'}</span>{' '}
              {isRTL 
                ? 'بعد قبول التسليم، سيتم تحويل الدفع من نظام الضمان إلى الخبير. لن تتمكن من طلب تعديلات بعد ذلك.'
                : 'After accepting delivery, payment will be released from escrow to the expert. You will not be able to request revisions after this.'
              }
            </p>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
