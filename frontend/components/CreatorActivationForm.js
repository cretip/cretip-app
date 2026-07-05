'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const CreatorActivationForm = ({ onSuccess }) => {
  const { activateCreator } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    url_slug: '',
    display_name: '',
    bio: '',
    stellar_wallet_address: '',
    category: '',
    social_links: {
      twitter: '',
      youtube: '',
      twitch: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const key = name.replace('social_', '');
      setFormData({
        ...formData,
        social_links: {
          ...formData.social_links,
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await activateCreator(formData);
      onSuccess?.();
      setIsExpanded(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Collapsed Banner */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 border-2 border-purple-400 dark:border-purple-500 text-white hover:shadow-lg transition"
        >
          <p className="text-lg font-bold">Want to receive tips? Claim your creator page now!</p>
          <p className="text-sm text-purple-100 mt-1">Set up your profile and start earning</p>
        </button>
      )}

      {/* Expanded Form */}
      {isExpanded && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Set Up Creator Profile</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Your Creator URL (e.g., cretip.app/yourname)
              </label>
              <input
                type="text"
                name="url_slug"
                value={formData.url_slug}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="yourname"
                required
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Your public name"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Tell fans about yourself"
                rows="3"
              />
            </div>

            {/* Stellar Wallet */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Stellar Testnet Wallet Address
              </label>
              <input
                type="text"
                name="stellar_wallet_address"
                value={formData.stellar_wallet_address}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="G..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">Select a category</option>
                <option value="tech">Tech</option>
                <option value="art">Art</option>
                <option value="gaming">Gaming</option>
                <option value="music">Music</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Social Links (Optional)</p>
              <input
                type="text"
                name="social_twitter"
                value={formData.social_links.twitter}
                onChange={handleChange}
                className="input-field w-full mb-2"
                placeholder="Twitter handle"
              />
              <input
                type="text"
                name="social_youtube"
                value={formData.social_links.youtube}
                onChange={handleChange}
                className="input-field w-full mb-2"
                placeholder="YouTube channel"
              />
              <input
                type="text"
                name="social_twitch"
                value={formData.social_links.twitch}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Twitch channel"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-success flex-1"
              >
                {loading ? 'Setting up...' : 'Activate Creator Profile'}
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatorActivationForm;
