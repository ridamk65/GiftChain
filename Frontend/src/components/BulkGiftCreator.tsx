import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { GiftService } from '../services/giftService';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface BulkGift {
  amount: string;
  message: string;
  expiryDays: number;
}

export const BulkGiftCreator: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [gifts, setGifts] = useState<BulkGift[]>([
    { amount: '1', message: '', expiryDays: 7 }
  ]);
  const [loading, setLoading] = useState(false);
  const [createdGifts, setCreatedGifts] = useState<string[]>([]);

  const addGift = () => {
    setGifts([...gifts, { amount: '1', message: '', expiryDays: 7 }]);
  };

  const removeGift = (index: number) => {
    setGifts(gifts.filter((_, i) => i !== index));
  };

  const updateGift = (index: number, field: keyof BulkGift, value: string | number) => {
    const updated = [...gifts];
    updated[index] = { ...updated[index], [field]: value };
    setGifts(updated);
  };

  const createBulkGifts = async () => {
    if (!signer || gifts.length < 2) return;

    setLoading(true);
    const giftIds: string[] = [];

    try {
      const giftService = new GiftService(signer);
      
      for (let i = 0; i < gifts.length; i++) {
        const gift = gifts[i];
        if (!gift.message.trim()) {
          alert(`Please add a message for gift ${i + 1}`);
          setLoading(false);
          return;
        }

        const result = await giftService.createGift(
          CONTRACT_ADDRESSES.MOCK_ERC20,
          gift.amount,
          gift.expiryDays,
          gift.message
        );
        
        giftIds.push(result.giftID);
      }

      setCreatedGifts(giftIds);
      alert(`Successfully created ${giftIds.length} gifts!`);
    } catch (error) {
      console.error('Error creating bulk gifts:', error);
      alert('Failed to create some gifts. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <div className="text-center">Please connect your wallet to create bulk gifts</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">🎁 Bulk Gift Creator</h2>
      
      <div className="space-y-4 mb-6">
        {gifts.map((gift, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Gift #{index + 1}</h3>
              {gifts.length > 1 && (
                <button
                  onClick={() => removeGift(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌ Remove
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (tokens)</label>
                <input
                  type="number"
                  value={gift.amount}
                  onChange={(e) => updateGift(index, 'amount', e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <input
                  type="text"
                  value={gift.message}
                  onChange={(e) => updateGift(index, 'message', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Gift message (3-50 chars)"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Expires in (days)</label>
                <select
                  value={gift.expiryDays}
                  onChange={(e) => updateGift(index, 'expiryDays', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={addGift}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ Add Another Gift
        </button>
        
        <button
          onClick={createBulkGifts}
          disabled={loading || gifts.length < 2}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating Gifts...' : `🎁 Create ${gifts.length} Gifts`}
        </button>
      </div>

      {createdGifts.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">✅ Gifts Created Successfully!</h3>
          <div className="space-y-1">
            {createdGifts.map((giftId, index) => (
              <div key={index} className="text-sm">
                <strong>Gift #{index + 1}:</strong> 
                <code className="ml-2 bg-gray-100 px-1 rounded text-xs">{giftId}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};