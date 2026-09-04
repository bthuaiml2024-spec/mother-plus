import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Apple,
  Droplets,
  Moon,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Languages,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';

export function HealthTipsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [tips, setTips] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [trimesterFilter, setTrimesterFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTips();
  }, [categoryFilter, trimesterFilter]);

  const loadTips = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (trimesterFilter !== 'all') params.trimester = trimesterFilter;

      const res = await api.getTips(params);
      if (res.data) setTips(res.data);
    } catch (err) {
      console.error('Failed to load tips:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', labelEn: 'All Tips', labelTa: 'அனைத்து குறிப்புகள்' },
    { id: 'nutrition', labelEn: 'Nutrition', labelTa: 'ஊட்டச்சத்து', icon: Apple },
    { id: 'hydration', labelEn: 'Hydration', labelTa: 'நீர்ச்சத்து', icon: Droplets },
    { id: 'rest', labelEn: 'Rest & Sleep', labelTa: 'ஓய்வு', icon: Moon },
    { id: 'warning_signs', labelEn: 'Warning Signs', labelTa: 'ஆபத்து அறிகுறிகள்', icon: AlertTriangle },
    { id: 'birth_prep', labelEn: 'Birth Prep', labelTa: 'பிரசவ தயார்நிலை', icon: HeartHandshake },
    { id: 'wellbeing', labelEn: 'Mental Wellbeing', labelTa: 'மன நலம்', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t('tipsPageTitle') || 'Maternal Nutrition & Health Guidance'}
                </h1>
                <p className="text-xs text-slate-500">
                  {t('tipsPageSubtitle') || 'Evidence-based community guidance for mothers across all trimesters.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors shadow-xs"
            >
              <Languages className="h-4 w-4" />
              <span>Language: {language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
            </button>
          </div>
        </div>

        {/* Safety Callout */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>
            These guidelines align with National Health Mission (NHM) maternal health education protocols. Always follow advice prescribed in-person by your designated ANM or Medical Officer.
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Loading health guidance...
            </div>
          ) : tips.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No guidance available for this filter.
            </div>
          ) : (
            tips.map((tip) => {
              const isWarning = tip.category === 'warning_signs';
              return (
                <div
                  key={tip.id}
                  className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                    isWarning ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isWarning
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {tip.tag}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {tip.trimester === 'all' ? 'All Trimesters' : tip.trimester.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {language === 'ta' ? tip.titleTa : tip.titleEn}
                    </h3>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                      {language === 'ta' ? tip.contentTa : tip.contentEn}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="h-3 w-3 text-rose-500" />
                      Community Advice
                    </span>
                    <span className="text-rose-600 font-bold">MOTHER+ 🌸</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
