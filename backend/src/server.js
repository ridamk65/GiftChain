const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const gifts = new Map();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send gift received notification
const sendGiftNotification = async (recipientEmail, giftData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@giftchain.com',
    to: recipientEmail,
    subject: '🎁 You have received a crypto gift!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; font-size: 28px;">🎁 You've Received a Crypto Gift!</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0;">Gift Details:</h3>
          <p style="margin: 5px 0;"><strong>💰 Amount:</strong> ${giftData.amount} tokens</p>
          <p style="margin: 5px 0;"><strong>💌 Message:</strong> "${giftData.message}"</p>
          <p style="margin: 5px 0;"><strong>👤 From:</strong> ${giftData.creator || 'Anonymous'}</p>
          <p style="margin: 5px 0;"><strong>⏰ Expires:</strong> ${new Date(giftData.expiry * 1000).toLocaleDateString()}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://10.98.26.231:5173/gift?id=${giftData.giftId}" 
             style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
            🎉 View & Claim Your Gift
          </a>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400E;"><strong>⚠️ Important:</strong> This gift expires on ${new Date(giftData.expiry * 1000).toLocaleDateString()}. Make sure to claim it before then!</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">Powered by GiftChain - Decentralized Crypto Gifting</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Gift notification sent to:', recipientEmail);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

// Send expiry reminder notification
const sendExpiryReminder = async (recipientEmail, giftData, daysLeft) => {
  const urgencyColor = daysLeft <= 1 ? '#EF4444' : daysLeft <= 3 ? '#F59E0B' : '#10B981';
  const urgencyText = daysLeft <= 1 ? 'URGENT' : daysLeft <= 3 ? 'REMINDER' : 'NOTICE';
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@giftchain.com',
    to: recipientEmail,
    subject: `⏰ ${urgencyText}: Your crypto gift expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: ${urgencyColor}; font-size: 28px;">⏰ Gift Expiry ${urgencyText}</h1>
        </div>
        
        <div style="background: ${urgencyColor}; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">Your gift expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!</h2>
          <p style="margin: 0; font-size: 18px;">Don't let it go to waste!</p>
        </div>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Gift Details:</h3>
          <p style="margin: 5px 0;"><strong>💰 Amount:</strong> ${giftData.amount} tokens</p>
          <p style="margin: 5px 0;"><strong>💌 Message:</strong> "${giftData.message}"</p>
          <p style="margin: 5px 0;"><strong>👤 From:</strong> ${giftData.creator || 'Anonymous'}</p>
          <p style="margin: 5px 0; color: ${urgencyColor};"><strong>⏰ Expires:</strong> ${new Date(giftData.expiry * 1000).toLocaleDateString()}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://10.98.26.231:5173/gift?id=${giftData.giftId}" 
             style="background: ${urgencyColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">
            🚀 Claim Now Before It Expires!
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">Powered by GiftChain - Decentralized Crypto Gifting</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Expiry reminder sent to ${recipientEmail} (${daysLeft} days left)`);
  } catch (error) {
    console.error('Failed to send expiry reminder:', error);
  }
};

// Check for expiring gifts and send reminders
const checkExpiringGifts = () => {
  const now = Math.floor(Date.now() / 1000);
  const oneDayInSeconds = 24 * 60 * 60;
  
  gifts.forEach((gift, giftId) => {
    if (!gift.claimed && gift.recipientEmail) {
      const timeLeft = gift.expiry - now;
      const daysLeft = Math.ceil(timeLeft / oneDayInSeconds);
      
      // Send reminders at 7 days, 3 days, 1 day, and 1 hour before expiry
      if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
        if (!gift.remindersSent) gift.remindersSent = [];
        
        if (!gift.remindersSent.includes(daysLeft)) {
          sendExpiryReminder(gift.recipientEmail, gift, daysLeft);
          gift.remindersSent.push(daysLeft);
        }
      }
      
      // Final 1-hour warning
      if (timeLeft <= 3600 && timeLeft > 0) { // 1 hour = 3600 seconds
        if (!gift.remindersSent) gift.remindersSent = [];
        
        if (!gift.remindersSent.includes('1hour')) {
          sendExpiryReminder(gift.recipientEmail, { ...gift, amount: gift.amount }, 0);
          gift.remindersSent.push('1hour');
        }
      }
    }
  });
};

// Run expiry check every hour
setInterval(checkExpiringGifts, 60 * 60 * 1000); // Check every hour
console.log('📧 Email notification system started - checking for expiring gifts every hour');

// Routes
app.post('/api/gifts', (req, res) => {
  const { giftId, creator, amount, message, expiry, tokenAddress } = req.body;
  
  gifts.set(giftId, {
    giftId,
    creator,
    amount,
    message,
    expiry,
    tokenAddress,
    claimed: false,
    claimedBy: null,
    createdAt: new Date().toISOString()
  });
  
  res.json({ success: true, giftId });
});

app.get('/api/gifts/:giftId', (req, res) => {
  const { giftId } = req.params;
  const gift = gifts.get(giftId);
  
  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' });
  }
  
  res.json(gift);
});

app.get('/api/gifts/user/:userAddress', (req, res) => {
  const { userAddress } = req.params;
  const userGifts = Array.from(gifts.values()).filter(
    gift => gift.creator.toLowerCase() === userAddress.toLowerCase()
  );
  
  res.json(userGifts);
});

app.post('/api/gifts/:giftId/claim', (req, res) => {
  const { giftId } = req.params;
  const { claimerAddress } = req.body;
  
  const gift = gifts.get(giftId);
  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' });
  }
  
  if (gift.claimed) {
    return res.status(400).json({ error: 'Gift already claimed' });
  }
  
  gift.claimed = true;
  gift.claimedBy = claimerAddress;
  gift.claimedAt = new Date().toISOString();
  
  gifts.set(giftId, gift);
  res.json({ success: true, gift });
});

// Send gift notification email
app.post('/api/gifts/:giftId/notify', async (req, res) => {
  const { giftId } = req.params;
  const { recipientEmail } = req.body;
  
  const gift = gifts.get(giftId);
  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' });
  }
  
  // Store recipient email for future reminders
  gift.recipientEmail = recipientEmail;
  gifts.set(giftId, gift);
  
  try {
    await sendGiftNotification(recipientEmail, { ...gift, giftId });
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Email notification failed:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Manual trigger for expiry check (for testing)
app.post('/api/check-expiring-gifts', (req, res) => {
  checkExpiringGifts();
  res.json({ message: 'Expiry check triggered' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});