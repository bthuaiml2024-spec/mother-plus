import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const DEMO_PROFILES = {
  WORKER: {
    id: 'u-worker-1',
    name: 'Sister Lakshmi',
    role: 'Healthcare Worker',
    designation: 'Auxiliary Nurse Midwife (ANM)',
    facility: 'Vallam PHC, Chengalpattu'
  },
  ADMIN: {
    id: 'u-admin-1',
    name: 'Dr. Rajesh Kumar',
    role: 'Admin',
    designation: 'District RCHO Officer',
    facility: 'District Health Administration'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEMO_PROFILES.WORKER);

  const switchRole = (roleType) => {
    if (roleType === 'Admin') {
      setCurrentUser(DEMO_PROFILES.ADMIN);
    } else {
      setCurrentUser(DEMO_PROFILES.WORKER);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, isWorker: currentUser.role === 'Healthcare Worker' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
