import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DonatePage from './pages/DonatePage';
import { WalletConnect } from './components/WalletConnect';
import { CreateGift } from './components/CreateGift';
import { ClaimGift } from './components/ClaimGift';
import { BulkGiftCreator } from './components/BulkGiftCreator';
import { GiftCardCreator } from './components/GiftCardCreator';
import { GiftCardDisplay } from './components/GiftCardDisplay';
import { Web3Provider } from './hooks/useWeb3';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Auto-switch to claim tab if URL has gift ID, or show gift display
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const giftIdFromUrl = urlParams.get('id');
    if (giftIdFromUrl) {
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
                    <Route path="/donate" element={<DonatePage />} />
                  </Routes>
                )}
                {activeTab === 'create' && <CreateGift />}
                {activeTab === 'claim' && <ClaimGift />}
                {activeTab === 'bulk' && <BulkGiftCreator />}
                {activeTab === 'giftcard' && <GiftCardCreator />}
              </>
            )}
          </main>
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}