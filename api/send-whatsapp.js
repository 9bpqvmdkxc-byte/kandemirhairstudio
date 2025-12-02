// Test modu - Twilio credentials eksik olduğunda
// Gerçek Twilio credentials eklendiğinde bu kod otomatik çalışacak

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message } = req.body;

    // Telefon numarasını format et (Türkiye: 05XX -> +905XX)
    let formattedPhone = to;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+90' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Test modu log
    console.log('========== WhatsApp Bildirimi ==========');
    console.log('Alıcı:', formattedPhone);
    console.log('Mesaj:', message);
    console.log('Zaman:', new Date().toLocaleString('tr-TR'));
    console.log('==========================================');

    // Twilio credentials kontrol et
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
      // Test modu - credentials eksik
      console.warn('⚠️ Twilio credentials yapılandırılmamış - TEST MODU');
      return res.status(200).json({
        success: true,
        mode: 'TEST',
        message: 'Gerçek Twilio credentials eklenince mesaj gönderilecek',
        phone: formattedPhone,
        timestamp: new Date().toISOString()
      });
    }

    // Gerçek Twilio modu
    const twilio = require('twilio');
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const response = await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${formattedPhone}`,
      body: message
    });

    console.log(`✅ WhatsApp gönderildi: ${formattedPhone} (SID: ${response.sid})`);
    res.status(200).json({
      success: true,
      mode: 'PRODUCTION',
      messageSid: response.sid,
      phone: formattedPhone
    });
  } catch (error) {
    console.error('❌ WhatsApp gönderme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

