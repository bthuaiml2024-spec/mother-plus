/**
 * Frontend API Service for MOTHER+ REST Endpoints
 */

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || `HTTP error ${res.status}`);
    }
    return json;
  } catch (err) {
    console.error(`API Request failed [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),
  resetDemoData: () => request('/dashboard/reset-demo', { method: 'POST' }),

  // Mothers
  getMothers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/mothers${query ? `?${query}` : ''}`);
  },
  getMotherById: (id) => request(`/mothers/${id}`),
  registerMother: (data) => request('/mothers', { method: 'POST', body: JSON.stringify(data) }),
  updateMother: (id, data) => request(`/mothers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Health Checks & Triage
  getSymptomsTaxonomy: () => request('/health-check/meta/symptoms'),
  submitHealthCheck: (data) => request('/health-check', { method: 'POST', body: JSON.stringify(data) }),
  getMotherHealthChecks: (motherId) => request(`/health-check/${motherId}`),

  // Reminders
  getReminders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reminders${query ? `?${query}` : ''}`);
  },
  createReminder: (data) => request('/reminders', { method: 'POST', body: JSON.stringify(data) }),
  updateReminder: (id, data) => request(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  sendTestReminder: (id) => request(`/reminders/${id}/send-test`, { method: 'POST' }),

  // Alerts
  getAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/alerts${query ? `?${query}` : ''}`);
  },
  updateAlertStatus: (id, status) => request(`/alerts/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  addAlertNote: (id, noteData) => request(`/alerts/${id}/notes`, { method: 'POST', body: JSON.stringify(noteData) }),

  // Tips
  getTips: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tips${query ? `?${query}` : ''}`);
  },

  // Auth / Users
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getDemoUsers: () => request('/auth/users'),

  // WhatsApp Webhook Simulator
  sendSimulatedWhatsAppMessage: (payload) => request('/whatsapp/webhook', { method: 'POST', body: JSON.stringify(payload) })
};
