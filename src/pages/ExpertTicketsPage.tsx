import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  Plus,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  ChevronRight
} from 'lucide-react';

export function ExpertTicketsPage() {
  const { isRTL, toggleLanguage } = useLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Payment not received',
      subjectAr: 'لم أستلم الدفعة',
      status: 'open',
      priority: 'high',
      date: '2024-02-05',
      lastUpdate: '2 hours ago',
      lastUpdateAr: 'منذ ساعتين',
      messages: 3
    },
    {
      id: 'TKT-002',
      subject: 'Question about commission rates',
      subjectAr: 'سؤال حول معدلات العمولة',
      status: 'in_progress',
      priority: 'medium',
      date: '2024-02-03',
      lastUpdate: '1 day ago',
      lastUpdateAr: 'منذ يوم',
      messages: 5
    },
    {
      id: 'TKT-003',
      subject: 'Profile verification issue',
      subjectAr: 'مشكلة في التحقق من الملف الشخصي',
      status: 'resolved',
      priority: 'low',
      date: '2024-02-01',
      lastUpdate: '3 days ago',
      lastUpdateAr: 'منذ 3 أيام',
      messages: 8
    }
  ];

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter || (filter === 'resolved' && t.status === 'resolved'));

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isRTL ? 'تذاكر الدعم' : 'Support Tickets'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إدارة تذاكر الدعم الخاصة بك' : 'Manage your support tickets'}
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'تذكرة جديدة' : 'New Ticket'}
          </Button>
        </div>

        {/* Create Ticket Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'إنشاء تذكرة جديدة' : 'Create New Ticket'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الموضوع' : 'Subject'}
                </label>
                <input
                  type="text"
                  placeholder={isRTL ? 'صف المشكلة باختصار...' : 'Describe the issue briefly...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الأولوية' : 'Priority'}
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="low">{isRTL ? 'منخفضة' : 'Low'}</option>
                  <option value="medium">{isRTL ? 'متوسطة' : 'Medium'}</option>
                  <option value="high">{isRTL ? 'عالية' : 'High'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={4}
                  placeholder={isRTL ? 'قدم تفاصيل عن المشكلة...' : 'Provide details about the issue...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                  {isRTL ? 'إرسال التذكرة' : 'Submit Ticket'}
                </Button>
                <Button 
                  onClick={() => setShowCreateForm(false)}
                  variant="outline" 
                  className="flex-1"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'الكل' : 'All'} ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'open' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'مفتوح' : 'Open'} ({tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'resolved' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isRTL ? 'محلول' : 'Resolved'} ({tickets.filter(t => t.status === 'resolved').length})
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status === 'open' ? (isRTL ? 'مفتوح' : 'Open') :
                       ticket.status === 'in_progress' ? (isRTL ? 'قيد المعالجة' : 'In Progress') :
                       (isRTL ? 'محلول' : 'Resolved')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.priority === 'high' ? (isRTL ? 'أولوية عالية' : 'High Priority') :
                       ticket.priority === 'medium' ? (isRTL ? 'أولوية متوسطة' : 'Medium Priority') :
                       (isRTL ? 'أولوية منخفضة' : 'Low Priority')}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {isRTL ? ticket.subjectAr : ticket.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {isRTL ? ticket.lastUpdateAr : ticket.lastUpdate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {ticket.messages} {isRTL ? 'رسائل' : 'messages'}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedTicket(ticket.id)}
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  {isRTL ? 'عرض' : 'View'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {selectedTicket === ticket.id && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="space-y-4 mb-4">
                    {/* Mock conversation */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        You
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-900">Initial ticket message describing the issue...</p>
                        <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        SP
                      </div>
                      <div className="flex-1 bg-teal-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900">Support response message...</p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Reply */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder={isRTL ? 'اكتب ردك...' : 'Type your reply...'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'لا توجد تذاكر' : 'No Tickets Found'}
            </h3>
            <p className="text-gray-600">
              {isRTL ? 'لا توجد تذاكر في هذه الفئة' : 'No tickets in this category'}
            </p>
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
