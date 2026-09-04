import React from 'react';

export function QuickStatsCard({
  title,
  count,
  subtitle,
  icon: Icon,
  colorScheme = 'blue',
  onClick,
  active = false
}) {
  const schemes = {
    blue: {
      bg: 'bg-blue-50/70 hover:bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-700',
      borderActive: 'ring-2 ring-blue-500'
    },
    emerald: {
      bg: 'bg-emerald-50/70 hover:bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      borderActive: 'ring-2 ring-emerald-500'
    },
    amber: {
      bg: 'bg-amber-50/70 hover:bg-amber-50 text-amber-900 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      borderActive: 'ring-2 ring-amber-500'
    },
    rose: {
      bg: 'bg-rose-50/70 hover:bg-rose-50 text-rose-900 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-700',
      borderActive: 'ring-2 ring-rose-500'
    },
    purple: {
      bg: 'bg-purple-50/70 hover:bg-purple-50 text-purple-900 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-700',
      borderActive: 'ring-2 ring-purple-500'
    }
  };

  const scheme = schemes[colorScheme] || schemes.blue;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${scheme.bg} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${active ? scheme.borderActive : 'shadow-xs'}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {count ?? 0}
        </span>
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
