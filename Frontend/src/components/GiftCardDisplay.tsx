import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { GiftService } from '../services/giftService';
import { GiftCard } from './GiftCard';

export const GiftCardDisplay: React.FC = () => {
  const { signer } = useWeb3();
  const [giftId, setGiftId] = useState<string>('');
  const [giftData, setGiftData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showClaimInterface, setShowClaimInterface] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const giftIdFromUrl = urlParams.get('id');
    if (giftIdFromUrl) {
      setGiftId(giftIdFromUrl);
      loadGiftData(giftIdFromUrl);
    }
  }, []);

  const loadGiftData = async (id: string) => {
    setLoading(true);
    try {
      // Try to get gift data from backend first
      const response = await fetch(`http://localhost:3001/api/gifts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGiftData(data);
      } else {
        // Fallback: create basic gift data
        setGiftData({
          giftId: id,
          message: 'Special Gift for You',
          amount: '1.0',
          creator: 'Anonymous'
        });
      }
    } catch (error) {
      console.error('Error loading gift data:', error);
      setGiftData({
        giftId: id,
        message: 'Special Gift for You',
        amount: '1.0',
        creator: 'Anonymous'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimGift = async () => {
    if (!signer || !giftId) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const giftService = new GiftService(signer);
      await giftService.claimGift(giftId);
      alert('🎉 Gift claimed successfully!');
      
      // Update backend
      await fetch(`http://localhost:3001/api/gifts/${giftId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimerAddress: await signer.getAddress() })
      });
      
    } catch (error) {
      console.error('Error claiming gift:', error);
      alert('Failed to claim gift. Make sure you\'re not the creator!');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !giftData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🎁</div>
          <p className="text-lg">Loading your gift...</p>
        </div>
      </div>
    );
  }

  if (!giftData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-lg">Gift not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎁 You've Received a Gift!</h1>
          <p className="text-lg text-gray-600">Someone special has sent you a crypto gift</p>
        </div>

        {/* Gift Card Display */}
        <div className="mb-8">
          <GiftCard
            giftId={giftData.giftId}
            message={giftData.message}
            amount={giftData.amount}
            senderName={giftData.creator || 'Anonymous'}
            recipientName="You"
            expiryDate={giftData.expiry ? new Date(giftData.expiry * 1000).toLocaleDateString() : undefined}
          />
        </div>

        {/* Claim Interface */}
        {!showClaimInterface ? (
          <div className="text-center">
            <button
              onClick={() => setShowClaimInterface(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all"
            >
              🎉 Claim Your Gift Now!
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-xl font-bold mb-4 text-center">Claim Your Crypto Gift</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Instructions:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Make sure you have MetaMask installed</li>
                  <li>Connect to Hardhat Local network (Chain ID: 31337)</li>
                  <li>Click "Claim Gift" below</li>
                  <li>Confirm the transaction in MetaMask</li>
                </ol>
              </div>

              <div className="text-center space-y-3">
                <button
                  onClick={handleClaimGift}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Claiming Gift...' : '🎁 Claim Gift'}
                </button>
                
                <p className="text-xs text-gray-500">
                  By claiming this gift, the tokens will be transferred to your connected wallet
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold">GiftChain</span> - Decentralized Crypto Gifting
          </p>
        </div>
      </div>
    </div>
  );
};