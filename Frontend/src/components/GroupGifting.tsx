import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

interface Contributor {
  id: string;
  name: string;
  email: string;
  amount: string;
  contributed: boolean;
}

export const GroupGifting: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [giftDetails, setGiftDetails] = useState({
    recipientName: '',
    recipientEmail: '',
    message: '',
    targetAmount: '',
    expiryDays: 7
  });
  
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [newContributor, setNewContributor] = useState({
    name: '',
    email: '',
    amount: ''
  });
  
  const [groupGiftId, setGroupGiftId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const addContributor = () => {
    if (!newContributor.name || !newContributor.email || !newContributor.amount) {
      alert('Please fill all contributor details');
      return;
    }

    const contributor: Contributor = {
      id: Date.now().toString(),
      name: newContributor.name,
      email: newContributor.email,
      amount: newContributor.amount,
      contributed: false
    };

    setContributors([...contributors, contributor]);
    setNewContributor({ name: '', email: '', amount: '' });
  };

  const removeContributor = (id: string) => {
    setContributors(contributors.filter(c => c.id !== id));
  };

  const getTotalAmount = () => {
    return contributors.reduce((sum, c) => sum + parseFloat(c.amount || '0'), 0);
  };

  const createGroupGift = async () => {
    if (!signer || !isConnected) {
      alert('Please connect your wallet');
      return;
    }

    if (contributors.length === 0) {
      alert('Please add at least one contributor');
      return;
    }

    setLoading(true);
    try {
      // Create group gift in backend
      const groupGift = {
        id: `group_${Date.now()}`,
        recipientName: giftDetails.recipientName,
        recipientEmail: giftDetails.recipientEmail,
        message: giftDetails.message,
        targetAmount: giftDetails.targetAmount,
        totalContributed: '0',
        contributors: contributors,
        createdBy: await signer.getAddress(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        expiryDate: new Date(Date.now() + giftDetails.expiryDays * 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await fetch('http://localhost:3001/api/group-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupGift)
      });

      if (response.ok) {
        const data = await response.json();
        setGroupGiftId(data.id);
        
        // Send invitations to contributors
        await sendContributorInvitations(data.id);
        
        alert('🎉 Group gift created! Invitations sent to contributors.');
      } else {
        alert('Failed to create group gift');
      }
    } catch (error) {
      console.error('Error creating group gift:', error);
      alert('Failed to create group gift');
    } finally {
      setLoading(false);
    }
  };

  const sendContributorInvitations = async (groupGiftId: string) => {
    for (const contributor of contributors) {
      try {
        await fetch('http://localhost:3001/api/group-gifts/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groupGiftId,
            contributorEmail: contributor.email,
            contributorName: contributor.name,
            amount: contributor.amount,
            recipientName: giftDetails.recipientName,
            message: giftDetails.message
          })
        });
      } catch (error) {
        console.error('Failed to send invitation to:', contributor.email);
      }
    }
  };

  const shareGroupGift = () => {
    const shareUrl = `${window.location.origin}/group-gift/${groupGiftId}`;
    const shareText = `🎁 Join me in creating a group gift for ${giftDetails.recipientName}! Target: ${giftDetails.targetAmount} tokens. "${giftDetails.message}"`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Group Gift',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      alert('Group gift link copied to clipboard!');
    }
  };

  if (groupGiftId) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Group Gift Created!</h2>
          <p className="text-gray-600">Invitations sent to all contributors</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Gift Details:</h3>
          <p><strong>For:</strong> {giftDetails.recipientName}</p>
          <p><strong>Target:</strong> {giftDetails.targetAmount} tokens</p>
          <p><strong>Contributors:</strong> {contributors.length}</p>
          <p><strong>Message:</strong> "{giftDetails.message}"</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={shareGroupGift}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            📱 Share Group Gift
          </button>
          
          <button
            onClick={() => {
              setGroupGiftId('');
              setContributors([]);
              setGiftDetails({
                recipientName: '',
                recipientEmail: '',
                message: '',
                targetAmount: '',
                expiryDays: 7
              });
            }}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">👥 Create Group Gift</h2>
      
      {/* Gift Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">🎁 Gift Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Name</label>
            <input
              type="text"
              value={giftDetails.recipientName}
              onChange={(e) => setGiftDetails({...giftDetails, recipientName: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="Who is this gift for?"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Email</label>
            <input
              type="email"
              value={giftDetails.recipientEmail}
              onChange={(e) => setGiftDetails({...giftDetails, recipientEmail: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="recipient@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Amount (Tokens)</label>
            <input
              type="number"
              step="0.01"
              value={giftDetails.targetAmount}
              onChange={(e) => setGiftDetails({...giftDetails, targetAmount: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="100"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Expires in</label>
            <select
              value={giftDetails.expiryDays}
              onChange={(e) => setGiftDetails({...giftDetails, expiryDays: Number(e.target.value)})}
              className="w-full p-3 border rounded-lg"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Group Message</label>
          <textarea
            value={giftDetails.message}
            onChange={(e) => setGiftDetails({...giftDetails, message: e.target.value})}
            className="w-full p-3 border rounded-lg h-20 resize-none"
            placeholder="Write a message from the group..."
            required
          />
        </div>
      </div>

      {/* Add Contributors */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">👥 Add Contributors</h3>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={newContributor.name}
            onChange={(e) => setNewContributor({...newContributor, name: e.target.value})}
            className="p-3 border rounded-lg"
            placeholder="Contributor name"
          />
          <input
            type="email"
            value={newContributor.email}
            onChange={(e) => setNewContributor({...newContributor, email: e.target.value})}
            className="p-3 border rounded-lg"
            placeholder="Email address"
          />
          <input
            type="number"
            step="0.01"
            value={newContributor.amount}
            onChange={(e) => setNewContributor({...newContributor, amount: e.target.value})}
            className="p-3 border rounded-lg"
            placeholder="Amount"
          />
          <button
            onClick={addContributor}
            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
          >
            ➕ Add
          </button>
        </div>

        {/* Contributors List */}
        {contributors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Contributors ({contributors.length}):</h4>
            {contributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium">{contributor.name}</span>
                  <span className="text-gray-600 ml-2">({contributor.email})</span>
                  <span className="text-green-600 ml-2 font-semibold">{contributor.amount} tokens</span>
                </div>
                <button
                  onClick={() => removeContributor(contributor.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-800">
                Total: {getTotalAmount()} tokens 
                {giftDetails.targetAmount && (
                  <span className="ml-2">
                    ({((getTotalAmount() / parseFloat(giftDetails.targetAmount)) * 100).toFixed(1)}% of target)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Button */}
      <button
        onClick={createGroupGift}
        disabled={loading || contributors.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating Group Gift...' : '🎉 Create Group Gift & Send Invitations'}
      </button>
    </div>
  );
};