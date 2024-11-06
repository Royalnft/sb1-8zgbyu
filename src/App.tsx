import React from 'react';
import { WalletProvider } from './context/WalletContext';
import { WalletDashboard } from './components/WalletDashboard';

export const App: React.FC = () => {
  return (
    <WalletProvider>
      <WalletDashboard />
    </WalletProvider>
  );
};