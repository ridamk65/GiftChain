import React, { useState } from 'react';
import { SUPPORTED_NETWORKS, getNetworkByChainId } from '../config/networks';
import { useWeb3 } from '../hooks/useWeb3';

export const NetworkSelector: React.FC = () => {
  const { provider, isConnected } = useWeb3();
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (provider && isConnected) {
      provider.getNetwork().then(network => {
        const networkInfo = getNetworkByChainId(Number(network.chainId));
        setCurrentNetwork(networkInfo || SUPPORTED_NETWORKS.hardhat);
      });
    }
  }, [provider, isConnected]);

  const switchNetwork = async (network: any) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${network.chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : [],
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
    setIsDropdownOpen(false);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <span className="text-lg">{currentNetwork?.icon || '🔗'}</span>
        <span className="text-sm font-medium">{currentNetwork?.name || 'Unknown'}</span>
        <span className="text-xs">▼</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">Select Network</div>
            {Object.values(SUPPORTED_NETWORKS).map((network) => (
              <button
                key={network.chainId}
                onClick={() => switchNetwork(network)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${
                  currentNetwork?.chainId === network.chainId ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <span className="text-lg">{network.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{network.name}</div>
                  <div className="text-xs text-gray-500">{network.currency}</div>
                </div>
                {currentNetwork?.chainId === network.chainId && (
                  <span className="ml-auto text-green-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};