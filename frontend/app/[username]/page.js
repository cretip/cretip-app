'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import TipCard from '@/components/TipCard';
import ActivityFeed from '@/components/ActivityFeed';

const API_BASE = 'http://localhost:3001/api';

export default function CreatorProfile() {
  const params = useParams();
  const { username } = params;

  const [creator, setCreator] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);

        const creatorRes = await axios.get(`${API_BASE}/creators/${username}`);
        setCreator(creatorRes.data);

        const tipsRes = await axios.get(`${API_BASE}/tips/${creatorRes.data.id}`);
        setTips(tipsRes.data);
      } catch (err) {
        console.error('Error fetching creator data:', err);
        setError('Creator not found');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCreatorData();
    }
  }, [username]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleConnectWallet = () => {
    setWalletConnected(true);
    console.log('Mock wallet connected');
  };

  const handleTipSuccess = (newTip) => {
    setTips([newTip, ...tips]);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading creator profile...</p>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Creator Header */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{creator.display_name}</h1>
            <p className="text-blue-600 dark:text-blue-400 text-lg mb-4">@{creator.username}</p>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl">{creator.bio}</p>
          </div>
        </div>

        {/* Wallet Address Display */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Stellar Wallet</p>
          <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
            {creator.stellar_wallet_address}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tipping Card */}
        <div className="lg:col-span-1">
          <TipCard
            creatorId={creator.id}
            creatorUsername={creator.username}
            creatorName={creator.display_name}
            creatorWallet={creator.stellar_wallet_address}
            walletConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
            onTipSuccess={handleTipSuccess}
            isFavorite={favorites.includes(creator.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed tips={tips} creatorName={creator.display_name} />
        </div>
      </div>
    </div>
  );
}
