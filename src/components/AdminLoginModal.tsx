import React, { useState } from 'react';
import { Shield, Lock, Key, X, AlertTriangle, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentLang: 'en' | 'ta';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentLang
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'p@$$word') {
      setErrorMsg('');
      setPasswordInput('');
      onSuccess();
    } else {
      setErrorMsg(
        currentLang === 'ta'
          ? 'தவறான கடவுச்சொல்! சரியான கடவுச்சொல்லை உள்ளிடவும் (Hint: p@$$word)'
          : 'Incorrect Admin Password! (Hint: p@$$word)'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181B20] text-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-800 gold-header-strip relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {currentLang === 'ta' ? 'நிர்வாகி உள்நுழைவு' : 'Admin Restricted Access'}
          </h3>
          <p className="text-xs text-amber-300 font-medium">
            {currentLang === 'ta'
              ? 'தமிழ் சங்கம் - மாநில நிர்வாகி கடவுச்சொல்லை உள்ளிடவும்'
              : 'Tamil Sangam – State Administration Protected Workbench'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-900/60 border border-red-500 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              <span>{currentLang === 'ta' ? 'நிர்வாகி கடவுச்சொல் (Admin Password)' : 'Enter Admin Password'}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 tracking-wider"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-gray-400 hover:text-yellow-400"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Authorized state & district admins only.</p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#181B20] font-extrabold py-3.5 rounded-xl shadow-xl transition-all uppercase text-sm tracking-wider"
          >
            <Lock className="w-4 h-4" />
            <span>{currentLang === 'ta' ? 'உள்நுழைக' : 'UNLOCK ADMIN DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
