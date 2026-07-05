'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';

export default function ConnectWalletButton() {
  const { publicKey, isConnecting, error, connectWallet, disconnectWallet, truncateAddress } = useWallet();
  const [showError, setShowError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnectClick = async () => {
    setShowError(false);
    await connectWallet();
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      {publicKey ? (
        <div className="flex items-center gap-2">
          {/* Connected Wallet Badge */}
          <button
            onClick={disconnectWallet}
            className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 text-gray-100 text-sm font-mono hover:bg-gray-800 dark:hover:bg-gray-600 transition flex items-center gap-2 group"
            title={`Connected: ${publicKey}`}
          >
            <span className="text-xs">{truncateAddress(publicKey)}</span>
            <span className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-red-500 transition"></span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnectClick}
          disabled={isConnecting}
          className="px-4 py-2 rounded-lg bg-cyan-500 dark:bg-cyan-600 text-gray-900 dark:text-white font-semibold text-sm hover:bg-cyan-400 dark:hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/50 hover:animate-none"
          title="Connect your Stellar wallet (Freighter)"
        >
          {isConnecting ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Connecting...
            </>
          ) : (
            'Connect Wallet 💳'
          )}
        </button>
      )}

      {/* Error Message */}
      {showError && error && (
        <div className="absolute top-full right-0 mt-2 bg-red-900 dark:bg-red-800 text-red-100 text-xs rounded px-3 py-2 whitespace-nowrap z-50 shadow-lg max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
