import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

export const WalletConnect: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};