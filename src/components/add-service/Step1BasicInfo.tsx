import { useState, useRef } from 'react';
import { Upload, X, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';

interface Step1Data {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  mainImage: File | null;
  mainImagePreview: string;
}

interface Step1BasicInfoProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
  isRTL?: boolean;
}

export function Step1BasicInfo({ data, onChange, onNext, isRTL = true }: Step1BasicInfoProps) {
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'design', label: isRTL ? '🎨 تصميم وجرافيك' : '🎨 Design & Graphics' },
    { id: 'programming', label: isRTL ? '💻 برمجة وتطوير' : '💻 Programming & Development' },
    { id: 'writing', label: isRTL ? '✍️ كتابة وترجمة' : '✍️ Writing & Translation' },
    { id: 'marketing', label: isRTL ? '📱 تسويق رقمي' : '📱 Digital Marketing' },
    { id: 'video', label: isRTL ? '🎬 فيديو وأنيميشن' : '🎬 Video & Animation' },
    { id: 'business', label: isRTL ? '💼 أعمال' : '💼 Business' },
  ];

  const subcategories: Record<string, { id: string; label: string }[]> = {
    design: [
      { id: 'logo', label: isRTL ? 'تصميم شعارات' : 'Logo Design' },
      { id: 'social', label: isRTL ? 'تصميم سوشيال ميديا' : 'Social Media Design' },
      { id: 'ui', label: isRTL ? 'تصميم واجهات' : 'UI Design' },
      { id: 'print', label: isRTL ? 'تصميم مطبوعات' : 'Print Design' },
    ],
    programming: [
      { id: 'web', label: isRTL ? 'تطوير مواقع' : 'Web Development' },
      { id: 'mobile', label: isRTL ? 'تطوير تطبيقات' : 'Mobile Apps' },
      { id: 'backend', label: isRTL ? 'برمجة خلفية' : 'Backend Development' },
    ],
  };

  const handleAddTag = () => {
    if (tagInput.trim() && data.tags.length < 5 && !data.tags.includes(tagInput.trim())) {
      onChange({ ...data, tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange({ ...data, tags: data.tags.filter(t => t !== tag) });
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          mainImage: file,
          mainImagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const isValid = () => {
    return (
      data.title.trim().length >= 10 &&
      data.category &&
      data.subcategory &&
      data.tags.length > 0 &&
      data.mainImagePreview
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
            1
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? '📝 معلومات أساسية' : '📝 Basic Information'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Service Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'عنوان الخدمة' : 'Service Title'}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              maxLength={100}
              placeholder={isRTL ? 'سأقوم بـ...' : 'I will...'}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm ${data.title.length >= 90 ? 'text-orange-600' : 'text-gray-500'}`}>
                📊 {data.title.length}/100 {isRTL ? 'حرف' : 'characters'}
              </span>
              <span className="text-xs text-teal-600 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                {isRTL ? 'مثال: تصميم شعار احترافي بـ 3 مفاهيم مختلفة' : 'Example: Professional logo design with 3 concepts'}
              </span>
            </div>
          </div>

          {/* Main Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'الفئة الرئيسية' : 'Main Category'}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={data.category}
              onChange={(e) => onChange({ ...data, category: e.target.value, subcategory: '' })}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">{isRTL ? 'اختر الفئة' : 'Select Category'}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {data.category && subcategories[data.category] && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? 'الفئة الفرعية' : 'Subcategory'}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={data.subcategory}
                onChange={(e) => onChange({ ...data, subcategory: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">{isRTL ? 'اختر الفئة الفرعية' : 'Select Subcategory'}</option>
                {subcategories[data.category].map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'الكلمات المفتاحية' : 'Keywords'}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder={isRTL ? 'أضف كلمة مفتاحية...' : 'Add a keyword...'}
                disabled={data.tags.length >= 5}
                className="flex-1 h-10 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
              />
              <Button
                onClick={handleAddTag}
                disabled={!tagInput.trim() || data.tags.length >= 5}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isRTL ? 'إضافة' : 'Add'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-teal-900">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isRTL ? `${data.tags.length}/5 كلمات` : `${data.tags.length}/5 keywords`}
            </p>
          </div>

          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'صورة الخدمة الرئيسية' : 'Main Service Image'}
              <span className="text-red-500">*</span>
            </label>
            
            {data.mainImagePreview ? (
              <div className="relative">
                <img
                  src={data.mainImagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => onChange({ ...data, mainImage: null, mainImagePreview: '' })}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-700 font-medium mb-1">
                  {isRTL ? 'اسحب وأفلت الصورة هنا' : 'Drag & drop your image here'}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {isRTL ? 'أو اختر ملف' : 'or choose a file'}
                </p>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  {isRTL ? 'اختر صورة' : 'Choose Image'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              • JPG, PNG ({isRTL ? 'حد أقصى 5 ميجابايت' : 'Max 5MB'})<br />
              • {isRTL ? 'الحجم الموصى به: 1280x720' : 'Recommended size: 1280x720'}
            </p>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
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
