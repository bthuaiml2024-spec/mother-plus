import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export function RiskBadge({ level = 'GREEN', size = 'md', showDescription = false }) {
  const { t } = useLanguage();

  const configs = {
    GREEN: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: ShieldCheck,
      label: t('riskGreen') || 'GREEN - ROUTINE',
      desc: 'Routine care; no danger signs detected'
    },
    YELLOW: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      label: t('riskYellow') || 'YELLOW - FOLLOW-UP',
      desc: 'Mild symptoms; clinic visit within 24-48h recommended'
    },
    RED: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 urgent-alert-pulse',
      dot: 'bg-rose-600',
      icon: AlertOctagon,
      label: t('riskRed') || 'RED - URGENT DANGER',
      desc: 'Danger signs identified; immediate emergency referral required'
    }
  };

  const config = configs[level] || configs.GREEN;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}>
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <Icon className="h-3.5 w-3.5" />
        <span>{config.label}</span>
      </span>
      {showDescription && (
        <span className="text-[11px] text-slate-500 italic pl-1">{config.desc}</span>
      )}
    </div>
  );
}
