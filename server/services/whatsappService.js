/**
 * WhatsApp Cloud API Integration Service
 * 
 * Supports two operating modes:
 * 1. SIMULATION / MOCK MODE (Default): Logs message payloads, emits to local web simulator,
 *    and simulates automated inbound webhook messages without requiring Meta developer accounts.
 * 2. PRODUCTION / META CLOUD API MODE: Activated when WHATSAPP_ACCESS_TOKEN and
 *    WHATSAPP_PHONE_NUMBER_ID are provided in the environment.
 */

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
export const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mother_plus_verify_token_2026';

export const isProductionWhatsAppConfigured = Boolean(
  WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID
);

/**
 * Send an outbound message (text or interactive) to a recipient phone number.
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient phone number (E.164 format, e.g., +919840112345)
 * @param {string} options.body - Text message body
 * @param {Array} [options.quickReplies] - Array of quick reply button objects { id, title }
 * @param {string} [options.language] - 'en' or 'ta'
 */
export async function sendWhatsAppMessage({ to, body, quickReplies = [], language = 'en' }) {
  const timestamp = new Date().toISOString();
  
  if (!isProductionWhatsAppConfigured) {
    // MOCK / SIMULATION MODE
    const logEntry = {
      mode: 'MOCK_SIMULATOR',
      status: 'SENT_SIMULATED',
      to,
      body,
      quickReplies,
      language,
      timestamp,
      messageId: `wamid.mock.${Date.now()}.${Math.floor(Math.random() * 10000)}`
    };

    console.log(`[WHATSAPP MOCK DISPATCH] -> To: ${to} | Text: "${body.substring(0, 60)}..."`);
    return {
      success: true,
      mode: 'MOCK',
      meta: logEntry
    };
  }

  // META WHATSAPP CLOUD API IMPLEMENTATION
  try {
    const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    let payload;
    if (quickReplies && quickReplies.length > 0) {
      // Interactive Button Message
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to.replace(/\D/g, ''),
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: body },
          action: {
            buttons: quickReplies.slice(0, 3).map((btn, idx) => ({
              type: 'reply',
              reply: {
                id: btn.id || `btn_${idx}`,
                title: btn.title.substring(0, 20)
              }
            }))
          }
        }
      };
    } else {
      // Plain text message
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to.replace(/\D/g, ''),
        type: 'text',
        text: { preview_url: false, body }
      };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await res.json();
    if (!res.ok) {
      console.error('[WhatsApp Cloud API Error]', responseData);
      return { success: false, error: responseData };
    }

    return {
      success: true,
      mode: 'META_CLOUD_API',
      messageId: responseData.messages?.[0]?.id,
      data: responseData
    };
  } catch (err) {
    console.error('[WhatsApp Network Failure]', err.message);
    return {
      success: false,
      mode: 'META_CLOUD_API',
      error: err.message
    };
  }
}
