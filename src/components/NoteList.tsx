import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import type { Note, WalletAddress } from '../types/wallet';

interface NoteListProps {
  notes: Note[];
  addresses: WalletAddress[];
  onTransfer: (note: Note, toAddress: string) => Promise<void>;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  addresses,
  onTransfer,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDate(note.timestamp)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => onTransfer(note, e.target.value)}
                className="text-sm border border-gray-300 rounded-lg p-1"
                defaultValue=""
              >
                <option value="" disabled>Transfer to...</option>
                {addresses
                  .filter((addr) => addr.address !== note.address)
                  .map((addr) => (
                    <option key={addr.address} value={addr.address}>
                      {addr.address.substring(0, 8)}...
                    </option>
                  ))}
              </select>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Stored at: </span>
            <span className="font-mono">{note.address}</span>
          </div>
          {note.inscriptionId && (
            <div className="mt-1 text-xs text-gray-500">
              <span className="font-medium">Inscription ID: </span>
              <span className="font-mono">{note.inscriptionId}</span>
            </div>
          )}
        </div>
      ))}
      {notes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notes yet. Create your first note above!
        </div>
      )}
    </div>
  );
};