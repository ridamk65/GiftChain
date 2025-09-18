import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { GiftService } from '../services/giftService';

export const ClaimGift: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [giftId, setGiftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [giftDetails, setGiftDetails] = useState<any>(null);

  const handleValidateGift = async () => {
    if (!signer || !giftId) return;

    setLoading(true);
    try {
      const giftService = new GiftService(signer);
      const [isValid, message] = await giftService.validateGift(giftId);
      
      if (isValid) {
        const details = await giftService.getGiftDetails(giftId);
        setGiftDetails(details);
      } else {
        alert(`Gift validation failed: ${message}`);
      }
    } catch (error) {
      console.error('Error validating gift:', error);
      alert('Failed to validate gift');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimGift = async () => {
    if (!signer || !giftId) return;

    setLoading(true);
    try {
      const giftService = new GiftService(signer);
      await giftService.claimGift(giftId);
      alert('Gift claimed successfully!');
      setGiftDetails(null);
      setGiftId('');
    } catch (error) {
      console.error('Error claiming gift:', error);
      alert('Failed to claim gift');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div className="text-center">Please connect your wallet to claim gifts</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Claim Gift</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Gift ID</label>
        <input
          type="text"
          value={giftId}
          onChange={(e) => setGiftId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter gift ID"
        />
      </div>
      
      <button
        onClick={handleValidateGift}
        disabled={loading || !giftId}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
      >
        {loading ? 'Validating...' : 'Validate Gift'}
      </button>

      {giftDetails && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Gift Details</h3>
          <p><strong>Message:</strong> {giftDetails.message}</p>
          <p><strong>Amount:</strong> {giftDetails.amount.toString()} wei</p>
          <p><strong>Status:</strong> {giftDetails.status === 1 ? 'Pending' : 'Other'}</p>
          
          <button
            onClick={handleClaimGift}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 mt-4"
          >
            {loading ? 'Claiming...' : 'Claim Gift'}
          </button>
        </div>
      )}
    </div>
  );
};