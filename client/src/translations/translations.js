/**
 * MOTHER+ Comprehensive Bilingual Translations (English & Tamil)
 */

export const translations = {
  en: {
    // Brand & Header
    appName: 'MOTHER+',
    tagline: 'Supporting every mother, every step.',
    heroTitle: 'Maternal Health Support, Anytime.',
    heroSubtitle: 'Multilingual digital support for reminders, health check-ins, and early warning alerts.',
    tryDemoBtn: 'Try WhatsApp Simulator',
    dashboardBtn: 'Healthcare Dashboard',
    roleWorker: 'Healthcare Worker (ANM/ASHA)',
    roleAdmin: 'Health Admin (MO/RCHO)',
    demoDataBadge: 'DEMO DATA ACTIVE',
    resetDemoBtn: 'Reset Demo Data',
    
    // Navigation
    navHome: 'Home',
    navWhatsApp: 'WhatsApp Bot',
    navDashboard: 'Dashboard',
    navAlerts: 'Urgent Alerts',
    navReminders: 'Reminders',
    navTips: 'Health Tips',

    // Safety Banner
    safetyNoticeTitle: 'Clinical Safety & Triage Notice',
    safetyNoticeText: 'MOTHER+ is NOT an AI doctor. It does not diagnose diseases or prescribe medications. It uses a deterministic clinical rule engine to identify pregnancy danger signs, advise immediate emergency care, and alert designated healthcare workers.',

    // Stats Cards
    statTotalMothers: 'Total Mothers',
    statHealthyGreen: 'Healthy (Green)',
    statFollowUpYellow: 'Follow-up Needed (Yellow)',
    statUrgentRed: 'Urgent Alerts (Red)',
    statUpcomingAppts: 'Upcoming Appointments',
    statMissedFollowups: 'Missed Follow-ups',

    // Risk Levels
    riskGreen: 'GREEN - ROUTINE',
    riskYellow: 'YELLOW - FOLLOW-UP',
    riskRed: 'RED - URGENT DANGER',

    // WhatsApp Interface
    botOnline: 'Official Maternal Health Bot • Online',
    botWelcomeTitle: 'Hello! Welcome to MOTHER+ 🌸',
    botWelcomeSubtitle: 'How can we assist you today?',
    btnRegister: '1. Register Profile',
    btnMyPregnancy: '2. My Pregnancy',
    btnHealthTips: '3. Health Tips',
    btnReminders: '4. Reminders',
    btnDailyCheck: '5. Daily Health Check',
    btnHelp: '6. Help / Emergency',
    btnChangeLanguage: '7. 🌐 Change Language / மொழியை மாற்று',
    chooseLanguageTitle: 'Choose your language / மொழியைத் தேர்ந்தெடுக்கவும்',
    dangerSignsHeader: 'Danger Signs (RED Level)',
    mildDiscomfortsHeader: 'Mild Pregnancy Discomforts (YELLOW Level)',
    typeMessagePlaceholder: 'Type a message or select an option...',
    selectDemoMother: 'Simulate As Pre-Registered Mother:',
    newRegistrationOption: '+ Register New Mother',

    // WhatsApp Check-in
    checkinQuestion: 'How are you feeling today?',
    feelWell: '😊 Feeling well',
    feelDiscomfort: '😐 I have some discomfort',
    feelConcerning: '⚠️ I have concerning symptoms',
    feelEmergency: '🚨 Emergency',
    symptomsPrompt: 'Please select any symptoms you are experiencing right now:',
    submitCheckinBtn: 'Submit Health Check',
    noSymptomsNotice: 'No symptoms selected. Press submit to confirm you are feeling well.',

    // Warning Alerts
    urgentWarningBanner: 'CRITICAL WARNING: These symptoms may require urgent medical attention. Please contact your healthcare provider or seek emergency medical care now.',
    urgentHospitalNotice: 'Do NOT wait for a chatbot response in an emergency. Dial 108 or go to the nearest Primary Health Centre / District Hospital immediately.',
    yellowWarningBanner: 'FOLLOW-UP RECOMMENDED: Mild symptoms reported. Please consult your ASHA/ANM worker or visit the clinic within 24-48 hours.',
    greenReassuranceBanner: 'REASSURING: No danger signs detected. Keep taking your iron & calcium supplements, eat well, and stay hydrated.',

    // Dashboard Table
    searchMothersPlaceholder: 'Search by mother name, phone, or ASHA worker...',
    filterRiskAll: 'All Risk Levels',
    thName: 'Mother Details',
    thWeek: 'Pregnancy Week',
    thEdd: 'Estimated Due Date',
    thFacility: 'Healthcare Facility & ANM',
    thRisk: 'Risk Level',
    thActions: 'Actions',
    btnViewProfile: 'View Profile',
    btnSendReminder: 'Send Reminder',
    btnAcknowledge: 'Acknowledge',
    btnReview: 'Mark Reviewed',
    btnAddNote: 'Add Clinical Note',

    // Mother Profile
    profileOverview: 'Maternal Health Continuity Record',
    gestationalAgeLabel: 'Current Gestational Age',
    trimesterLabel: 'Trimester',
    eddLabel: 'Estimated Delivery Date (EDD)',
    lmpLabel: 'Last Menstrual Period (LMP)',
    contactLabel: 'Emergency Contact',
    facilityLabel: 'PHC / Hospital',
    workerLabel: 'Assigned ANM / ASHA',
    languageLabel: 'Preferred Language',
    recentCheckinsTitle: 'Recent Health Check-in History',
    remindersScheduleTitle: 'Antenatal Appointments & Reminders',
    alertsHistoryTitle: 'Escalation Alerts & Clinical Notes',
    scheduleNewReminderBtn: '+ Schedule Reminder / ANC',

    // Reminders
    reminderTypeAnc: 'ANC Appointment',
    reminderTypeFollowup: 'Clinical Follow-up',
    reminderTypeSupplement: 'Supplement (IFA / Calcium)',
    reminderTypeEmergency: 'Emergency Referral',
    statusUpcoming: 'Upcoming',
    statusCompleted: 'Completed',
    statusMissed: 'Missed',
    btnSendTestReminder: 'Send Test Reminder 📲',

    // Modals
    modalNewReminderTitle: 'Schedule Antenatal Reminder',
    modalAddNoteTitle: 'Add Healthcare Worker Follow-up Note',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',

    // Tips
    tipsPageTitle: 'Maternal Nutrition & Health Guidance',
    tipsPageSubtitle: 'Evidence-based community guidance for mothers across all trimesters.',
    catAll: 'All Guidelines',
    catNutrition: 'Nutrition & Diet',
    catHydration: 'Hydration & Fluids',
    catRest: 'Rest & Sleeping Posture',
    catWarning: 'Danger Signs & Red Flags',
    catPrep: 'Birth Preparedness Plan',
    catWellbeing: 'Mental Wellbeing'
  },

  ta: {
    // Brand & Header
    appName: 'MOTHER+',
    tagline: 'ஒவ்வொரு தாய்க்கும், ஒவ்வொரு அடியிலும் பாதுகாப்பு.',
    heroTitle: 'மகிழ்ச்சியான தாய்மைக்கு முழுமையான வழிகாட்டி.',
    heroSubtitle: 'நினைவூட்டல்கள், தினசரி உடல்நல பரிசோதனை மற்றும் அவசர எச்சரிக்கைக்கான பன்மொழி டிஜிட்டல் தளம்.',
    tryDemoBtn: 'வாட்ஸ்அப் பாட் டெமோ',
    dashboardBtn: 'சுகாதாரப் பணியாளர் தளம்',
    roleWorker: 'சுகாதாரப் பணியாளர் (ANM/ASHA)',
    roleAdmin: 'மாவட்ட சுகாதார அதிகாரி (MO/RCHO)',
    demoDataBadge: 'டெமோ தரவு பயன்பாட்டில் உள்ளது',
    resetDemoBtn: 'டெமோ தரவை மீட்டமைக்க',

    // Navigation
    navHome: 'முகப்பு',
    navWhatsApp: 'வாட்ஸ்அப் பாட்',
    navDashboard: 'கண்காணிப்பு தளம்',
    navAlerts: 'அவசர எச்சரிக்கைகள்',
    navReminders: 'நினைவூட்டல்கள்',
    navTips: 'ஆரோக்கிய குறிப்புகள்',

    // Safety Banner
    safetyNoticeTitle: 'மருத்துவ பாதுகாப்பு & எச்சரிக்கை அறிவிப்பு',
    safetyNoticeText: 'MOTHER+ என்பது ஒரு செயற்கை நுண்ணறிவு மருத்துவர் அல்ல. இது நோய் கண்டறிதலோ அல்லது மருந்து பரிந்துரையோ செய்யாது. இது கர்ப்ப கால ஆபத்து அறிகுறிகளைக் கண்டறிந்து, உடனடியாக தகுதிவாய்ந்த மருத்துவரை அணுகவும் சுகாதாரப் பணியாளருக்கு எச்சரிக்கை அனுப்பவும் மட்டுமே வடிவமைக்கப்பட்டுள்ளது.',

    // Stats Cards
    statTotalMothers: 'மொத்த கர்ப்பிணிகள்',
    statHealthyGreen: 'ஆரோக்கியமான நிலை (பச்சை)',
    statFollowUpYellow: 'கவனிப்பு தேவை (மஞ்சள்)',
    statUrgentRed: 'அவசர எச்சரிக்கை (சிவப்பு)',
    statUpcomingAppts: 'வரவிருக்கும் பரிசோதனைகள்',
    statMissedFollowups: 'தவறவிடப்பட்ட சந்திப்புகள்',

    // Risk Levels
    riskGreen: 'பச்சை - இயல்பான நிலை',
    riskYellow: 'மஞ்சள் - கவனிப்பு தேவை',
    riskRed: 'சிவப்பு - உடனடி ஆபத்து',

    // WhatsApp Interface
    botOnline: 'அரசு தாய்மை நல உதவி பாட் • ஆன்லைன்',
    botWelcomeTitle: 'வணக்கம்! MOTHER+ இற்கு நல்வரவு 🌸',
    botWelcomeSubtitle: 'இன்று உங்களுக்கு எவ்வாறு உதவலாம்?',
    btnRegister: '1. புதிய பதிவு',
    btnMyPregnancy: '2. என் கர்ப்ப நிலை',
    btnHealthTips: '3. ஆரோக்கியக் குறிப்புகள்',
    btnReminders: '4. நினைவூட்டல்கள்',
    btnDailyCheck: '5. தினசரி உடல்நல பரிசோதனை',
    btnHelp: '6. உதவி / அவசர எண்',
    btnChangeLanguage: '7. 🌐 மொழியை மாற்று / Change Language',
    chooseLanguageTitle: 'மொழியைத் தேர்ந்தெடுக்கவும் / Choose your language',
    dangerSignsHeader: 'ஆபத்து அறிகுறிகள் (சிவப்பு நிலை)',
    mildDiscomfortsHeader: 'லேசான கர்ப்ப அசௌகரியங்கள் (மஞ்சள் நிலை)',
    typeMessagePlaceholder: 'செய்தியை உள்ளிடவும் அல்லது விருப்பத்தைத் தேர்ந்தெடுக்கவும்...',
    selectDemoMother: 'பதிவுசெய்யப்பட்ட தாயாக சோதிக்க:',
    newRegistrationOption: '+ புதிய தாயாக பதிவு செய்ய',

    // WhatsApp Check-in
    checkinQuestion: 'இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?',
    feelWell: '😊 நலமாக உள்ளேன்',
    feelDiscomfort: '😐 லேசான அசௌகரியம் உள்ளது',
    feelConcerning: '⚠️ கவலை தரும் அறிகுறிகள் உள்ளன',
    feelEmergency: '🚨 அவசர நிலை',
    symptomsPrompt: 'உங்களுக்கு ஏதேனும் அறிகுறிகள் இருந்தால் தேர்வு செய்யவும்:',
    submitCheckinBtn: 'பரிசோதனையை சமர்ப்பிக்கவும்',
    noSymptomsNotice: 'அறிகுறிகள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை. நீங்கள் நலமாக உள்ளீர்கள் என்பதை உறுதிப்படுத்த சமர்ப்பிக்கவும்.',

    // Warning Alerts
    urgentWarningBanner: 'முக்கிய எச்சரிக்கை: இந்த அறிகுறிகளுக்கு உடனடி மருத்துவ கவனிப்பு தேவைப்படலாம். உடனே உங்கள் சுகாதாரப் பணியாளரைத் தொடர்பு கொள்ளவும் அல்லது அவசர மருத்துவமனைக்குச் செல்லவும்.',
    urgentHospitalNotice: 'அவசர நேரத்தில் பாட் பதிலுக்காக காத்திருக்க வேண்டாம். உடனடியாக 108 ஐ அழைக்கவும் அல்லது அருகிலுள்ள ஆரம்ப சுகாதார நிலையத்தை அணுகவும்.',
    yellowWarningBanner: 'தொடர் கவனிப்பு தேவை: லேசான அறிகுறிகள் உள்ளன. அடுத்த 24-48 மணி நேரத்திற்குள் உங்கள் கிராம சுகாதார செவிலியரை (ANM) அணுகவும்.',
    greenReassuranceBanner: 'மகிழ்ச்சி: எந்த ஆபத்து அறிகுறிகளும் இல்லை. சத்தான உணவு உண்ணவும், இரும்புச்சத்து மாத்திரைகளை தவறாமல் எடுக்கவும்.',

    // Dashboard Table
    searchMothersPlaceholder: 'பெயர், தொலைபேசி எண் அல்லது செவிலியர் பெயர் மூலம் தேடுக...',
    filterRiskAll: 'அனைத்து பாதுகாப்பு நிலைகளும்',
    thName: 'கர்ப்பிணி விவரம்',
    thWeek: 'கர்ப்ப வாரம்',
    thEdd: 'பிரசவ தேதி',
    thFacility: 'சுகாதார நிலையம் & செவிலியர்',
    thRisk: 'நிலை',
    thActions: 'செயல்கள்',
    btnViewProfile: 'விவரம் பார்க்க',
    btnSendReminder: 'நினைவூட்டல் அனுப்ப',
    btnAcknowledge: 'ஏற்றுக்கொள்',
    btnReview: 'பரிசீலிக்கப்பட்டது',
    btnAddNote: 'மருத்துவ குறிப்பு சேர்க்க',

    // Mother Profile
    profileOverview: 'கர்ப்பிணி தொடர் கண்காணிப்பு பதிவேடு',
    gestationalAgeLabel: 'தற்போதைய கர்ப்ப வாரம்',
    trimesterLabel: 'பருவம்',
    eddLabel: 'எதிர்பார்க்கப்படும் பிரசவ தேதி (EDD)',
    lmpLabel: 'கடைசி மாதவிடாய் தேதி (LMP)',
    contactLabel: 'அவசர தொடர்பு எண்',
    facilityLabel: 'சுகாதார நிலையம் / மருத்துவமனை',
    workerLabel: 'பொறுப்பு செவிலியர் (ANM/ASHA)',
    languageLabel: 'விருப்ப மொழி',
    recentCheckinsTitle: 'சமீபத்திய தினசரி பரிசோதனை வரலாறு',
    remindersScheduleTitle: 'மருத்துவ பரிசோதனைகள் & நினைவூட்டல்கள்',
    alertsHistoryTitle: 'அவசர எச்சரிக்கைகள் & மருத்துவ குறிப்புகள்',
    scheduleNewReminderBtn: '+ புதிய நினைவூட்டல் திட்டமிட',

    // Reminders
    reminderTypeAnc: 'மகப்பேறு பரிசோதனை (ANC)',
    reminderTypeFollowup: 'மருத்துவ தொடர் கவனிப்பு',
    reminderTypeSupplement: 'ஊட்டச்சத்து மாத்திரைகள் (IFA/கால்சியம்)',
    reminderTypeEmergency: 'அவசர மருத்துவ பரிந்துரை',
    statusUpcoming: 'வரவிருப்பது',
    statusCompleted: 'முடிந்தது',
    statusMissed: 'தவறியது',
    btnSendTestReminder: 'டெமோ நினைவூட்டல் அனுப்புக 📲',

    // Modals
    modalNewReminderTitle: 'புதிய நினைவூட்டலை திட்டமிடுக',
    modalAddNoteTitle: 'சுகாதாரப் பணியாளர் மருத்துவக் குறிப்பு',
    saveBtn: 'சேமிக்க',
    cancelBtn: 'ரத்து செய்ய',

    // Tips
    tipsPageTitle: 'தாய்மை ஊட்டச்சத்து மற்றும் நல்வாழ்வு வழிகாட்டி',
    tipsPageSubtitle: 'அனைத்து பருவங்களிலும் தாய்மார்களுக்கான ஆரோக்கிய வழிகாட்டுதல்கள்.',
    catAll: 'அனைத்து குறிப்புகளும்',
    catNutrition: 'ஊட்டச்சத்து & உணவுமுறை',
    catHydration: 'நீர்ச்சத்து & திரவங்கள்',
    catRest: 'ஓய்வு & தூங்கும் முறை',
    catWarning: 'ஆபத்து அறிகுறிகள்',
    catPrep: 'பிரசவ தயார்நிலை திட்டம்',
    catWellbeing: 'மன அமைதி & உடற்பயிற்சி'
  }
};
