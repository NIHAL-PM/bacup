const { WHATSAPP_TEMPLATES } = require('../../dist/lib/whatsappTemplates');
const { sendWhatsAppMessage } = require('../../dist/lib/kernelWhatsApp');
const connectDB = require('./lib/mongoose.cjs');
const mongoose = require('mongoose');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { registrationId, type } = req.body; 
  // type = 'initial', 'followUp', 'finalWarning', 'confirmed', 'twoDayReminder'

  if (!registrationId || !type) {
    return res.status(400).json({ error: 'Missing ID or type' });
  }

  try {
    await connectDB();
    
    // Fetch user from database
    const Registration = mongoose.models.Registration || mongoose.model('Registration', new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      fullName: String,
      contactNumber: String,
      deleted: { type: Boolean, default: false }
    }));

    const user = await Registration.findById(registrationId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Use fullName or name, and contactNumber or phone
    const userName = user.fullName || user.name;
    const userPhone = user.contactNumber || user.phone;

    // 1. Select Template
    const templateFn = WHATSAPP_TEMPLATES[type];
    if (!templateFn) {
      return res.status(400).json({ error: 'Invalid message type' });
    }

    const message = templateFn(userName || 'Attendee');

    // 2. Send via Kernel
    const result = await sendWhatsAppMessage(userPhone, message);

    // 3. Handle Result
    if (result.status === 'NEEDS_SCAN') {
       // Return the QR code image to the frontend so admin can scan it!
       return res.status(401).json({ 
         message: 'Authentication required', 
         qrCodeBase64: result.screenshot 
       });
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to send' });
    }

    return res.status(200).json({ message: 'Message sent successfully' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};