'use client';

import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const TipCard = ({
  creatorId,
  creatorUsername,
  creatorName,
  creatorWallet,
  walletConnected,
  onConnectWallet,
  onTipSuccess,
  isFavorite,
  onToggleFavorite,
}) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showWallet, setShowWallet] = useState(false);

  const presetAmounts = [
    { label: '$2', value: 2 },
    { label: '$5', value: 5 },
    { label: '$10', value: 10 },
  ];

  const handleMockTip = async () => {
    if (!walletConnected) {
      onConnectWallet();
      return;
    }

    const tipAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

    if (!tipAmount || tipAmount <= 0) {
      setFeedback({ type: 'error', message: 'Please select or enter a tip amount' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const mockTxHash = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await axios.post(`${API_BASE}/tips`, {
        tx_hash: mockTxHash,
        amount: tipAmount,
        sender: 'You',
        creator_id: creatorId,
        timestamp: new Date().toISOString(),
      });

      setFeedback({
        type: 'success',
        message: `Tipped $${tipAmount} to ${creatorName}`,
      });

      if (onTipSuccess) {
        onTipSuccess(response.data.tip);
      }

      setSelectedAmount(null);
      setCustomAmount('');

      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Error processing tip:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to process tip. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(creatorWallet);
    setFeedback({ type: 'success', message: 'Wallet address copied' });
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="card sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Send a Tip</h3>
        <button
          onClick={() => onToggleFavorite(creatorId)}
          className={`text-2xl transition ${isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>
      </div>

      {/* Wallet Preview */}
      {creatorWallet && (
        <div className="mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">Creator Wallet</p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs text-gray-900 dark:text-white break-all">
              {creatorWallet.substring(0, 12)}...{creatorWallet.substring(creatorWallet.length - 8)}
            </p>
            <button
              onClick={copyToClipboard}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setShowWallet(!showWallet)}
            className="text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline"
          >
            {showWallet ? 'Hide' : 'Show'} full address
          </button>
          {showWallet && (
            <p className="font-mono text-xs text-gray-900 dark:text-white mt-2 p-2 bg-white dark:bg-gray-800 rounded break-all border border-gray-200 dark:border-gray-600">
              {creatorWallet}
            </p>
          )}
        </div>
      )}

      {!walletConnected ? (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Connect your wallet to send a tip
          </p>
          <button
            onClick={onConnectWallet}
            className="btn-primary w-full"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300">Wallet connected</p>
        </div>
      )}

      {/* Preset Amount Buttons */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Quick Amounts</p>
        <div className="grid grid-cols-3 gap-2">
          {presetAmounts.map((amount) => (
            <button
              key={amount.value}
              onClick={() => {
                setSelectedAmount(amount.value);
                setCustomAmount('');
              }}
              className={`py-2 rounded-lg font-semibold transition ${
                selectedAmount === amount.value
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {amount.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="mb-6">
        <label className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2 block">
          Custom Amount
        </label>
        <input
          type="number"
          placeholder="Enter amount..."
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(null);
          }}
          className="input-field w-full"
          disabled={!walletConnected}
        />
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            feedback.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Send Tip Button */}
      <button
        onClick={handleMockTip}
        disabled={!walletConnected || loading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          walletConnected && !loading
            ? 'btn-success'
            : 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-700 text-white'
        }`}
      >
        {loading ? 'Processing...' : 'Send Tip'}
      </button>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        100% goes to the creator. No platform fees.
      </p>
    </div>
  );
};

export default TipCard;
