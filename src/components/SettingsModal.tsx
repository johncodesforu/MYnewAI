import { X, Moon, Sun, Monitor, ShieldCheck, Key, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange,
  apiKey,
  onApiKeyChange
}: SettingsModalProps) {
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Appearance Section */}
          <section>
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-4">
              Appearance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onThemeChange('light')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-transparent'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                  <Sun size={20} />
                </div>
                <span className="text-xs font-bold dark:text-neutral-200">Light Mode</span>
              </button>

              <button
                onClick={() => onThemeChange('dark')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-transparent'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                  <Moon size={20} />
                </div>
                <span className="text-xs font-bold dark:text-neutral-200">Dark Mode</span>
              </button>
            </div>
          </section>

          {/* API Credentials */}
          <section>
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-4">
              API Configuration
            </h3>
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-600 transition-colors">
                  <Key size={18} />
                </div>
                <input 
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="Paste your Gemini API key..."
                  className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-neutral-800 dark:text-white placeholder-neutral-400"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-indigo-600 transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="px-2 text-[10px] text-neutral-500 leading-relaxed font-medium">
                Your key is stored securely in your browser's local storage and is only used to connect to Google's Gemini servers.
              </p>
            </div>
          </section>

          {/* AI Intelligence Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                Model Intelligence
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded-full uppercase">
                <ShieldCheck size={10} />
                Enhanced
              </div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                  <Monitor size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold dark:text-neutral-100">Gemini 3.1 Pro</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Powered with Google Search Grounding</p>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2">
                Your AI is now using the most powerful reasoning engine available, capable of web research and complex analysis of up to 100 files (200MB each).
              </p>
            </div>
          </section>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/20 border-t border-neutral-100 dark:border-neutral-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:scale-[1.02] transition-transform active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
