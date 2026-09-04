import React from 'react';
import {
  Smartphone,
  LayoutDashboard,
  ShieldCheck,
  HeartHandshake,
  Languages,
  CalendarCheck,
  BellRing,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram.jsx';

export function LandingPage({ onNavigate }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-slate-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6 border border-rose-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart India Hackathon (SIH) Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            MOTHER+ <span className="text-rose-600">🌸</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mt-3">
              {t('heroTitle') || 'Maternal Health Support, Anytime.'}
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            {t('heroSubtitle') || 'Multilingual digital support for reminders, health check-ins, and early warning alerts.'}
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/whatsapp')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
            >
              <Smartphone className="h-4 w-4" />
              <span>{t('tryDemoBtn') || 'Try WhatsApp Simulator'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('/dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t('dashboardBtn') || 'Healthcare Dashboard'}</span>
            </button>
          </div>

          {/* Value props badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <Languages className="h-4 w-4 text-rose-600" />
              English & தமிழ் (Tamil)
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Rule-Based Safety Screening
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <BellRing className="h-4 w-4 text-amber-600" />
              Automated Reminders
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <Users className="h-4 w-4 text-blue-600" />
              ASHA / ANM Escalation
            </span>
          </div>
        </div>
      </section>

      {/* Safety Notice Callout */}
      <section className="max-w-5xl mx-auto px-4 -mt-6 relative z-20 w-full">
        <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm flex items-start gap-3.5">
          <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block text-sm text-amber-950 mb-0.5">
              {t('safetyNoticeTitle') || 'Clinical Safety & Triage Notice'}
            </span>
            {t('safetyNoticeText') || 'MOTHER+ is NOT an AI doctor. It does not diagnose diseases or prescribe medications. It uses a deterministic clinical rule engine to identify pregnancy danger signs, advise immediate emergency care, and alert designated healthcare workers.'}
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Pipeline) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Workflow Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Continuous Care Between Health Center Visits
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Empowering rural and underserved mothers through familiar messaging and immediate risk triaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Simple Registration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mother registers via WhatsApp in Tamil or English. Gestational week and EDD are automatically calculated from LMP date.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Daily Health Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A quick 4-option check-in ("Feeling well", "Discomfort", "Concerning", "Emergency") monitors ongoing maternal wellbeing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Rule-Based Triaging</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our clinical screening engine screens for danger signs (pre-eclampsia, bleeding, distress) and assigns GREEN, YELLOW, or RED.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Escalation & Care</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              RED danger signs trigger immediate emergency hospital instructions and notify the ASHA/ANM dashboard for rapid clinical intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Visual System Architecture Diagram */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <ArchitectureDiagram />
      </section>

      {/* Target Audiences: For Mothers vs For Healthcare Workers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Mothers */}
          <div className="bg-gradient-to-br from-rose-50/70 to-pink-50/70 rounded-3xl p-6 sm:p-8 border border-rose-100">
            <div className="h-12 w-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">For Expecting Mothers</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              No complex apps to install. Accessible through standard WhatsApp in local language.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Automated ANC checkup and iron tablet reminders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Trimester-tailored nutrition and hydration advice</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Tamil & English support for zero language barrier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Immediate emergency guidance when danger signs occur</span>
              </li>
            </ul>
            <div className="mt-6">
              <button
                onClick={() => onNavigate('/whatsapp')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Launch WhatsApp Simulator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* For Healthcare Workers */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 rounded-3xl p-6 sm:p-8 border border-blue-100">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">For ASHA, ANMs & Medical Officers</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              A clear digital dashboard to prioritize at-risk mothers and follow-up on missed appointments.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Real-time urgent alert queue for RED danger symptoms</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Track gestational week, EDD, and missed follow-ups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Log clinical follow-up observations and referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Schedule ANC visit reminders sent straight to maternal phones</span>
              </li>
            </ul>
            <div className="mt-6">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Healthcare Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">
            MOTHER+ 🌸 – Multilingual WhatsApp-Based Maternal Health Continuity & Early-Warning System
          </p>
          <p>
            Smart India Hackathon (SIH) Prototype • Built with React, Vite, Node.js, Express, and node-cron.
          </p>
          <p className="text-[11px] text-slate-400">
            Safety Disclaimer: This platform provides screening heuristics, not clinical diagnoses. Validated by healthcare protocols before community deployment.
          </p>
        </div>
      </footer>
    </div>
  );
}
