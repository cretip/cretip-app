'use client';

import { useState } from 'react';

export default function QuickTipModal({ isOpen, creator, userBalance, onClose, onSendTip }) {
  const [tipAmount, setTipAmount] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    if (parseFloat(tipAmount) > userBalance) {
      setFeedback({ type: 'error', message: `Insufficient balance. You have $${userBalance.toFixed(2)}` });
      return;
    }

    setSending(true);
    try {
      await onSendTip(parseFloat(tipAmount));
      setTipAmount('');
      setFeedback('');
      onClose();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Failed to send tip' });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !creator) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Tip</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Creator Info */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Sending tip to</p>
            <p className="font-semibold text-gray-900 dark:text-white">{creator.display_name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">@{creator.username}</p>
          </div>

          {/* Tip Amount Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tip Amount USDC
              </label>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="input-field w-full"
                placeholder="Enter amount in USDC"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  feedback.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {sending ? 'Sending...' : 'Send Tip'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
