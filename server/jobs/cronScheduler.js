import cron from 'node-cron';
import { db } from '../services/dbService.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

let isJobRunning = false;

/**
 * Initialize automated background cron job to monitor and dispatch maternal reminders.
 * Checks every minute for prototype demonstration.
 */
export function initCronJobs() {
  console.log('[CRON] Initializing MOTHER+ Reminder Scheduler (every 1 minute check)...');

  cron.schedule('* * * * *', async () => {
    if (isJobRunning) return;
    isJobRunning = true;

    try {
      const now = new Date();
      const allReminders = await db.find('reminders', { status: 'UPCOMING' });
      
      for (const reminder of allReminders) {
        const dueDate = new Date(reminder.dueDateTime);
        // Check if reminder is due or past due within prototype window
        if (dueDate <= now) {
          console.log(`[CRON DISPATCH] Reminder #${reminder.id} is due for ${reminder.motherName} (${reminder.phone})`);
          
          const mother = await db.findById('mothers', reminder.motherId);
          const lang = mother?.preferredLanguage || 'en';

          const messageEn = `🌸 Hello ${reminder.motherName}!\nThis is your MOTHER+ reminder:\nYou have an upcoming ${reminder.title.toLowerCase()}.\nPlease follow the appointment instructions provided by your healthcare worker (${mother?.healthcareWorker || 'PHC Team'}).`;
          const messageTa = `🌸 வணக்கம் ${reminder.motherName}!\nஇது உங்கள் MOTHER+ நினைவூட்டல்:\nஉங்களுக்கு ${reminder.title} திட்டமிடப்பட்டுள்ளது.\nதயவுசெய்து உங்கள் சுகாதாரப் பணியாளர் (${mother?.healthcareWorker || 'சுகாதார நிலையம்'}) வழங்கிய வழிமுறைகளைப் பின்பற்றவும்.`;

          await sendWhatsAppMessage({
            to: reminder.phone,
            body: lang === 'ta' ? messageTa : messageEn,
            language: lang
          });

          // Mark as sent / completed in prototype
          await db.updateById('reminders', reminder.id, {
            status: 'COMPLETED',
            sentAt: now.toISOString()
          });
        }
      }
    } catch (err) {
      console.error('[CRON ERROR]', err.message);
    } finally {
      isJobRunning = false;
    }
  });
}

/**
 * Helper to manually dispatch an instant test reminder for demonstration.
 */
export async function dispatchManualReminder(reminderId) {
  const reminder = await db.findById('reminders', reminderId);
  if (!reminder) {
    throw new Error('Reminder not found');
  }

  const mother = await db.findById('mothers', reminder.motherId);
  const lang = mother?.preferredLanguage || 'en';

  const messageEn = `🌸 Hello ${reminder.motherName}!\nThis is your MOTHER+ reminder:\nYou have an upcoming ${reminder.title}.\nPlease follow the appointment instructions provided by your healthcare worker (${mother?.healthcareWorker || 'PHC Team'}).`;
  const messageTa = `🌸 வணக்கம் ${reminder.motherName}!\nஇது உங்கள் MOTHER+ நினைவூட்டல்:\nஉங்களுக்கு ${reminder.title} திட்டமிடப்பட்டுள்ளது.\nதயவுசெய்து உங்கள் சுகாதாரப் பணியாளர் (${mother?.healthcareWorker || 'சுகாதார நிலையம்'}) வழங்கிய வழிமுறைகளைப் பின்பற்றவும்.`;

  const dispatchResult = await sendWhatsAppMessage({
    to: reminder.phone,
    body: lang === 'ta' ? messageTa : messageEn,
    language: lang
  });

  const updated = await db.updateById('reminders', reminder.id, {
    lastTestSentAt: new Date().toISOString(),
    status: 'COMPLETED'
  });

  return {
    reminder: updated,
    dispatchResult,
    sentMessageText: lang === 'ta' ? messageTa : messageEn
  };
}
