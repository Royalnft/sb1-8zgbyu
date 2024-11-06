import React from 'react';
import { useWallet } from '../context/WalletContext';
import { AddressCard } from './AddressCard';
import { NoteEditor } from './NoteEditor';
import { NoteList } from './NoteList';

export const WalletDashboard: React.FC = () => {
  const { state, createNote, transferNote } = useWallet();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bitcoin Ordinals Wallet</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your Bitcoin Ordinals inscriptions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Recovery Phrase</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-sm break-all">{state.mnemonic}</p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Keep this phrase safe. It's the only way to recover your wallet.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Addresses</h2>
              <div className="space-y-3">
                {state.addresses.map((address) => (
                  <AddressCard
                    key={address.address}
                    address={address}
                    isSelected={address.address === state.selectedAddress}
                    onSelect={(addr) => console.log('Selected:', addr)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
              <NoteEditor
                addresses={state.addresses}
                selectedAddress={state.selectedAddress}
                onSave={createNote}
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
              <NoteList
                notes={state.notes}
                addresses={state.addresses}
                onTransfer={async (note, toAddress) => {
                  await transferNote(note.id, toAddress);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};