'use client';

import { useState, useEffect } from 'react';

export default function CopyProfileLink({ urlSlug }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${origin}/${urlSlug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy profile link:', error);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[220px]">
        {origin.replace(/^https?:\/\//, '')}/{urlSlug}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy profile link"
        className="shrink-0 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm"
      >
        {copied ? <span className="text-emerald-500 font-bold">✅</span> : '📋'}
      </button>

      {copied && (
        <span className="absolute -top-8 left-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded px-2 py-1 whitespace-nowrap shadow-lg">
          Copied! 🚀
        </span>
      )}
    </div>
  );
}
