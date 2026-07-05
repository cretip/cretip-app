'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null);

  // Initialize on mount - restore from localStorage
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('stellarPublicKey');
    const savedWalletType = localStorage.getItem('stellarWalletType');
    
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
      setWalletType(savedWalletType);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check for native Freighter browser injection (window.stellarPubkeySigner)
      if (!window.stellarPubkeySigner) {
        alert('Please install the Freighter Extension from freighter.app to tip creators!');
        setError('Freighter wallet not found. Install Freighter extension.');
        setIsConnecting(false);
        return;
      }

      // Request public key using native Freighter API
      const publicKey = await window.stellarPubkeySigner.getPublicKey();
      
      if (publicKey) {
        setPublicKey(publicKey);
        setWalletType('freighter');
        localStorage.setItem('stellarPublicKey', publicKey);
        localStorage.setItem('stellarWalletType', 'freighter');
        console.log('Wallet connected:', publicKey);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet. Make sure Freighter is installed and unlocked.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setWalletType(null);
    localStorage.removeItem('stellarPublicKey');
    localStorage.removeItem('stellarWalletType');
    setError(null);
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnecting,
        error,
        walletType,
        connectWallet,
        disconnectWallet,
        truncateAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
