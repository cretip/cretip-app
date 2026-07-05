'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function Home() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const creatorList = [
          { id: 'creator_1', username: 'alice', display_name: 'Alice Creator', bio: 'Digital artist & musician' },
          { id: 'creator_2', username: 'bob', display_name: 'Bob Dev', bio: 'Open-source developer' },
          { id: 'creator_3', username: 'charlie', display_name: 'Charlie Content', bio: 'Web3 educator' },
        ];
        setCreators(creatorList);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const favoriteCreators = creators.filter(c => favorites.includes(c.id));

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Support creators directly
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Send payments instantly to your favorite creators using crypto. No intermediaries. No fees. Pure value transfer.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </section>

      {/* Favorite Creators Section - List View */}
      {favoriteCreators.length > 0 && (
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Your Favorites
          </h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favoriteCreators.map((creator) => (
                <Link key={creator.id} href={`/${creator.username}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-gray-700 transition cursor-pointer">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{creator.display_name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">@{creator.username}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(creator.id);
                      }}
                      className="ml-3 text-xl text-yellow-500 hover:text-yellow-600 transition"
                      title="Remove from favorites"
                    >
                      ★
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Creators Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          All Creators
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading creators...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Link key={creator.id} href={`/${creator.username}`}>
                <div className="card cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-gray-900 dark:text-white">
                      {creator.display_name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(creator.id);
                      }}
                      className={`text-2xl transition ${
                        favorites.includes(creator.id)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 dark:text-gray-600 hover:text-yellow-500'
                      }`}
                      title={favorites.includes(creator.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      ★
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">@{creator.username}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">{creator.bio}</p>
                  <button className="btn-secondary w-full text-center">
                    Send Tip
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Instant Transfers</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Transfers settle in seconds on the blockchain network
          </p>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Secure & Transparent</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            All transactions are immutable and verifiable on-chain
          </p>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Direct to Creator</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            100% of your tip reaches the creator with minimal fees
          </p>
        </div>
      </section>
    </div>
  );
}
