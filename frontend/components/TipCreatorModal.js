'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const TipCreatorModal = ({ isOpen, onClose, userId }) => {
  const [creators, setCreators] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCreators();
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [isOpen]);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/health`);
      
      // Get all creators from the system
      // For now, we'll use mock data since we need an endpoint that lists all creators
      const mockCreators = [
        { id: 'creator_1', username: 'alice', display_name: 'Alice Creator', category: 'Art' },
        { id: 'creator_2', username: 'bob', display_name: 'Bob Dev', category: 'Tech' },
        { id: 'creator_3', username: 'charlie', display_name: 'Charlie Content', category: 'Education' },
      ];
      setCreators(mockCreators);
    } catch (err) {
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTip = async (e) => {
    e.preventDefault();
    
    if (!selectedCreator) {
      setError('Please select a creator');
      return;
    }

    const amount = selectedPreset || parseFloat(tipAmount);
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid tip amount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const mockTxHash = `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await axios.post(`${API_BASE}/tips`, {
        tx_hash: mockTxHash,
        amount,
        sender: userId,
        creator_id: selectedCreator.id,
        timestamp: new Date().toISOString(),
      });

      setSuccess(`Successfully tipped $${amount} to ${selectedCreator.display_name}!`);
      setSelectedCreator(null);
      setTipAmount('');
      setSelectedPreset(null);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send tip');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (creatorId) => {
    let updatedFavorites;
    if (favorites.includes(creatorId)) {
      updatedFavorites = favorites.filter(id => id !== creatorId);
    } else {
      updatedFavorites = [...favorites, creatorId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (!isOpen) return null;

  const favoriteCreators = creators.filter(c => favorites.includes(c.id));
  const otherCreators = creators.filter(c => !favorites.includes(c.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tip a Creator</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Creator Selection */}
        {!selectedCreator ? (
          <div>
            {/* Favorite Creators */}
            {favoriteCreators.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Favorites</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {favoriteCreators.map((creator) => (
                    <button
                      key={creator.id}
                      onClick={() => setSelectedCreator(creator)}
                      className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{creator.display_name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">@{creator.username}</p>
                        </div>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Creators */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Creators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherCreators.map((creator) => (
                  <button
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator)}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{creator.display_name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">@{creator.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(creator.id);
                        }}
                        className="text-gray-400 dark:text-gray-600 group-hover:text-yellow-500 transition"
                      >
                        ★
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tip Amount Selection */
          <form onSubmit={handleTip} className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected Creator</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedCreator.display_name}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(amount);
                      setTipAmount('');
                    }}
                    className={`py-2 rounded-lg font-semibold transition ${
                      selectedPreset === amount
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Or Enter Custom Amount
              </label>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => {
                  setTipAmount(e.target.value);
                  setSelectedPreset(null);
                }}
                className="input-field w-full"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                {success}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-success flex-1"
              >
                {loading ? 'Sending...' : 'Send Tip'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCreator(null)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TipCreatorModal;
