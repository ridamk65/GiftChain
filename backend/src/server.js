const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const gifts = new Map();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});