'use client';

import { useState } from 'react';
import axios from 'axios';
import { useWallet } from '@/context/WalletContext';

const API_BASE = 'http://localhost:3001/api';

export default function LinkWalletSection({ user, onSuccess }) {
  const { publicKey, truncateAddress } = useWallet();
  const [linking, setLinking] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleLinkWallet = async () => {
    if (!publicKey) {
      setFeedback({ type: 'error', message: 'No wallet connected. Please connect a wallet first.' });
      return;
    }

    if (user.stellar_wallet_address && user.stellar_wallet_address === publicKey) {
      setFeedback({ type: 'info', message: 'This wallet is already linked to your profile.' });
      return;
    }

    setLinking(true);
    setFeedback('');

    try {
      // Update user profile with wallet address
      const response = await axios.post(`${API_BASE}/user/update-wallet`, {
        user_id: user.id,
        stellar_wallet_address: publicKey,
      });

      setFeedback({
        type: 'success',
        message: `Wallet linked successfully! Address: ${truncateAddress(publicKey)}`,
      });

      // Call success callback to update parent component
      if (onSuccess) {
        onSuccess(response.data.user);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to link wallet';
      setFeedback({ type: 'error', message: errorMsg });
    } finally {
      setLinking(false);
    }
  };

  // Don't show if already linked and no other wallet connected
  if (user.stellar_wallet_address && !publicKey) {
    return null;
  }

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Stellar Wallet</h3>
      
      {publicKey ? (
        <div className="space-y-4">
          {/* Connected Wallet Info */}
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Connected Wallet</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white">{publicKey}</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">🟢 Connected</p>
          </div>

          {/* Current Profile Wallet */}
          {user.stellar_wallet_address && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Current Profile Wallet</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">{user.stellar_wallet_address}</p>
            </div>
          )}

          {/* Link Button */}
          {!user.stellar_wallet_address || user.stellar_wallet_address !== publicKey ? (
            <button
              onClick={handleLinkWallet}
              disabled={linking}
              className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {linking ? 'Linking Wallet...' : 'Link Connected Wallet to Profile'}
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
              <p className="text-sm text-green-700 dark:text-green-300 font-semibold">✓ Wallet linked to profile</p>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-3 rounded-lg text-sm ${
                feedback.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                  : feedback.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            No wallet connected. Connect a wallet from the header button to link it to your profile.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Once you connect a wallet, you can link it here to receive tips.
          </p>
        </div>
      )}
    </div>
  );
}
