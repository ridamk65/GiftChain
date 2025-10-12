import React, { useState } from 'react';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  isStable: boolean;
  description: string;
}

// Cache bust: 2025-01-12-v2
export const supportedTokens: Token[] = [
  {
    address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // MockERC20 deployed address
    symbol: 'MOCK',
    name: 'Mock Token',
    decimals: 18,
    icon: '🎁',
    isStable: false,
    description: 'Test token for GiftChain'
  }
];

interface TokenSelectorProps {
  selectedToken: Token;
  onSelect: (token: Token) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ selectedToken, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">💰 Select Token</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border rounded-lg bg-white flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedToken.icon}</span>
          <div className="text-left">
            <div className="font-medium">{selectedToken.symbol}</div>
            <div className="text-xs text-gray-500">{selectedToken.name}</div>
          </div>
          {selectedToken.isStable && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Stable
            </span>
          )}
        </div>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-50">
          {supportedTokens.map((token) => (
            <button
              key={token.address}
              type="button"
              onClick={() => {
                onSelect(token);
                setIsOpen(false);
              }}
              className={`w-full p-4 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg ${
                selectedToken.address === token.address ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <span className="text-2xl">{token.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  {token.isStable && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Stable
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{token.name}</div>
                <div className="text-xs text-gray-500">{token.description}</div>
              </div>
              {selectedToken.address === token.address && (
                <span className="text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>💡 Tip:</strong> {selectedToken.isStable 
            ? 'Stable coins maintain consistent USD value, perfect for reliable gifts!' 
            : 'This token value may fluctuate. Consider stable coins for predictable value.'}
        </p>
      </div>
    </div>
  );
};