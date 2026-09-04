import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Languages,
  Calendar,
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  RotateCcw,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';

export function WhatsAppPage({ onNavigate }) {
  const { language, setLanguage, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mothersList, setMothersList] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [chatState, setChatState] = useState('MENU'); // 'MENU' | 'REGISTERING' | 'CHECKIN_GENERAL' | 'CHECKIN_SYMPTOMS'
  const [regForm, setRegForm] = useState({ step: 0, name: '', age: '24', phone: '+91 98401 55555', lmpDate: '2026-04-15', facility: 'Primary Health Centre', emergencyContact: '+91 98401 99999' });
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState({ dangerSigns: [], mildDiscomforts: [] });
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load mothers & symptoms taxonomy on mount
  useEffect(() => {
    loadMothers();
    loadSymptoms();
    // Default to English and prompt for language selection immediately on opening
    setLanguage('en');
    showLanguageSelectionPrompt();
  }, []);

  const loadMothers = async () => {
    try {
      const res = await api.getMothers();
      if (res.data) {
        setMothersList(res.data);
        if (res.data.length > 0 && !selectedMother) {
          // Pre-select first mother for demo context without overriding language
          setSelectedMother(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch mothers:', err);
    }
  };

  const loadSymptoms = async () => {
    try {
      const res = await api.getSymptomsTaxonomy();
      if (res.data) {
        setAvailableSymptoms(res.data);
      }
    } catch (err) {
      console.error('Failed to load symptoms taxonomy:', err);
    }
  };

  // Switch simulated mother profile
  const selectMotherForChat = (mother) => {
    setSelectedMother(mother);
    // Keep currently active user language
    initWelcomeChat(mother, language);
  };

  const showLanguageSelectionPrompt = () => {
    setChatState('LANG_SELECT');
    setMessages([
      {
        id: `msg-lang-select-${Date.now()}`,
        sender: 'bot',
        text: '🌸 Welcome to MOTHER+ / MOTHER+ இற்கு நல்வரவு\n\nChoose your language / மொழியைத் தேர்ந்தெடுக்கவும்:\n\n1. English\n2. தமிழ்',
        time: getCurrentTime(),
        quickOptions: [
          { id: 'lang_en', label: '1. English' },
          { id: 'lang_ta', label: '2. தமிழ்' }
        ]
      }
    ]);
  };

  const handleSelectLanguage = (newLang) => {
    setLanguage(newLang);
    if (selectedMother) {
      setSelectedMother((prev) => (prev ? { ...prev, preferredLanguage: newLang } : null));
    }
    const notice = newLang === 'ta'
      ? 'மொழி வெற்றிகரமாக தமிழில் அமைக்கப்பட்டது 🌐'
      : 'Language set to English successfully 🌐';
    initWelcomeChat(selectedMother, newLang, notice);
  };

  const initWelcomeChat = (mother, lang = language, prependNotice = null) => {
    const isTa = lang === 'ta';
    const motherName = mother ? ` ${mother.name}` : '';
    const mainText = isTa
      ? `வணக்கம்${motherName}! MOTHER+ இற்கு நல்வரவு 🌸\nஒவ்வொரு தாய்க்கும், ஒவ்வொரு அடியிலும் பாதுகாப்பு.\n\nகீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்ந்தெடுக்கவும் அல்லது எண்ணைத் தட்டச்சு செய்யவும்:`
      : `Hello${motherName}! Welcome to MOTHER+ 🌸\nSupporting every mother, every step.\n\nSelect one of the quick options below or reply with a number:`;

    const welcomeMsg = prependNotice ? `${prependNotice}\n\n${mainText}` : mainText;

    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'bot',
        text: welcomeMsg,
        time: getCurrentTime(),
        quickOptions: [
          { id: '1', label: isTa ? '1. புதிய பதிவு' : '1. Register Profile' },
          { id: '2', label: isTa ? '2. என் கர்ப்ப நிலை' : '2. My Pregnancy' },
          { id: '3', label: isTa ? '3. ஆரோக்கியக் குறிப்புகள்' : '3. Health Tips' },
          { id: '4', label: isTa ? '4. நினைவூட்டல்கள்' : '4. Reminders' },
          { id: '5', label: isTa ? '5. தினசரி பரிசோதனை' : '5. Daily Health Check' },
          { id: '6', label: isTa ? '6. உதவி / அவசர எண்' : '6. Help / Emergency' },
          { id: '7', label: isTa ? '🌐 7. மொழியை மாற்று / Change Language' : '🌐 7. Change Language / மொழியை மாற்று' }
        ]
      }
    ]);
    setChatState('MENU');
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addBotMessage = (text, quickOptions = [], delayMs = 600, extraData = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          time: getCurrentTime(),
          quickOptions,
          extraData
        }
      ]);
    }, delayMs);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        time: getCurrentTime()
      }
    ]);
  };

  // Handle user input dispatch
  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    addUserMessage(text);
    setInputText('');

    // Handle language selection state
    if (chatState === 'LANG_SELECT') {
      const lower = text.toLowerCase();
      if (text === '1' || lower === 'en' || lower.includes('english') || text === 'lang_en') {
        handleSelectLanguage('en');
        return;
      }
      if (text === '2' || lower === 'ta' || lower.includes('tamil') || lower.includes('தமிழ்') || text === 'lang_ta') {
        handleSelectLanguage('ta');
        return;
      }
      addBotMessage(
        `Please choose your language / தயவுசெய்து மொழியைத் தேர்ந்தெடுக்கவும்:\n\n1. English\n2. தமிழ்`,
        [
          { id: 'lang_en', label: '1. English' },
          { id: 'lang_ta', label: '2. தமிழ்' }
        ]
      );
      return;
    }

    // Handle interactive registration state machine
    if (chatState === 'REGISTERING') {
      handleRegistrationStep(text);
      return;
    }

    // Handle menu commands
    const lower = text.toLowerCase();
    const isTa = language === 'ta';

    if (text === '1' || lower.includes('register') || lower.includes('பதிவு')) {
      startRegistrationFlow();
      return;
    }

    if (text === '2' || lower.includes('pregnancy') || lower.includes('கர்ப்ப')) {
      handleMyPregnancyQuery();
      return;
    }

    if (text === '3' || lower.includes('tip') || lower.includes('குறிப்பு')) {
      handleTipsQuery();
      return;
    }

    if (text === '4' || lower.includes('reminder') || lower.includes('நினைவூட்டல்')) {
      handleRemindersQuery();
      return;
    }

    if (text === '5' || lower.includes('check') || lower.includes('பரிசோதனை')) {
      startHealthCheckFlow();
      return;
    }

    if (text === '6' || lower.includes('help') || lower.includes('emergency') || lower.includes('உதவி') || lower.includes('அவசரம்')) {
      handleHelpQuery();
      return;
    }

    if (text === '7' || lower.includes('lang') || lower.includes('language') || lower.includes('மொழி') || lower.includes('மாற்று') || text === 'change_lang') {
      showLanguageSelectionPrompt();
      return;
    }

    // Default response
    const defaultReply = isTa
      ? `MOTHER+ பாட்: தயவுசெய்து மெனுவிலிருந்து ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும் (1-7) அல்லது "பரிசோதனை" என தட்டச்சு செய்யவும்.`
      : `MOTHER+ Bot: Please select an option from the menu (1 to 7) or reply "Daily Health Check".`;
    addBotMessage(defaultReply, [
      { id: '5', label: isTa ? '5. தினசரி பரிசோதனை' : '5. Daily Health Check' },
      { id: '2', label: isTa ? '2. என் கர்ப்ப நிலை' : '2. My Pregnancy' },
      { id: '7', label: isTa ? '🌐 7. மொழியை மாற்று' : '🌐 7. Change Language' }
    ]);
  };

  // 1. REGISTRATION CONVERSATION FLOW
  const startRegistrationFlow = () => {
    setChatState('REGISTERING');
    setRegForm({ step: 1, name: '', age: '', phone: '', lmpDate: '', facility: '', emergencyContact: '' });
    const prompt = language === 'ta'
      ? `புதிய பதிவு தொடங்குகிறது 📋\nஉங்கள் முழுப் பெயர் என்ன?`
      : `Let's get you registered 📋\nWhat is your full name?`;
    addBotMessage(prompt);
  };

  const handleRegistrationStep = async (input) => {
    const isTa = language === 'ta';
    const step = regForm.step;

    if (step === 1) {
      setRegForm((prev) => ({ ...prev, step: 2, name: input }));
      addBotMessage(isTa ? `நன்றி ${input}. உங்கள் வயது என்ன?` : `Thank you ${input}. What is your age?`);
    } else if (step === 2) {
      setRegForm((prev) => ({ ...prev, step: 3, age: input }));
      addBotMessage(
        isTa ? `உங்கள் மொபைல் எண் என்ன? (எ.கா. +91 98401 12345)` : `What is your phone number? (e.g., +91 98401 12345)`
      );
    } else if (step === 3) {
      setRegForm((prev) => ({ ...prev, step: 4, phone: input }));
      addBotMessage(
        isTa
          ? `கடைசி மாதவிடாய் தொடக்க தேதி (LMP) என்ன? (வடிவம்: YYYY-MM-DD, எ.கா. 2026-04-10)`
          : `When was your Last Menstrual Period (LMP) date? (Format: YYYY-MM-DD, e.g., 2026-04-10)`
      );
    } else if (step === 4) {
      setRegForm((prev) => ({ ...prev, step: 5, lmpDate: input }));
      addBotMessage(
        isTa
          ? `உங்கள் ஆரம்ப சுகாதார நிலையம் (PHC) அல்லது கிராமம் எது?`
          : `Which Primary Health Centre (PHC) or village do you belong to?`
      );
    } else if (step === 5) {
      setRegForm((prev) => ({ ...prev, step: 6, facility: input }));
      addBotMessage(
        isTa
          ? `கடைசியாக, அவசர தொடர்பு எண் மற்றும் உறவு (எ.கா. +91 98401 99999 - கணவர்):`
          : `Finally, what is your emergency contact number and relation? (e.g., +91 98401 99999 - Husband):`
      );
    } else if (step === 6) {
      const finalForm = {
        name: regForm.name,
        age: Number(regForm.age) || 24,
        phone: regForm.phone,
        preferredLanguage: language,
        lmpDate: regForm.lmpDate,
        healthcareFacility: regForm.facility,
        emergencyContact: input
      };

      try {
        setIsTyping(true);
        const res = await api.registerMother(finalForm);
        setIsTyping(false);

        const newMother = res.data;
        const metrics = res.metrics;
        setSelectedMother(newMother);
        setMothersList((prev) => [newMother, ...prev]);
        setChatState('MENU');

        const successMsg = isTa
          ? `நன்றி, ${newMother.name} 🌸 உங்கள் MOTHER+ சுயவிவரம் வெற்றிகரமாக உருவாக்கப்பட்டது!\n\n🤰 கணக்கிடப்பட்ட கர்ப்ப வாரம்: வாரம் ${metrics.gestationalWeeks}\n📅 எதிர்பார்க்கப்படும் பிரசவ தேதி: ${metrics.eddDate}\n🏥 மையம்: ${newMother.healthcareFacility}`
          : `Thank you, ${newMother.name} 🌸 Your MOTHER+ profile is ready.\n\n🤰 Calculated Gestational Age: Week ${metrics.gestationalWeeks}\n📅 Estimated Due Date (EDD): ${metrics.eddDate}\n🏥 Facility: ${newMother.healthcareFacility}`;

        addBotMessage(successMsg, [
          { id: '5', label: isTa ? 'தினசரி உடல்நல பரிசோதனை' : 'Daily Health Check' },
          { id: '3', label: isTa ? 'ஆரோக்கியக் குறிப்புகள்' : 'Health Tips' }
        ]);
      } catch (err) {
        setIsTyping(false);
        addBotMessage(`Registration error: ${err.message}. Please try again with format YYYY-MM-DD for LMP.`);
        setChatState('MENU');
      }
    }
  };

  // 2. MY PREGNANCY STATUS
  const handleMyPregnancyQuery = () => {
    const isTa = language === 'ta';
    if (!selectedMother) {
      addBotMessage(
        isTa
          ? 'நீங்கள் இன்னும் பதிவு செய்யவில்லை. 1 என தட்டச்சு செய்து உங்கள் சுயவிவரத்தை உருவாக்கவும்.'
          : 'You are not yet registered. Reply "1" or "Register" to create your profile.'
      );
      return;
    }

    const msg = isTa
      ? `🤰 உங்கள் கர்ப்ப நிலை விவரம்:\nபெயர்: ${selectedMother.name}\nகர்ப்ப வாரம்: வாரம் ${selectedMother.gestationalWeeks} (பருவம் ${selectedMother.trimester})\nஎதிர்பார்க்கப்படும் பிரசவ தேதி: ${selectedMother.eddDate}\nபாதுகாப்பு நிலை: ${selectedMother.riskLevel}\nபொறுப்பு செவிலியர்: ${selectedMother.healthcareWorker}\nமையம்: ${selectedMother.healthcareFacility}`
      : `🤰 Your Pregnancy Overview:\nName: ${selectedMother.name}\nGestational Age: Week ${selectedMother.gestationalWeeks} (Trimester ${selectedMother.trimester})\nEstimated Due Date: ${selectedMother.eddDate}\nRisk Tier: ${selectedMother.riskLevel}\nAssigned Worker: ${selectedMother.healthcareWorker}\nFacility: ${selectedMother.healthcareFacility}`;

    addBotMessage(msg, [
      { id: '5', label: isTa ? 'தினசரி பரிசோதனை' : 'Daily Health Check' },
      { id: '4', label: isTa ? 'நினைவூட்டல்கள்' : 'Reminders' }
    ]);
  };

  // 3. HEALTH TIPS
  const handleTipsQuery = async () => {
    const isTa = language === 'ta';
    try {
      const res = await api.getTips({ trimester: `trimester_${selectedMother?.trimester || 2}` });
      const tip = res.data?.[0] || {
        titleEn: 'Balanced Nutrition & Hydration',
        titleTa: 'சமச்சீர் ஊட்டச்சத்து மற்றும் நீர்ச்சத்து',
        contentEn: 'Eat green leafy vegetables, lentils, milk, and seasonal fruits daily. Drink at least 8-10 glasses of boiled cooled water.',
        contentTa: 'தினமும் கீரைகள், பருப்பு, பால் மற்றும் பழங்களை உண்ணவும். 8-10 டம்ளர் கொதிக்க வைத்து ஆறவைத்த தண்ணீரை பருகவும்.'
      };

      const msg = isTa
        ? `💡 இன்றைய ஊட்டச்சத்துக் குறிப்பு:\n*${tip.titleTa}*\n\n${tip.contentTa}\n\nமேலும் ஆலோசனைகளுக்கு உங்கள் செவிலியரை அணுகவும்.`
        : `💡 Health & Nutrition Guidance:\n*${tip.titleEn}*\n\n${tip.contentEn}\n\nAlways consult your healthcare worker for personalized advice.`;

      addBotMessage(msg, [
        { id: '5', label: isTa ? 'தினசரி பரிசோதனை' : 'Daily Health Check' },
        { id: 'menu', label: isTa ? 'முதன்மை மெனு' : 'Main Menu' }
      ]);
    } catch (err) {
      addBotMessage('Health tips loaded.');
    }
  };

  // 4. REMINDERS
  const handleRemindersQuery = async () => {
    const isTa = language === 'ta';
    try {
      const res = await api.getReminders({ motherId: selectedMother?.id });
      const reminders = res.data || [];
      const upcoming = reminders.filter((r) => r.status === 'UPCOMING');

      if (upcoming.length === 0) {
        const msg = isTa
          ? `🌸 உங்களுக்கு தற்போது நிலுவையில் உள்ள சந்திப்புகள் எதுவும் இல்லை. வழக்கமான மாத்திரைகளை தவறாமல் எடுக்கவும்.`
          : `🌸 You have no pending appointments right now. Remember to continue your daily iron & calcium supplements.`;
        addBotMessage(msg);
      } else {
        const nextAppt = upcoming[0];
        const dateFormatted = new Date(nextAppt.dueDateTime).toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const msg = isTa
          ? `⏰ வரவிருக்கும் சந்திப்பு நினைவூட்டல்:\n*${nextAppt.title}*\nதேதி: ${dateFormatted}\nகுறிப்பு: ${nextAppt.notes || 'MCP அட்டையை உடன் எடுத்து வரவும்.'}`
          : `⏰ Upcoming Antenatal Reminder:\n*${nextAppt.title}*\nDate: ${dateFormatted}\nNotes: ${nextAppt.notes || 'Please carry your Mother-Child Protection (MCP) card.'}`;

        addBotMessage(msg, [
          { id: '5', label: isTa ? 'தினசரி பரிசோதனை' : 'Daily Health Check' },
          { id: 'menu', label: isTa ? 'முதன்மை மெனு' : 'Main Menu' }
        ]);
      }
    } catch (err) {
      addBotMessage('Failed to fetch reminders.');
    }
  };

  // 5. DAILY HEALTH CHECK FLOW
  const startHealthCheckFlow = () => {
    setChatState('CHECKIN_GENERAL');
    setSelectedSymptoms([]);
    const isTa = language === 'ta';
    const msg = isTa
      ? `🩺 MOTHER+ தினசரி உடல்நல பரிசோதனை\n\nஇன்று நீங்கள் எப்படி உணர்கிறீர்கள்?`
      : `🩺 MOTHER+ Daily Health Check\n\nHow are you feeling today?`;

    addBotMessage(msg, [
      { id: 'feel_well', label: isTa ? '😊 1. நலமாக உள்ளேன்' : '😊 1. Feeling well' },
      { id: 'feel_discomfort', label: isTa ? '😐 2. லேசான அசௌகரியம்' : '😐 2. Discomfort' },
      { id: 'feel_concerning', label: isTa ? '⚠️ 3. கவலை தரும் அறிகுறிகள்' : '⚠️ 3. Concerning symptoms' },
      { id: 'feel_emergency', label: isTa ? '🚨 4. அவசர நிலை' : '🚨 4. Emergency' }
    ]);
  };

  const handleGeneralFeelingSelect = (feelingId) => {
    const isTa = language === 'ta';

    if (feelingId === 'feel_well') {
      addUserMessage(isTa ? 'நலமாக உள்ளேன்' : 'Feeling well');
      submitTriageReport('well', []);
    } else if (feelingId === 'feel_emergency') {
      addUserMessage(isTa ? 'அவசர நிலை!' : 'Emergency!');
      submitTriageReport('emergency', ['Immediate Emergency Selected']);
    } else {
      // Discomfort or Concerning -> open symptom multi-select
      const feeling = feelingId === 'feel_discomfort' ? 'discomfort' : 'concerning';
      addUserMessage(feeling === 'discomfort' ? (isTa ? 'லேசான அசௌகரியம்' : 'Some discomfort') : (isTa ? 'கவலை தரும் அறிகுறிகள்' : 'Concerning symptoms'));
      setChatState('CHECKIN_SYMPTOMS');
      
      const prompt = isTa
        ? `தயவுசெய்து நீங்கள் உணரும் அறிகுறிகளை கீழே தேர்வு செய்யவும்:`
        : `Please select any symptoms you are experiencing right now from the list below:`;
      addBotMessage(prompt, [], 300, { isSymptomSelector: true, feelingType: feeling });
    }
  };

  const toggleSymptomSelection = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
    );
  };

  const submitTriageReport = async (feelingGeneral, symptomsToSubmit = selectedSymptoms) => {
    const isTa = language === 'ta';
    setIsTyping(true);

    try {
      const payload = {
        motherId: selectedMother?.id,
        phone: selectedMother?.phone,
        name: selectedMother?.name,
        feelingGeneral,
        symptoms: symptomsToSubmit
      };

      const res = await api.submitHealthCheck(payload);
      const evalData = res.data.evaluation;
      setIsTyping(false);

      if (evalData.level === 'RED') {
        // RED WARNING DISPLAY
        const redMsg = isTa ? (evalData.tamilMessage || evalData.message) : (evalData.message || evalData.tamilMessage);
        const emergencyNotice = isTa
          ? `🚨 அவசர நடவடிக்கை:\nதயவுசெய்து அடுத்த பரிசோதனை நாள் வரை காத்திருக்க வேண்டாம். உடனடியாக 108 ஐ அழைக்கவும் அல்லது அருகிலுள்ள அவசர மருத்துவமனைக்குச் செல்லவும்.\n\n*சுகாதாரப் பணியாளருக்கு (${selectedMother?.healthcareWorker || 'ANM/ASHA'}) அவசர எச்சரிக்கை அனுப்பப்பட்டுள்ளது.*`
          : `🚨 URGENT ACTION REQUIRED:\nDo NOT wait for a scheduled appointment. Please call 108 or go to the nearest hospital emergency unit immediately.\n\n*An urgent alert has been dispatched to your healthcare worker (${selectedMother?.healthcareWorker || 'ANM'}).*`;

        addBotMessage(`${redMsg}\n\n${emergencyNotice}`, [
          { id: 'menu', label: isTa ? 'முதன்மை மெனு' : 'Main Menu' }
        ], 200, { riskLevel: 'RED' });

        // Update local mother status
        if (selectedMother) {
          setSelectedMother((prev) => (prev ? { ...prev, riskLevel: 'RED' } : null));
        }
      } else if (evalData.level === 'YELLOW') {
        const yellowMsg = isTa ? (evalData.tamilMessage || evalData.message) : (evalData.message || evalData.tamilMessage);
        addBotMessage(yellowMsg, [
          { id: '4', label: isTa ? '4. நினைவூட்டல் பார்க்க' : '4. View Reminders' },
          { id: 'menu', label: isTa ? 'முதன்மை மெனு' : 'Main Menu' }
        ], 200, { riskLevel: 'YELLOW' });

        if (selectedMother && selectedMother.riskLevel !== 'RED') {
          setSelectedMother((prev) => (prev ? { ...prev, riskLevel: 'YELLOW' } : null));
        }
      } else {
        const greenMsg = isTa ? (evalData.tamilMessage || evalData.message) : (evalData.message || evalData.tamilMessage);
        addBotMessage(greenMsg, [
          { id: '3', label: isTa ? '3. ஆரோக்கியக் குறிப்புகள்' : '3. Health Tips' },
          { id: 'menu', label: isTa ? 'முதன்மை மெனு' : 'Main Menu' }
        ], 200, { riskLevel: 'GREEN' });
      }

      setChatState('MENU');
      setSelectedSymptoms([]);
    } catch (err) {
      setIsTyping(false);
      addBotMessage(`Error evaluating health check: ${err.message}`);
      setChatState('MENU');
    }
  };

  // 6. HELP & EMERGENCY
  const handleHelpQuery = () => {
    const isTa = language === 'ta';
    const msg = isTa
      ? `🚨 அவசர உதவி எண்கள் & ஆதரவு:\n\n• அரசு 24x7 அவசர ஆம்புலன்ஸ்: 108\n• கர்ப்பிணி பெண்கள் உதவி எண்: 102\n• ஆரம்ப சுகாதார நிலையம்: ${selectedMother?.healthcareFacility || 'அருகிலுள்ள PHC'}\n• பொறுப்பு செவிலியர்: ${selectedMother?.healthcareWorker || 'ANM'}\n\nஉடல்நல பாதிப்பு இருந்தால் தாமதிக்காமல் மருத்துவமனை செல்லவும்.`
      : `🚨 Emergency Contacts & Support:\n\n• National Emergency Ambulance: 108\n• Pregnant Mother Helpline: 102\n• Primary Health Centre: ${selectedMother?.healthcareFacility || 'Local PHC'}\n• Assigned Worker: ${selectedMother?.healthcareWorker || 'ANM/ASHA'}\n\nIn case of critical danger signs, do not wait for an online response. Seek hospital care immediately.`;

    addBotMessage(msg, [
      { id: '5', label: isTa ? '5. தினசரி பரிசோதனை' : '5. Daily Health Check' },
      { id: 'menu', label: isTa ? 'முதன்மை மெனு' : 'Main Menu' }
    ]);
  };

  // Switch language button inside chat
  const handleToggleLangInChat = () => {
    const newLang = language === 'en' ? 'ta' : 'en';
    handleSelectLanguage(newLang);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 py-6 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Top Demo Controller Ribbon */}
      <div className="w-full max-w-md mb-4 bg-white rounded-2xl p-3 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            {t('selectDemoMother') || 'Simulate Mother:'}
          </span>
          <select
            value={selectedMother?.id || ''}
            onChange={(e) => {
              const m = mothersList.find((item) => item.id === e.target.value);
              if (m) selectMotherForChat(m);
            }}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 w-full"
          >
            {mothersList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.riskLevel}) - Wk {m.gestationalWeeks}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startRegistrationFlow}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('newRegistrationOption') || '+ New Registration'}
          </button>
          <button
            onClick={() => showLanguageSelectionPrompt()}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            title={language === 'ta' ? 'மொழியைத் தேர்ந்தெடுக்க' : 'Choose Language'}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Realistic Mobile Messaging Frame */}
      <div className="w-full max-w-md h-[680px] bg-white rounded-[38px] shadow-2xl border-[8px] border-slate-800 flex flex-col overflow-hidden relative">
        {/* Smartphone Speaker / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-30 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* WhatsApp-Style Header */}
        <div className="bg-emerald-700 text-white pt-7 pb-3 px-4 flex items-center justify-between shadow-md z-20">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-emerald-100 hover:text-white"
              title="Return to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-lg shadow-xs">
                🌸
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-700 rounded-full" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm tracking-tight">MOTHER+</span>
                <span className="text-[10px] bg-emerald-900/60 px-1 py-0.2 rounded font-semibold text-emerald-200">
                  Verified
                </span>
              </div>
              <span className="text-[11px] text-emerald-100 font-normal">
                {isTyping ? 'typing...' : 'online'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick in-chat language toggle */}
            <button
              onClick={handleToggleLangInChat}
              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 border border-emerald-600 cursor-pointer shadow-xs"
              title={language === 'en' ? 'தமிழில் மாற்றவும்' : 'Switch to English'}
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Chat Message Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 whatsapp-bg">
          {/* Encryption / Community Care Disclaimer Bubble */}
          <div className="mx-auto max-w-[85%] bg-amber-100/90 text-amber-900 text-[10px] text-center p-2 rounded-xl shadow-xs border border-amber-200/80 leading-snug">
            🛡️ MOTHER+ Health Assistant • Deterministic Safety Screening • For medical emergencies call 108.
          </div>

          {/* Active mother banner indicator */}
          {selectedMother && (
            <div className="mx-auto max-w-[90%] bg-emerald-100/90 text-emerald-950 text-[11px] font-medium text-center py-1 px-3 rounded-full shadow-xs border border-emerald-200">
              Active: <strong>{selectedMother.name}</strong> • Week {selectedMother.gestationalWeeks} • Risk: {selectedMother.riskLevel}
            </div>
          )}

          {/* Render Messages */}
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isBot
                      ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/70'
                      : 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200/60'
                  } ${
                    msg.extraData?.riskLevel === 'RED'
                      ? 'border-2 border-rose-500 bg-rose-50/95 text-rose-950 font-medium'
                      : msg.extraData?.riskLevel === 'YELLOW'
                      ? 'border-2 border-amber-400 bg-amber-50/95'
                      : ''
                  }`}
                >
                  {/* Message body */}
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Red Alert Callout if present */}
                  {msg.extraData?.riskLevel === 'RED' && (
                    <div className="mt-2.5 p-2 bg-rose-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
                      <AlertOctagon className="h-4 w-4 shrink-0 animate-pulse" />
                      <span>{t('urgentWarningBanner')}</span>
                    </div>
                  )}

                  {/* Interactive Symptom Multi-Select inside chat */}
                  {msg.extraData?.isSymptomSelector && (
                    <div className="mt-3 pt-2 border-t border-slate-200 space-y-2">
                      <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        {language === 'ta' ? 'ஆபத்து அறிகுறிகள் (சிவப்பு நிலை)' : 'Danger Signs (RED Level)'}
                      </div>
                      <div className="space-y-1">
                        {availableSymptoms.dangerSigns?.map((ds) => {
                          const isChecked = selectedSymptoms.includes(ds.id);
                          return (
                            <button
                              key={ds.id}
                              type="button"
                              onClick={() => toggleSymptomSelection(ds.id)}
                              className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-rose-100 border-rose-400 text-rose-900 font-semibold'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span>{language === 'ta' ? ds.ta : ds.en}</span>
                              {isChecked && <Check className="h-3.5 w-3.5 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider pt-2 flex items-center gap-1">
                        <span>{language === 'ta' ? 'லேசான கர்ப்ப அசௌகரியங்கள் (மஞ்சள் நிலை)' : 'Mild Pregnancy Discomforts (YELLOW Level)'}</span>
                      </div>
                      <div className="space-y-1">
                        {availableSymptoms.mildDiscomforts?.map((md) => {
                          const isChecked = selectedSymptoms.includes(md.id);
                          return (
                            <button
                              key={md.id}
                              type="button"
                              onClick={() => toggleSymptomSelection(md.id)}
                              className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span>{language === 'ta' ? md.ta : md.en}</span>
                              {isChecked && <Check className="h-3.5 w-3.5 text-amber-700 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => submitTriageReport(msg.extraData.feelingType, selectedSymptoms)}
                        className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {language === 'ta' ? 'பரிசோதனையை சமர்ப்பிக்கவும்' : 'Submit Health Check'} ({selectedSymptoms.length} {language === 'ta' ? 'தேர்வு செய்யப்பட்டது' : 'selected'})
                      </button>
                    </div>
                  )}

                  {/* Timestamp & double check */}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {!isBot && <CheckCheck className="h-3.5 w-3.5 text-blue-500" />}
                  </div>
                </div>

                {/* Quick Reply Action Pills */}
                {msg.quickOptions && msg.quickOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.quickOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          if (opt.id === 'feel_well' || opt.id === 'feel_discomfort' || opt.id === 'feel_concerning' || opt.id === 'feel_emergency') {
                            handleGeneralFeelingSelect(opt.id);
                          } else if (opt.id === 'menu') {
                            initWelcomeChat(selectedMother, language);
                          } else if (opt.id === 'lang_en') {
                            addUserMessage('1. English');
                            handleSelectLanguage('en');
                          } else if (opt.id === 'lang_ta') {
                            addUserMessage('2. தமிழ்');
                            handleSelectLanguage('ta');
                          } else if (opt.id === '7' || opt.id === 'change_lang') {
                            addUserMessage(language === 'ta' ? '🌐 மொழியை மாற்று' : '🌐 Change Language');
                            showLanguageSelectionPrompt();
                          } else {
                            handleSendMessage(opt.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 font-medium text-xs rounded-full border border-emerald-300 shadow-xs hover:border-emerald-500 transition-all cursor-pointer text-left"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-2 w-16 text-slate-400 shadow-xs">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-slate-100 p-2.5 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('typeMessagePlaceholder') || 'Type a message or select an option...'}
            className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
