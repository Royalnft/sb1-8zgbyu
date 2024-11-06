import React, { useState } from 'react';
import { Save, Loader } from 'lucide-react';
import type { WalletAddress } from '../types/wallet';

interface NoteEditorProps {
  addresses: WalletAddress[];
  selectedAddress: string;
  onSave: (content: string, address: string) => Promise<void>;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  addresses,
  selectedAddress,
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [targetAddress, setTargetAddress] = useState(selectedAddress);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave(content, targetAddress);
      setContent('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <div className="flex items-center space-x-4">
        <select
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {addresses.map((addr) => (
            <option key={addr.address} value={addr.address}>
              {addr.address.substring(0, 8)}...{addr.address.substring(addr.address.length - 8)}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};