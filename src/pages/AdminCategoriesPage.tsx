import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { adminApi, categoryApi, type CategoryResponse, type SubcategoryResponse } from '../services/api';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
  FolderOpen,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';

export function AdminCategoriesPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  // Subcategory form
  const [showSubForm, setShowSubForm] = useState<number | null>(null);
  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [savingSub, setSavingSub] = useState(false);

  const fetchCategories = () => {
    setIsLoading(true);
    categoryApi.listWithSubcategories()
      .then(res => setCategories(res.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetCatForm = () => {
    setShowCatForm(false);
    setEditingCatId(null);
    setCatName('');
    setCatDesc('');
    setCatIcon('');
  };

  const resetSubForm = () => {
    setShowSubForm(null);
    setEditingSubId(null);
    setSubName('');
    setSubDesc('');
  };

  const handleSaveCategory = async () => {
    setSavingCat(true);
    setMessage(null);
    try {
      if (editingCatId) {
        await adminApi.updateCategory(editingCatId, { name: catName, description: catDesc, iconUrl: catIcon || undefined });
        setMessage({ type: 'success', text: isRTL ? 'تم تحديث الفئة بنجاح' : 'Category updated successfully' });
      } else {
        await adminApi.createCategory({ name: catName, description: catDesc, iconUrl: catIcon || undefined });
        setMessage({ type: 'success', text: isRTL ? 'تم إنشاء الفئة بنجاح' : 'Category created successfully' });
      }
      resetCatForm();
      fetchCategories();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed' });
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (catId: number) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(catId);
      setMessage({ type: 'success', text: isRTL ? 'تم حذف الفئة' : 'Category deleted' });
      fetchCategories();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed' });
    }
  };

  const handleEditCategory = (cat: CategoryResponse) => {
    setEditingCatId(cat.categoryId);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCatIcon(cat.iconUrl || '');
    setShowCatForm(true);
  };

  const handleSaveSubcategory = async () => {
    if (!showSubForm) return;
    setSavingSub(true);
    setMessage(null);
    try {
      if (editingSubId) {
        await adminApi.updateSubcategory(editingSubId, { name: subName, description: subDesc });
        setMessage({ type: 'success', text: isRTL ? 'تم تحديث الفئة الفرعية' : 'Subcategory updated' });
      } else {
        await adminApi.createSubcategory(showSubForm, { name: subName, description: subDesc });
        setMessage({ type: 'success', text: isRTL ? 'تم إنشاء الفئة الفرعية' : 'Subcategory created' });
      }
      resetSubForm();
      fetchCategories();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed' });
    } finally {
      setSavingSub(false);
    }
  };

  const handleDeleteSubcategory = async (subId: number) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الفئة الفرعية؟' : 'Delete this subcategory?')) return;
    try {
      await adminApi.deleteSubcategory(subId);
      setMessage({ type: 'success', text: isRTL ? 'تم حذف الفئة الفرعية' : 'Subcategory deleted' });
      fetchCategories();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed' });
    }
  };

  const handleEditSubcategory = (catId: number, sub: SubcategoryResponse) => {
    setShowSubForm(catId);
    setEditingSubId(sub.subcategoryId);
    setSubName(sub.name);
    setSubDesc(sub.description || '');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isRTL ? 'إدارة الفئات' : 'Category Management'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إنشاء وتعديل وحذف الفئات والفئات الفرعية' : 'Create, edit, and delete categories and subcategories'}
            </p>
          </div>
          <Button onClick={() => { resetCatForm(); setShowCatForm(true); }} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'فئة جديدة' : 'New Category'}
          </Button>
        </div>

        {message && (
          <div className={`rounded-lg p-3 text-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Category Form */}
        {showCatForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCatId ? (isRTL ? 'تعديل الفئة' : 'Edit Category') : (isRTL ? 'فئة جديدة' : 'New Category')}
              </h2>
              <button onClick={resetCatForm}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'الاسم' : 'Name'} *</label>
                <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'الوصف' : 'Description'}</label>
                <input type="text" value={catDesc} onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'رابط الأيقونة' : 'Icon URL'}</label>
                <input type="text" value={catIcon} onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveCategory} disabled={savingCat || !catName.trim()} className="bg-teal-600 hover:bg-teal-700 text-white">
                {savingCat ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isRTL ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{isRTL ? 'لا توجد فئات بعد' : 'No categories yet'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.categoryId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <button
                    onClick={() => setExpandedCat(expandedCat === cat.categoryId ? null : cat.categoryId)}
                    className="flex items-center gap-3 flex-1"
                  >
                    {expandedCat === cat.categoryId ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{cat.name}</p>
                      {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
                    </div>
                    <span className="ml-auto mr-4 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {(cat.subcategories || []).length} {isRTL ? 'فرعية' : 'subcategories'}
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditCategory(cat)}>
                      <Edit className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(cat.categoryId)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Subcategories */}
                {expandedCat === cat.categoryId && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        {isRTL ? 'الفئات الفرعية' : 'Subcategories'}
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { resetSubForm(); setShowSubForm(cat.categoryId); }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {isRTL ? 'إضافة فرعية' : 'Add Subcategory'}
                      </Button>
                    </div>

                    {/* Subcategory Form */}
                    {showSubForm === cat.categoryId && (
                      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">{isRTL ? 'الاسم' : 'Name'} *</label>
                            <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">{isRTL ? 'الوصف' : 'Description'}</label>
                            <input type="text" value={subDesc} onChange={(e) => setSubDesc(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button size="sm" variant="ghost" onClick={resetSubForm}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
                          <Button size="sm" onClick={handleSaveSubcategory} disabled={savingSub || !subName.trim()} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {savingSub ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                            {isRTL ? 'حفظ' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Subcategory List */}
                    {(cat.subcategories || []).length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">{isRTL ? 'لا توجد فئات فرعية' : 'No subcategories'}</p>
                    ) : (
                      <div className="space-y-2">
                        {(cat.subcategories || []).map(sub => (
                          <div key={sub.subcategoryId} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{sub.name}</p>
                              {sub.description && <p className="text-xs text-gray-500">{sub.description}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditSubcategory(cat.categoryId, sub)}>
                                <Edit className="w-3 h-3 text-gray-500" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteSubcategory(sub.subcategoryId)}>
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
