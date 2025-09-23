import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { TransactionHistory } from './TransactionHistory';

interface UserStats {
  totalSent: number;
  totalReceived: number;
  giftsSent: number;
  giftsReceived: number;
  totalValue: string;
}

export const UserDashboard: React.FC = () => {
  const { signer, isConnected, account } = useWeb3();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'profile'>('overview');

  useEffect(() => {
    if (isConnected && account) {
      loadUserStats();
    }
  }, [isConnected, account]);

  const loadUserStats = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/user/stats/${account}`);
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access your personal GiftChain dashboard
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>🔒 Secure:</strong> No passwords needed - your wallet is your login
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🎁 My GiftChain Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ Connected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveSection('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Transaction History
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👤 Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            {loading ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">⏳</div>
                <p>Loading your stats...</p>
              </div>
            ) : userStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gifts Sent</p>
                      <p className="text-3xl font-bold text-blue-600">{userStats.giftsSent}</p>
                    </div>
                    <div className="text-3xl">📤</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gifts Received</p>
                      <p className="text-3xl font-bold text-green-600">{userStats.giftsReceived}</p>
                    </div>
                    <div className="text-3xl">📥</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sent</p>
                      <p className="text-2xl font-bold text-purple-600">{userStats.totalSent} tokens</p>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Received</p>
                      <p className="text-2xl font-bold text-emerald-600">{userStats.totalReceived} tokens</p>
                    </div>
                    <div className="text-3xl">🎉</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎁</div>
                <p className="text-gray-600">No activity yet. Start by creating your first gift!</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.hash = '#create'}
                  className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-center"
                >
                  <div className="text-2xl mb-2">🎁</div>
                  <div className="font-medium">Create Gift</div>
                </button>
                
                <button
                  onClick={() => window.location.hash = '#giftcard'}
                  className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 text-center"
                >
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-medium">Gift Cards</div>
                </button>
                
                <button
                  onClick={() => window.location.hash = '#bulk'}
                  className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 text-center"
                >
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-medium">Bulk Create</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'history' && <TransactionHistory />}

        {activeSection === 'profile' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">👤 Profile Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <code className="text-sm">{account}</code>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <span className="text-sm">Hardhat Local (Chain ID: 31337)</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">🔒 Security Features</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Wallet-based authentication (no passwords)</li>
                  <li>✅ Decentralized identity</li>
                  <li>✅ Private key controlled access</li>
                  <li>✅ No personal data stored</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};