import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';

export interface Step4Data {
  portfolioImages: Array<{ file: File; preview: string }>;
  videoUrl: string;
}

interface Step4PortfolioProps {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
  onNext: () => void;
  onPrev: () => void;
  isRTL?: boolean;
}

export function Step4Portfolio({ data, onChange, onNext, onPrev, isRTL = true }: Step4PortfolioProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, 5 - data.portfolioImages.length)
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    onChange({
      ...data,
      portfolioImages: [...data.portfolioImages, ...newImages],
    });
  };

  const handleRemoveImage = (index: number) => {
    onChange({
      ...data,
      portfolioImages: data.portfolioImages.filter((_, i) => i !== index),
    });
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

    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
            4
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? '🖼️ معرض الأعمال' : '🖼️ Portfolio Gallery'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Portfolio Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'أضف صور لأعمال سابقة' : 'Add images of previous work'}
            </label>
            <p className="text-sm text-gray-600 mb-4">
              {isRTL ? '(اختياري لكن موصى به بشدة)' : '(Optional but highly recommended)'}
            </p>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {data.portfolioImages.map((image, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={image.preview}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              {data.portfolioImages.length < 5 && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-600 text-center px-2">
                    {isRTL ? 'أضف صورة' : 'Add Image'}
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                • {isRTL ? `${data.portfolioImages.length}/5 صور` : `${data.portfolioImages.length}/5 images`}
              </span>
              <span>
                • JPG/PNG ({isRTL ? 'حد أقصى 3 ميجابايت لكل صورة' : 'Max 3MB each'})
              </span>
            </div>

            {data.portfolioImages.length > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                💡 {isRTL ? 'اسحب الصور لإعادة ترتيبها' : 'Drag images to reorder'}
              </p>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'رابط فيديو توضيحي (اختياري)' : 'Video URL (Optional)'}
            </label>
            <input
              type="url"
              value={data.videoUrl}
              onChange={(e) => onChange({ ...data, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              {isRTL ? 'YouTube أو Vimeo' : 'YouTube or Vimeo'}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-teal-900 mb-1">
                  {isRTL ? 'لماذا معرض الأعمال مهم؟' : 'Why is a portfolio important?'}
                </p>
                <p className="text-sm text-teal-800">
                  {isRTL
                    ? 'الخدمات التي تحتوي على معرض أعمال تحصل على عدد مبيعات أعلى بنسبة 40% مقارنة بالخدمات بدون معرض.'
                    : 'Services with a portfolio get 40% more sales compared to those without one.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button onClick={onPrev} variant="outline">
            {isRTL ? '→ السابق' : '← Previous'}
          </Button>
          <Button
            onClick={onNext}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8"
          >
            {isRTL ? 'التالي ←' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
