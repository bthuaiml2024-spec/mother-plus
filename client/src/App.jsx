import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { WhatsAppPage } from './pages/WhatsAppPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { MotherProfilePage } from './pages/MotherProfilePage.jsx';
import { AlertsPage } from './pages/AlertsPage.jsx';
import { RemindersPage } from './pages/RemindersPage.jsx';
import { HealthTipsPage } from './pages/HealthTipsPage.jsx';
import { api } from './services/api.js';

function MainApp() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });
  const [selectedMotherId, setSelectedMotherId] = useState('m-red-103');
  const [pendingAlertCount, setPendingAlertCount] = useState(0);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (path.startsWith('/mothers/')) {
      const id = path.split('/')[2];
      setSelectedMotherId(id);
    }
    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo(0, 0);
  };

  // Poll for active RED alerts to keep navbar badge live
  const checkAlertsCount = async () => {
    try {
      const res = await api.getAlerts({ status: 'PENDING_REVIEW', riskLevel: 'RED' });
      if (res.data) {
        setPendingAlertCount(res.data.length);
      }
    } catch (err) {
      // silent background check
    }
  };

  useEffect(() => {
    checkAlertsCount();
    const interval = setInterval(checkAlertsCount, 10000);
    return () => clearInterval(interval);
  }, [currentPath]);

  const renderPage = () => {
    if (currentPath === '/whatsapp') {
      return <WhatsAppPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard') {
      return <DashboardPage onNavigate={navigate} onSelectMother={(id) => setSelectedMotherId(id)} />;
    }
    if (currentPath === '/alerts') {
      return <AlertsPage onNavigate={navigate} onSelectMother={(id) => setSelectedMotherId(id)} />;
    }
    if (currentPath === '/reminders') {
      return <RemindersPage onNavigate={navigate} onSelectMother={(id) => setSelectedMotherId(id)} />;
    }
    if (currentPath === '/tips') {
      return <HealthTipsPage />;
    }
    if (currentPath.startsWith('/mothers/')) {
      const motherId = currentPath.split('/')[2] || selectedMotherId;
      return <MotherProfilePage motherId={motherId} onNavigate={navigate} />;
    }
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        alertCount={pendingAlertCount}
        onDataReset={() => {
          checkAlertsCount();
          navigate('/dashboard');
        }}
      />
      <main className="flex-1">{renderPage()}</main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
