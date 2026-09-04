import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  Clock,
  CheckCircle2,
  MessageSquarePlus,
  Phone,
  Eye,
  RotateCcw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { FollowUpModal } from '../components/FollowUpModal.jsx';

export function AlertsPage({ onNavigate, onSelectMother }) {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAlertForNote, setSelectedAlertForNote] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.getAlerts({ status: statusFilter });
      if (res.data) setAlerts(res.data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      await api.updateAlertStatus(alertId, newStatus);
      setToast(`Alert #${alertId} updated to ${newStatus}`);
      setTimeout(() => setToast(null), 3000);
      loadAlerts();
    } catch (err) {
      alert('Failed to update alert: ' + err.message);
    }
  };

  const handleSaveNote = async (noteData) => {
    if (!selectedAlertForNote) return;
    await api.addAlertNote(selectedAlertForNote.id, noteData);
    loadAlerts();
  };

  const pendingCount = alerts.filter(a => a.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Emergency Escalation & Urgent Alerts Queue
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time clinical danger signs flagged by the MOTHER+ Screening Engine.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'PENDING_REVIEW', 'ACKNOWLEDGED', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {status === 'ALL' ? 'All Alerts' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md">
            {toast}
          </div>
        )}

        {/* Safety Disclaimer */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Clinical Triage Safety Protocol:</span>
            Alerts do NOT represent final clinical diagnoses. Healthcare workers must make immediate contact, arrange hospital transport if red danger signs are present, and verify patient vital signs in person.
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading emergency escalation queue...
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Active Emergency Alerts</h3>
              <p className="text-xs text-slate-500 mt-1">
                All registered mothers in this filter category have routine status.
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isPending = alert.status === 'PENDING_REVIEW';
              const isRed = alert.riskLevel === 'RED';
              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-3xl p-6 border shadow-xs transition-all ${
                    isPending && isRed
                      ? 'border-rose-300 ring-2 ring-rose-500/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <RiskBadge level={alert.riskLevel} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-slate-900">{alert.motherName}</h3>
                          <span className="text-xs text-slate-500">• Wk {alert.gestationalWeeks}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{alert.phone}</span>
                          <span>•</span>
                          <span>Assigned: {alert.assignedWorker}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(alert.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                          alert.status === 'PENDING_REVIEW'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : alert.status === 'ACKNOWLEDGED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="py-4 space-y-3 text-xs">
                    <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
                      <span className="font-bold text-rose-900 block text-[11px] uppercase tracking-wider mb-1">
                        Reported Danger Signs:
                      </span>
                      <p className="font-semibold text-rose-800">
                        {alert.reportedSymptoms?.join(', ') || 'Emergency check-in reported'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-500 block text-[11px] uppercase tracking-wider mb-1">
                        System Recommended Action:
                      </span>
                      <p className="font-bold text-slate-900">
                        {alert.recommendedAction}
                      </p>
                    </div>

                    {/* Historical Notes */}
                    {alert.notes && alert.notes.length > 0 && (
                      <div className="pt-2">
                        <span className="font-bold text-slate-700 text-xs block mb-2">
                          Clinical Follow-up Notes:
                        </span>
                        <div className="space-y-2">
                          {alert.notes.map((note) => (
                            <div key={note.id} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                              <div className="flex items-center justify-between text-[11px] text-blue-900 font-bold mb-0.5">
                                <span>{note.author}</span>
                                <span className="text-[10px] text-blue-600 font-normal">
                                  {new Date(note.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-slate-700">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onSelectMother) onSelectMother(alert.motherId);
                          onNavigate(`/mothers/${alert.motherId}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Maternal Record</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAlertForNote(alert);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors border border-blue-200"
                      >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        <span>Add Clinical Note</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {alert.status === 'PENDING_REVIEW' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          Acknowledge Alert
                        </button>
                      )}

                      {alert.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Follow Up Note Modal */}
      <FollowUpModal
        isOpen={Boolean(selectedAlertForNote)}
        onClose={() => setSelectedAlertForNote(null)}
        onSave={handleSaveNote}
        alert={selectedAlertForNote}
      />
    </div>
  );
}
