import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  User,
  Heart,
  ShieldAlert,
  Send,
  PlusCircle,
  FileText,
  CheckCircle2,
  AlertOctagon,
  ClockAlert,
  Activity,
  MessageSquarePlus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { ReminderModal } from '../components/ReminderModal.jsx';
import { FollowUpModal } from '../components/FollowUpModal.jsx';

export function MotherProfilePage({ motherId, onNavigate }) {
  const { t, language } = useLanguage();
  const [motherData, setMotherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (motherId) loadMotherProfile();
  }, [motherId]);

  const loadMotherProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getMotherById(motherId);
      if (res.data) {
        setMotherData(res.data);
      }
    } catch (err) {
      console.error('Failed to load mother profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminderTest = async (reminderId) => {
    try {
      const res = await api.sendTestReminder(reminderId);
      setToastMsg(`Test reminder sent: "${res.data?.sentMessageText?.substring(0, 50)}..."`);
      setTimeout(() => setToastMsg(null), 4000);
      loadMotherProfile();
    } catch (err) {
      alert('Failed to send reminder: ' + err.message);
    }
  };

  const handleSaveFollowUpNote = async (noteData) => {
    // If mother has active alerts, add to first active alert, else log as note
    if (motherData.alerts && motherData.alerts.length > 0) {
      const targetAlert = motherData.alerts[0];
      await api.addAlertNote(targetAlert.id, noteData);
    }
    loadMotherProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading maternal health continuity record...
      </div>
    );
  }

  if (!motherData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-600 font-bold mb-4">Mother profile not found.</p>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const gestationalWeeks = motherData.gestationalWeeks || 20;
  const progressPercent = Math.min(100, Math.round((gestationalWeeks / 40) * 100));

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation back and header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>Add Follow-up Note</span>
            </button>

            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Schedule ANC Visit</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md">
            {toastMsg}
          </div>
        )}

        {/* Top Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-rose-100 text-rose-700 font-black text-2xl flex items-center justify-center shadow-xs">
                🌸
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900">{motherData.name}</h1>
                  <RiskBadge level={motherData.riskLevel} size="md" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{motherData.phone}</span>
                  <span>•</span>
                  <span>Age {motherData.age}</span>
                  <span>•</span>
                  <span>Blood Group: <strong>{motherData.bloodGroup || 'B+'}</strong></span>
                  <span>•</span>
                  <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded uppercase">
                    Language: {motherData.preferredLanguage}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Gestational Age
                </div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  Week {gestationalWeeks}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Trimester {motherData.trimester}
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Due Date
                </div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {new Date(motherData.eddDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  LMP: {motherData.lmpDate}
                </div>
              </div>
            </div>
          </div>

          {/* Gestational Age Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span>Pregnancy Progress (Week {gestationalWeeks} of 40)</span>
              <span className="text-rose-600 font-black">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>Trimester 1 (Wks 1-12)</span>
              <span>Trimester 2 (Wks 13-27)</span>
              <span>Trimester 3 (Wks 28-40)</span>
            </div>
          </div>

          {/* Clinical metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Healthcare Facility:</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{motherData.healthcareFacility}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Assigned ANM / ASHA:</span>
              <span className="font-bold text-blue-700 mt-0.5 block">{motherData.healthcareWorker}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Emergency Contact:</span>
              <span className="font-bold text-rose-700 mt-0.5 block">{motherData.emergencyContact || 'Not recorded'}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Left (Appointments & Reminders), Right (Health Checks & Danger Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Antenatal Reminders & Appointments */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rose-600" />
                  Antenatal Reminders & Visits
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {motherData.reminders?.length || 0} Scheduled
                </span>
              </div>

              <div className="space-y-3">
                {(!motherData.reminders || motherData.reminders.length === 0) ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No appointments or reminders recorded.
                  </p>
                ) : (
                  motherData.reminders.map((rem) => {
                    const isUpcoming = rem.status === 'UPCOMING';
                    const isMissed = rem.status === 'MISSED';
                    return (
                      <div
                        key={rem.id}
                        className={`p-4 rounded-2xl border text-xs transition-all ${
                          isMissed
                            ? 'bg-amber-50/70 border-amber-200'
                            : isUpcoming
                            ? 'bg-blue-50/50 border-blue-200'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{rem.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(rem.dueDateTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {rem.notes && (
                              <p className="mt-2 text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-slate-100">
                                {rem.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isMissed
                                  ? 'bg-amber-200 text-amber-900'
                                  : isUpcoming
                                  ? 'bg-blue-200 text-blue-900'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {rem.status}
                            </span>
                            <button
                              onClick={() => handleSendReminderTest(rem.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] inline-flex items-center gap-1 shadow-xs"
                              title="Simulate dispatching this reminder to mother's WhatsApp"
                            >
                              <Send className="h-2.5 w-2.5" />
                              <span>Send Test</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Daily Health Checks & Triage Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                Recent Health Check-in Logs
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {motherData.healthChecks?.length || 0} Submissions
              </span>
            </div>

            <div className="space-y-3">
              {(!motherData.healthChecks || motherData.healthChecks.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No health check submissions yet.
                </p>
              ) : (
                motherData.healthChecks.map((hc) => (
                  <div
                    key={hc.id}
                    className={`p-4 rounded-2xl border text-xs ${
                      hc.level === 'RED'
                        ? 'bg-rose-50 border-rose-200'
                        : hc.level === 'YELLOW'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-emerald-50/50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={hc.level} size="sm" />
                        <span className="font-bold text-slate-800">
                          {hc.feelingGeneral === 'well'
                            ? 'Feeling Well'
                            : hc.feelingGeneral === 'emergency'
                            ? 'EMERGENCY'
                            : 'Discomfort / Symptoms Reported'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(hc.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                      {hc.message}
                    </p>

                    {hc.symptoms && hc.symptoms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {hc.symptoms.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-white/90 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Urgent Alerts and Healthcare Worker Notes Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            Urgent Alerts & Clinical Action History
          </h3>

          {(!motherData.alerts || motherData.alerts.length === 0) ? (
            <p className="text-xs text-slate-400 py-4">No active or historical clinical alerts.</p>
          ) : (
            <div className="space-y-4">
              {motherData.alerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <RiskBadge level={alert.riskLevel} size="sm" />
                      <span className="font-bold text-slate-900">Alert #{alert.id}</span>
                      <span className="text-slate-400">• {new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                    <span className="font-bold text-[11px] uppercase tracking-wider text-rose-600">
                      {alert.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-slate-700">
                      <strong>Reported Symptoms:</strong> {alert.reportedSymptoms?.join(', ')}
                    </div>
                    <div className="text-slate-700">
                      <strong>Action Directive:</strong> {alert.recommendedAction}
                    </div>
                  </div>

                  {/* Notes Timeline */}
                  {alert.notes && alert.notes.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                      <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                        Healthcare Worker Clinical Notes:
                      </span>
                      {alert.notes.map((note) => (
                        <div key={note.id} className="bg-white p-3 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-bold text-blue-700">{note.author}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-800 text-xs">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={async (remData) => {
          await api.createReminder(remData);
          loadMotherProfile();
        }}
        mothers={[motherData]}
        initialMotherId={motherData.id}
      />

      <FollowUpModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveFollowUpNote}
        mother={motherData}
        alert={motherData.alerts?.[0]}
      />
    </div>
  );
}
