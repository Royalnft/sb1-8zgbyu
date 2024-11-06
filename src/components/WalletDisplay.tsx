import React from 'react';
import { Plus, Copy } from 'lucide-react';
import { WalletAddress } from '../utils/bitcoin';

interface WalletDisplayProps {
  addresses: WalletAddress[];
  onGenerateNewAddress: () => void;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ addresses, onGenerateNewAddress }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Wallet Addresses</h2>
        <button
          onClick={onGenerateNewAddress}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Address
        </button>
      </div>
      
      <div className="grid gap-4">
        {addresses.map((addr, index) => (
          <div key={addr.address} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Address {index + 1}</p>
                <p className="font-mono text-sm break-all">{addr.address}</p>
                <p className="text-xs text-gray-500">Path: {addr.path}</p>
              </div>
              <button
                onClick={() => copyToClipboard(addr.address)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Copy address"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};