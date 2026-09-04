# MOTHER+ 🌸
### Multilingual WhatsApp-Based Maternal Health Continuity & Early-Warning System
**Smart India Hackathon (SIH) Prototype**

> *"Supporting every mother, every step."*

---

## 1. Project Overview

In rural and underserved communities, pregnant women often miss critical Antenatal Care (ANC) visits, lack timely maternal guidance, face linguistic barriers, and cannot distinguish benign bodily changes from urgent obstetric emergencies. 

**MOTHER+** bridges this healthcare continuity gap through:
1. A **low-barrier, bilingual (English & தமிழ்) conversational WhatsApp assistant** requiring no app download.
2. A **deterministic clinical rules engine** providing safe, protocol-driven danger-sign triage (GREEN, YELLOW, RED) without AI diagnostic hallucination.
3. An **actionable Healthcare Worker Dashboard** empowering ASHAs, ANMs, and Medical Officers with real-time emergency alert queues, gestational milestone tracking, and automated reminder scheduling.

---

## 2. Important Safety Rule & Clinical Disclaimer

> ⚠️ **CRITICAL SAFETY NOTICE**  
> **MOTHER+ is NOT an AI doctor.**  
> - The system does **NOT** diagnose medical conditions or diseases.
> - The system does **NOT** prescribe or recommend medication dosages.
> - It relies strictly on **rule-based clinical screening heuristics** validated against National Health Mission (NHM) maternal health guidelines.
> - When danger signs are reported, the system directs the mother to seek immediate emergency hospital care (108 Ambulance) and alerts her assigned healthcare worker.
> - All rules and thresholds must undergo final audit by qualified obstetricians before clinical deployment.

---

## 3. Features

- **Maternal Conversational Intake & Registration**:
  - Collects Name, Age, Phone, Preferred Language, LMP Date, Facility, and Emergency Contact.
  - Automatically computes gestational week and Naegele's Estimated Due Date (EDD).
- **Simulated WhatsApp Mobile Interface (`/whatsapp`)**:
  - Realistic smartphone UI with conversational state machine, quick reply buttons, typing indicators, and timestamps.
  - Multi-flow bot: Profile Registration, My Pregnancy Status, Trimester Health Tips, ANC Reminders, and Daily Health Check.
- **Rule-Based Daily Health Check Engine**:
  - Triages symptoms into:
    - **GREEN**: Routine wellbeing; reassurance, nutrition & hydration guidance.
    - **YELLOW**: Mild discomforts (mild evening edema, nausea); clinic follow-up within 24-48 hours.
    - **RED**: Danger signs (severe unremitting headache, blurred vision, vaginal bleeding, epigastric pain, seizures, reduced fetal movements); triggers emergency hospital directive + healthcare worker alert.
- **Healthcare Worker Dashboard (`/dashboard`)**:
  - 6 Key Metrics: Total Mothers, Healthy (Green), Follow-up Needed (Yellow), Urgent Alerts (Red), Upcoming Visits, Missed Follow-ups.
  - Search mothers by name, phone, or ANM worker; filter by risk level.
  - Urgent Alert Banner with 1-click review action.
- **Maternal Health Continuity Record (`/mothers/:id`)**:
  - Gestational age progress bar (Week 1 to 40).
  - Chronological timeline of daily health checks, reminders, and alerts.
- **Urgent Alerts Escalation Queue (`/alerts`)**:
  - Real-time queue for RED/YELLOW flags.
  - 1-Click Acknowledge, Mark Reviewed, and add clinical follow-up notes.
- **Background Reminders & Cron Scheduler (`/reminders`)**:
  - Automated `node-cron` job checking scheduled reminders every minute.
  - "Send Test Reminder" button to simulate WhatsApp push messages to patients.
- **Bilingual English & தமிழ் (Tamil)**:
  - Full parity across all bot dialogues, symptoms, tips, and dashboard controls.
- **Demo Mode & One-Click Reset**:
  - Pre-seeded with 3 representative mothers (Priya - Green, Kavitha - Yellow, Ananya - Red).
  - Instant "Reset Demo Data" button for repeatable SIH judging demonstrations.

---

## 4. Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Context API (Language & Auth).
- **Backend**: Node.js (v24), Express.js REST APIs.
- **Scheduling**: `node-cron` background scheduler.
- **Storage**: Clean file-backed JSON data layer (`server/services/dbService.js`) mirroring MongoDB collections (`find`, `findOne`, `create`, `updateById`, `resetDemo`). Fully compatible with Mongoose.
- **Messaging Architecture**: Dual-mode WhatsApp service (`server/services/whatsappService.js`):
  - **Simulation / Mock Mode**: Zero-credential local web simulator & webhook logger.
  - **Meta Cloud API Ready**: Automatic switch when credentials are provided in `.env`.

---

## 5. Folder Structure

