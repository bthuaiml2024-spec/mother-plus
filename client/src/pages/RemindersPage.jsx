import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Send,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ClockAlert,
  Phone,
  FileText,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { ReminderModal } from '../components/ReminderModal.jsx';

export function RemindersPage({ onNavigate, onSelectMother }) {
  const { t, language } = useLanguage();
  const [reminders, setReminders] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (typeFilter !== 'ALL') params.type = typeFilter;

      const [remRes, mothersRes] = await Promise.all([
        api.getReminders(params),
        api.getMothers()
      ]);

      if (remRes.data) setReminders(remRes.data);
      if (mothersRes.data) setMothers(mothersRes.data);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestReminder = async (rem) => {
    try {
      const res = await api.sendTestReminder(rem.id);
      setToast({
        title: `Test Reminder Dispatched to ${rem.motherName}`,
        body: res.data?.sentMessageText
      });
      setTimeout(() => setToast(null), 5000);
      loadData();
    } catch (err) {
      alert('Failed to send test reminder: ' + err.message);
    }
  };

  const handleCreateReminder = async (newRemData) => {
    await api.createReminder(newRemData);
    loadData();
  };

  const handleToggleComplete = async (rem) => {
    try {
      const newStatus = rem.status === 'COMPLETED' ? 'UPCOMING' : 'COMPLETED';
      await api.updateReminder(rem.id, { status: newStatus });
      loadData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Antenatal Care Reminders & Scheduling
                </h1>
                <p className="text-xs text-slate-500">
                  Automated background cron dispatches maternal WhatsApp reminders at scheduled intervals.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Schedule New Reminder</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs">{toast.title}</h4>
              <p className="text-[11px] text-emerald-100 whitespace-pre-line mt-0.5">{toast.body}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-xs text-emerald-200 hover:text-white font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Status:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {['ALL', 'UPCOMING', 'COMPLETED', 'MISSED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="ALL">All Types</option>
              <option value="ANC_APPOINTMENT">ANC Appointments</option>
              <option value="FOLLOW_UP">Follow-ups</option>
              <option value="SUPPLEMENT">Supplements (IFA / Calcium)</option>
              <option value="EMERGENCY_VISIT">Specialist / Referral</option>
            </select>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading reminders...</div>
          ) : reminders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No reminders found for this filter selection.</p>
            </div>
          ) : (
            reminders.map((rem) => {
              const isUpcoming = rem.status === 'UPCOMING';
              const isMissed = rem.status === 'MISSED';
              return (
                <div
                  key={rem.id}
                  className={`p-5 rounded-3xl border bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300 ${
                    isMissed ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      onClick={() => handleToggleComplete(rem)}
                      className={`h-9 w-9 rounded-2xl flex items-center justify-center cursor-pointer transition-colors mt-0.5 ${
                        rem.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : isMissed
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {rem.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isMissed ? (
                        <ClockAlert className="h-5 w-5" />
                      ) : (
                        <Calendar className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{rem.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isMissed
                              ? 'bg-amber-100 text-amber-800'
                              : isUpcoming
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {rem.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">{rem.motherName}</span>
                        <span>•</span>
                        <span>{rem.phone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(rem.dueDateTime).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {rem.notes && (
                        <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                          {rem.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleSendTestReminder(rem)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
                      title="Test simulated WhatsApp push message"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{t('btnSendTestReminder') || 'Send Test Reminder 📲'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateReminder}
        mothers={mothers}
      />
    </div>
  );
}
