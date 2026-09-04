import express from 'express';
import {
  sendWhatsAppMessage,
  WHATSAPP_VERIFY_TOKEN,
  isProductionWhatsAppConfigured
} from '../services/whatsappService.js';
import { db } from '../services/dbService.js';
import { evaluateHealthStatus, calculatePregnancyMetrics } from '../rules/healthRulesEngine.js';

const router = express.Router();

/**
 * GET /api/whatsapp/webhook
 * Meta WhatsApp Cloud API Webhook Verification Endpoint
 */
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('[WHATSAPP WEBHOOK] Verified challenge with Meta Cloud API successfully');
      return res.status(200).send(challenge);
    } else {
      console.warn('[WHATSAPP WEBHOOK] Token verification mismatch');
      return res.status(403).send('Forbidden verification token');
    }
  }

  res.status(400).send('Bad Request: Missing hub parameters');
});

/**
 * POST /api/whatsapp/webhook
 * Inbound Webhook Listener for Meta Cloud API or direct simulator triggers
 */
router.post('/webhook', async (req, res, next) => {
  try {
    const body = req.body;

    // Handle Meta WhatsApp Cloud API payload format
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; // Phone number
        const text = message.text?.body || message.interactive?.button_reply?.title || '';
        const buttonId = message.interactive?.button_reply?.id;

        console.log(`[WHATSAPP INBOUND META] From: ${from} | Text: "${text}" | ButtonId: ${buttonId}`);
        // Process message through conversational rules
        await processInboundWhatsAppMessage(from, text, buttonId);
      }

      return res.status(200).send('EVENT_RECEIVED');
    }

    // Direct Simulator / Mock payload format: { from, text, buttonId }
    if (body.from || body.phone) {
      const from = body.from || body.phone;
      const text = body.text || body.message || '';
      const buttonId = body.buttonId || null;

      const reply = await processInboundWhatsAppMessage(from, text, buttonId);
      return res.json({ success: true, mode: 'SIMULATOR', response: reply });
    }

    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/whatsapp/send
 * Direct API to dispatch WhatsApp message (used by Healthcare dashboard or test tools)
 */
router.post('/send', async (req, res, next) => {
  try {
    const { to, body, quickReplies = [], language = 'en' } = req.body;
    if (!to || !body) {
      return res.status(400).json({ success: false, error: 'Recipient "to" and message "body" are required' });
    }

    const result = await sendWhatsAppMessage({ to, body, quickReplies, language });
    res.json({
      success: true,
      data: result,
      metaConfigured: isProductionWhatsAppConfigured
    });
  } catch (err) {
    next(err);
  }
});

/**
 * High-level conversational state processor for WhatsApp interactions.
 */
async function processInboundWhatsAppMessage(fromPhone, incomingText, buttonId) {
  const normalizedPhone = fromPhone.replace(/\D/g, '');
  const allMothers = await db.find('mothers');
  const mother = allMothers.find(m => m.phone.replace(/\D/g, '').includes(normalizedPhone));
  const lang = mother?.preferredLanguage || 'en';

  const cleanText = incomingText.trim().toLowerCase();

  // 1. Help or Menu command
  if (cleanText === 'hi' || cleanText === 'hello' || cleanText === 'menu' || buttonId === 'btn_menu') {
    const nameGreeting = mother ? ` ${mother.name}` : '';
    const bodyEn = `Hello${nameGreeting}! Welcome to MOTHER+ 🌸\nSupporting every mother, every step.\n\nReply with a number or click an option below:\n1. 📋 Register\n2. 🤰 My Pregnancy\n3. 💡 Health Tips\n4. ⏰ Reminders\n5. 🩺 Daily Health Check\n6. ❓ Help / Emergency`;
    const bodyTa = `வணக்கம்${nameGreeting}! MOTHER+ இற்கு நல்வரவு 🌸\nஒவ்வொரு தாய்க்கும், ஒவ்வொரு அடியிலும் பாதுகாப்பு.\n\nகீழே உள்ள விருப்பத்தைத் தேர்ந்தெடுக்கவும்:\n1. 📋 பதிவு செய்ய\n2. 🤰 என் கர்ப்ப நிலை\n3. 💡 ஆரோக்கியக் குறிப்புகள்\n4. ⏰ நினைவூட்டல்கள்\n5. 🩺 தினசரி உடல்நல பரிசோதனை\n6. ❓ உதவி / அவசர உதவி`;

    return await sendWhatsAppMessage({
      to: fromPhone,
      body: lang === 'ta' ? bodyTa : bodyEn,
      language: lang,
      quickReplies: [
        { id: 'btn_checkin', title: lang === 'ta' ? 'உடல்நல பரிசோதனை' : 'Daily Health Check' },
        { id: 'btn_mypregnancy', title: lang === 'ta' ? 'என் கர்ப்ப நிலை' : 'My Pregnancy' },
        { id: 'btn_tips', title: lang === 'ta' ? 'ஆரோக்கியக் குறிப்பு' : 'Health Tips' }
      ]
    });
  }

  // 2. Daily Health Check trigger
  if (cleanText === '5' || cleanText.includes('check') || buttonId === 'btn_checkin') {
    const bodyEn = `🩺 MOTHER+ Daily Health Check\n\nHow are you feeling today?\n1. 😊 Feeling well\n2. 😐 I have some discomfort\n3. ⚠️ I have concerning symptoms\n4. 🚨 Emergency`;
    const bodyTa = `🩺 MOTHER+ தினசரி உடல்நல பரிசோதனை\n\nஇன்று நீங்கள் எப்படி உணர்கிறீர்கள்?\n1. 😊 நலமாக உள்ளேன்\n2. 😐 லேசான அசௌகரியம் உள்ளது\n3. ⚠️ கவலை தரும் அறிகுறிகள் உள்ளன\n4. 🚨 அவசர நிலை`;

    return await sendWhatsAppMessage({
      to: fromPhone,
      body: lang === 'ta' ? bodyTa : bodyEn,
      language: lang,
      quickReplies: [
        { id: 'feel_well', title: lang === 'ta' ? 'நலமாக உள்ளேன்' : 'Feeling well' },
        { id: 'feel_discomfort', title: lang === 'ta' ? 'லேசான அசௌகரியம்' : 'Discomfort' },
        { id: 'feel_emergency', title: lang === 'ta' ? 'அவசர நிலை' : 'Emergency' }
      ]
    });
  }

  // 3. Status of pregnancy
  if (cleanText === '2' || cleanText.includes('pregnancy') || buttonId === 'btn_mypregnancy') {
    if (!mother) {
      const notRegEn = 'You are not yet registered with MOTHER+. Please reply with "Register" to start your profile.';
      const notRegTa = 'நீங்கள் இன்னும் MOTHER+ இல் பதிவு செய்யவில்லை. பதிவு செய்ய "Register" அல்லது 1 என பதிலளிக்கவும்.';
      return await sendWhatsAppMessage({ to: fromPhone, body: lang === 'ta' ? notRegTa : notRegEn, language: lang });
    }

    const metrics = calculatePregnancyMetrics(mother.lmpDate);
    const bodyEn = `🤰 Your Pregnancy Overview\nName: ${mother.name}\nGestational Age: Week ${metrics?.gestationalWeeks || mother.gestationalWeeks}\nEstimated Due Date: ${metrics?.eddDate || mother.eddDate}\nRisk Tier: ${mother.riskLevel}\nAssigned Worker: ${mother.healthcareWorker}\nFacility: ${mother.healthcareFacility}`;
    const bodyTa = `🤰 உங்கள் கர்ப்ப விவரம்\nபெயர்: ${mother.name}\nகர்ப்ப வாரம்: வாரம் ${metrics?.gestationalWeeks || mother.gestationalWeeks}\nஎதிர்பார்க்கப்படும் பிரசவ தேதி: ${metrics?.eddDate || mother.eddDate}\nபாதுகாப்பு நிலை: ${mother.riskLevel}\nசுகாதாரப் பணியாளர்: ${mother.healthcareWorker}\nசுகாதார மையம்: ${mother.healthcareFacility}`;

    return await sendWhatsAppMessage({ to: fromPhone, body: lang === 'ta' ? bodyTa : bodyEn, language: lang });
  }

  // Default fallback
  const fallbackEn = `Thank you for messaging MOTHER+ 🌸. Reply "menu" to see available health options or contact your PHC at 108 in case of an obstetric emergency.`;
  const fallbackTa = `MOTHER+ உடன் இணைந்ததற்கு நன்றி 🌸. விருப்பங்களைப் பார்க்க "menu" என பதிலளிக்கவும் அல்லது அவசர உதவிக்கு 108 ஐ அழைக்கவும்.`;
  return await sendWhatsAppMessage({ to: fromPhone, body: lang === 'ta' ? fallbackTa : fallbackEn, language: lang });
}

export default router;
