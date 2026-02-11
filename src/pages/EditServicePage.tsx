import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { serviceApi, categoryApi, type CategoryResponse, type SubcategoryResponse } from '../services/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

export function EditServicePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState('');

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryResponse[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      serviceApi.getById(id),
      categoryApi.listWithSubcategories(),
    ])
      .then(([serviceRes, catRes]) => {
        const s = serviceRes.data;
        setServiceName(s.serviceName || s.title || '');
        setDescription(s.description || '');
        setPrice(String(s.price || ''));
        setDuration(String(s.duration ?? s.deliveryTime ?? ''));
        setCategoryId(s.category ? String(s.category.categoryId) : '');
        setSubcategoryId(s.subcategory ? String(s.subcategory.subcategoryId) : '');
        setCurrentThumbnail(s.thumbnail || '');
        setCategories(catRes.data.categories || []);
      })
      .catch(() => setError(isRTL ? 'فشل في تحميل الخدمة' : 'Failed to load service'))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Update subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => String(c.categoryId) === categoryId);
      setSubcategories(cat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [categoryId, categories]);

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await serviceApi.update(Number(id), {
        serviceName,
        description,
        price: parseFloat(price) || 0,
        duration: parseInt(duration) || 1,
        categoryId: parseInt(categoryId) || 0,
        subcategoryId: parseInt(subcategoryId) || 0,
      }, thumbnail || undefined);
      setMessage({ type: 'success', text: isRTL ? 'تم تحديث الخدمة بنجاح' : 'Service updated successfully' });
      setTimeout(() => navigate('/my-services'), 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || (isRTL ? 'فشل في تحديث الخدمة' : 'Failed to update service') });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" onClick={() => navigate('/my-services')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'تعديل الخدمة' : 'Edit Service'}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700">{error}</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
            {message && (
              <div className={`rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'اسم الخدمة' : 'Service Name'} *
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'الوصف' : 'Description'} *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'السعر ($)' : 'Price ($)'} *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'المدة (أيام)' : 'Duration (days)'} *
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'الفئة' : 'Category'} *
              </label>
              <select
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(''); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">{isRTL ? 'اختر الفئة' : 'Select Category'}</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={String(cat.categoryId)}>{cat.name}</option>
                ))}
              </select>
            </div>

            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الفئة الفرعية' : 'Subcategory'} *
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">{isRTL ? 'اختر الفئة الفرعية' : 'Select Subcategory'}</option>
                  {subcategories.map(sub => (
                    <option key={sub.subcategoryId} value={String(sub.subcategoryId)}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'الصورة المصغرة' : 'Thumbnail'}
              </label>
              {currentThumbnail && !thumbnail && (
                <img src={currentThumbnail} alt="Current" className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setThumbnail(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isSaving || !serviceName.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
