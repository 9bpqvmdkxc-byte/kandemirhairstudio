/**
 * SMS Entegrasyonu Servisi
 * 
 * Bu dosya SMS gönderimi için hazırlanmıştır.
 * Desteklenen SMS API'leri:
 * - Twilio
 * - AWS SNS
 * - Netgsm
 * - Iletişim Merkezi
 */

// SMS API Konfigürasyonu
const SMS_CONFIG = {
  provider: process.env.REACT_APP_SMS_PROVIDER || 'twilio', // 'twilio', 'aws', 'netgsm', etc.
  apiKey: process.env.REACT_APP_SMS_API_KEY,
  apiSecret: process.env.REACT_APP_SMS_API_SECRET,
  from: process.env.REACT_APP_SMS_FROM_NUMBER || '+90',
};

/**
 * Randevu onayı SMS gönder
 * @param {string} phoneNumber - Müşteri telefon numarası
 * @param {object} appointment - Randevu bilgileri
 * @returns {Promise<boolean>} - Başarı durumu
 */
export const sendAppointmentConfirmationSMS = async (phoneNumber, appointment) => {
  if (!SMS_CONFIG.apiKey) {
    console.warn('SMS API anahtarı konfigüre edilmemiştir');
    return false;
  }

  const message = `
Kandemir Hair Studio Randevu Onayı:
📅 ${appointment.date}
🕐 ${appointment.hour}:00
✂️ Hizmet: ${appointment.service}
👨‍💼 Çalışan: ${appointment.kuafor}

Sorular için: +90-XXX-XXX-XXXX
  `.trim();

  try {
    const response = await sendSMS(phoneNumber, message);
    return response.success;
  } catch (error) {
    console.error('SMS gönderme hatası:', error);
    return false;
  }
};

/**
 * Randevu iptal SMS gönder
 * @param {string} phoneNumber - Müşteri telefon numarası
 * @param {object} appointment - Randevu bilgileri
 * @returns {Promise<boolean>}
 */
export const sendAppointmentCancellationSMS = async (phoneNumber, appointment) => {
  if (!SMS_CONFIG.apiKey) {
    console.warn('SMS API anahtarı konfigüre edilmemiştir');
    return false;
  }

  const message = `
Kandemir Hair Studio - Randevu İptali:
${appointment.date} ${appointment.hour}:00 saatindeki randevunuz iptal edilmiştir.
Yeni randevu almak için lütfen bize ulaşın.
  `.trim();

  try {
    const response = await sendSMS(phoneNumber, message);
    return response.success;
  } catch (error) {
    console.error('SMS gönderme hatası:', error);
    return false;
  }
};

/**
 * Randevu hatırlatma SMS gönder (24 saat öncesi)
 * @param {string} phoneNumber - Müşteri telefon numarası
 * @param {object} appointment - Randevu bilgileri
 * @returns {Promise<boolean>}
 */
export const sendAppointmentReminderSMS = async (phoneNumber, appointment) => {
  if (!SMS_CONFIG.apiKey) {
    console.warn('SMS API anahtarı konfigüre edilmemiştir');
    return false;
  }

  const message = `
⏰ Kandemir Hair Studio - Randevu Hatırlatması:
Yarın saat ${appointment.hour}:00'de randevunuz var.
Sorular veya değişiklik için: +90-XXX-XXX-XXXX
  `.trim();

  try {
    const response = await sendSMS(phoneNumber, message);
    return response.success;
  } catch (error) {
    console.error('SMS gönderme hatası:', error);
    return false;
  }
};

/**
 * Genel SMS gönderme fonksiyonu
 * @param {string} to - Alıcı telefon numarası
 * @param {string} message - SMS mesajı
 * @returns {Promise<object>} - API yanıtı
 */
const sendSMS = async (to, message) => {
  switch (SMS_CONFIG.provider) {
    case 'twilio':
      return await sendViaTwilio(to, message);
    case 'aws':
      return await sendViaAWS(to, message);
    case 'netgsm':
      return await sendViaNetgsm(to, message);
    default:
      console.warn(`Bilinmeyen SMS provider: ${SMS_CONFIG.provider}`);
      return { success: false };
  }
};

/**
 * Twilio üzerinden SMS gönder
 */
const sendViaTwilio = async (to, message) => {
  try {
    const response = await fetch('/api/send-sms-twilio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });
    const data = await response.json();
    return { success: data.success, messageId: data.messageId };
  } catch (error) {
    console.error('Twilio SMS hatası:', error);
    return { success: false };
  }
};

/**
 * AWS SNS üzerinden SMS gönder
 */
const sendViaAWS = async (to, message) => {
  try {
    const response = await fetch('/api/send-sms-aws', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });
    const data = await response.json();
    return { success: data.success, messageId: data.messageId };
  } catch (error) {
    console.error('AWS SMS hatası:', error);
    return { success: false };
  }
};

/**
 * Netgsm üzerinden SMS gönder (Türkiye)
 */
const sendViaNetgsm = async (to, message) => {
  try {
    const response = await fetch('/api/send-sms-netgsm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });
    const data = await response.json();
    return { success: data.success, messageId: data.messageId };
  } catch (error) {
    console.error('Netgsm SMS hatası:', error);
    return { success: false };
  }
};

export default {
  sendAppointmentConfirmationSMS,
  sendAppointmentCancellationSMS,
  sendAppointmentReminderSMS,
  SMS_CONFIG,
};
