'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { WalletProvider, useWallet } from '@/context/WalletContext';
import AuthModal from '@/components/AuthModal';

function HeaderContent() {
  const { user, logout } = useAuth();
  const { disconnectWallet } = useWallet();
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    setTheme(savedTheme);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogout = () => {
    disconnectWallet();
    logout();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">
          Cretip
        </a>
        
        <div className="flex items-center gap-4">
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition">
              Home
            </a>
            {user && (
              <a href="/dashboard" className="hover:text-gray-600 dark:hover:text-gray-300 transition">
                Dashboard
              </a>
            )}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cretip | Creator Tipping Platform</title>
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <WalletProvider>
          <AuthProvider>
            <HeaderContent />
            <main>
              {children}
            </main>
            <footer className="border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 mt-12">
              <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>Built on Stellar • Open-source © 2026 Cretip</p>
              </div>
            </footer>
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
