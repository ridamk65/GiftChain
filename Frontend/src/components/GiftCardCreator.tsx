import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { GiftService } from '../services/giftService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { GiftCard } from './GiftCard';

export const GiftCardCreator: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [createdGift, setCreatedGift] = useState<{
    id: string;
    message: string;
    amount: string;
    senderName: string;
    recipientName: string;
    expiryDate: string;
  } | null>(null);

  const handleCreateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !isConnected) return;

    setLoading(true);
    try {
      const giftService = new GiftService(signer);
      const result = await giftService.createGift(
        CONTRACT_ADDRESSES.MOCK_ERC20,
        amount,
        expiryDays,
        message
      );
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      
      // Store gift in backend with email for notifications
      await fetch('http://localhost:3001/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: result.giftID,
          creator: await signer.getAddress(),
          amount: amount,
          message: message,
          expiry: Math.floor(expiryDate.getTime() / 1000),
          tokenAddress: CONTRACT_ADDRESSES.MOCK_ERC20,
          recipientEmail: recipientEmail
        })
      });
      
      setCreatedGift({
        id: result.giftID,
        message: message,
        amount: amount,
        senderName: senderName || 'Anonymous',
        recipientName: recipientName || 'Dear Friend',
        recipientEmail: recipientEmail,
        expiryDate: expiryDate.toLocaleDateString()
      });
      
      // Auto-send email if recipient email provided
      if (recipientEmail) {
        setTimeout(async () => {
          try {
            await fetch(`http://localhost:3001/api/gifts/${result.giftID}/notify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ recipientEmail })
            });
            alert('📧 Gift created and email notification sent!');
          } catch (error) {
            console.log('Email notification failed, but gift created successfully');
          }
        }, 1000);
      }
      
      // Reset form
      setAmount('');
      setMessage('');
      setSenderName('');
      setRecipientName('');
      setRecipientEmail('');
    } catch (error) {
      console.error('Error creating gift card:', error);
      alert('Failed to create gift card');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreatedGift(null);
    setAmount('');
    setMessage('');
    setSenderName('');
    setRecipientName('');
  };

  if (!isConnected) {
    return <div className="text-center">Please connect your wallet to create gift cards</div>;
  }

  if (createdGift) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">🎁 Your Gift Card is Ready!</h2>
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Create Another
          </button>
        </div>
        
        <GiftCard
          giftId={createdGift.id}
          message={createdGift.message}
          amount={createdGift.amount}
          senderName={createdGift.senderName}
          recipientName={createdGift.recipientName}
          expiryDate={createdGift.expiryDate}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">🎁 Create Gift Card</h2>
      
      <form onSubmit={handleCreateGiftCard} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From (Your Name)</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Your name (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">To (Recipient Name)</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Recipient name (optional)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">📧 Recipient Email (for notifications)</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="recipient@email.com (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            If provided, recipient will get email notification + expiry reminders
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount (Tokens)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., 10"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Expires in</label>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Gift Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg h-24 resize-none"
            placeholder="Write a personal message for the recipient..."
            minLength={3}
            maxLength={100}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/100 characters</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 font-semibold text-lg"
        >
          {loading ? 'Creating Gift Card...' : '🎁 Create Beautiful Gift Card'}
        </button>
      </form>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
        <h3 className="font-semibold mb-3 text-center">✨ What you'll get:</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-center">
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <p className="font-medium">Beautiful Design</p>
            <p className="text-gray-600">Professional gift card with your personal touch</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <p className="font-medium">QR Code</p>
            <p className="text-gray-600">Easy scanning for instant claiming</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-2">🖨️</div>
            <p className="font-medium">Print Ready</p>
            <p className="text-gray-600">Download or print for physical gifting</p>
          </div>
        </div>
      </div>
    </div>
  );
};