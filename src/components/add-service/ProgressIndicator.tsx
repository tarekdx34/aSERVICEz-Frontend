import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  isRTL?: boolean;
}

export function ProgressIndicator({ currentStep, totalSteps, isRTL = true }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: isRTL ? 'معلومات أساسية' : 'Basic Information' },
    { number: 2, label: isRTL ? 'الوصف والتفاصيل' : 'Description & Details' },
    { number: 3, label: isRTL ? 'التسعير والتسليم' : 'Pricing & Delivery' },
    { number: 4, label: isRTL ? 'معرض الأعمال' : 'Portfolio Gallery' },
    { number: 5, label: isRTL ? 'المراجعة والنشر' : 'Review & Publish' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-6 mb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.number < currentStep
                      ? 'bg-teal-600 text-white'
                      : step.number === currentStep
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${
                    step.number === currentStep ? 'text-teal-600' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative top-[-12px]">
                  <div
                    className={`h-full transition-all ${
                      step.number < currentStep ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
