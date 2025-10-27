import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { ExplorerLink } from './ExplorerLink';

interface Transaction {
  giftId: string;
  amount: string;
  message: string;
  creator: string;
  claimedBy?: string;
  claimed: boolean;
  createdAt: string;
  claimedAt?: string;
  expiry: number;
  type: 'sent' | 'received';
  recipientEmail?: string;
}

export const TransactionHistory: React.FC = () => {
  const { signer, isConnected } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    if (isConnected && signer) {
      loadTransactionHistory();
    }
  }, [isConnected, signer]);

  const loadTransactionHistory = async () => {
    if (!signer) return;
    
    setLoading(true);
    try {
      const userAddress = await signer.getAddress();
      const response = await fetch(`http://localhost:3001/api/transactions/${userAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
      // Show user-friendly error message
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (transaction: Transaction) => {
    if (transaction.type === 'received') return 'text-green-600';
    
    const now = Math.floor(Date.now() / 1000);
    if (transaction.claimed) return 'text-green-600';
    if (transaction.expiry < now) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusText = (transaction: Transaction) => {
    if (transaction.type === 'received') return 'Received';
    
    const now = Math.floor(Date.now() / 1000);
    if (transaction.claimed) return 'Claimed';
    if (transaction.expiry < now) return 'Expired';
    return 'Pending';
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const copyGiftId = (giftId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(giftId).then(() => {
        alert('📋 Gift ID copied to clipboard!');
      }).catch(() => {
        fallbackCopy(giftId, 'Gift ID');
      });
    } else {
      fallbackCopy(giftId, 'Gift ID');
    }
  };

  const shareGift = (giftId: string) => {
    console.log('Share button clicked for gift:', giftId);
    const url = `${window.location.origin}/gift?id=${giftId}`;
    console.log('Generated URL:', url);
    
    // Simple direct copy for testing
    try {
      navigator.clipboard.writeText(url);
      alert('🔗 Gift link copied!\n\n' + url);
    } catch (error) {
      console.error('Clipboard error:', error);
      alert('Copy failed. URL: ' + url);
    }
  };

  const fallbackCopy = (text: string, type: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert(`✅ ${type} copied to clipboard!`);
    } catch (err) {
      alert(`❌ Failed to copy ${type}. Please copy manually:\n\n${text}`);
    }
    document.body.removeChild(textArea);
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please connect your wallet to view transaction history</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-4">📊 Transaction History</h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-4 py-2 rounded ${filter === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sent ({transactions.filter(tx => tx.type === 'sent').length})
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-4 py-2 rounded ${filter === 'received' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Received ({transactions.filter(tx => tx.type === 'received').length})
          </button>
        </div>

        <button
          onClick={loadTransactionHistory}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">⏳</div>
            <p>Loading transaction history...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">No transactions found</p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === 'sent' ? 'You haven\'t sent any gifts yet' : 
               filter === 'received' ? 'You haven\'t received any gifts yet' : 
               'Start by creating your first gift!'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.hash = '#create'}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                🎁 Create Your First Gift
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${transaction.type === 'sent' ? 'text-blue-500' : 'text-green-500'}`}>
                      {transaction.type === 'sent' ? '📤' : '📥'}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {transaction.type === 'sent' ? 'Gift Sent' : 'Gift Received'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {transaction.type === 'sent' 
                          ? new Date(transaction.createdAt).toLocaleString()
                          : new Date(transaction.claimedAt!).toLocaleString()
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">{transaction.amount} tokens</div>
                    <div className={`text-sm font-medium ${getStatusColor(transaction)}`}>
                      {getStatusText(transaction)}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Message:</p>
                    <p className="font-medium">"{transaction.message}"</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">
                      {transaction.type === 'sent' ? 'Recipient Email:' : 'From:'}
                    </p>
                    <p className="font-medium">
                      {transaction.type === 'sent' 
                        ? (transaction.recipientEmail || 'Not provided')
                        : `${transaction.creator.slice(0, 6)}...${transaction.creator.slice(-4)}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  <button
                    onClick={() => copyGiftId(transaction.giftId)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                  >
                    📋 Copy ID
                  </button>
                  
                  {transaction.type === 'sent' && !transaction.claimed && (
                    <button
                      onClick={() => shareGift(transaction.giftId)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded"
                    >
                      🔗 Share Link
                    </button>
                  )}
                  
                  <div className="text-xs px-3 py-1">
                    <ExplorerLink hash={transaction.giftId} type="tx" className="text-xs">
                      View Transaction
                    </ExplorerLink>
                  </div>
                  
                  <div className="text-xs text-gray-500 px-3 py-1">
                    Expires: {new Date(transaction.expiry * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};