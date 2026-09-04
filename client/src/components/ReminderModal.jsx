import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export function ReminderModal({ isOpen, onClose, onSave, mothers = [], initialMotherId = null }) {
  const { t } = useLanguage();
  const [motherId, setMotherId] = useState(initialMotherId || (mothers[0]?.id || ''));
  const [type, setType] = useState('ANC_APPOINTMENT');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [dueTime, setDueTime] = useState('09:30');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motherId) {
      setError('Please select a mother');
      return;
    }
    if (!title.trim()) {
      setError('Please provide an appointment title');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const dueDateTime = `${dueDate}T${dueTime}:00.000Z`;
      await onSave({
        motherId,
        type,
        title: title.trim(),
        dueDateTime,
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-rose-600" />
            {t('modalNewReminderTitle') || 'Schedule Antenatal Reminder'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Select Mother */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Mother
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                value={motherId}
                onChange={(e) => setMotherId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                required
              >
                <option value="">-- Choose Mother --</option>
                {mothers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.phone}) - Wk {m.gestationalWeeks}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reminder Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="ANC_APPOINTMENT">ANC Appointment</option>
              <option value="FOLLOW_UP">Clinical Follow-up</option>
              <option value="SUPPLEMENT">Supplement Reminder (IFA / Calcium)</option>
              <option value="EMERGENCY_VISIT">Specialist / Hospital Referral</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title / Reason
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3rd Trimester Anomaly Scan & BP Check"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions / Notes for Mother
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please bring your Mother-Child Protection (MCP) card and report with empty stomach for fasting sugar test."
                rows="3"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancelBtn') || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (t('saveBtn') || 'Schedule Reminder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
