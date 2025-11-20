import { WHATSAPP_TEMPLATES } from './whatsappTemplates';
import { sendWhatsAppMessage } from './kernelWhatsApp';

// Test script for WhatsApp integration
export async function testWhatsAppIntegration() {
  console.log('🧪 Testing WhatsApp Integration...\n');
  
  // Test 1: Message Templates
  console.log('1️⃣ Testing Message Templates:');
  const testName = 'Test User';
  
  console.log('Initial Template:');
  console.log(WHATSAPP_TEMPLATES.initial(testName));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('FollowUp Template:');
  console.log(WHATSAPP_TEMPLATES.followUp(testName));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('Final Warning Template:');
  console.log(WHATSAPP_TEMPLATES.finalWarning(testName));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('Confirmed Template:');
  console.log(WHATSAPP_TEMPLATES.confirmed(testName));
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('Two Day Reminder Template:');
  console.log(WHATSAPP_TEMPLATES.twoDayReminder(testName));
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Kernel Connection (Commented out for safety)
  console.log('2️⃣ Testing Kernel Connection:');
  console.log('⚠️  Skipping actual message sending for safety.');
  console.log('To test actual sending, uncomment the code below and provide a valid phone number.');
  
  /*
  const testPhone = '918589990060'; // Replace with actual test number
  const testMessage = WHATSAPP_TEMPLATES.initial(testName);
  
  console.log(`Sending test message to ${testPhone}...`);
  const result = await sendWhatsAppMessage(testPhone, testMessage);
  
  console.log('Result:', result);
  
  if (result.status === 'NEEDS_SCAN') {
    console.log('📱 QR Code authentication required');
    console.log('QR Code (base64):', result.screenshot?.substring(0, 100) + '...');
  } else if (result.success) {
    console.log('✅ Message sent successfully!');
  } else {
    console.log('❌ Error:', result.error);
  }
  */
  
  console.log('\n🎯 Test completed! Check the message templates above.');
  console.log('💡 To test actual sending:');
  console.log('   1. Uncomment the code block above');
  console.log('   2. Replace testPhone with your number');
  console.log('   3. Run: npm run test:whatsapp');
}

// Run the test if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  testWhatsAppIntegration().catch(console.error);
}