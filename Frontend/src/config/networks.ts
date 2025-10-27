export const SUPPORTED_NETWORKS = {
  // Ethereum Mainnet
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    icon: '🔷'
  },
  
  // Polygon
  polygon: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon.llamarpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: '🟣'
  },
  
  // Arbitrum
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    currency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    icon: '🔵'
  },
  
  // Base
  base: {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    icon: '🔵'
  },
  
  // Sepolia Testnet
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    currency: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
    icon: '🧪'
  },
  
  // Local Hardhat
  hardhat: {
    chainId: 31337,
    name: 'Hardhat Local',
    currency: 'ETH',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: '',
    icon: '⚒️'
  }
};

export const getNetworkByChainId = (chainId: number) => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId);
};

export const getExplorerUrl = (chainId: number, hash: string, type: 'tx' | 'address' | 'token' = 'tx') => {
  const network = getNetworkByChainId(chainId);
  if (!network?.blockExplorer) return '#';
  
  switch (type) {
    case 'tx':
      return `${network.blockExplorer}/tx/${hash}`;
    case 'address':
      return `${network.blockExplorer}/address/${hash}`;
    case 'token':
      return `${network.blockExplorer}/token/${hash}`;
    default:
      return network.blockExplorer;
  }
};