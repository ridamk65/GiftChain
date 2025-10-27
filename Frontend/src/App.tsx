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
import { LanguageSelector } from './components/LanguageSelector';
import { NetworkSelector } from './components/NetworkSelector';
import { LanguageProvider, useTranslation } from './i18n/useTranslation';
import { Web3Provider } from './hooks/useWeb3';

function AppContent() {
  const { t } = useTranslation();
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



  // Redirect to dashboard after authentication
  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'home') {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated]);

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  return (
    <Web3Provider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">GiftChain</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  {t.dashboard}
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  {t.createGift}
                </button>
                <button
                  onClick={() => setActiveTab('claim')}
                  className={`px-4 py-2 rounded ${activeTab === 'claim' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  {t.claimGift}
                </button>
                <button
                  onClick={() => setActiveTab('giftcard')}
                  className={`px-4 py-2 rounded ${activeTab === 'giftcard' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  {t.giftCards}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  {t.history}
                </button>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{t.welcome}, {user?.fullName}</span>
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
                    {t.logout}
                  </button>
                </div>
                
                <NetworkSelector />
                <LanguageSelector />
                <WalletConnect />
              </div>
            </div>
          </nav>

          <main className="max-w-6xl mx-auto p-6">
            {activeTab === 'dashboard' && <UserDashboard />}
            {activeTab === 'create' && <CreateGift />}
            {activeTab === 'claim' && <ClaimGift />}
            {activeTab === 'giftcard' && <GiftCardCreator />}
            {activeTab === 'history' && <TransactionHistory />}
          </main>
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}