import React from 'react';
import { Smartphone, ShieldAlert, Cpu, CalendarClock, LayoutDashboard, Database, ArrowRight } from 'lucide-react';

export function ArchitectureDiagram() {
  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          System Architecture & Data Flow
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
          How MOTHER+ Protects Maternal Health
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Zero-barrier WhatsApp communication combined with deterministic clinical safety rules and rapid healthcare-worker escalation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Step 1: Mother Channel */}
        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-base">Maternal Channel</h4>
                <p className="text-xs text-emerald-700">WhatsApp & Web Simulator</p>
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Bilingual conversational intake (English & Tamil)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Automated pregnancy week & EDD tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Daily 4-point health check-in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Trimester nutrition & hygiene tips</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
            <span>Meta Cloud API Ready</span>
            <ArrowRight className="h-4 w-4 hidden md:block text-emerald-600" />
          </div>
        </div>

        {/* Step 2: Intelligent Rules Engine & Cron */}
        <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-rose-950 text-base">Health Rules Engine</h4>
                <p className="text-xs text-rose-700">Deterministic Safety Triage</p>
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span><strong>No AI hallucination</strong> – rule-based screening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>Flags danger signs (severe headache, bleeding, vision loss)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>Categorizes into <strong>GREEN, YELLOW, RED</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span><CalendarClock className="inline h-3.5 w-3.5 text-rose-500 mr-1" /> Node-cron scheduled reminder engine</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800 font-medium">
            <span>Instant Triaging</span>
            <ArrowRight className="h-4 w-4 hidden md:block text-rose-600" />
          </div>
        </div>

        {/* Step 3: Healthcare Worker Dashboard */}
        <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-base">Healthcare Dashboard</h4>
                <p className="text-xs text-blue-700">ASHA, ANM & Medical Officers</p>
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><ShieldAlert className="inline h-3.5 w-3.5 text-rose-600 mr-1" /> Real-time <strong>Urgent RED Alerts</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Track gestational week & missed ANC visits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>1-Click Acknowledge & Clinical Follow-up Notes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Send proactive test reminders via WhatsApp</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800 font-medium">
            <span><Database className="inline h-3.5 w-3.5 text-blue-500 mr-1" /> Mongo-Ready Storage</span>
            <span className="font-bold">Continuity of Care</span>
          </div>
        </div>
      </div>
    </div>
  );
}
