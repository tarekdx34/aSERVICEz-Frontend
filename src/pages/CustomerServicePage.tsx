import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  AlertCircle,
  Clock,
  Users,
  MessageCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowUpCircle,
  Shield
} from 'lucide-react';

export function CustomerServicePage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  const tickets = [
    {
      id: 'CS-001',
      type: 'dispute',
      priority: 'high',
      customer: 'Sarah Johnson',
      customerAr: 'سارة جونسون',
      expert: 'Ahmed Hassan',
      expertAr: 'أحمد حسن',
      orderId: 'ORD-1738756891234',
      issue: 'Quality issue - Logo doesn\'t meet requirements',
      issueAr: 'مشكلة في الجودة - الشعار لا يلبي المتطلبات',
      status: 'new',
      createdAt: '2024-02-05 10:30',
      assignedTo: null,
      messages: 5
    },
    {
      id: 'CS-002',
      type: 'refund',
      priority: 'high',
      customer: 'Mike Chen',
      customerAr: 'مايك تشن',
      expert: 'Fatima Said',
      expertAr: 'فاطمة سعيد',
      orderId: 'ORD-1738756123456',
      issue: 'Expert did not deliver on time',
      issueAr: 'لم يسلم الخبير في الوقت المحدد',
      status: 'in_progress',
      createdAt: '2024-02-04 15:20',
      assignedTo: 'CS Agent 1',
      messages: 12
    },
    {
      id: 'CS-003',
      type: 'mediation',
      priority: 'medium',
      customer: 'Emma Williams',
      customerAr: 'إيما ويليامز',
      expert: 'Omar Ali',
      expertAr: 'عمر علي',
      orderId: 'ORD-1738755987654',
      issue: 'Revision request disagreement',
      issueAr: 'خلاف حول طلب التعديل',
      status: 'in_progress',
      createdAt: '2024-02-03 09:15',
      assignedTo: 'CS Agent 2',
      messages: 8
    }
  ];

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
  const ticket = tickets.find(t => t.id === selectedTicket);

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo', sans-serif" : "system-ui, -apple-system, sans-serif"};
        }
      `}</style>

      <Navbar isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'خدمة العملاء' : 'Customer Service'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة التذاكر والوساطة' : 'Manage tickets and mediation'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'تذاكر جديدة' : 'New Tickets'}</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'قيد المعالجة' : 'In Progress'}</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'متوسط الوقت' : 'Avg Time'}</p>
                <p className="text-2xl font-bold text-gray-900">2.4h</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'محلول اليوم' : 'Resolved Today'}</p>
                <p className="text-2xl font-bold text-gray-900">32</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Queue */}
          <div className={selectedTicket ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {isRTL ? 'قائمة التذاكر' : 'Ticket Queue'}
                </h2>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      filter === 'all' ? 'bg-white shadow' : ''
                    }`}
                  >
                    {isRTL ? 'الكل' : 'All'}
                  </button>
                  <button
                    onClick={() => setFilter('new')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      filter === 'new' ? 'bg-white shadow' : ''
                    }`}
                  >
                    {isRTL ? 'جديد' : 'New'}
                  </button>
                  <button
                    onClick={() => setFilter('in_progress')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      filter === 'in_progress' ? 'bg-white shadow' : ''
                    }`}
                  >
                    {isRTL ? 'نشط' : 'Active'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTicket === t.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-600">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.priority === 'high' ? 'bg-red-100 text-red-700' :
                          t.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t.priority === 'high' ? (isRTL ? 'عالي' : 'High') :
                           t.priority === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                           (isRTL ? 'منخفض' : 'Low')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                          t.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {t.status === 'new' ? (isRTL ? 'جديد' : 'New') :
                           t.status === 'in_progress' ? (isRTL ? 'قيد المعالجة' : 'In Progress') :
                           (isRTL ? 'محلول' : 'Resolved')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {isRTL ? t.issueAr : t.issue}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <span>{isRTL ? 'الطلب:' : 'Order:'} {t.orderId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {t.messages}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{t.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Case Details & Mediation */}
          {selectedTicket && ticket && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {isRTL ? 'تفاصيل القضية' : 'Case Details'}
                </h2>

                {/* Two-Panel Layout */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Customer Panel */}
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {ticket.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{isRTL ? ticket.customerAr : ticket.customer}</p>
                        <p className="text-sm text-gray-600">{isRTL ? 'العميل' : 'Customer'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'الطلبات:' : 'Orders:'}</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'المبلغ المنفق:' : 'Spent:'}</span>
                        <span className="font-medium">$2,450</span>
                      </div>
                    </div>
                  </div>

                  {/* Expert Panel */}
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {ticket.expert.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{isRTL ? ticket.expertAr : ticket.expert}</p>
                        <p className="text-sm text-gray-600">{isRTL ? 'الخبير' : 'Expert'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'التقييم:' : 'Rating:'}</span>
                        <span className="font-medium">4.9 ⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isRTL ? 'الطلبات:' : 'Orders:'}</span>
                        <span className="font-medium">156</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Case Timeline */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{isRTL ? 'الجدول الزمني' : 'Case Timeline'}</h3>
                  <div className="space-y-3">
                    {[
                      { time: '10:30', event: 'Ticket created by customer', eventAr: 'تم إنشاء التذكرة من قبل العميل' },
                      { time: '10:45', event: 'Expert responded', eventAr: 'رد الخبير' },
                      { time: '11:20', event: 'Customer escalated to support', eventAr: 'قام العميل بتصعيد الدعم' },
                      { time: '11:35', event: 'Assigned to CS Agent', eventAr: 'تم التعيين لوكيل خدمة العملاء' }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">{isRTL ? item.eventAr : item.event}</p>
                          <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mediation Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? 'ملاحظات الوساطة' : 'Mediation Notes'}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder={isRTL ? 'أضف ملاحظاتك...' : 'Add your notes...'}
                  />
                </div>

                {/* Resolution Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{isRTL ? 'إجراءات الحل' : 'Resolution Actions'}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'إغلاق القضية' : 'Close Case'}
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {isRTL ? 'إصدار استرداد' : 'Issue Refund'}
                    </Button>
                    <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                      <Shield className="w-4 h-4 mr-2" />
                      {isRTL ? 'تطبيق السياسة' : 'Enforce Policy'}
                    </Button>
                    <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      <ArrowUpCircle className="w-4 h-4 mr-2" />
                      {isRTL ? 'تصعيد للمسؤول' : 'Escalate to Admin'}
                    </Button>
                  </div>

                  {/* Refund Amount Input */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'مبلغ الاسترداد' : 'Refund Amount'}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option>{isRTL ? 'استرداد كامل' : 'Full Refund'}</option>
                        <option>{isRTL ? 'استرداد جزئي' : 'Partial Refund'}</option>
                        <option>{isRTL ? 'تعويض' : 'Compensation'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
