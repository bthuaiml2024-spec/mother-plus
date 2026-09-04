import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  ClockAlert,
  Search,
  Filter,
  PlusCircle,
  Smartphone,
  ChevronRight,
  Send,
  Eye,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { QuickStatsCard } from '../components/QuickStatsCard.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { ReminderModal } from '../components/ReminderModal.jsx';

export function DashboardPage({ onNavigate, onSelectMother }) {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [mothers, setMothers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedMotherForReminder, setSelectedMotherForReminder] = useState(null);
  const [reminderToast, setReminderToast] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, mothersRes, alertsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getMothers(),
        api.getAlerts()
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (mothersRes.data) setMothers(mothersRes.data);
      if (alertsRes.data) setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInstantReminder = async (mother) => {
    try {
      // Find upcoming reminder or create quick simulation
      const res = await api.getReminders({ motherId: mother.id, status: 'UPCOMING' });
      let reminderId;
      if (res.data && res.data.length > 0) {
        reminderId = res.data[0].id;
      } else {
        // Create an ad-hoc reminder
        const newRem = await api.createReminder({
          motherId: mother.id,
          type: 'ANC_APPOINTMENT',
          title: `Routine Antenatal Follow-up (Wk ${mother.gestationalWeeks})`,
          dueDateTime: new Date(Date.now() + 86400000).toISOString(),
          notes: 'Routine blood pressure and fetal growth checkup.'
        });
        reminderId = newRem.data.id;
      }

      const dispatchRes = await api.sendTestReminder(reminderId);
      setReminderToast({
        title: `Reminder Sent to ${mother.name}!`,
        body: dispatchRes.data?.sentMessageText || 'WhatsApp notification dispatched via simulation engine.'
      });
      setTimeout(() => setReminderToast(null), 5000);
      loadDashboardData();
    } catch (err) {
      alert('Failed to send reminder: ' + err.message);
    }
  };

  const handleCreateReminder = async (reminderData) => {
    await api.createReminder(reminderData);
    loadDashboardData();
  };

  // Filtered mothers list
  const filteredMothers = mothers.filter((m) => {
    const matchesRisk = selectedRiskFilter === 'ALL' || m.riskLevel === selectedRiskFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.healthcareFacility.toLowerCase().includes(q) ||
      (m.healthcareWorker && m.healthcareWorker.toLowerCase().includes(q));
    return matchesRisk && matchesSearch;
  });

  const pendingRedAlerts = alerts.filter((a) => a.riskLevel === 'RED' && a.status === 'PENDING_REVIEW');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Maternal Care Continuity Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {currentUser.facility}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active Officer: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.designation})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedMotherForReminder(null);
                setIsReminderModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Schedule Reminder</span>
            </button>

            <button
              onClick={() => onNavigate('/whatsapp')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Smartphone className="h-4 w-4" />
              <span>Simulate WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Urgent Emergency Alert Banner (High Priority) */}
        {pendingRedAlerts.length > 0 && (
          <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-rose-500 urgent-alert-pulse">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
                <AlertOctagon className="h-7 w-7 text-white animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-md">
                  Action Required
                </span>
                <h3 className="text-lg font-black tracking-tight mt-1">
                  {pendingRedAlerts.length} Urgent Danger Sign Alert(s) Detected!
                </h3>
                <p className="text-xs text-rose-100">
                  Critical symptoms reported by pregnant mother(s). Immediate clinical assessment recommended.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/alerts')}
              className="px-5 py-2.5 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-black shadow-md transition-transform active:scale-95 whitespace-nowrap"
            >
              Review Urgent Alerts Now →
            </button>
          </div>
        )}

        {/* Toast Notification when reminder dispatched */}
        {reminderToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
            <div>
              <h4 className="font-bold text-xs">{reminderToast.title}</h4>
              <p className="text-[11px] text-emerald-100 whitespace-pre-line">{reminderToast.body}</p>
            </div>
            <button
              onClick={() => setReminderToast(null)}
              className="text-xs text-emerald-200 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 6 Key Stat Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickStatsCard
            title={t('statTotalMothers')}
            count={stats?.totalMothers ?? mothers.length}
            subtitle="Registered in PHC"
            icon={Users}
            colorScheme="blue"
            onClick={() => setSelectedRiskFilter('ALL')}
            active={selectedRiskFilter === 'ALL'}
          />
          <QuickStatsCard
            title={t('statHealthyGreen')}
            count={stats?.greenMothers ?? 0}
            subtitle="Routine antenatal care"
            icon={ShieldCheck}
            colorScheme="emerald"
            onClick={() => setSelectedRiskFilter('GREEN')}
            active={selectedRiskFilter === 'GREEN'}
          />
          <QuickStatsCard
            title={t('statFollowUpYellow')}
            count={stats?.yellowMothers ?? 0}
            subtitle="Minor discomforts"
            icon={AlertTriangle}
            colorScheme="amber"
            onClick={() => setSelectedRiskFilter('YELLOW')}
            active={selectedRiskFilter === 'YELLOW'}
          />
          <QuickStatsCard
            title={t('statUrgentRed')}
            count={stats?.redMothers ?? 0}
            subtitle="Danger signs flagged"
            icon={AlertOctagon}
            colorScheme="rose"
            onClick={() => setSelectedRiskFilter('RED')}
            active={selectedRiskFilter === 'RED'}
          />
          <QuickStatsCard
            title={t('statUpcomingAppts')}
            count={stats?.upcomingAppointments ?? 0}
            subtitle="Scheduled visits"
            icon={Calendar}
            colorScheme="purple"
            onClick={() => onNavigate('/reminders')}
          />
          <QuickStatsCard
            title={t('statMissedFollowups')}
            count={stats?.missedAppointments ?? 0}
            subtitle="Require ASHA visit"
            icon={ClockAlert}
            colorScheme="amber"
            onClick={() => onNavigate('/reminders')}
          />
        </div>

        {/* Search, Filter & Mothers Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Mothers Continuity Directory
              </h2>
              <p className="text-xs text-slate-500">
                Monitor gestational progress, reported risk levels, and scheduled follow-ups.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchMothersPlaceholder') || 'Search name, phone, or worker...'}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
                />
              </div>

              {/* Risk Filter Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                {['ALL', 'GREEN', 'YELLOW', 'RED'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedRiskFilter(tier)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedRiskFilter === tier
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-6">{t('thName') || 'Mother Details'}</th>
                  <th className="py-3 px-6">{t('thWeek') || 'Pregnancy Week'}</th>
                  <th className="py-3 px-6">{t('thEdd') || 'Due Date'}</th>
                  <th className="py-3 px-6">{t('thFacility') || 'Assigned Center & ANM'}</th>
                  <th className="py-3 px-6">{t('thRisk') || 'Risk Level'}</th>
                  <th className="py-3 px-6 text-right">{t('thActions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredMothers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No maternal records found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredMothers.map((mother) => (
                    <tr key={mother.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{mother.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{mother.phone}</span>
                          <span>•</span>
                          <span>Age {mother.age}</span>
                          <span>•</span>
                          <span className="uppercase font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                            {mother.preferredLanguage}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">
                          Week {mother.gestationalWeeks}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Trimester {mother.trimester}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">
                          {new Date(mother.eddDate).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          LMP: {mother.lmpDate}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800">
                          {mother.healthcareFacility}
                        </div>
                        <div className="text-[11px] text-blue-600 font-semibold">
                          {mother.healthcareWorker}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <RiskBadge level={mother.riskLevel} />
                      </td>

                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (onSelectMother) onSelectMother(mother.id);
                            onNavigate(`/mothers/${mother.id}`);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          <span>Profile</span>
                        </button>

                        <button
                          onClick={() => handleSendInstantReminder(mother)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs shadow-xs"
                          title="Simulate sending scheduled WhatsApp reminder"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Remind</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reminder Scheduling Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleCreateReminder}
        mothers={mothers}
        initialMotherId={selectedMotherForReminder?.id}
      />
    </div>
  );
}
