import Kernel from '@onkernel/sdk';
import { chromium } from 'playwright';

// Initialize Kernel with environment variables
const kernel = new Kernel({
  apiKey: process.env.KERNEL_API_KEY || '',
  baseURL: process.env.KERNEL_BASE_URL || 'https://api.onkernel.com'
});

export async function sendWhatsAppMessage(phone: string, message: string) {
  let browser;
  try {
    // 1. Start Remote Browser with Vercel-compatible settings
    const kernelBrowser = await kernel.browsers.create({
        // Use Vercel-compatible session directory
        userDataDir: '/tmp/whatsapp_session',
        // Add timeout for serverless environment
        timeout: 30000,
        // Optimize for serverless
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    browser = await chromium.connectOverCDP(kernelBrowser.cdp_ws_url);
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.newPage();

    // 2. Format Phone Number (Remove spaces, ensure country code)
    const cleanPhone = phone.replace(/\D/g, ''); 
    // Assuming 91 for India if missing, adjust logic as needed
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    // 3. Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // 4. Go to WhatsApp Web "Click to Chat" URL
    // This bypasses the need to search for contacts manually
    const url = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
    
    console.log(`Navigating to WhatsApp for ${formattedPhone}...`);
    await page.goto(url);

    // 5. Check for Login Status (QR Code vs Chat Interface)
    // Wait specifically for the main chat pane OR the QR code canvas
    const loadSelector = await Promise.race([
      page.waitForSelector('div[aria-label="Type a message"]', { timeout: 15000 }).then(() => 'chat'),
      page.waitForSelector('canvas[aria-label="Scan this QR code"]', { timeout: 15000 }).then(() => 'qr'),
    ]).catch(() => 'timeout');

    if (loadSelector === 'qr') {
      // Capture screenshot of QR code to send back to Admin
      const screenshot = await page.screenshot({ encoding: 'base64' });
      await browser.close();
      return { success: false, status: 'NEEDS_SCAN', screenshot };
    }

    if (loadSelector === 'timeout') {
      await browser.close();
      return { success: false, status: 'TIMEOUT', error: 'WhatsApp Web took too long to load.' };
    }

    // 6. Send the Message
    // Click the send button (Playwright looks for the send icon)
    await page.click('button[aria-label="Send"]');
    
    // Wait a moment for the tick mark to appear (message sent)
    await page.waitForTimeout(2000); 

    console.log('✅ Message sent successfully');
    await browser.close();
    return { success: true, status: 'SENT' };

  } catch (error: any) {
    console.error('Kernel Error:', error);
    if (browser) await browser.close();
    return { success: false, status: 'ERROR', error: error.message };
  }
}

export async function checkWhatsAppLogin() {
  let browser;
  try {
    const kernelBrowser = await kernel.browsers.create({
      userDataDir: '/tmp/whatsapp_session',
      timeout: 30000,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    browser = await chromium.connectOverCDP(kernelBrowser.cdp_ws_url);
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.newPage();
    
    await page.goto('https://web.whatsapp.com');
    
    // Check if logged in or needs QR scan
    const loadSelector = await Promise.race([
      page.waitForSelector('div[aria-label="Type a message"]', { timeout: 10000 }).then(() => 'logged_in'),
      page.waitForSelector('canvas[aria-label="Scan this QR code"]', { timeout: 10000 }).then(() => 'needs_scan'),
    ]).catch(() => 'timeout');

    if (loadSelector === 'needs_scan') {
      const screenshot = await page.screenshot({ encoding: 'base64' });
      await browser.close();
      return { status: 'NEEDS_SCAN', screenshot };
    }

    await browser.close();
    return { status: loadSelector === 'logged_in' ? 'LOGGED_IN' : 'TIMEOUT' };

  } catch (error: any) {
    console.error('Login Check Error:', error);
    if (browser) await browser.close();
    return { status: 'ERROR', error: error.message };
  }
}