import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { serviceApi, categoryApi, type CategoryResponse, type SubcategoryResponse } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

export function AddServicePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryResponse[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    categoryApi.listWithSubcategories()
      .then(res => setCategories(res.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => String(c.categoryId) === categoryId);
      setSubcategories(cat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
    setSubcategoryId('');
  }, [categoryId, categories]);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isValid = serviceName.trim().length >= 3 && description.trim().length >= 10 && price && Number(price) > 0 && duration && Number(duration) >= 1 && categoryId;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError('');
    try {
      await serviceApi.create({
        serviceName: serviceName.trim(),
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        categoryId: parseInt(categoryId),
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : 0,
      }, thumbnail || undefined);

      alert(
        isRTL
          ? 'تم إرسال خدمتك للمراجعة! سيتم إشعارك عند الموافقة.'
          : 'Your service has been submitted for review! You will be notified upon approval.'
      );
      navigate('/my-services');
    } catch (err: any) {
      setError(err.message || (isRTL ? 'حدث خطأ أثناء نشر الخدمة' : 'Failed to publish service'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'إضافة خدمة جديدة' : 'Add New Service'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isRTL ? `مرحباً ${user?.name || 'الخبير'}` : `Welcome ${user?.name || 'Expert'}`}
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
          )}

          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'اسم الخدمة' : 'Service Name'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              maxLength={200}
              placeholder={isRTL ? 'مثال: تصميم شعار احترافي' : 'e.g. Professional Logo Design'}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'وصف الخدمة' : 'Description'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder={isRTL ? 'اكتب وصفاً تفصيلياً للخدمة...' : 'Write a detailed description of your service...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? 'السعر ($)' : 'Price ($)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                min="0.01"
                step="0.01"
                placeholder="50.00"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? 'مدة التسليم (أيام)' : 'Duration (days)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                min="1"
                placeholder="3"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? 'الفئة' : 'Category'} <span className="text-red-500">*</span>
              </label>
              {loadingCats ? (
                <div className="flex items-center gap-2 h-12 px-4 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">{isRTL ? 'اختر الفئة' : 'Select Category'}</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={String(cat.categoryId)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? 'الفئة الفرعية' : 'Subcategory'}
              </label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={!categoryId || subcategories.length === 0}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
              >
                <option value="">{isRTL ? 'اختر الفئة الفرعية' : 'Select Subcategory'}</option>
                {subcategories.map(sub => (
                  <option key={sub.subcategoryId} value={String(sub.subcategoryId)}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {isRTL ? 'صورة الخدمة' : 'Service Thumbnail'}
            </label>
            {thumbnailPreview ? (
              <div className="relative">
                <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                <button
                  onClick={() => { setThumbnail(null); setThumbnailPreview(''); }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-400 hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">{isRTL ? 'اختر صورة (اختياري)' : 'Choose an image (optional)'}</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-300 px-8"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />{isRTL ? 'جاري النشر...' : 'Publishing...'}</>
              ) : (
                <>{isRTL ? '🚀 نشر الخدمة' : '🚀 Publish Service'}</>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            {isRTL
              ? 'ستتم مراجعة الخدمة من قبل فريق الإدارة قبل النشر'
              : 'Your service will be reviewed by the admin team before publishing'}
          </p>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
