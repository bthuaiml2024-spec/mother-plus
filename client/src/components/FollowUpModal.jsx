import React, { useState } from 'react';
import { X, MessageSquarePlus, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function FollowUpModal({ isOpen, onClose, onSave, alert = null, mother = null }) {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [noteText, setNoteText] = useState('');
  const [author, setAuthor] = useState(currentUser?.name || 'Sister Lakshmi (ANM)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const titleTarget = alert ? `Alert #${alert.id} (${alert.motherName})` : mother ? mother.name : 'Patient';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setError('Please write clinical follow-up details');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        author,
        text: noteText.trim()
      });
      setNoteText('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save follow-up note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-blue-600" />
            {t('modalAddNoteTitle') || 'Add Clinical Follow-up Note'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Recording clinical observation / home-visit / telephone check-in for <strong>{titleTarget}</strong>.
        </p>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Healthcare Worker Name / Role
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Observations & Action Taken
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Visited mother at home. Blood pressure recorded at 138/88 mmHg. Advised bed rest and scheduled urine albumin screening at PHC tomorrow morning."
              rows="4"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (t('saveBtn') || 'Save Note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
