import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import type { WalletAddress } from '../types/wallet';

interface AddressCardProps {
  address: WalletAddress;
  isSelected: boolean;
  onSelect: (address: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onSelect(address.address)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          Address {address.path.split('/').pop()}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(address.address);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
          <a
            href={`https://mempool.space/address/${address.address}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </a>
        </div>
      </div>
      <p className="text-xs font-mono text-gray-500 break-all">
        {address.address}
      </p>
    </div>
  );
};