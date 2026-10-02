import React, { useState } from 'react';
import type { AdminAccount } from '../types';
import { getAdminAccounts, saveLoggedInAdmin } from '../services/storageService';
import { Shield, Lock, Key, X, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admin: AdminAccount) => void;
  currentLang: 'en' | 'ta';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentLang
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accounts = getAdminAccounts();
    const cleanUsername = usernameInput.trim().toLowerCase();

    // Find account by matching username & password
    let match = accounts.find(
      a => (a.username.toLowerCase() === cleanUsername || a.id.toLowerCase() === cleanUsername) && a.password === passwordInput
    );

    // Support default admin fallback if exact username is superadmin and password matches default
    if (!match && passwordInput === 'p@$$word' && (!cleanUsername || cleanUsername === 'superadmin' || cleanUsername === 'admin')) {
      match = accounts.find(a => a.role === 'SUPER_ADMIN') || accounts[0];
    }

    if (match) {
      setErrorMsg('');
      setUsernameInput('');
      setPasswordInput('');
      saveLoggedInAdmin(match);
      onSuccess(match);
    } else {
      setErrorMsg(
        currentLang === 'ta'
          ? 'தவறான பயனர் பெயர் அல்லது கடவுச்சொல்!'
          : 'Invalid Username or Password!'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#1E232B] text-slate-900 dark:text-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-gray-800 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-[#8B1E26]/10 border border-[#8B1E26]/30 text-[#8B1E26] dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            {currentLang === 'ta' ? 'நிர்வாகி உள்நுழைவு' : 'Admin Portal Login'}
          </h3>
          <p className="text-xs text-[#8B1E26] dark:text-red-400 font-bold">
            {currentLang === 'ta'
              ? 'தமிழ் சங்கம் - மாநில & மாவட்ட நிர்வாகி உள்நுழைவு'
              : 'Tamil Sangam – State & District Administration Portal'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-900/60 border border-red-500 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400" />
              <span>{currentLang === 'ta' ? 'பயனர் பெயர் (Username)' : 'Username'}</span>
            </label>
            <input
              type="text"
              required
              placeholder="Username..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E26]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#8B1E26] dark:text-red-400" />
              <span>{currentLang === 'ta' ? 'கடவுச்சொல் (Password)' : 'Password'}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E26] tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-[#8B1E26] dark:hover:text-red-400 cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#8B1E26] hover:bg-[#72151C] text-white font-extrabold py-3.5 rounded-xl shadow-xl transition-all uppercase text-sm tracking-wider cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{currentLang === 'ta' ? 'உள்நுழைக' : 'LOGIN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
