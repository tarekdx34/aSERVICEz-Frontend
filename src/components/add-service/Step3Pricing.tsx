import { useState } from 'react';
import { Plus, X, Package as PackageIcon, Zap, FileText } from 'lucide-react';
import { Button } from '../ui/button';

export interface ServicePackage {
  name: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface ServiceExtra {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Step3Data {
  packages: {
    basic: ServicePackage;
    standard: ServicePackage;
    premium: ServicePackage;
  };
  extras: ServiceExtra[];
}

interface Step3PricingProps {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
  onNext: () => void;
  onPrev: () => void;
  isRTL?: boolean;
}

export function Step3Pricing({ data, onChange, onNext, onPrev, isRTL = true }: Step3PricingProps) {
  const [showExtraForm, setShowExtraForm] = useState(false);
  const [newExtra, setNewExtra] = useState({ name: '', price: 0, icon: '⚡' });

  const packageTypes: Array<keyof typeof data.packages> = ['basic', 'standard', 'premium'];

  const packageLabels = {
    basic: { ar: 'باقة أساسية', en: 'Basic Package', color: 'bg-blue-50 border-blue-200' },
    standard: { ar: 'باقة متقدمة', en: 'Standard Package', color: 'bg-purple-50 border-purple-200' },
    premium: { ar: 'باقة احترافية', en: 'Premium Package', color: 'bg-teal-50 border-teal-200' },
  };

  const updatePackage = (type: keyof typeof data.packages, field: keyof ServicePackage, value: any) => {
    onChange({
      ...data,
      packages: {
        ...data.packages,
        [type]: {
          ...data.packages[type],
          [field]: value,
        },
      },
    });
  };

  const addPackageFeature = (type: keyof typeof data.packages, feature: string) => {
    if (feature.trim()) {
      const currentFeatures = data.packages[type].features;
      updatePackage(type, 'features', [...currentFeatures, feature.trim()]);
    }
  };

  const removePackageFeature = (type: keyof typeof data.packages, index: number) => {
    const currentFeatures = data.packages[type].features;
    updatePackage(type, 'features', currentFeatures.filter((_, i) => i !== index));
  };

  const handleAddExtra = () => {
    if (newExtra.name.trim() && newExtra.price > 0) {
      onChange({
        ...data,
        extras: [
          ...data.extras,
          {
            id: Date.now().toString(),
            ...newExtra,
          },
        ],
      });
      setNewExtra({ name: '', price: 0, icon: '⚡' });
      setShowExtraForm(false);
    }
  };

  const handleRemoveExtra = (id: string) => {
    onChange({
      ...data,
      extras: data.extras.filter(extra => extra.id !== id),
    });
  };

  const isValid = () => {
    return (
      data.packages.basic.price >= 5 &&
      data.packages.basic.deliveryDays >= 1 &&
      data.packages.basic.features.length >= 1
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
            3
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? '💰 التسعير والتسليم' : '💰 Pricing & Delivery'}
          </h2>
        </div>

        {/* Packages */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">
            {isRTL ? 'الباقات' : 'Packages'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packageTypes.map((type) => {
              const pkg = data.packages[type];
              const label = packageLabels[type];
              const [featureInput, setFeatureInput] = useState('');

              return (
                <div key={type} className={`border-2 rounded-xl p-6 ${label.color}`}>
                  <h4 className="font-bold text-gray-900 mb-4">
                    {isRTL ? label.ar : label.en}
                  </h4>

                  <div className="space-y-4">
                    {/* Price */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {isRTL ? 'السعر' : 'Price'}
                        {type === 'basic' && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={pkg.price || ''}
                          onChange={(e) => updatePackage(type, 'price', Number(e.target.value))}
                          min="5"
                          placeholder="0"
                          className="w-full h-10 px-3 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-500 text-sm">$</span>
                      </div>
                    </div>

                    {/* Delivery Days */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {isRTL ? 'مدة التسليم (أيام)' : 'Delivery (days)'}
                        {type === 'basic' && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="number"
                        value={pkg.deliveryDays || ''}
                        onChange={(e) => updatePackage(type, 'deliveryDays', Number(e.target.value))}
                        min="1"
                        placeholder="0"
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Revisions */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {isRTL ? 'عدد المراجعات' : 'Revisions'}
                      </label>
                      <input
                        type="number"
                        value={pkg.revisions || ''}
                        onChange={(e) => updatePackage(type, 'revisions', Number(e.target.value))}
                        min="0"
                        placeholder="0"
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        {isRTL ? 'ما يشمله' : "What's included"}
                      </label>
                      <div className="space-y-2 mb-2">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs bg-white p-2 rounded">
                            <span className="text-teal-600">☑</span>
                            <span className="flex-1">{feature}</span>
                            <button
                              onClick={() => removePackageFeature(type, index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addPackageFeature(type, featureInput);
                              setFeatureInput('');
                            }
                          }}
                          placeholder={isRTL ? 'ميزة...' : 'Feature...'}
                          className="flex-1 h-8 px-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          onClick={() => {
                            addPackageFeature(type, featureInput);
                            setFeatureInput('');
                          }}
                          className="px-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Extras */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isRTL ? 'خدمات إضافية (اختياري)' : 'Service Extras (Optional)'}
            </h3>
            {!showExtraForm && (
              <Button
                onClick={() => setShowExtraForm(true)}
                variant="outline"
                className="text-teal-600 border-teal-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إضافة خدمة' : 'Add Extra'}
              </Button>
            )}
          </div>

          {/* Extra Form */}
          {showExtraForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isRTL ? 'الأيقونة' : 'Icon'}
                  </label>
                  <select
                    value={newExtra.icon}
                    onChange={(e) => setNewExtra({ ...newExtra, icon: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="⚡">⚡ {isRTL ? 'سريع' : 'Fast'}</option>
                    <option value="📄">📄 {isRTL ? 'ملف' : 'File'}</option>
                    <option value="🎨">🎨 {isRTL ? 'تصميم' : 'Design'}</option>
                    <option value="📦">📦 {isRTL ? 'إضافي' : 'Extra'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isRTL ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    value={newExtra.name}
                    onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                    placeholder={isRTL ? 'توصيل سريع 24 ساعة' : 'Express delivery 24h'}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isRTL ? 'السعر' : 'Price'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newExtra.price || ''}
                      onChange={(e) => setNewExtra({ ...newExtra, price: Number(e.target.value) })}
                      min="1"
                      placeholder="0"
                      className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <Button onClick={handleAddExtra} className="bg-teal-600 hover:bg-teal-700 text-white">
                      {isRTL ? 'إضافة' : 'Add'}
                    </Button>
                    <Button onClick={() => setShowExtraForm(false)} variant="outline">
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extras List */}
          {data.extras.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.extras.map((extra) => (
                <div key={extra.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{extra.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{extra.name}</p>
                      <p className="text-sm text-teal-600">+${extra.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExtra(extra.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
