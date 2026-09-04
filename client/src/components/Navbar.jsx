import React, { useState } from 'react';
import {
  Heart,
  Smartphone,
  LayoutDashboard,
  BellRing,
  Calendar,
  BookOpen,
  RotateCcw,
  Globe,
  User,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export function Navbar({ currentPath, onNavigate, alertCount = 0, onDataReset }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    if (window.confirm('Reset demo data to initial pristine state?')) {
      try {
        setIsResetting(true);
        await api.resetDemoData();
        if (onDataReset) onDataReset();
        alert('Demo data successfully reset!');
      } catch (err) {
        alert('Failed to reset demo data: ' + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const navItems = [
    { path: '/', label: t('navHome') || 'Home', icon: Heart },
    { path: '/whatsapp', label: t('navWhatsApp') || 'WhatsApp Bot', icon: Smartphone, highlight: true },
    { path: '/dashboard', label: t('navDashboard') || 'Dashboard', icon: LayoutDashboard },
    {
      path: '/alerts',
      label: t('navAlerts') || 'Urgent Alerts',
      icon: BellRing,
      badge: alertCount > 0 ? alertCount : null
    },
    { path: '/reminders', label: t('navReminders') || 'Reminders', icon: Calendar },
    { path: '/tips', label: t('navTips') || 'Health Tips', icon: BookOpen }
  ];

  const handleNavClick = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner for Demo Status and Safety Notice */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-rose-500/40 text-rose-100 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-rose-400/30">
              SIH Prototype
            </span>
            <span>MOTHER+ Multilingual Maternal Continuity & Early-Warning System</span>
            <span className="hidden md:inline text-rose-200">• NOT an AI doctor (Rule-based screening)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              disabled={isResetting}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors"
              title="Reset all sample mothers and alerts to pristine demo state"
            >
              <RotateCcw className={`h-3 w-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{t('resetDemoBtn') || 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">MOTHER+</span>
                <span className="text-xs bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">SIH</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-none">
                {t('tagline') || 'Supporting every mother, every step.'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 shadow-xs'
                      : item.highlight
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Language Switch & Role Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors"
              title="Switch language between English and Tamil"
            >
              <Globe className="h-3.5 w-3.5 text-rose-600" />
              <span>{language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => switchRole('Healthcare Worker')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentUser.role === 'Healthcare Worker'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ANM / ASHA
              </button>
              <button
                onClick={() => switchRole('Admin')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentUser.role === 'Admin'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Active Role:</span>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => switchRole('Healthcare Worker')}
                className={`px-2 py-1 rounded ${currentUser.role === 'Healthcare Worker' ? 'bg-rose-600 text-white' : 'bg-slate-100'}`}
              >
                ANM / ASHA
              </button>
              <button
                onClick={() => switchRole('Admin')}
                className={`px-2 py-1 rounded ${currentUser.role === 'Admin' ? 'bg-rose-600 text-white' : 'bg-slate-100'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
