import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProgressIndicator } from '../components/add-service/ProgressIndicator';
import { Step1BasicInfo } from '../components/add-service/Step1BasicInfo';
import { Step2Description } from '../components/add-service/Step2Description';
import { Step3Pricing, ServicePackage, ServiceExtra } from '../components/add-service/Step3Pricing';
import { Step4Portfolio } from '../components/add-service/Step4Portfolio';
import { Step5Review } from '../components/add-service/Step5Review';
import { Button } from '../components/ui/button';
import { Save } from 'lucide-react';

interface FormData {
  step1: {
    title: string;
    category: string;
    subcategory: string;
    tags: string[];
    mainImage: File | null;
    mainImagePreview: string;
  };
  step2: {
    description: string;
    features: string[];
    buyerInstructions: string;
  };
  step3: {
    packages: {
      basic: ServicePackage;
      standard: ServicePackage;
      premium: ServicePackage;
    };
    extras: ServiceExtra[];
  };
  step4: {
    portfolioImages: Array<{ file: File; preview: string }>;
    videoUrl: string;
  };
}

const STORAGE_KEY = 'addServiceDraft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function AddServicePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState<FormData>(() => {
    // Try to load draft from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore previews but not actual files (files can't be serialized)
        return {
          ...parsed,
          step1: {
            ...parsed.step1,
            mainImage: null,
          },
          step4: {
            ...parsed.step4,
            portfolioImages: [],
          },
        };
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }

    return {
      step1: {
        title: '',
        category: '',
        subcategory: '',
        tags: [],
        mainImage: null,
        mainImagePreview: '',
      },
      step2: {
        description: '',
        features: [],
        buyerInstructions: '',
      },
      step3: {
        packages: {
          basic: {
            name: 'Basic',
            price: 0,
            deliveryDays: 0,
            revisions: 0,
            features: [],
          },
          standard: {
            name: 'Standard',
            price: 0,
            deliveryDays: 0,
            revisions: 0,
            features: [],
          },
          premium: {
            name: 'Premium',
            price: 0,
            deliveryDays: 0,
            revisions: 0,
            features: [],
          },
        },
        extras: [],
      },
      step4: {
        portfolioImages: [],
        videoUrl: '',
      },
    };
  });

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData]);

  const saveDraft = () => {
    try {
      // Create a serializable version of formData
      const serializable = {
        ...formData,
        step1: {
          ...formData.step1,
          mainImage: null, // Can't serialize File objects
        },
        step4: {
          ...formData.step4,
          portfolioImages: formData.step4.portfolioImages.map(img => ({
            preview: img.preview,
          })),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
      setLastSaved(new Date());
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    alert(isRTL ? 'تم حفظ المسودة بنجاح!' : 'Draft saved successfully!');
  };

  const handlePublish = () => {
    // Clear draft
    localStorage.removeItem(STORAGE_KEY);
    
    // Show success message
    alert(
      isRTL
        ? 'تم إرسال خدمتك للمراجعة! سيتم إشعارك خلال 24-48 ساعة.'
        : 'Your service has been submitted for review! You will be notified within 24-48 hours.'
    );

    // Navigate to home or dashboard
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Import Cairo font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isRTL ? 'إضافة خدمة جديدة' : 'Add New Service'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isRTL ? `مرحباً ${user?.name || 'الخبير'}` : `Welcome ${user?.name || 'Expert'}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  {isRTL ? 'آخر حفظ: ' : 'Last saved: '}
                  {lastSaved.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US')}
                </span>
              )}
              <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                {isRTL ? 'حفظ كمسودة' : 'Save Draft'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={5} isRTL={isRTL} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {currentStep === 1 && (
          <Step1BasicInfo
            data={formData.step1}
            onChange={(data) => setFormData({ ...formData, step1: data })}
            onNext={() => setCurrentStep(2)}
            isRTL={isRTL}
          />
        )}

        {currentStep === 2 && (
          <Step2Description
            data={formData.step2}
            onChange={(data) => setFormData({ ...formData, step2: data })}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
            isRTL={isRTL}
          />
        )}

        {currentStep === 3 && (
          <Step3Pricing
            data={formData.step3}
            onChange={(data) => setFormData({ ...formData, step3: data })}
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
            isRTL={isRTL}
          />
        )}

        {currentStep === 4 && (
          <Step4Portfolio
            data={formData.step4}
            onChange={(data) => setFormData({ ...formData, step4: data })}
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(3)}
            isRTL={isRTL}
          />
        )}

        {currentStep === 5 && (
          <Step5Review
            formData={formData}
            onPrev={() => setCurrentStep(4)}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isRTL={isRTL}
          />
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
