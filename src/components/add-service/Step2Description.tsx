import { useState } from 'react';
import { Plus, X, Lightbulb, Bold, Italic, List as ListIcon } from 'lucide-react';
import { Button } from '../ui/button';

export interface Step2Data {
  description: string;
  features: string[];
  buyerInstructions: string;
}

interface Step2DescriptionProps {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onPrev: () => void;
  isRTL?: boolean;
}

export function Step2Description({ data, onChange, onNext, onPrev, isRTL = true }: Step2DescriptionProps) {
  const [featureInput, setFeatureInput] = useState('');
  const [textFormat, setTextFormat] = useState({ bold: false, italic: false });

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      onChange({ ...data, features: [...data.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    onChange({ ...data, features: data.features.filter((_, i) => i !== index) });
  };

  const isValid = () => {
    return data.description.trim().length >= 100 && data.features.length >= 3;
  };

  const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
            2
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? '📋 الوصف والتفاصيل' : '📋 Description & Details'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Service Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'وصف الخدمة' : 'Service Description'}
              <span className="text-red-500">*</span>
            </label>

            {/* Simple formatting toolbar */}
            <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <button
                onClick={() => setTextFormat({ ...textFormat, bold: !textFormat.bold })}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${textFormat.bold ? 'bg-gray-300' : ''}`}
                title={isRTL ? 'عريض' : 'Bold'}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTextFormat({ ...textFormat, italic: !textFormat.italic })}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${textFormat.italic ? 'bg-gray-300' : ''}`}
                title={isRTL ? 'مائل' : 'Italic'}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title={isRTL ? 'قائمة' : 'List'}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              rows={10}
              placeholder={isRTL ? 'اكتب وصفاً تفصيلياً للخدمة...' : 'Write a detailed description of your service...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />

            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm ${wordCount > 1400 ? 'text-orange-600' : 'text-gray-500'}`}>
                📊 {wordCount}/1500 {isRTL ? 'كلمة' : 'words'}
              </span>
            </div>

            {/* Tips */}
            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-teal-900 mb-2">
                    {isRTL ? 'نصائح لوصف فعال:' : 'Tips for an effective description:'}
                  </p>
                  <ul className="text-sm text-teal-800 space-y-1">
                    <li>• {isRTL ? 'وضح ما ستقدمه بالتفصيل' : 'Clearly explain what you will provide'}</li>
                    <li>• {isRTL ? 'اذكر المميزات والفوائد' : 'Mention features and benefits'}</li>
                    <li>• {isRTL ? 'حدد ما لن تقدمه' : 'Specify what is not included'}</li>
                    <li>• {isRTL ? 'استخدم لغة واضحة ومهنية' : 'Use clear and professional language'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Provide */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'ماذا ستقدم في هذه الخدمة؟' : "What you'll provide in this service?"}
              <span className="text-red-500">*</span>
            </label>
            
            <div className="space-y-3">
              {data.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-teal-600">✓</span>
                  <span className="flex-1 text-sm text-gray-700">{feature}</span>
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder={isRTL ? 'مثال: تصميم 3 مفاهيم مبدئية' : 'Example: 3 initial design concepts'}
                  className="flex-1 h-10 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <Button
                  onClick={handleAddFeature}
                  disabled={!featureInput.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {isRTL ? `${data.features.length} ميزة (الحد الأدنى: 3)` : `${data.features.length} features (minimum: 3)`}
            </p>
          </div>

          {/* Buyer Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'تعليمات للمشتري' : 'Instructions for Buyer'}
            </label>
            <textarea
              value={data.buyerInstructions}
              onChange={(e) => onChange({ ...data, buyerInstructions: e.target.value })}
              rows={4}
              placeholder={isRTL ? 'مثال: يرجى إرسال الألوان المفضلة والشعار الحالي إن وجد...' : 'Example: Please send your preferred colors and current logo if any...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button onClick={onPrev} variant="outline">
            {isRTL ? '→ السابق' : '← Previous'}
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid()}
            className="bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed px-8"
          >
            {isRTL ? 'التالي ←' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
