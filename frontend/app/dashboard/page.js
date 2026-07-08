'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { executeTestnetTip, getStellarExplorerLink, checkAccountExists } from '@/lib/stellar';
import CreatorActivationForm from '@/components/CreatorActivationForm';
import QuickTipModal from '@/components/QuickTipModal';
import LinkWalletSection from '@/components/LinkWalletSection';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import CopyProfileLink from '@/components/CopyProfileLink';

const API_BASE = 'http://localhost:3001/api';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { publicKey: walletAddress } = useWallet();
  const [tipsSent, setTipsSent] = useState([]);
  const [tipsReceived, setTipsReceived] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loadingTips, setLoadingTips] = useState(true);
  const [creatorSearch, setCreatorSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [sendingTip, setSendingTip] = useState(false);
  const [tipFeedback, setTipFeedback] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [quickTipModal, setQuickTipModal] = useState({ isOpen: false, creator: null });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchTips();
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = () => {
    const saved = localStorage.getItem(`favorites_${user.id}`);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const fetchTips = async () => {
    try {
      setLoadingTips(true);
      const [sent, received] = await Promise.all([
        axios.get(`${API_BASE}/tips/sent/${user.id}`),
        axios.get(`${API_BASE}/tips/received/${user.id}`),
      ]);
      setTipsSent(sent.data);
      setTipsReceived(received.data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoadingTips(false);
    }
  };

  const searchCreators = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/creators/search`, {
        params: { query: searchTerm },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching creators:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreatorSearchChange = (e) => {
    const value = e.target.value;
    setCreatorSearch(value);
    setSelectedCreator(null);
    searchCreators(value);
  };

  const handleSelectCreator = (creator) => {
    setSelectedCreator(creator);
    setCreatorSearch(creator.display_name);
    setSearchResults([]);
  };

  const handleAddFavorite = (creator) => {
    const updatedFavorites = [...favorites, creator];
    saveFavorites(updatedFavorites);
  };

  const handleRemoveFavorite = (creatorId) => {
    const updatedFavorites = favorites.filter(c => c.id !== creatorId);
    saveFavorites(updatedFavorites);
  };

  const openQuickTipModal = (creator) => {
    setQuickTipModal({ isOpen: true, creator });
  };

  const closeQuickTipModal = () => {
    setQuickTipModal({ isOpen: false, creator: null });
  };

  const handleQuickTip = async (amount) => {
    const creator = quickTipModal.creator;
    if (!creator) return;

    try {
      const mockTxHash = `mock_tx_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      
      const response = await axios.post(`${API_BASE}/tips`, {
        tx_hash: mockTxHash,
        amount,
        sender: user.id,
        creator_id: creator.id,
        currency: 'USDC',
        timestamp: new Date().toISOString(),
      });

      setTipsSent([response.data.tip, ...tipsSent]);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to send tip');
    }
  };

  const handleSendTip = async (e) => {
    e.preventDefault();
    
    if (!selectedCreator || !tipAmount || parseFloat(tipAmount) <= 0) {
      setTipFeedback({ type: 'error', message: 'Please select a creator and enter a valid amount' });
      return;
    }

    if (!walletAddress) {
      setTipFeedback({ type: 'error', message: 'Please connect your Freighter wallet first' });
      return;
    }

    if (!selectedCreator.stellar_wallet_address) {
      setTipFeedback({ type: 'error', message: 'Creator has not linked their Stellar wallet yet' });
      return;
    }

    setSendingTip(true);
    setTipFeedback('');

    try {
      // Check if creator wallet is funded
      const creatorExists = await checkAccountExists(selectedCreator.stellar_wallet_address);
      if (!creatorExists) {
        setTipFeedback({ 
          type: 'error', 
          message: 'Creator wallet is not funded on Stellar Testnet yet' 
        });
        setSendingTip(false);
        return;
      }

      // Execute blockchain transaction
      const tipResult = await executeTestnetTip(
        walletAddress,
        selectedCreator.stellar_wallet_address,
        tipAmount
      );

      // Record transaction in backend
      const response = await axios.post(`${API_BASE}/tips`, {
        tx_hash: tipResult.txHash,
        amount: parseFloat(tipAmount),
        sender: user.id,
        creator_id: selectedCreator.id,
        currency: 'USDC',
        timestamp: new Date().toISOString(),
      });

      // Build explorer link
      const explorerLink = getStellarExplorerLink(tipResult.txHash);

      setTipFeedback({ 
        type: 'success', 
        message: `Tip of ${tipAmount} USDC sent successfully!`,
        txHash: tipResult.txHash,
        explorerLink
      });
      
      setTipsSent([response.data.tip, ...tipsSent]);
      setSelectedCreator(null);
      setCreatorSearch('');
      setTipAmount('');
      
      setTimeout(() => {
        setTipFeedback('');
      }, 5000);
    } catch (error) {
      const errorMsg = error.message || error.response?.data?.error || 'Failed to send tip. Please try again.';
      setTipFeedback({ type: 'error', message: errorMsg });
    } finally {
      setSendingTip(false);
    }
  };

  const handleCreatorActivationSuccess = () => {
    fetchTips();
  };

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user.username}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user.is_creator ? 'Creator' : 'Fan'} Dashboard
        </p>
      </div>

      {/* Wallet Connection Section */}
      <div className="mb-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Stellar Wallet</p>
          <p className="text-xs text-blue-700 dark:text-blue-300">Connect your Freighter wallet to send and receive USDC tips</p>
        </div>
        <ConnectWalletButton />
      </div>

      {/* Creator Activation Form (if not creator) */}
      {!user.is_creator && (
        <CreatorActivationForm onSuccess={handleCreatorActivationSuccess} />
      )}

      {/* Creator View */}
      {user.is_creator && (
        <div>
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Creator Analytics
            </button>
            <button
              onClick={() => setActiveTab('supported')}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                activeTab === 'supported'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Supported Creators
            </button>
          </div>

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              {/* Profile Info Card */}
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Creator Profile</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Display Name</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.creator_profile?.display_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Profile URL</p>
                    <CopyProfileLink urlSlug={user.creator_profile?.url_slug} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Category</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.creator_profile?.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Bio</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{user.creator_profile?.bio}</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Tips Received</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tipsReceived.length}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Amount Raised</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${tipsReceived.reduce((sum, t) => sum + t.amount, 0).toFixed(2)} USDC
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Tip</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    ${tipsReceived.length > 0 ? (tipsReceived.reduce((sum, t) => sum + t.amount, 0) / tipsReceived.length).toFixed(2) : '0.00'} USDC
                  </p>
                </div>
              </div>

              {/* Recent Tips */}
              <div className="card">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Tips Received</h3>
                {loadingTips ? (
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                ) : tipsReceived.length > 0 ? (
                  <div className="space-y-4">
                    {tipsReceived.slice(0, 10).map((tip) => (
                      <div key={tip.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{tip.sender}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(tip.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">${tip.amount} {tip.currency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">No tips received yet</p>
                )}
              </div>
            </div>
          )}

          {/* Supported Creators Tab */}
          {activeTab === 'supported' && (
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tips You Have Sent</h3>
              {loadingTips ? (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              ) : tipsSent.length > 0 ? (
                <div className="space-y-4">
                  {tipsSent.slice(0, 10).map((tip) => (
                    <div key={tip.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Tip to Creator</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(tip.timestamp).toLocaleString()}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">-${tip.amount} {tip.currency}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">You haven't sent any tips yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fan View (Default) */}
      {!user.is_creator && (
        <div className="space-y-8">
          {/* Link Wallet Section */}
          <LinkWalletSection user={user} onSuccess={() => {}} />

          {/* Favorite Creators Section */}
          {favorites.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Favorite Creators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((creator) => (
                  <div key={creator.id} className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{creator.display_name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">@{creator.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openQuickTipModal(creator)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Tip
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(creator.id)}
                        className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-700 transition font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Tip Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Tip</h2>
            <form onSubmit={handleSendTip} className="space-y-4">
              {/* Creator Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Search Creator
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={creatorSearch}
                    onChange={handleCreatorSearchChange}
                    className="input-field w-full"
                    placeholder="Search by name or username..."
                    autoComplete="off"
                  />
                  
                  {/* Search Results Dropdown */}
                  {(creatorSearch && searchResults.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      {searchResults.map((creator) => (
                        <button
                          key={creator.id}
                          type="button"
                          onClick={() => handleSelectCreator(creator)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
                        >
                          <p className="font-semibold text-gray-900 dark:text-white">{creator.display_name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">@{creator.username}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results Message */}
                  {(creatorSearch && searchLoading) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Searching...</p>
                    </div>
                  )}

                  {(creatorSearch && !searchLoading && searchResults.length === 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">No creators found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Creator Display */}
              {selectedCreator && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Selected Creator</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedCreator.display_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">@{selectedCreator.username}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!favorites.some(c => c.id === selectedCreator.id)) {
                        handleAddFavorite(selectedCreator);
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm font-semibold transition ${
                      favorites.some(c => c.id === selectedCreator.id)
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 cursor-default'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                    disabled={favorites.some(c => c.id === selectedCreator.id)}
                  >
                    {favorites.some(c => c.id === selectedCreator.id) ? 'Added to Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              )}

              {/* Tip Amount */}
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
                  required
                />
              </div>

              {/* Feedback Message */}
              {tipFeedback && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    tipFeedback.type === 'success'
                      ? 'bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300'
                      : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}
                >
                  <p className="font-semibold">{tipFeedback.message}</p>
                  {tipFeedback.explorerLink && (
                    <a
                      href={tipFeedback.explorerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm mt-2 inline-block"
                    >
                      View on Stellar Expert
                    </a>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sendingTip || !selectedCreator}
                className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingTip ? 'Processing Transaction...' : 'Send Tip'}
              </button>
            </form>
          </div>

          {/* Transaction History */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tips You Have Sent</h2>
            {loadingTips ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : tipsSent.length > 0 ? (
              <div className="space-y-4">
                {tipsSent.map((tip) => (
                  <div key={tip.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Tip Sent</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(tip.timestamp).toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{tip.tx_hash.substring(0, 20)}...</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">-${tip.amount} {tip.currency}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">You haven't sent any tips yet. Start by searching for a creator above!</p>
            )}
          </div>
        </div>
      )}

      {/* Quick Tip Modal */}
      <QuickTipModal
        isOpen={quickTipModal.isOpen}
        creator={quickTipModal.creator}
        userBalance={0}
        onClose={closeQuickTipModal}
        onSendTip={handleQuickTip}
      />
    </div>
  );
}
