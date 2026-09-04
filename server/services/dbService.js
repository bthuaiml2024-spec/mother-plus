import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDemoData } from '../data/initialSeed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json');

/**
 * Robust JSON file-backed in-memory database abstraction layer.
 * Mirrors MongoDB/Mongoose collection methods so that switching to a
 * production MongoDB connection string via MONGODB_URI requires zero changes
 * to business logic controllers.
 */
class DatabaseService {
  constructor() {
    this.data = {
      mothers: [],
      healthChecks: [],
      alerts: [],
      reminders: [],
      users: []
    };
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure all collections exist
        const defaultCollections = ['mothers', 'healthChecks', 'alerts', 'reminders', 'users'];
        for (const col of defaultCollections) {
          if (!this.data[col]) this.data[col] = [];
        }
      } else {
        await this.resetDemo();
      }
    } catch (err) {
      console.warn('Could not read existing store.json, resetting to initial seed:', err.message);
      await this.resetDemo();
    }
    this.initialized = true;
  }

  async save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err.message);
    }
  }

  async resetDemo({ resetAll = false } = {}) {
    const demoData = getDemoData();
    if (resetAll) {
      this.data = demoData;
    } else {
      // Keep real registered users (non-demo)
      const nonDemoMothers = (this.data.mothers || []).filter(m => !m.isDemo);
      const nonDemoMotherIds = new Set(nonDemoMothers.map(m => m.id));
      
      const nonDemoHealthChecks = (this.data.healthChecks || []).filter(hc => nonDemoMotherIds.has(hc.motherId));
      const nonDemoAlerts = (this.data.alerts || []).filter(a => nonDemoMotherIds.has(a.motherId));
      const nonDemoReminders = (this.data.reminders || []).filter(r => nonDemoMotherIds.has(r.motherId));

      this.data = {
        mothers: [...demoData.mothers, ...nonDemoMothers],
        healthChecks: [...demoData.healthChecks, ...nonDemoHealthChecks],
        alerts: [...demoData.alerts, ...nonDemoAlerts],
        reminders: [...demoData.reminders, ...nonDemoReminders],
        users: demoData.users
      };
    }
    await this.save();
    return this.data;
  }

  // --- Generic Collection Methods ---

  async find(collectionName, filter = {}) {
    await this.init();
    const collection = this.data[collectionName] || [];
    return collection.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if (typeof val === 'function') {
          if (!val(item[key])) return false;
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(collectionName, filter = {}) {
    const results = await this.find(collectionName, filter);
    return results[0] || null;
  }

  async findById(collectionName, id) {
    return this.findOne(collectionName, { id });
  }

  async create(collectionName, doc) {
    await this.init();
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    const newDoc = {
      id: doc.id || `${collectionName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    this.data[collectionName].unshift(newDoc);
    await this.save();
    return newDoc;
  }

  async updateById(collectionName, id, updates) {
    await this.init();
    const collection = this.data[collectionName] || [];
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    collection[index] = {
      ...collection[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return collection[index];
  }

  async deleteById(collectionName, id) {
    await this.init();
    const collection = this.data[collectionName] || [];
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return false;
    collection.splice(index, 1);
    await this.save();
    return true;
  }
}

export const db = new DatabaseService();
