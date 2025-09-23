import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/animations.css';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import LogInPage from './pages/LogInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { WalletConnect } from './components/WalletConnect';
import { CreateGift } from './components/CreateGift';
import { ClaimGift } from './components/ClaimGift';
import { BulkGiftCreator } from './components/BulkGiftCreator';
import { GiftCardCreator } from './components/GiftCardCreator';
import { GiftCardDisplay } from './components/GiftCardDisplay';
import { TransactionHistory } from './components/TransactionHistory';
import { UserDashboard } from './components/UserDashboard';
import { GroupGifting } from './components/GroupGifting';
import { Web3Provider } from './hooks/useWeb3';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status on app load
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Auto-switch tabs based on URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const giftIdFromUrl = urlParams.get('id');
    const tabFromUrl = urlParams.get('tab');
    
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    } else if (giftIdFromUrl) {
      if (window.location.pathname === '/gift') {
        setActiveTab('gift-display');
      } else {
        setActiveTab('claim');
      }
    }
  }, []);

  return (
    <Web3Provider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">GiftChain</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 rounded ${activeTab === 'home' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  Home
                </button>
                
                {/* Show these tabs only when authenticated */}
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => setActiveTab('create')}
                      className={`px-4 py-2 rounded ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      Create Gift
                    </button>
                    <button
                      onClick={() => setActiveTab('claim')}
                      className={`px-4 py-2 rounded ${activeTab === 'claim' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      Claim Gift
                    </button>
                    <button
                      onClick={() => setActiveTab('bulk')}
                      className={`px-4 py-2 rounded ${activeTab === 'bulk' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      Bulk Create
                    </button>
                    <button
                      onClick={() => setActiveTab('giftcard')}
                      className={`px-4 py-2 rounded ${activeTab === 'giftcard' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      Gift Cards
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      History
                    </button>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('group')}
                      className={`px-4 py-2 rounded ${activeTab === 'group' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      Group Gift
                    </button>
                  </>
                )}
                
                {/* Show login/logout based on auth status */}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Welcome, {user?.fullName}</span>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setIsAuthenticated(false);
                        setUser(null);
                        setActiveTab('home');
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <a href="/login" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      Login
                    </a>
                    <a href="/signin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Sign Up
                    </a>
                  </div>
                )}
                
                <WalletConnect />
              </div>
            </div>
          </nav>

          <main className="max-w-6xl mx-auto p-6">
            {activeTab === 'gift-display' ? (
              <GiftCardDisplay />
            ) : (
              <>
                {activeTab === 'home' && (
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/login" element={<LogInPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Routes>
                )}
                {activeTab === 'create' && <CreateGift />}
                {activeTab === 'claim' && <ClaimGift />}
                {activeTab === 'bulk' && <BulkGiftCreator />}
                {activeTab === 'giftcard' && <GiftCardCreator />}
                {activeTab === 'history' && <TransactionHistory />}
                {activeTab === 'dashboard' && <UserDashboard />}
                {activeTab === 'group' && <GroupGifting />}
              </>
            )}
          </main>
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}