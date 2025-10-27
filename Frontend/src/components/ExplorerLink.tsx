import React from 'react';
import { getExplorerUrl, getNetworkByChainId } from '../config/networks';
import { useWeb3 } from '../hooks/useWeb3';

interface ExplorerLinkProps {
  hash: string;
  type: 'tx' | 'address' | 'token';
  children?: React.ReactNode;
  className?: string;
}

export const ExplorerLink: React.FC<ExplorerLinkProps> = ({
  hash,
  type,
  children,
  className = ''
}) => {
  const { provider } = useWeb3();
  const [chainId, setChainId] = React.useState<number>(31337);

  React.useEffect(() => {
    if (provider) {
      provider.getNetwork().then(network => {
        setChainId(Number(network.chainId));
      });
    }
  }, [provider]);

  const explorerUrl = getExplorerUrl(chainId, hash, type);
  const network = getNetworkByChainId(chainId);

  if (!network?.blockExplorer) {
    return (
      <span className={`text-gray-500 ${className}`}>
        {children || `${hash.slice(0, 6)}...${hash.slice(-4)}`}
      </span>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'tx': return '🔗';
      case 'address': return '👤';
      case 'token': return '🪙';
      default: return '🔍';
    }
  };

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline ${className}`}
      title={`View on ${network.name} Explorer`}
    >
      <span>{getIcon()}</span>
      {children || `${hash.slice(0, 6)}...${hash.slice(-4)}`}
      <span className="text-xs">↗</span>
    </a>
  );
};