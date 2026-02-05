import { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { Button } from '../ui/button';

interface Step5ReviewProps {
  formData: any;
  onPrev: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isRTL?: boolean;
}

export function Step5Review({ formData, onPrev, onSaveDraft, onPublish, isRTL = true }: Step5ReviewProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToOriginal, setAgreedToOriginal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onPublish();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
            5
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? '✅ المراجعة والنشر' : '✅ Review & Publish'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Service Preview Card */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isRTL ? 'معاينة الخدمة' : 'Service Preview'}
            </h3>
            
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              {/* Image */}
              {formData.step1.mainImagePreview && (
                <div className="aspect-[16/9] bg-gray-100">
                  <img
                    src={formData.step1.mainImagePreview}
                    alt="Service preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {formData.step1.title}
                </h4>

                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.step1.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {formData.step2.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'يبدأ من' : 'Starting from'}
                    </p>
                    <p className="text-2xl font-bold text-teal-600">
                      ${formData.step3.packages.basic.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'التسليم' : 'Delivery'}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.step3.packages.basic.deliveryDays} {isRTL ? 'أيام' : 'days'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isRTL ? 'ملخص الخدمة' : 'Service Summary'}
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'العنوان:' : 'Title:'}</span>
                <span className="font-medium text-gray-900">{formData.step1.title}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'الفئة:' : 'Category:'}</span>
                <span className="font-medium text-gray-900">
                  {formData.step1.category} › {formData.step1.subcategory}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'السعر:' : 'Price:'}</span>
                <span className="font-medium text-gray-900">
                  {isRTL ? `يبدأ من $${formData.step3.packages.basic.price}` : `Starting at $${formData.step3.packages.basic.price}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'التسليم:' : 'Delivery:'}</span>
                <span className="font-medium text-gray-900">
                  {formData.step3.packages.basic.deliveryDays} {isRTL ? 'أيام' : 'days'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'عدد الميزات:' : 'Features:'}</span>
                <span className="font-medium text-gray-900">{formData.step2.features.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'صور المعرض:' : 'Portfolio images:'}</span>
                <span className="font-medium text-gray-900">{formData.step4.portfolioImages.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">{isRTL ? 'خدمات إضافية:' : 'Extras:'}</span>
                <span className="font-medium text-gray-900">{formData.step3.extras.length}</span>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                {isRTL
                  ? 'أوافق على شروط وأحكام نشر الخدمات في منصة aSERVICEa'
                  : 'I agree to the terms and conditions of publishing services on aSERVICEa'}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToOriginal}
                onChange={(e) => setAgreedToOriginal(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                {isRTL
                  ? 'أؤكد أن المحتوى والأعمال المعروضة أصلية وخاصة بي'
                  : 'I confirm that the content and portfolio are original and mine'}
              </span>
            </label>
          </div>

          {/* Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">
                  {isRTL ? 'ملاحظة هامة' : 'Important Notice'}
                </p>
                <p className="text-sm text-yellow-800">
                  {isRTL
                    ? 'ستتم مراجعة الخدمة من قبل فريق الإدارة خلال 24-48 ساعة. سيتم إشعارك بالنتيجة عبر البريد الإلكتروني.'
                    : 'Your service will be reviewed by our team within 24-48 hours. You will be notified of the result via email.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button onClick={onPrev} variant="outline">
            {isRTL ? '→ السابق' : '← Previous'}
          </Button>

          <div className="flex gap-3">
            <Button onClick={onSaveDraft} variant="outline" className="flex-1 sm:flex-none">
              💾 {isRTL ? 'حفظ كمسودة' : 'Save as Draft'}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!agreedToTerms || !agreedToOriginal || isPublishing}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed flex-1 sm:flex-none"
            >
              {isPublishing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  {isRTL ? 'جاري النشر...' : 'Publishing...'}
                </>
              ) : (
                <>
                  🚀 {isRTL ? 'نشر الخدمة' : 'Publish Service'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
