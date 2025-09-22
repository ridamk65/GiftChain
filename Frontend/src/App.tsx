import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DonatePage from './pages/DonatePage';
import { WalletConnect } from './components/WalletConnect';
import { CreateGift } from './components/CreateGift';
import { ClaimGift } from './components/ClaimGift';
import { Web3Provider } from './hooks/useWeb3';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

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
                <WalletConnect />
              </div>
            </div>
          </nav>

          <main className="max-w-6xl mx-auto p-6">
            {activeTab === 'home' && (
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/donate" element={<DonatePage />} />
              </Routes>
            )}
            {activeTab === 'create' && <CreateGift />}
            {activeTab === 'claim' && <ClaimGift />}
          </main>
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}