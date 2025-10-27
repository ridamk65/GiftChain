import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { GiftService } from '../services/giftService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { AnimatedGiftCard } from './AnimatedGiftCard';
import { TemplateSelector, GiftTemplate, giftTemplates } from './GiftTemplates';
import { SocialShare } from './SocialShare';
import { TokenSelector, supportedTokens, Token } from './TokenSelector';
import { VideoMessage } from './VideoMessage';
import { CurrencyConverter } from './CurrencyConverter';

export const GiftCardCreator: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [selectedTemplate, setSelectedTemplate] = useState<GiftTemplate>(giftTemplates[0]);
  const [selectedToken, setSelectedToken] = useState<Token>(supportedTokens[0]);
  const [playMusic, setPlayMusic] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [createdGift, setCreatedGift] = useState<{
    id: string;
    message: string;
    amount: string;
    senderName: string;
    recipientName: string;
    expiryDate: string;
    template: GiftTemplate;
  } | null>(null);

  const handleCreateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !isConnected) return;

    console.log('Selected token address:', selectedToken.address);
    console.log('Selected token:', selectedToken);
    
    setLoading(true);
    try {
      const giftService = new GiftService(signer);
      const result = await giftService.createGift(
        selectedToken.address,
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
          tokenAddress: selectedToken.address,
          tokenSymbol: selectedToken.symbol,
          recipientEmail: recipientEmail,
          hasVideo: !!videoBlob,
          videoUrl: videoUrl
        })
      });
      
      setCreatedGift({
        id: result.giftID,
        message: message,
        amount: amount,
        senderName: senderName || 'Anonymous',
        recipientName: recipientName || 'Dear Friend',
        recipientEmail: recipientEmail,
        expiryDate: expiryDate.toLocaleDateString(),
        template: selectedTemplate
      });
      
      // Show success message
      if (recipientEmail) {
        alert(`🎁 Gift card created successfully!\n📧 Notification would be sent to: ${recipientEmail}`);
      } else {
        alert('🎁 Gift card created successfully!');
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
        
        <AnimatedGiftCard
          giftId={createdGift.id}
          message={createdGift.message}
          amount={createdGift.amount}
          senderName={createdGift.senderName}
          recipientName={createdGift.recipientName}
          expiryDate={createdGift.expiryDate}
          template={createdGift.template}
          playMusic={playMusic}
        />
        
        {/* Social Sharing */}
        <div className="mt-6 flex justify-center">
          <SocialShare
            giftId={createdGift.id}
            message={createdGift.message}
            amount={createdGift.amount}
            senderName={createdGift.senderName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">🎁 Create Gift Card</h2>
      
      <form onSubmit={handleCreateGiftCard} className="space-y-6">
        <TemplateSelector 
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
        
        <TokenSelector
          selectedToken={selectedToken}
          onSelect={setSelectedToken}
        />
        
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
            <div className="space-y-2">
              <input
                type="number"
                step={selectedToken.decimals === 6 ? "0.01" : "0.001"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder={`e.g., ${selectedToken.isStable ? '10.00' : '0.1'}`}
                required
              />
              {amount && (
                <CurrencyConverter 
                  tokenAmount={amount}
                  tokenPrice={selectedToken.isStable ? 1 : 2.5}
                />
              )}
            </div>
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
          <label className="block text-sm font-medium mb-2">Personal Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg h-24 resize-none"
            placeholder="Write a heartfelt message from you to them..."
            minLength={3}
            maxLength={100}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/100 characters - Make it personal!</p>
        </div>
        
        <VideoMessage
          onVideoRecorded={(blob, url) => {
            setVideoBlob(blob);
            setVideoUrl(url);
          }}
          existingVideoUrl={videoUrl}
        />
        
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={playMusic}
              onChange={(e) => setPlayMusic(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">🎵 Play music with gift card</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r ${selectedTemplate.colors.primary} text-white p-4 rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold text-lg flex items-center justify-center gap-2`}
        >
          {selectedTemplate.emoji} {loading ? 'Creating Gift Card...' : `Create ${selectedTemplate.occasion} Gift`}
        </button>
      </form>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
        <h3 className="font-semibold mb-3 text-center">💝 Your Personal Gift Includes:</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-center">
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-2">💌</div>
            <p className="font-medium">Your Personal Touch</p>
            <p className="text-gray-600">Handcrafted message that shows you care</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-2">🤝</div>
            <p className="font-medium">Human Connection</p>
            <p className="text-gray-600">Real person to real person gifting</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="text-2xl mb-2">❤️</div>
            <p className="font-medium">Made with Love</p>
            <p className="text-gray-600">Every gift tells your unique story</p>
          </div>
        </div>
      </div>
    </div>
  );
};