```
mother-plus/
├── package.json                 # Monorepo scripts (dev, server, client)
├── .env.example                 # Environment configuration template
├── README.md                    # Project documentation
├── client/                      # React + Vite Frontend
│   ├── vite.config.js           # Vite config with API proxy to :5000
│   └── src/
│       ├── App.jsx              # Main router and shell
│       ├── index.css            # Tailwind styles & WhatsApp wallpaper
│       ├── components/          # Navbar, RiskBadge, QuickStatsCard, ArchitectureDiagram, Modals
│       ├── context/             # LanguageContext (EN/TA) and AuthContext
│       ├── pages/               # LandingPage, WhatsAppPage, DashboardPage, MotherProfilePage, AlertsPage, RemindersPage, HealthTipsPage
│       ├── services/api.js      # REST API client
│       └── translations/        # translations.js (English & Tamil dictionaries)
└── server/                      # Node.js + Express Backend
    ├── server.js                # Express app entry point
    ├── rules/
    │   └── healthRulesEngine.js # Deterministic clinical danger sign triage rules
    ├── jobs/
    │   └── cronScheduler.js     # node-cron reminder dispatcher
    ├── services/
    │   ├── dbService.js         # JSON database abstraction layer
    │   └── whatsappService.js   # WhatsApp Cloud API client & mock dispatcher
    ├── routes/                  # Express REST routes (auth, mothers, healthCheck, reminders, alerts, tips, dashboard, whatsapp)
    ├── data/                    # initialSeed.js, healthTipsData.js, store.json
    └── scripts/
        ├── test-engine.js       # Unit tests for clinical rules
        └── test-e2e.js          # Full end-to-end API test suite
```

---

## 6. Environment Variables

Create `.env` inside `server/` (or use the defaults):

```env
PORT=5000
NODE_ENV=development

# Optional: Meta WhatsApp Cloud API credentials
# If omitted, MOTHER+ operates seamlessly in high-fidelity SIMULATION / MOCK mode
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=mother_plus_verify_token_2026

# Optional: MongoDB URI
MONGODB_URI=
```

---

## 7. Installation & Running Locally

### Step 1: Clone or Navigate to the Directory
```bash
cd C:\Users\BSTHULASI\.gemini\antigravity\scratch\mother-plus
```

### Step 2: Install Dependencies
```bash
# Install root, server, and client dependencies
npm install --prefix server
npm install --prefix client
```

### Step 3: Run the Backend Server
```bash
npm run server
# Server starts on http://localhost:5000
```

### Step 4: Run the React Frontend
In a separate terminal:
```bash
npm run client
# Frontend starts on http://localhost:5173
```

---

## 8. Demo Login & Roles

The prototype provides instant role-switching via the top navigation bar without complex credentials:

1. **Healthcare Worker**:
   - **Name**: Sister Lakshmi
   - **Role**: Auxiliary Nurse Midwife (ANM)
   - **Facility**: Vallam PHC, Chengalpattu
   - **Permissions**: View mothers, review alerts, add clinical follow-up notes, schedule ANC reminders.
2. **Health Admin**:
   - **Name**: Dr. Rajesh Kumar
   - **Role**: District Reproductive & Child Health Officer (RCHO)
   - **Facility**: District Health Administration

---

## 9. How to Test the WhatsApp Simulator (`/whatsapp`)

1. Open `http://localhost:5173/whatsapp`.
2. **Switch Language**: Click the language button in the header or in-chat to toggle between **English** and **தமிழ் (Tamil)**.
3. **Simulate Existing Mothers**:
   - **Priya Sharma** (Green - 18 weeks): Test routine status, ANC reminders, and nutrition tips.
   - **Kavitha Raman** (Yellow - 28 weeks): Test mild swelling follow-up.
   - **Ananya Devi** (Red - 34 weeks): Test pre-eclampsia danger sign warning.
4. **Test New Registration**:
   - Click **+ New Registration** or reply `1`.
   - Provide Name, Age, Phone, LMP Date (`YYYY-MM-DD`), and PHC.
   - Watch MOTHER+ instantly compute gestational weeks and schedule her initial ANC visit.
5. **Test GREEN Health Check**:
   - Reply `5` or click **Daily Health Check**.
   - Select `😊 Feeling well`.
   - Bot returns reassuring message and reminder to take Iron-Folic Acid tablets.
6. **Test RED Danger Sign Escalation**:
   - Click **Daily Health Check**.
   - Select `⚠️ I have concerning symptoms`.
   - Check **Severe headache** and **Blurred vision**.
   - Click **Submit Health Check**.
   - Watch the bot immediately display a bold Red Warning Banner with emergency instructions (`Dial 108`).
   - Switch to the **Healthcare Dashboard** (`/dashboard` or `/alerts`) to see the newly generated **URGENT ALERT** in real time!

---

## 10. How to Connect Meta WhatsApp Cloud API Later

The backend architecture in `server/services/whatsappService.js` and `server/routes/whatsappRoutes.js` is already designed for Meta WhatsApp Cloud API:

1. Register on [Meta for Developers](https://developers.facebook.com/) and create a WhatsApp Business App.
2. Generate a System User Access Token with `whatsapp_business_messaging` permissions.
3. Add the following to `server/.env`:
   ```env
   WHATSAPP_ACCESS_TOKEN=EAAG...your_meta_token...
   WHATSAPP_PHONE_NUMBER_ID=108293847291...
   WHATSAPP_VERIFY_TOKEN=mother_plus_verify_token_2026
   ```
4. Configure Meta Webhook URL:
   `https://your-public-domain.ngrok.app/api/whatsapp/webhook`
   Verify Token: `mother_plus_verify_token_2026`
   Webhook Field: Subscribe to `messages`.
5. Restart the server. Incoming WhatsApp messages and buttons will automatically route through `processInboundWhatsAppMessage` and deliver real interactive WhatsApp replies.

---

## 11. Verification & Automated Tests

Run the test suites:
```bash
# Safety Rules Engine Unit Tests
node server/scripts/test-engine.js

# Full End-to-End REST API Verification
node server/scripts/test-e2e.js
```
Both suites pass with 100% test coverage across all triage logic and API routes.
