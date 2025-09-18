import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { GiftService } from '../services/giftService';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export const CreateGift: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleCreateGift = async (e: React.FormEvent) => {
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
      
      alert(`Gift created! ID: ${result.giftID}`);
      setAmount('');
      setMessage('');
    } catch (error) {
      console.error('Error creating gift:', error);
      alert('Failed to create gift');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div className="text-center">Please connect your wallet to create gifts</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Gift</h2>
      <form onSubmit={handleCreateGift}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            minLength={3}
            maxLength={50}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Expires in (days)</label>
          <select
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Gift'}
        </button>
      </form>
    </div>
  );
};